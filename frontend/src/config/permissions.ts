import type { UserRole } from '@/config/roles';

export type Permission =
  | 'dashboard:view'
  | 'jobs:read' | 'jobs:write' | 'jobs:delete' | 'jobs:bulk'
  | 'internships:read' | 'internships:write' | 'internships:delete' | 'internships:bulk'
  | 'companies:read' | 'companies:write' | 'companies:delete' | 'companies:verify'
  | 'blog:read' | 'blog:write' | 'blog:delete' | 'blog:publish'
  | 'roadmaps:read' | 'roadmaps:write' | 'roadmaps:delete'
  | 'interview:read' | 'interview:write' | 'interview:delete'
  | 'users:read' | 'users:write' | 'users:delete'
  | 'newsletter:read' | 'newsletter:write'
  | 'seo:read' | 'seo:write'
  | 'media:read' | 'media:write' | 'media:delete'
  | 'adsense:read' | 'adsense:write'
  | 'analytics:read'
  | 'settings:read' | 'settings:write'
  | 'categories:write' | 'tags:write';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [],
  employer: [],
  author: [
    'dashboard:view', 'blog:read', 'blog:write', 'media:read', 'media:write',
  ],
  editor: [
    'dashboard:view',
    'jobs:read', 'internships:read', 'companies:read',
    'blog:read', 'blog:write', 'blog:publish', 'blog:delete',
    'roadmaps:read', 'roadmaps:write',
    'interview:read', 'interview:write',
    'media:read', 'media:write',
    'seo:read',
    'categories:write', 'tags:write',
  ],
  admin: [
    'dashboard:view', 'analytics:read',
    'jobs:read', 'jobs:write', 'jobs:delete', 'jobs:bulk',
    'internships:read', 'internships:write', 'internships:delete', 'internships:bulk',
    'companies:read', 'companies:write', 'companies:delete', 'companies:verify',
    'blog:read', 'blog:write', 'blog:delete', 'blog:publish',
    'roadmaps:read', 'roadmaps:write', 'roadmaps:delete',
    'interview:read', 'interview:write', 'interview:delete',
    'users:read', 'users:write',
    'newsletter:read', 'newsletter:write',
    'seo:read', 'seo:write',
    'media:read', 'media:write', 'media:delete',
    'adsense:read', 'adsense:write',
    'settings:read', 'settings:write',
    'categories:write', 'tags:write',
  ],
  super_admin: [
    'dashboard:view', 'analytics:read',
    'jobs:read', 'jobs:write', 'jobs:delete', 'jobs:bulk',
    'internships:read', 'internships:write', 'internships:delete', 'internships:bulk',
    'companies:read', 'companies:write', 'companies:delete', 'companies:verify',
    'blog:read', 'blog:write', 'blog:delete', 'blog:publish',
    'roadmaps:read', 'roadmaps:write', 'roadmaps:delete',
    'interview:read', 'interview:write', 'interview:delete',
    'users:read', 'users:write', 'users:delete',
    'newsletter:read', 'newsletter:write',
    'seo:read', 'seo:write',
    'media:read', 'media:write', 'media:delete',
    'adsense:read', 'adsense:write',
    'settings:read', 'settings:write',
    'categories:write', 'tags:write',
  ],
};

export const ADMIN_ROLES: UserRole[] = ['author', 'editor', 'admin', 'super_admin'];

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'super_admin' || role === 'admin';
}
