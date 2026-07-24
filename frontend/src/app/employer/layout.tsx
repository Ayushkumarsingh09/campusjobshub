import { AuthGuard } from '@/components/auth/auth-guard';
import { RoleGuard } from '@/app/_components/role-guard';
import { DashboardSidebar } from '@/components/career/dashboard-sidebar';

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard redirectTo="/auth/login">
      <RoleGuard roles={['employer', 'admin', 'super_admin']} redirectTo="/dashboard">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col gap-8 lg:flex-row">
            <DashboardSidebar />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
