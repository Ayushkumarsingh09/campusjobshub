'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  Bookmark,
  Building2,
  FileText,
  Sparkles,
  Target,
  User,
  Briefcase,
  ScanSearch,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/components/providers/session-provider';

const studentNav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/applications', label: 'Applications', icon: Send },
  { href: '/dashboard/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { href: '/dashboard/saved-companies', label: 'Saved Companies', icon: Building2 },
  { href: '/dashboard/resumes', label: 'My Resumes', icon: FileText },
  { href: '/dashboard/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/dashboard/skills', label: 'Skill Gap', icon: Target },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

const toolsNav = [
  { href: '/resume/builder', label: 'Resume Builder', icon: FileText },
  { href: '/resume/ats-checker', label: 'ATS Checker', icon: ScanSearch },
  { href: '/resume/cover-letter', label: 'Cover Letter', icon: Mail },
];

const employerNav = [
  { href: '/employer', label: 'Overview', icon: LayoutDashboard },
  { href: '/employer/jobs', label: 'Manage Listings', icon: Briefcase },
  { href: '/employer/applications', label: 'Applications', icon: Send },
  { href: '/employer/company', label: 'Company', icon: Building2 },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useSession();
  const isEmployer = user?.role === 'employer';
  const mainNav = isEmployer ? employerNav : studentNav;

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <nav className="space-y-6">
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isEmployer ? 'Employer' : 'Career'}
          </p>
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/employer' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand-600/10 text-brand-700 dark:text-brand-400'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {!isEmployer && (
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tools
            </p>
            <ul className="space-y-1">
              {toolsNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                      pathname.startsWith(item.href) && 'bg-muted text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}
