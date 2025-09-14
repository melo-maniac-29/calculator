"use client";

import { useState } from 'react';
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CalculationResult } from '@/types';
import QueryInput from './QueryInput';
import ResultDisplay from './ResultDisplay';
import History from './History';
import ApiInfo from './ApiInfo';

export default function Calculator() {
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const processCalculation = useAction(api.calculations.processCalculation);
  const calculations = useQuery(api.calculations.getCalculations);

  const handleCalculation = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await processCalculation({ query });
      setCurrentResult(result);
    } catch (error) {
      console.error('Calculation error:', error);
      setCurrentResult({
        query,
        result: 'Error: Could not process calculation',
        steps: ['Failed to process query'],
        timestamp: Date.now(),
        type: 'math'
      } as CalculationResult);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQueries = [
    { 
      text: '15% tip on $120', 
      category: 'Math'
    },
    { 
      text: '€1000 to INR', 
      category: 'Currency'
    },
    { 
      text: '2 bananas + 1 apple calories', 
      category: 'Nutrition'
    },
    { 
      text: '5 * 25 - 20% tax', 
      category: 'Math'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Calculator Area */}
        <div className="xl:col-span-2 space-y-6">
          <QueryInput 
            onSubmit={handleCalculation}
            isLoading={isLoading}
          />
          
          {currentResult && (
            <div className="animate-slide-up">
              <ResultDisplay result={currentResult} />
            </div>
          )}
          
          {/* Example Queries */}
          <div className="glass rounded-2xl p-6 lg:p-8 animate-fade-in">
            <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-6">
              Try these examples
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleCalculation(example.text)}
                  disabled={isLoading}
                  className="group p-4 lg:p-5 rounded-xl btn-glass text-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
                >
                  <div className="flex items-start space-x-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                        {example.category}
                      </div>
                      <div className="text-sm lg:text-base text-foreground font-medium leading-relaxed">
                        {example.text}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* API Information */}
          <ApiInfo />
          
          {/* History */}
          <History 
            calculations={calculations || []}
            onSelectCalculation={setCurrentResult}
          />
        </div>
      </div>
    </div>
  );
}