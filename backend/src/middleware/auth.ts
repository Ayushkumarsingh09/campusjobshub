import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { verifyToken, JwtPayload, hasMinRole } from '../lib/auth';
import { UnauthorizedError, ForbiddenError } from '../lib/errors';
import { getCookieName } from '../lib/auth';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[getCookieName()];
  const bearerToken = req.headers.authorization?.replace('Bearer ', '');
  const token = cookieToken || bearerToken;

  if (!token) {
    return next(new UnauthorizedError('Authentication required'));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[getCookieName()];
  const bearerToken = req.headers.authorization?.replace('Bearer ', '');
  const token = cookieToken || bearerToken;

  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}

export function requireMinRole(minRole: UserRole) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!hasMinRole(req.user.role, minRole)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}
