'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden />
      </div>
      <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred while loading this page. Please try again or return to the
        homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="brand" onClick={reset}>
          <RefreshCw className="h-4 w-4" aria-hidden />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}
