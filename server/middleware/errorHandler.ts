import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/errors';
import logger from '../utils/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    logger.warn('App error', {
      code: err.code,
      message: err.message,
      path: req.path,
      method: req.method,
    });
    return sendError(res, err);
  }

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  return sendError(res, err);
}
