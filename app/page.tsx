import Calculator from '@/components/Calculator'
import { ThemeToggle } from '@/components/ThemeToggle'

// Force dynamic rendering for Convex compatibility
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen calculator-bg">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12 animate-fade-in">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Real-World Calculator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Smart calculator powered by AI that understands natural language and fetches live data
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="px-3 py-1 text-xs font-medium rounded-full glass text-foreground">
              Live Stock Prices
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full glass text-foreground">
              Real-time Currency
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full glass text-foreground">
              Nutrition Data
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full glass text-foreground">
              AI Powered
            </span>
          </div>
        </div>
        
        <Calculator />
      </div>
    </div>
  )
}