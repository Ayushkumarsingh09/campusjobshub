import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" aria-hidden />
      </div>
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for may have been moved, deleted, or never existed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="brand" asChild>
          <Link href="/">
            <Home className="h-4 w-4" aria-hidden />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">
            <Search className="h-4 w-4" aria-hidden />
            Search
          </Link>
        </Button>
      </div>
    </div>
  );
}
