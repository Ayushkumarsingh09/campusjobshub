import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'cjh_session';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/admin',
  '/employer',
  '/resume/builder',
  '/resume/ats-checker',
  '/resume/cover-letter',
] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasSession) {
    return NextResponse.next();
  }

  const callbackUrl = `${pathname}${search}`;
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/auth/login';
  loginUrl.search = '';
  loginUrl.searchParams.set('callbackUrl', callbackUrl);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/employer/:path*',
    '/resume/builder/:path*',
    '/resume/ats-checker/:path*',
    '/resume/cover-letter/:path*',
  ],
};
