import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import {
  hashPassword,
  verifyPassword,
  signToken,
  getCookieName,
  getCookieOptions,
} from '../lib/auth';
import { success, error } from '../lib/api-response';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../schemas/auth';
import { authenticate } from '../middleware/auth';
import { ConflictError } from '../lib/errors';

const router = Router();

router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) throw new ConflictError('Email already registered');

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
      },
    });

    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: !!user.emailVerifiedAt,
    });

    res.cookie(getCookieName(), token, getCookieOptions());
    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: !!user.emailVerifiedAt,
      },
    }, undefined, 201);
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), deletedAt: null, isActive: true },
    });

    if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
      return error(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: !!user.emailVerifiedAt,
    });

    res.cookie(getCookieName(), token, getCookieOptions());
    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: !!user.emailVerifiedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(getCookieName(), { path: '/' });
  return success(res, { message: 'Logged out' });
});

router.get('/session', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        emailVerifiedAt: true,
        profileCompletion: true,
        college: true,
        graduationYear: true,
        bio: true,
        phone: true,
        skills: true,
        interests: true,
        targetRole: true,
      },
    });

    if (!user) return error(res, 401, 'UNAUTHORIZED', 'User not found');

    return success(res, {
      user: {
        ...user,
        emailVerified: !!user.emailVerifiedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// NextAuth-compatible session endpoint
router.get('/me', authenticate, async (req: Request, res: Response) => {
  return success(res, { session: { user: req.user } });
});

export default router;
