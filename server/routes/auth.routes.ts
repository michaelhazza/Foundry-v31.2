import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as AuthService from '../services/auth.service';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';
import { sendError } from '../utils/errors';

const router = Router();

// Zod schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  organizationName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

// POST /api/auth/register
router.post('/register', validateBody(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, validateBody(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.getCurrentUser(req.user!.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', validateBody(forgotPasswordSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.forgotPassword(req.body);
    res.json({ success: true, data: { message: 'If the email exists, a reset link has been sent' } });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', validateBody(resetPasswordSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.resetPassword(req.body);
    res.json({ success: true, data: { message: 'Password has been reset' } });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/auth/change-password
router.patch('/change-password', requireAuth, validateBody(changePasswordSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.changePassword({
      userId: req.user!.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });
    res.json({ success: true, data: { message: 'Password changed' } });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/verify-token
router.get('/verify-token', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    const result = await AuthService.verifyToken(token);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/auth/logout
router.delete('/logout', requireAuth, async (_req: Request, res: Response) => {
  // Client-side token deletion only
  res.json({ success: true, data: { message: 'Logged out' } });
});

export default router;
