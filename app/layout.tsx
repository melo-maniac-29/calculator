import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConvexProvider } from './ConvexProvider'
import { ThemeProvider } from './ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Real-World Calculator',
  description: 'Smart calculator that understands natural language and fetches live data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexProvider>
            {children}
          </ConvexProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}