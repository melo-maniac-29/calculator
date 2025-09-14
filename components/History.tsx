"use client";

import { Clock, TrendingUp, DollarSign, Calculator, Apple, BarChart3 } from 'lucide-react';
import { CalculationResult } from '@/types';

interface HistoryProps {
  calculations: CalculationResult[];
  onSelectCalculation: (calculation: CalculationResult) => void;
}

export default function History({ calculations, onSelectCalculation }: HistoryProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return <TrendingUp className="text-green-500 dark:text-green-400" size={16} />;
      case 'currency':
        return <DollarSign className="text-blue-500 dark:text-blue-400" size={16} />;
      case 'nutrition':
        return <Apple className="text-red-500 dark:text-red-400" size={16} />;
      case 'math':
        return <Calculator className="text-purple-500 dark:text-purple-400" size={16} />;
      default:
        return <BarChart3 className="text-gray-500 dark:text-gray-400" size={16} />;
    }
  };

  const formatDisplayResult = (result: any) => {
    if (typeof result === 'number') {
      // Format large numbers with commas
      return result.toLocaleString(undefined, { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
      });
    }
    return String(result);
  };

  if (calculations.length === 0) {
    return (
      <div className="glass-card h-full min-h-[400px] lg:min-h-[500px] max-h-[600px] lg:max-h-[700px] flex flex-col">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="text-primary" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">History</h3>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-1 text-center min-h-0">
          <div className="p-4 rounded-full bg-muted/20 mb-4">
            <Clock className="text-muted-foreground" size={32} />
          </div>
          <p className="text-foreground font-medium mb-2">No calculations yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Start by asking questions like &ldquo;What&apos;s 1000 USD in EUR?&rdquo; or &ldquo;AAPL stock price&rdquo;
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card h-full min-h-[400px] lg:min-h-[500px] max-h-[600px] lg:max-h-[700px] flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="text-primary" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-foreground">History</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
            {calculations.length} {calculations.length === 1 ? 'calculation' : 'calculations'}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 -mr-2 min-h-0">
        {calculations.slice().reverse().map((calc, index) => (
          <button
            key={calc._id || index}
            onClick={() => onSelectCalculation(calc)}
            className="w-full text-left p-4 rounded-xl bg-background/50 hover:bg-background/80 
                     border border-border/50 hover:border-border transition-all duration-200 
                     group hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-muted/20 group-hover:bg-muted/30 transition-colors">
                {getTypeIcon(calc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {calc.query}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                    {formatDisplayResult(calc.result)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(calc.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {calculations.length > 20 && (
        <div className="mt-4 pt-4 border-t border-border/50 flex-shrink-0">
          <p className="text-xs text-center text-muted-foreground">
            Showing latest {Math.min(calculations.length, 50)} calculations
          </p>
        </div>
      )}
    </div>
  );
}