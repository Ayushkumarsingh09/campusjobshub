import { AdminShell } from '@/components/admin/admin-shell';
import { PermissionGuard } from '@/components/admin/permission-guard';
import { ADMIN_ROLES } from '@/config/permissions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard roles={ADMIN_ROLES}>
      <AdminShell>{children}</AdminShell>
    </PermissionGuard>
  );
}
