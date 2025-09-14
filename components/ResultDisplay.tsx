"use client";

import { TrendingUp, DollarSign, Calculator, Apple, Clock, Info } from 'lucide-react';
import { CalculationResult } from '@/types';
import { formatResult } from '@/lib/utils';

interface ResultDisplayProps {
  result: CalculationResult;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return <TrendingUp className="text-emerald-500" size={24} />;
      case 'currency':
        return <DollarSign className="text-blue-500" size={24} />;
      case 'nutrition':
        return <Apple className="text-red-500" size={24} />;
      default:
        return <Calculator className="text-purple-500" size={24} />;
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'stock':
        return {
          label: 'Stock Calculation',
          color: 'border-emerald-500/20 bg-emerald-500/10',
          textColor: 'text-emerald-700 dark:text-emerald-300',
          info: 'Stock prices are updated in real-time during market hours'
        };
      case 'currency':
        return {
          label: 'Currency Conversion', 
          color: 'border-blue-500/20 bg-blue-500/10',
          textColor: 'text-blue-700 dark:text-blue-300',
          info: 'Exchange rates are updated frequently throughout the day'
        };
      case 'nutrition':
        return {
          label: 'Nutrition Lookup',
          color: 'border-red-500/20 bg-red-500/10', 
          textColor: 'text-red-700 dark:text-red-300',
          info: 'Nutrition data is sourced from the USDA nutrition database'
        };
      case 'mixed':
        return {
          label: 'Mixed Calculation',
          color: 'border-purple-500/20 bg-purple-500/10',
          textColor: 'text-purple-700 dark:text-purple-300',
          info: 'Complex calculation with multiple data sources'
        };
      default:
        return {
          label: 'Math Calculation',
          color: 'border-gray-500/20 bg-gray-500/10',
          textColor: 'text-gray-700 dark:text-gray-300',
          info: 'Basic mathematical calculation'
        };
    }
  };

  const typeInfo = getTypeInfo(result.type);

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-white/10 dark:bg-white/5">
            {getTypeIcon(result.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-lg lg:text-xl">
              {typeInfo.label}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 break-words">
              {result.query}
            </p>
          </div>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(result.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {/* Result */}
      <div className="mb-8">
        <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2 break-words">
          {formatResult(result.result)}
        </div>
      </div>

      {/* Steps */}
      {result.steps.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center">
            Calculation Steps
          </h4>
          <div className="space-y-3">
            {result.steps.map((step: string, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-xl bg-muted/50 border border-border"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-foreground font-mono leading-relaxed">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className={`p-4 rounded-xl border ${typeInfo.color}`}>
        <div className="flex items-start space-x-3">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className={`text-xs ${typeInfo.textColor} leading-relaxed`}>
            {typeInfo.info}
          </p>
        </div>
      </div>
    </div>
  );
}