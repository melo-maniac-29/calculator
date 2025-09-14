import { action } from "./_generated/server";

export const convertCurrency = action(async (ctx, { from, to, amount }: { 
  from: string; 
  to: string; 
  amount: number; 
}) => {
  try {
    // Using exchangerate-api.com which is free and reliable
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const rate = data.rates[to];
    
    if (!rate) {
      throw new Error(`Currency ${to} not found`);
    }
    
    const result = amount * rate;
    
    return {
      from,
      to,
      amount,
      result: Math.round(result * 100) / 100, // Round to 2 decimal places
      rate: Math.round(rate * 10000) / 10000, // Round rate to 4 decimal places
      success: true,
    };
  } catch (error) {
    console.error("Error converting currency:", error);
    return {
      from,
      to,
      amount,
      result: 0,
      rate: 0,
      success: false,
    };
  }
});

export const getExchangeRate = action(async (ctx, { from, to }: { 
  from: string; 
  to: string; 
}) => {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const rate = data.rates[to];
    
    if (!rate) {
      throw new Error(`Currency ${to} not found`);
    }
    
    return {
      from,
      to,
      rate: Math.round(rate * 10000) / 10000,
      success: true,
      date: data.date,
    };
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return {
      from,
      to,
      rate: 0,
      success: false,
      date: null,
    };
  }
});