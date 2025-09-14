export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen calculator-bg flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}