import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Building2,
  FileText,
  Map,
  MessageSquare,
  Users,
  Mail,
  Search,
  Image,
  DollarSign,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { Permission } from '@/config/permissions';

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
  description?: string;
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    permission: 'dashboard:view',
    description: 'Overview & activity',
  },
  {
    title: 'Jobs',
    href: '/admin/jobs',
    icon: Briefcase,
    permission: 'jobs:read',
    description: 'Manage job listings',
  },
  {
    title: 'Internships',
    href: '/admin/internships',
    icon: GraduationCap,
    permission: 'internships:read',
    description: 'Manage internships',
  },
  {
    title: 'Companies',
    href: '/admin/companies',
    icon: Building2,
    permission: 'companies:read',
    description: 'Company profiles',
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: FileText,
    permission: 'blog:read',
    description: 'Articles & content',
  },
  {
    title: 'Roadmaps',
    href: '/admin/roadmaps',
    icon: Map,
    permission: 'roadmaps:read',
    description: 'Career roadmaps',
  },
  {
    title: 'Interview Q&A',
    href: '/admin/interview-questions',
    icon: MessageSquare,
    permission: 'interview:read',
    description: 'Prep questions',
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    permission: 'users:read',
    description: 'User management',
  },
  {
    title: 'Newsletter',
    href: '/admin/newsletter',
    icon: Mail,
    permission: 'newsletter:read',
    description: 'Subscribers',
  },
  {
    title: 'SEO',
    href: '/admin/seo',
    icon: Search,
    permission: 'seo:read',
    description: 'Page optimization',
  },
  {
    title: 'Media',
    href: '/admin/media',
    icon: Image,
    permission: 'media:read',
    description: 'Asset library',
  },
  {
    title: 'AdSense',
    href: '/admin/adsense',
    icon: DollarSign,
    permission: 'adsense:read',
    description: 'Ad slot config',
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: 'analytics:read',
    description: 'Traffic & growth',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'settings:read',
    description: 'Site configuration',
  },
];

export function getAdminBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [{ label: 'Admin', href: '/admin' }];

  if (segments.length === 0) {
    crumbs.push({ label: 'Dashboard' });
    return crumbs;
  }

  const moduleItem = adminNavItems.find((item) => item.href === `/admin/${segments[0]}`);
  const moduleLabel = moduleItem?.title ?? segments[0].replace(/-/g, ' ');

  crumbs.push({
    label: moduleLabel,
    href: segments.length > 1 ? `/admin/${segments[0]}` : undefined,
  });

  if (segments[1] === 'new') {
    crumbs.push({ label: 'New' });
  } else if (segments[1] === 'edit') {
    crumbs.push({ label: 'Edit' });
  }

  return crumbs;
}
