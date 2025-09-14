import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Save calculation to database
export const saveCalculation = mutation({
  args: {
    query: v.string(),
    result: v.union(v.number(), v.string()),
    steps: v.array(v.string()),
    type: v.union(
      v.literal("stock"),
      v.literal("currency"), 
      v.literal("nutrition"),
      v.literal("math"),
      v.literal("mixed")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calculations", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Get calculation history
export const getCalculations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("calculations")
      .order("desc")
      .take(50);
  },
});

// Main calculation processor
export const processCalculation = action(async (ctx, { query }: { query: string }) => {
  try {
    // First, try to handle as a simple math expression (numbers and basic operators only)
    const simpleMathPattern = /^[\d\s+\-*/().]+$/;
    if (simpleMathPattern.test(query)) {
      try {
        const cleanExpr = query.replace(/\s+/g, '');
        const mathResult = evaluateExpression(cleanExpr);
        const resultStr = mathResult % 1 === 0 ? mathResult.toString() : mathResult.toFixed(2);
        
        await ctx.runMutation(api.calculations.saveCalculation, {
          query,
          result: resultStr,
          steps: [`${query} = ${resultStr}`],
          type: "math",
        });
        
        return {
          query,
          result: resultStr,
          steps: [`${query} = ${resultStr}`],
          type: "math" as const,
          timestamp: Date.now(),
        };
      } catch (error) {
        // Fall through to AI parsing if simple math fails
      }
    }
    
    // Handle percentage calculations separately
    if (query.includes('%') && query.includes('of')) {
      const percentMatch = query.match(/(\d+(?:\.\d+)?)%\s+of\s+(\d+(?:\.\d+)?)/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        const number = parseFloat(percentMatch[2]);
        const result = (percent / 100) * number;
        
        await ctx.runMutation(api.calculations.saveCalculation, {
          query,
          result: result.toString(),
          steps: [`${percent}% of ${number} = ${result}`],
          type: "math",
        });
        
        return {
          query,
          result: result % 1 === 0 ? result.toString() : result.toFixed(2),
          steps: [`${percent}% of ${number} = ${result}`],
          type: "math" as const,
          timestamp: Date.now(),
        };
      }
    }
    
    // Parse complex queries using OpenAI
    const parsedQuery: any = await ctx.runAction(api.openai.parseQuery, { query });
    
    let result: string = "0";
    const steps: string[] = [];
    let runningTotal = 0;
    let nutritionTotal = 0;
    let currencyResult = "";
    let lastOperationType = "";
    
    // Handle simple math expressions first
    if (parsedQuery.type === "math" && parsedQuery.operations.length === 1 && parsedQuery.operations[0].expression) {
      try {
        const mathResult = evaluateExpression(parsedQuery.operations[0].expression);
        result = mathResult.toString();
        steps.push(`${parsedQuery.operations[0].expression} = ${mathResult}`);
      } catch {
        result = "Error: Invalid expression";
        steps.push("Could not evaluate mathematical expression");
      }
    } else {
      // Process complex operations
      for (const operation of parsedQuery.operations) {
        switch (operation.type) {
          case 'stock': {
            const stockData: any = await ctx.runAction(api.stocks.getStockPrice, { 
              symbol: operation.stockSymbol! 
            });
            const stockValue = stockData.price * (operation.value || 1);
            runningTotal += stockValue;
            steps.push(`${operation.stockSymbol}: $${stockData.price.toFixed(2)} × ${operation.value || 1} = $${stockValue.toFixed(2)}`);
            lastOperationType = "stock";
            break;
          }
          
          case 'currency': {
            const currencyData: any = await ctx.runAction(api.currency.convertCurrency, {
              from: operation.currencyFrom!,
              to: operation.currencyTo!,
              amount: operation.amount || operation.value || runningTotal || 1
            });
            
            if (runningTotal > 0 && !operation.amount && !operation.value) {
              // Converting existing running total
              const convertedTotal = await ctx.runAction(api.currency.convertCurrency, {
                from: "USD",
                to: operation.currencyTo!,
                amount: runningTotal
              });
              currencyResult = `${convertedTotal.result.toFixed(2)} ${operation.currencyTo}`;
              steps.push(`$${runningTotal.toFixed(2)} USD = ${convertedTotal.result.toFixed(2)} ${operation.currencyTo}`);
            } else {
              currencyResult = `${currencyData.result.toFixed(2)} ${operation.currencyTo}`;
              steps.push(`${operation.amount || operation.value} ${operation.currencyFrom} = ${currencyData.result.toFixed(2)} ${operation.currencyTo}`);
            }
            lastOperationType = "currency";
            break;
          }
          
          case 'nutrition': {
            const nutritionData: any = await ctx.runAction(api.nutrition.getNutrition, {
              food: operation.food!,
              quantity: operation.quantity || "1"
            });
            nutritionTotal += nutritionData.calories;
            steps.push(`${operation.quantity || "1"} ${operation.food}: ${nutritionData.calories} calories`);
            lastOperationType = "nutrition";
            break;
          }
          
          case 'add':
            runningTotal += operation.value || 0;
            steps.push(`+ ${operation.value || 0}`);
            break;
            
          case 'subtract':
            runningTotal -= operation.value || 0;
            steps.push(`- ${operation.value || 0}`);
            break;
            
          case 'multiply':
            if (lastOperationType === "nutrition") {
              nutritionTotal *= operation.value || 1;
              steps.push(`× ${operation.value || 1} = ${nutritionTotal} calories`);
            } else {
              runningTotal *= operation.value || 1;
              steps.push(`× ${operation.value || 1}`);
            }
            break;
            
          case 'divide':
            if (lastOperationType === "nutrition") {
              nutritionTotal /= operation.value || 1;
              steps.push(`÷ ${operation.value || 1} = ${nutritionTotal} calories`);
            } else {
              runningTotal /= operation.value || 1;
              steps.push(`÷ ${operation.value || 1}`);
            }
            break;
            
          case 'percentage':
            // Handle "X% of Y" differently than "X% tip/discount on Y"
            if (query.toLowerCase().includes('of') && !query.toLowerCase().includes('tip') && !query.toLowerCase().includes('discount')) {
              // This is "X% of Y" - calculate the percentage value
              const baseValue = runningTotal || operation.baseValue || 100;
              const percentValue = baseValue * ((operation.value || 0) / 100);
              result = percentValue.toString();
              steps.push(`${operation.value}% of ${baseValue} = ${percentValue}`);
              return {
                query,
                result: percentValue % 1 === 0 ? percentValue.toString() : percentValue.toFixed(2),
                steps,
                type: "math" as const,
                timestamp: Date.now(),
              };
            } else {
              // This is tip/discount calculation
              if (lastOperationType === "nutrition") {
                const percentValue = nutritionTotal * ((operation.value || 0) / 100);
                if (query.toLowerCase().includes('tip')) {
                  // For tips, show the tip amount, not the total
                  result = `${percentValue.toFixed(2)} calories`;
                  steps.push(`${operation.value}% tip = ${percentValue.toFixed(2)} calories`);
                } else {
                  nutritionTotal -= percentValue;
                  steps.push(`- ${operation.value}% = ${nutritionTotal} calories`);
                }
              } else {
                const percentValue = runningTotal * ((operation.value || 0) / 100);
                if (query.toLowerCase().includes('tip')) {
                  // For tips, show the tip amount, not the total
                  result = `$${percentValue.toFixed(2)}`;
                  steps.push(`${operation.value}% tip on $${runningTotal.toFixed(2)} = $${percentValue.toFixed(2)}`);
                } else if (operation.subtract !== false) {
                  runningTotal -= percentValue;
                  steps.push(`- ${operation.value}% (${percentValue.toFixed(2)}) = $${runningTotal.toFixed(2)}`);
                } else {
                  runningTotal += percentValue;
                  steps.push(`+ ${operation.value}% (${percentValue.toFixed(2)}) = $${runningTotal.toFixed(2)}`);
                }
              }
            }
            break;
            
          case 'number':
            runningTotal = operation.value || 0;
            steps.push(`Starting with: ${operation.value || 0}`);
            break;
        }
      }
    }
    
    // Set final result based on operation types (if not already set)
    if (result === "0") {
      if (currencyResult) {
        result = currencyResult;
      } else if (nutritionTotal > 0) {
        result = `${nutritionTotal} calories`;
      } else {
        // Determine if result should have currency formatting
        const hasMonetaryOperations = parsedQuery.operations.some((op: any) => 
          op.type === 'stock' || 
          (op.type === 'percentage' && (query.includes('$') || query.includes('dollar')) && !query.toLowerCase().includes('tip'))
        ) || query.includes('$') || query.includes('dollar') || query.includes('USD') || parsedQuery.type === 'mixed' || parsedQuery.type === 'stock';
        
        if (hasMonetaryOperations && !query.toLowerCase().includes('tip')) {
          result = `$${runningTotal.toFixed(2)}`;
        } else {
          // Basic math - no currency symbol
          result = runningTotal % 1 === 0 ? runningTotal.toString() : runningTotal.toFixed(2);
        }
      }
    }
    
    // Save to database
    await ctx.runMutation(api.calculations.saveCalculation, {
      query,
      result,
      steps,
      type: parsedQuery.type,
    });
    
    return {
      query,
      result,
      steps,
      type: parsedQuery.type,
      timestamp: Date.now(),
    };
    
  } catch (error) {
    console.error("Error processing calculation:", error);
    
    // Save error result to database
    await ctx.runMutation(api.calculations.saveCalculation, {
      query,
      result: "Error: Could not process calculation",
      steps: ["Failed to parse query"],
      type: "math",
    });
    
    return {
      query,
      result: "Error: Could not process calculation",
      steps: ["Failed to parse query"],
      type: "math" as const,
      timestamp: Date.now(),
    };
  }
});

// Simple math expression evaluator
function evaluateExpression(expr: string): number {
  // Remove spaces and validate expression
  const cleaned = expr.replace(/\s+/g, '');
  
  // Basic validation - only allow numbers, operators, parentheses, and decimal points
  if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) {
    throw new Error('Invalid characters in expression');
  }
  
  // For very simple expressions, use manual parsing instead of Function constructor
  try {
    // Handle simple two-number operations first
    const simpleOp = cleaned.match(/^(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)$/);
    if (simpleOp) {
      const num1 = parseFloat(simpleOp[1]);
      const operator = simpleOp[2];
      const num2 = parseFloat(simpleOp[3]);
      
      switch (operator) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num2 !== 0 ? num1 / num2 : (() => { throw new Error('Division by zero'); })();
        default: throw new Error('Unknown operator');
      }
    }
    
    // For more complex expressions, try the Function constructor
    const result = new Function('return ' + cleaned)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }
    return result;
  } catch (error) {
    throw new Error('Could not evaluate expression');
  }
}