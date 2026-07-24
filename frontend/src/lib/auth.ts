import { api } from './api';
import type { UserRole } from '@/config/roles';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  emailVerified: boolean;
  profileCompletion?: number;
  college?: string | null;
  graduationYear?: number | null;
  bio?: string | null;
  phone?: string | null;
  skills?: string[];
  interests?: string[];
  targetRole?: string | null;
}

export interface Session {
  user: SessionUser;
}

export async function getSession(): Promise<Session | null> {
  try {
    const res = await api.get<{ user: SessionUser }>('/auth/session');
    return res.data ? { user: res.data.user } : null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  return api.post<{ user: SessionUser }>('/auth/login', { email, password });
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'employer';
}) {
  return api.post<{ user: SessionUser }>('/auth/register', data);
}

export async function logout() {
  return api.post('/auth/logout');
}
