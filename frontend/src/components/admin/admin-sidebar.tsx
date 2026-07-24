'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminNavItems } from '@/config/admin-nav';
import { hasPermission } from '@/config/permissions';
import { useSession } from '@/components/providers/session-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: () => void;
  className?: string;
}

export function AdminSidebar({
  collapsed,
  onCollapsedChange,
  onNavigate,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useSession();

  const visibleItems = adminNavItems.filter(
    (item) => user && hasPermission(user.role, item.permission)
  );

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-zinc-800 bg-zinc-950',
        collapsed ? 'w-[68px]' : 'w-64',
        className
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-3">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-2 font-semibold text-zinc-100"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Briefcase className="h-4 w-4" />
          </span>
          {!collapsed && <span className="truncate text-sm">{siteConfig.name}</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="hidden h-8 w-8 shrink-0 lg:inline-flex"
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2" aria-label="Admin navigation">
        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.title : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-600/15 text-brand-400'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="border-t border-zinc-800 p-3">
          <Link
            href="/"
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ← Back to site
          </Link>
        </div>
      )}
    </aside>
  );
}
