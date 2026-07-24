'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/components/providers/session-provider';
import type { UserRole } from '@/config/roles';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  redirectTo?: string;
}

function RoleCheck({ children, roles, redirectTo = '/dashboard' }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && user && !roles.includes(user.role)) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, roles, router, redirectTo, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">Verifying permissions…</p>
      </div>
    );
  }

  if (!user || !roles.includes(user.role)) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldAlert className="h-12 w-12 text-muted-foreground" aria-hidden />
        <h2 className="text-xl font-semibold">Access denied</h2>
        <p className="max-w-md text-muted-foreground">
          You do not have permission to view this page.
        </p>
        <Button variant="brand" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

export function RoleGuard(props: RoleGuardProps) {
  return (
    <AuthGuard redirectTo="/auth/login">
      <RoleCheck {...props} />
    </AuthGuard>
  );
}
