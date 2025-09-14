"use client";

import { TrendingUp, DollarSign, Apple, Brain } from 'lucide-react';

export default function ApiInfo() {
  const apis = [
    {
      name: 'Finnhub',
      description: 'Real-time stock prices and market data',
      icon: <TrendingUp className="text-emerald-500 dark:text-emerald-400" size={20} />,
      status: 'Live',
      statusColor: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30'
    },
    {
      name: 'ExchangeRate-API',
      description: 'Live currency conversion rates',
      icon: <DollarSign className="text-blue-500 dark:text-blue-400" size={20} />,
      status: 'Live',
      statusColor: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
    },
    {
      name: 'Nutritionix',
      description: 'USDA nutrition database lookup',
      icon: <Apple className="text-red-500 dark:text-red-400" size={20} />,
      status: 'Live',
      statusColor: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
    },
    {
      name: 'OpenAI GPT-3.5',
      description: 'Natural language processing',
      icon: <Brain className="text-purple-500 dark:text-purple-400" size={20} />,
      status: 'Active',
      statusColor: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
    }
  ];

  return (
    <div className="glass-card h-full min-h-[300px] max-h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="text-primary" size={20} />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Powered By</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-muted-foreground">All Systems Live</span>
        </div>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 -mr-2 min-h-0">
        {apis.map((api, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-border transition-all duration-200"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-muted/20">
                {api.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {api.name}
                  </h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${api.statusColor}`}>
                    {api.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {api.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50 flex-shrink-0">
        <p className="text-xs text-center text-muted-foreground">
          All APIs provide real-time data with sub-second response times
        </p>
      </div>
    </div>
  );
}