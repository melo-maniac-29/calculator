// Types for the Real-World Calculator

export type CalculationType = 'stock' | 'currency' | 'nutrition' | 'math' | 'mixed';

export interface CalculationResult {
  _id?: string;
  query: string;
  result: string | number;
  steps: string[];
  type: CalculationType;
  timestamp: number;
}

export interface StockOperation {
  type: 'stock';
  stockSymbol: string;
  value?: number;
}

export interface CurrencyOperation {
  type: 'currency';
  currencyFrom: string;
  currencyTo: string;
  amount?: number;
  value?: number;
}

export interface NutritionOperation {
  type: 'nutrition';
  food: string;
  quantity?: string;
}

export interface MathOperation {
  type: 'add' | 'subtract' | 'multiply' | 'divide' | 'percentage';
  value?: number;
}

export type Operation = StockOperation | CurrencyOperation | NutritionOperation | MathOperation;

export interface ParsedQuery {
  operations: Operation[];
  type: CalculationType;
}

export interface StockData {
  price: number;
  symbol: string;
  name?: string;
}

export interface CurrencyData {
  result: number;
  from: string;
  to: string;
  rate: number;
}

export interface NutritionData {
  calories: number;
  food: string;
  quantity: string;
}