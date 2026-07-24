export type UserRole = 'student' | 'employer' | 'author' | 'editor' | 'admin' | 'super_admin';

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  employer: 'Employer',
  author: 'Author',
  editor: 'Editor',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

export const ADMIN_PANEL_ROLES: UserRole[] = ['author', 'editor', 'admin', 'super_admin'];

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard': ['student', 'employer', 'author', 'editor', 'admin', 'super_admin'],
  '/dashboard/admin': ['author', 'editor', 'admin', 'super_admin'],
  '/admin': ['author', 'editor', 'admin', 'super_admin'],
  '/employer': ['employer', 'admin'],
  '/resume/builder': ['student', 'employer', 'author', 'editor', 'admin', 'super_admin'],
  '/resume/ats-checker': ['student', 'employer', 'author', 'editor', 'admin', 'super_admin'],
  '/resume/cover-letter': ['student', 'employer', 'author', 'editor', 'admin', 'super_admin'],
};

export function canAccessRoute(role: UserRole, path: string): boolean {
  const matched = Object.entries(ROUTE_PERMISSIONS).find(([route]) => path.startsWith(route));
  if (!matched) return true;
  return matched[1].includes(role);
}
