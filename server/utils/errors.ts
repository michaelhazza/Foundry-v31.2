export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  // Auth errors
  'AUTH-001': { status: 401, message: 'Invalid credentials' },
  'AUTH-002': { status: 401, message: 'Token expired' },
  'AUTH-003': { status: 401, message: 'Invalid token' },
  'AUTH-004': { status: 403, message: 'Insufficient permissions' },
  // Validation errors
  'VAL-001': { status: 400, message: 'Validation failed' },
  // Database errors
  'DB-001': { status: 500, message: 'Database error' },
  'DB-002': { status: 409, message: 'Resource already exists' },
  'DB-003': { status: 404, message: 'Resource not found' },
  // API errors
  'API-001': { status: 502, message: 'External API error' },
  // System errors
  'SYS-001': { status: 500, message: 'Internal server error' },
  // File errors
  'FILE-001': { status: 400, message: 'Invalid file' },
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

export function createAppError(code: ErrorCode, details?: string): AppError {
  const errorDef = ErrorCodes[code];
  return new AppError(errorDef.status, code, details || errorDef.message);
}

export function sendError(res: any, error: AppError | Error) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }
  return res.status(500).json({
    success: false,
    error: {
      code: 'SYS-001',
      message: 'Internal server error',
    },
  });
}
