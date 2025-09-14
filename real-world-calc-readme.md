# 🧮 Real-World Calculator

> Smart calculator that understands natural language and fetches live data for real-world calculations

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-blue)](https://www.convex.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/real-world-calculator.git
cd real-world-calculator

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start Convex backend
npx convex dev

# Start development server (new terminal)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start calculating!

## 🎯 What It Does

Type natural language queries and get real results:

| Query Example | Result |
|---------------|--------|
| `$500 + 10 AAPL shares` | `$2,234.50` (live stock price) |
| `€1000 to INR` | `₹90,450` (current exchange rate) |
| `calories in 2 bananas + 1 apple` | `285 calories` (nutrition data) |
| `5 hours at $25/hr - 20% tax` | `$100 net pay` (calculated) |
| `TSLA stock price * 50` | `$12,150` (current Tesla price) |

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Convex (serverless functions + real-time database)
- **AI**: OpenAI GPT for natural language understanding
- **APIs**: Finnhub (stocks) + ExchangeRate.host (currency) + Nutritionix (food)

## 🔑 Environment Setup

Create `.env.local` with your API keys:

```env
# Convex (get from convex.dev dashboard)
CONVEX_DEPLOYMENT=your-deployment-url
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# Stock Market Data
FINNHUB_API_KEY=your-finnhub-api-key-here

# Nutrition Data  
NUTRITIONIX_API_KEY=your-nutritionix-api-key-here
NUTRITIONIX_API_ID=your-nutritionix-app-id-here

# Currency API (ExchangeRate.host - no key needed, completely free)
```

## 📁 Project Structure

```
real-world-calculator/
├── app/                     # Next.js 14 app directory
│   ├── page.tsx            # Main calculator page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── Calculator.tsx      # Main calculator interface
│   ├── QueryInput.tsx      # Natural language input
│   ├── ResultDisplay.tsx   # Results with breakdown
│   └── History.tsx         # Calculation history
├── convex/                 # Convex backend
│   ├── _generated/         # Auto-generated files
│   ├── calculations.ts     # Main calculation logic
│   ├── openai.ts          # OpenAI integration
│   ├── stocks.ts          # Finnhub stock data
│   ├── currency.ts        # Currency conversion
│   ├── nutrition.ts       # Food nutrition lookup
│   └── schema.ts          # Database schema
├── lib/                   # Utilities
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
└── package.json          # Dependencies
```

## 🚀 Installation Guide

### 1. Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Git

### 2. Clone & Install
```bash
git clone <repo-url>
cd real-world-calculator
npm install
```

### 3. Setup Convex
```bash
# Login to Convex
npx convex auth

# Initialize project
npx convex dev
```

### 4. Get Missing API Keys

You have most keys, just need:

**Convex URLs:**
1. After running `npx convex dev`, copy the URLs shown
2. Add them to `.env.local`

All other API keys are ready to use! ✅

### 5. Start Development
```bash
# Terminal 1: Convex backend
npx convex dev

# Terminal 2: Next.js frontend  
npm run dev
```

## 🔄 How It Works

### 1. Natural Language Processing
```typescript
// convex/openai.ts
export const parseQuery = action(async (ctx, { query }) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system", 
        content: "Parse this calculation query and extract: operation type, values, symbols..."
      },
      { role: "user", content: query }
    ]
  });
  
  return JSON.parse(response.choices[0].message.content);
});
```

### 2. Live Data Fetching
```typescript
// convex/stocks.ts
export const getStockPrice = action(async (ctx, { symbol }) => {
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
  );
  const data = await response.json();
  return data.c; // current price
});
```

### 3. Currency Conversion (Free API)
```typescript
// convex/currency.ts
export const convertCurrency = action(async (ctx, { from, to, amount }) => {
  const response = await fetch(
    `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
  );
  return await response.json();
});
```

### 4. Nutrition Lookup
```typescript
// convex/nutrition.ts
export const getNutrition = action(async (ctx, { food, quantity }) => {
  const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
    method: 'POST',
    headers: {
      'x-app-id': process.env.NUTRITIONIX_API_ID,
      'x-app-key': process.env.NUTRITIONIX_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: `${quantity} ${food}` })
  });
  return await response.json();
});
```

## 🎨 Key Features

### Smart Query Understanding
- **Stock queries**: "price of AAPL", "10 Tesla shares", "MSFT stock"
- **Currency**: "500 USD to EUR", "€1000 in Indian rupees"  
- **Food**: "calories in 2 eggs", "nutrition in 100g rice"
- **Math**: "15% of 2000", "20% tax on $500"
- **Combined**: "$100 + 5 AAPL shares - 10% tax"

### Real-time Results
- Live stock prices (updated every minute)
- Current exchange rates
- Accurate nutrition information
- Calculation history with timestamps

### Responsive Design
- Works on desktop, tablet, mobile
- Clean, modern interface
- Real-time result updates

## 🧪 Example Queries & Results

```
Query: "$1000 + price of 20 AAPL shares"
Steps:
1. Get AAPL current price: $223.45
2. Calculate: 20 * $223.45 = $4,469
3. Add: $1000 + $4,469 = $5,469
Result: $5,469.00

Query: "calories in 250g chicken breast + 1 banana"  
Steps:
1. Chicken breast (250g): 275 calories
2. Banana (1 medium): 105 calories  
3. Total: 275 + 105 = 380 calories
Result: 380 calories

Query: "€500 to INR after 5% fee"
Steps: 
1. Convert €500 to INR: ₹45,225
2. Calculate 5% fee: ₹2,261.25
3. Subtract fee: ₹45,225 - ₹2,261.25 = ₹42,963.75
Result: ₹42,963.75
```

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
```

### Deploy Convex Backend
```bash
npx convex deploy --prod
```

## 📊 API Rate Limits

| Service | Free Limit | Cost After |
|---------|------------|------------|
| OpenAI | $5 free credit | $0.002/1K tokens |
| Finnhub | 60 calls/min | $0.024/call |
| Nutritionix | 200 requests/day | $0.006/request |
| ExchangeRate.host | Unlimited | Always free |

## 🐛 Troubleshooting

**OpenAI API Error:**
```bash
# Check your API key has credits
# Verify key starts with 'sk-proj-'
```

**Convex Connection Issues:**
```bash
npx convex auth logout
npx convex auth login
```

**Stock API Not Working:**
```bash
# Verify Finnhub key in .env.local
# Check if market is open (stocks only update during market hours)
```

## 📝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/awesome-feature`  
3. Commit changes: `git commit -m 'Add awesome feature'`
4. Push: `git push origin feature/awesome-feature`
5. Open Pull Request

## 🔒 Security Notes

- All API keys are server-side only (Convex actions)
- No sensitive data exposed to frontend
- Rate limiting implemented for all external APIs

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

**Ready to build?** Run the setup commands and start calculating! 🚀