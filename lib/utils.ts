import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: { [key: string]: string } = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'INR': '₹',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'Fr',
    'CNY': '¥',
    'SEK': 'kr',
    'NOK': 'kr',
    'MXN': '$',
    'SGD': 'S$',
    'HKD': 'HK$',
    'NZD': 'NZ$',
    'TRY': '₺',
    'RUB': '₽',
    'BRL': 'R$',
    'ZAR': 'R'
  };

  const symbol = currencySymbols[currency] || currency;
  
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatResult(result: string | number): string {
  if (typeof result === 'number') {
    return formatNumber(result);
  }
  return result;
}