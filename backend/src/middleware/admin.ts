import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate } from './auth';
import { Permission, hasPermission, isAdminRole } from '../lib/permissions';
import { ForbiddenError, UnauthorizedError } from '../lib/errors';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    if (!req.user || !isAdminRole(req.user.role as UserRole)) {
      return next(new ForbiddenError('Admin access required'));
    }
    next();
  });
}

export function requirePerm(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError());
    if (!hasPermission(req.user.role as UserRole, permission)) {
      return next(new ForbiddenError(`Missing permission: ${permission}`));
    }
    next();
  };
}
