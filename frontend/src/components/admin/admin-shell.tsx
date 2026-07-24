'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <div className="hidden lg:block">
        <AdminSidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          className="fixed inset-y-0 left-0 z-30"
        />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 border-zinc-800 bg-zinc-950 p-0">
          <AdminSidebar
            collapsed={false}
            onCollapsedChange={() => {}}
            onNavigate={() => setMobileOpen(false)}
            className="h-full w-full border-0"
          />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          'flex min-h-screen flex-1 flex-col transition-[margin] duration-200',
          collapsed ? 'lg:ml-[68px]' : 'lg:ml-64'
        )}
      >
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
