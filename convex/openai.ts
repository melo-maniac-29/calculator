import { action } from "./_generated/server";
import OpenAI from "openai";

export const parseQuery = action(async (ctx, { query }: { query: string }) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a calculator query parser. Parse natural language queries and return JSON with this exact structure:
          {
            "type": "stock|currency|nutrition|math|mixed",
            "operations": [
              {
                "type": "add|subtract|multiply|divide|stock|currency|nutrition|percentage|number",
                "value": number (if applicable),
                "stockSymbol": "string" (if stock operation),
                "currencyFrom": "string" (if currency),
                "currencyTo": "string" (if currency), 
                "amount": number (if currency),
                "food": "string" (if nutrition),
                "quantity": "string" (if nutrition),
                "expression": "string" (if simple math),
                "subtract": boolean (for percentage - true for tax/reduction, false for tip/addition)
              }
            ]
          }
          
          Examples:
          "2 + 3 * 4" -> {"type": "math", "operations": [{"type": "number", "expression": "2 + 3 * 4"}]}
          "50% tip on $20" -> {"type": "math", "operations": [{"type": "number", "value": 20}, {"type": "percentage", "value": 50, "subtract": false}]}
          "50% tip on 20$" -> {"type": "math", "operations": [{"type": "number", "value": 20}, {"type": "percentage", "value": 50, "subtract": false}]}
          "15% tip on $120" -> {"type": "math", "operations": [{"type": "number", "value": 120}, {"type": "percentage", "value": 15, "subtract": false}]}
          "$125 - 20% tax" -> {"type": "math", "operations": [{"type": "number", "value": 125}, {"type": "percentage", "value": 20, "subtract": true}]}
          "100 + 20% increase" -> {"type": "math", "operations": [{"type": "number", "value": 100}, {"type": "percentage", "value": 20, "subtract": false}]}
          "$500 + 10 AAPL shares" -> {"type": "mixed", "operations": [{"type": "number", "value": 500}, {"type": "stock", "stockSymbol": "AAPL", "value": 10}]}
          "€1000 to INR" -> {"type": "currency", "operations": [{"type": "currency", "currencyFrom": "EUR", "currencyTo": "INR", "amount": 1000}]}
          "calories in 2 bananas + 1 apple" -> {"type": "nutrition", "operations": [{"type": "nutrition", "food": "bananas", "quantity": "2"}, {"type": "nutrition", "food": "apple", "quantity": "1"}]}
          "5 hours at $25/hr" -> {"type": "math", "operations": [{"type": "multiply", "value": 5}, {"type": "multiply", "value": 25}]}
          "compound interest: $1000 at 5% for 3 years" -> {"type": "math", "operations": [{"type": "number", "expression": "1000 * Math.pow(1.05, 3)"}]}
          
          For basic math expressions (like "2+3*4"), use a single operation with type "number" and the expression.
          For percentages, determine if it's a reduction (tax, discount) or addition (tip, interest).
          For multiple food items, create separate nutrition operations.
          
          Return ONLY valid JSON, no explanation.`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    
    // Validate the response structure
    if (!parsed.type || !parsed.operations || !Array.isArray(parsed.operations)) {
      throw new Error("Invalid response structure");
    }
    
    return parsed;
  } catch (error) {
    console.error("Error parsing query:", error);
    
    // Try to detect simple math expressions as fallback
    const mathPattern = /^[0-9+\-*/.\s()]+$/;
    if (mathPattern.test(query.trim())) {
      return {
        type: "math",
        operations: [{ type: "number", expression: query.trim() }]
      };
    }
    
    // Try to detect percentage tip patterns
    const tipPattern = /(\d+)%\s+tip\s+on\s+[\$]?(\d+)/i;
    const tipMatch = query.match(tipPattern);
    if (tipMatch) {
      const [, percent, amount] = tipMatch;
      return {
        type: "math",
        operations: [
          { type: "number", value: parseFloat(amount) },
          { type: "percentage", value: parseFloat(percent), subtract: false }
        ]
      };
    }
    
    // Try to detect tax patterns
    const taxPattern = /[\$]?(\d+)\s*-\s*(\d+)%\s+(tax|discount)/i;
    const taxMatch = query.match(taxPattern);
    if (taxMatch) {
      const [, amount, percent] = taxMatch;
      return {
        type: "math",
        operations: [
          { type: "number", value: parseFloat(amount) },
          { type: "percentage", value: parseFloat(percent), subtract: true }
        ]
      };
    }
    
    // Final fallback
    return {
      type: "math",
      operations: [{ type: "add", value: 0 }]
    };
  }
});