import { action } from "./_generated/server";

export const getStockPrice = action(async (ctx, { symbol }: { symbol: string }) => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      symbol,
      price: data.c || 0, // current price
      change: data.d || 0, // change
      changePercent: data.dp || 0, // change percent
      previousClose: data.pc || 0, // previous close
    };
  } catch (error) {
    console.error("Error fetching stock price:", error);
    return {
      symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      previousClose: 0,
    };
  }
});

export const getMultipleStocks = action(async (ctx, { symbols }: { symbols: string[] }) => {
  try {
    const promises = symbols.map(symbol => 
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`)
        .then(res => res.json())
        .then(data => ({
          symbol,
          price: data.c || 0,
          change: data.d || 0,
          changePercent: data.dp || 0,
          previousClose: data.pc || 0,
        }))
        .catch(() => ({
          symbol,
          price: 0,
          change: 0,
          changePercent: 0,
          previousClose: 0,
        }))
    );

    return await Promise.all(promises);
  } catch (error) {
    console.error("Error fetching multiple stocks:", error);
    return symbols.map(symbol => ({
      symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      previousClose: 0,
    }));
  }
});