import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createAppError } from '../utils/errors';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  organizationId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createAppError('AUTH-003', 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    const decoded = jwt.verify(token, secret) as AuthUser;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(createAppError('AUTH-002'));
    } else if (error.name === 'JsonWebTokenError') {
      next(createAppError('AUTH-003'));
    } else {
      next(error);
    }
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createAppError('AUTH-003', 'Not authenticated'));
    }
    if (!roles.includes(req.user.role)) {
      return next(createAppError('AUTH-004', 'Insufficient permissions'));
    }
    next();
  };
}

export function requireOrganization(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || !req.user.organizationId) {
    return next(createAppError('AUTH-003', 'No organization context'));
  }
  next();
}
