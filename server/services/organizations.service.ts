import { db } from '../db';
import { organizations, users } from '../db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { createAppError } from '../utils/errors';
import { buildPaginationMeta } from '../utils/pagination';

export async function getOrganization(organizationId: number) {
  const [org] = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
  if (!org) {
    throw createAppError('DB-003', 'Organization not found');
  }
  return org;
}

export async function listUsers(options: { organizationId: number; page: number; limit: number; offset: number }) {
  const { organizationId, page, limit, offset } = options;

  const userList = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.organizationId, organizationId), isNull(users.deletedAt)))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(users)
    .where(and(eq(users.organizationId, organizationId), isNull(users.deletedAt)));

  return {
    users: userList,
    pagination: buildPaginationMeta(page, limit, countResult.total),
  };
}

export async function addUser(data: { organizationId: number; email: string; name: string; role: string }) {
  const { organizationId, email, name, role } = data;

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    throw createAppError('DB-002', 'Email already in use');
  }

  // Create user with a temporary password hash (they'll need to reset)
  const bcrypt = await import('bcrypt');
  const tempHash = await bcrypt.default.hash('temp-' + Date.now(), 10);

  const [user] = await db.insert(users).values({
    organizationId,
    email,
    name,
    passwordHash: tempHash,
    role,
  }).returning();

  return { id: user.id, email: user.email, name: user.name, role: user.role, organizationId: user.organizationId, createdAt: user.createdAt };
}

export async function updateOrganization(data: { organizationId: number; name?: string }) {
  const { organizationId, name } = data;

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (name) updates.name = name;

  const [org] = await db.update(organizations).set(updates).where(eq(organizations.id, organizationId)).returning();
  if (!org) {
    throw createAppError('DB-003', 'Organization not found');
  }
  return org;
}
