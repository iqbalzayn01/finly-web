import { Link } from '@tanstack/react-router'
import { ArrowLeft, Home, FileQuestion } from './ui/icon'

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-6">
        <FileQuestion className="h-8 w-8" />
      </div>

      <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
        404 • Page Not Found
      </span>

      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
        Page Not Found
      </h1>

      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        The page or resource you are looking for doesn't exist, has been
        removed, or is temporarily unavailable.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-none flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Return to Dashboard
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 border border-border bg-card hover:bg-accent text-foreground text-xs font-bold rounded-xl transition-all shadow-none flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Landing Page
        </Link>
      </div>
    </div>
  )
}
