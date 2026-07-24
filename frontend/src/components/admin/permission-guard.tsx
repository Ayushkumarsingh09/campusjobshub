'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useSession } from '@/components/providers/session-provider';
import type { UserRole } from '@/config/roles';
import {
  ADMIN_ROLES,
  hasAnyPermission,
  hasPermission,
  isAdminRole,
  type Permission,
} from '@/config/permissions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PermissionGuardProps {
  children: React.ReactNode;
  roles?: UserRole[];
  permission?: Permission;
  permissions?: Permission[];
  redirectTo?: string;
}

function PermissionCheck({
  children,
  roles = ADMIN_ROLES,
  permission,
  permissions,
  redirectTo = '/dashboard',
}: PermissionGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useSession();

  const allowedByRole = user ? roles.includes(user.role) : false;
  const allowedByPerm =
    user &&
    (permission
      ? hasPermission(user.role, permission)
      : permissions
        ? hasAnyPermission(user.role, permissions)
        : isAdminRole(user.role));

  const allowed = allowedByRole && allowedByPerm;

  useEffect(() => {
    if (!isLoading && user && !allowed) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, allowed, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Verifying permissions…</p>
      </div>
    );
  }

  if (!user || !allowed) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldAlert className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Access denied</h2>
        <p className="max-w-md text-muted-foreground">
          You do not have permission to access the admin panel.
        </p>
        <Button variant="brand" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

export function PermissionGuard(props: PermissionGuardProps) {
  return (
    <AuthGuard redirectTo="/auth/login">
      <PermissionCheck {...props} />
    </AuthGuard>
  );
}
