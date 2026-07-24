'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/components/providers/session-provider';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
  className?: string;
}

export function AuthGuard({
  children,
  redirectTo = '/login',
  fallback,
  className,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const params = new URLSearchParams({ redirect: pathname });
      router.replace(`${redirectTo}?${params.toString()}`);
    }
  }, [isLoading, isAuthenticated, router, redirectTo, pathname]);

  if (isLoading) {
    return (
      fallback ?? (
        <div
          className={cn(
            'flex min-h-[50vh] flex-col items-center justify-center gap-3',
            className
          )}
        >
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">Checking authentication…</p>
        </div>
      )
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
