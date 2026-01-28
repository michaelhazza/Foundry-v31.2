import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createAppError } from '../utils/errors';

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const appError = createAppError('VAL-001', 'Validation failed');
        appError.details = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(appError);
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const appError = createAppError('VAL-001', 'Query validation failed');
        appError.details = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(appError);
      } else {
        next(error);
      }
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const appError = createAppError('VAL-001', 'Parameter validation failed');
        appError.details = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(appError);
      } else {
        next(error);
      }
    }
  };
}
