import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { UnauthorizedError } from './errors';

const AUTH_SECRET = process.env.AUTH_SECRET ?? 'dev-secret-change-in-production';
const TOKEN_EXPIRY = '30d';
const COOKIE_NAME = 'cjh_session';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, AUTH_SECRET) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired session');
  }
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

import { ROLE_HIERARCHY } from './permissions';

export { ROLE_HIERARCHY, hasPermission, requirePermission, isAdminRole } from './permissions';

export function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
