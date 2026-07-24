import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardSidebar } from '@/components/career/dashboard-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard redirectTo="/auth/login">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <DashboardSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
