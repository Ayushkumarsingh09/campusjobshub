'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MegaMenu } from '@/components/layout/mega-menu';
import { SearchBar } from '@/components/layout/search-bar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useSession } from '@/components/providers/session-provider';
import { isAdminRole } from '@/config/permissions';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const { user, isLoading } = useSession();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container-wide">
        <div className="flex h-16 items-center gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Briefcase className="h-4 w-4" />
            </span>
            <span className="hidden text-base sm:inline-block">{siteConfig.name}</span>
          </Link>

          <MegaMenu />

          <div className="ml-auto hidden flex-1 max-w-md lg:flex">
            <SearchBar compact />
          </div>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="hidden h-9 w-24 animate-pulse rounded-md bg-muted sm:block" />
            ) : user ? (
              <div className="hidden items-center gap-3 sm:flex">
                {isAdminRole(user.role) && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 rounded-full outline-none ring-offset-background transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                    <AvatarFallback className="text-xs">{initials ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button variant="brand" size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
            <MobileNav />
          </div>
        </div>

        <div className="pb-3 lg:hidden">
          <SearchBar compact placeholder="Search jobs & internships…" />
        </div>
      </div>
    </header>
  );
}
