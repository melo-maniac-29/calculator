"use client";

import { useState, FormEvent } from 'react';
import { Search, Calculator, Sparkles, Loader2 } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export default function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  const capabilities = [
    { label: 'Stocks', color: 'text-emerald-400' },
    { label: 'Currency', color: 'text-blue-400' },
    { label: 'Nutrition', color: 'text-red-400' },
    { label: 'Math', color: 'text-purple-400' }
  ];

  return (
    <div className="glass rounded-2xl p-6 lg:p-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute left-4 lg:left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
            <Search size={20} />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=""
            className="w-full pl-12 lg:pl-14 pr-4 py-4 lg:py-5 bg-background border border-border rounded-xl lg:rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 
                     text-foreground placeholder-muted-foreground text-base lg:text-lg
                     transition-all duration-300"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                     px-4 lg:px-6 py-2 lg:py-3 bg-primary hover:bg-primary/90 
                     disabled:bg-muted disabled:cursor-not-allowed 
                     text-primary-foreground rounded-lg lg:rounded-xl font-medium 
                     transition-all duration-300 flex items-center space-x-2
                     disabled:opacity-50 hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Calculate</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-powered capabilities:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {capabilities.map((cap, index) => (
              <div
                key={index}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-muted border border-border"
              >
                <span className={`text-xs font-medium ${cap.color}`}>
                  {cap.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}