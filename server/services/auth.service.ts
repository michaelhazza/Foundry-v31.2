import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db';
import { users, organizations, passwordResetTokens } from '../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { createAppError } from '../utils/errors';
import logger from '../utils/logger';

const SALT_ROUNDS = 10;
const JWT_EXPIRY = '7d';

function generateToken(user: { id: number; email: string; role: string; organizationId: number }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
    secret,
    { expiresIn: JWT_EXPIRY }
  );
}

export async function register(data: { email: string; password: string; name: string; organizationName: string }) {
  const { email, password, name, organizationName } = data;

  // Check if email already exists
  const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser) {
    throw createAppError('DB-002', 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const slug = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Create organization and user in one flow
  const [org] = await db.insert(organizations).values({
    name: organizationName,
    slug: slug + '-' + Date.now(),
  }).returning();

  const [user] = await db.insert(users).values({
    organizationId: org.id,
    email,
    passwordHash,
    name,
    role: 'admin',
  }).returning();

  const token = generateToken({ id: user.id, email: user.email, role: user.role, organizationId: org.id });

  logger.info('User registered', { userId: user.id, organizationId: org.id });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role, organizationId: org.id },
    organization: org,
    token,
  };
}

export async function login(data: { email: string; password: string }) {
  const { email, password } = data;

  const [user] = await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt))).limit(1);
  if (!user) {
    throw createAppError('AUTH-001');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw createAppError('AUTH-001');
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role, organizationId: user.organizationId });

  logger.info('User logged in', { userId: user.id });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role, organizationId: user.organizationId },
    token,
  };
}

export async function getCurrentUser(userId: number) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      organizationId: users.organizationId,
      orgName: organizations.name,
      orgSlug: organizations.slug,
    })
    .from(users)
    .innerJoin(organizations, eq(users.organizationId, organizations.id))
    .where(and(eq(users.id, userId), isNull(users.deletedAt)))
    .limit(1);

  if (!user) {
    throw createAppError('DB-003', 'User not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    organization: { id: user.organizationId, name: user.orgName, slug: user.orgSlug },
  };
}

export async function forgotPassword(data: { email: string }) {
  const { email } = data;

  const [user] = await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt))).limit(1);
  if (!user) {
    // Don't reveal if email exists
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  logger.info('Password reset requested', { userId: user.id });
  // In production, send email with token. For MVP, log token.
  logger.debug('Reset token generated', { userId: user.id });
}

export async function resetPassword(data: { token: string; newPassword: string }) {
  const { token, newPassword } = data;

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const [resetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.tokenHash, tokenHash))
    .limit(1);

  if (!resetToken || resetToken.expiresAt < new Date()) {
    throw createAppError('AUTH-003', 'Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, resetToken.userId));
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetToken.id));

  logger.info('Password reset completed', { userId: resetToken.userId });
}

export async function changePassword(data: { userId: number; currentPassword: string; newPassword: string }) {
  const { userId, currentPassword, newPassword } = data;

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw createAppError('DB-003', 'User not found');
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw createAppError('AUTH-001', 'Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId));

  logger.info('Password changed', { userId });
}

export async function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    const decoded = jwt.verify(token, secret) as any;
    return { valid: true, expiresAt: new Date(decoded.exp * 1000).toISOString() };
  } catch {
    return { valid: false, expiresAt: null };
  }
}
