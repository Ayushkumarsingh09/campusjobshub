'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { getAdminBreadcrumb } from '@/config/admin-nav';
import { useSession } from '@/components/providers/session-provider';
import { useTheme } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROLE_LABELS } from '@/config/roles';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function AdminHeader({ onMenuClick, className }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user, signOut } = useSession();
  const { resolvedTheme, toggleTheme } = useTheme();
  const crumbs = getAdminBreadcrumb(pathname);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center gap-4 border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 sm:flex">
        <ol className="flex items-center gap-1 text-sm text-zinc-400">
          {crumbs.map((crumb, i) => (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-zinc-200">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-zinc-200">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-7 w-7">
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback className="text-xs">{initials ?? 'A'}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm sm:inline">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
              <div className="text-xs capitalize">
                {user ? ROLE_LABELS[user.role] : ''}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <User className="mr-2 h-4 w-4" />
                User Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
