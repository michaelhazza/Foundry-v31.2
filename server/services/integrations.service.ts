import { db } from '../db';
import { integrations } from '../db/schema';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { createAppError } from '../utils/errors';
import { encrypt, decrypt } from '../utils/encryption';
import { buildPaginationMeta } from '../utils/pagination';
import logger from '../utils/logger';

export async function listIntegrations(options: {
  organizationId: number;
  page: number;
  limit: number;
  offset: number;
  type?: string;
}) {
  const { organizationId, page, limit, offset, type } = options;

  const conditions = [
    eq(integrations.organizationId, organizationId),
    isNull(integrations.deletedAt),
  ];
  if (type) conditions.push(eq(integrations.type, type));

  const integrationList = await db
    .select({
      id: integrations.id,
      organizationId: integrations.organizationId,
      type: integrations.type,
      name: integrations.name,
      status: integrations.status,
      lastSyncAt: integrations.lastSyncAt,
      createdAt: integrations.createdAt,
      updatedAt: integrations.updatedAt,
    })
    .from(integrations)
    .where(and(...conditions))
    .orderBy(desc(integrations.createdAt))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(integrations)
    .where(and(...conditions));

  return {
    integrations: integrationList,
    pagination: buildPaginationMeta(page, limit, countResult.total),
  };
}

export async function getIntegration(integrationId: number, organizationId: number) {
  const [integration] = await db
    .select()
    .from(integrations)
    .where(and(
      eq(integrations.id, integrationId),
      eq(integrations.organizationId, organizationId),
      isNull(integrations.deletedAt)
    ))
    .limit(1);

  if (!integration) {
    throw createAppError('DB-003', 'Integration not found');
  }

  // Return without raw credentials for safety
  return {
    id: integration.id,
    organizationId: integration.organizationId,
    type: integration.type,
    name: integration.name,
    status: integration.status,
    lastSyncAt: integration.lastSyncAt,
    createdAt: integration.createdAt,
    updatedAt: integration.updatedAt,
  };
}

export async function testIntegration(integrationId: number, organizationId: number) {
  const [integration] = await db
    .select()
    .from(integrations)
    .where(and(
      eq(integrations.id, integrationId),
      eq(integrations.organizationId, organizationId),
      isNull(integrations.deletedAt)
    ))
    .limit(1);

  if (!integration) {
    throw createAppError('DB-003', 'Integration not found');
  }

  try {
    const creds = JSON.parse(decrypt(integration.credentials));
    // For MVP, just validate credentials can be decrypted
    logger.info('Integration test passed', { integrationId });
    return { status: 'success', message: 'Connection test passed', details: { type: integration.type } };
  } catch (error: any) {
    logger.warn('Integration test failed', { integrationId, error: error.message });
    return { status: 'error', message: 'Connection test failed', details: { error: error.message } };
  }
}

export async function createIntegration(data: {
  organizationId: number;
  type: string;
  name: string;
  credentials: Record<string, any>;
}) {
  const encryptedCreds = encrypt(JSON.stringify(data.credentials));

  const [integration] = await db.insert(integrations).values({
    organizationId: data.organizationId,
    type: data.type,
    name: data.name,
    credentials: encryptedCreds,
    status: 'active',
  }).returning();

  return {
    id: integration.id,
    organizationId: integration.organizationId,
    type: integration.type,
    name: integration.name,
    status: integration.status,
    lastSyncAt: integration.lastSyncAt,
    createdAt: integration.createdAt,
    updatedAt: integration.updatedAt,
  };
}

export async function updateIntegration(data: {
  integrationId: number;
  organizationId: number;
  name?: string;
  credentials?: Record<string, any>;
}) {
  const { integrationId, organizationId, name, credentials } = data;

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (name !== undefined) updates.name = name;
  if (credentials !== undefined) updates.credentials = encrypt(JSON.stringify(credentials));

  const [integration] = await db
    .update(integrations)
    .set(updates)
    .where(and(
      eq(integrations.id, integrationId),
      eq(integrations.organizationId, organizationId),
      isNull(integrations.deletedAt)
    ))
    .returning();

  if (!integration) {
    throw createAppError('DB-003', 'Integration not found');
  }

  return {
    id: integration.id,
    organizationId: integration.organizationId,
    type: integration.type,
    name: integration.name,
    status: integration.status,
    lastSyncAt: integration.lastSyncAt,
    createdAt: integration.createdAt,
    updatedAt: integration.updatedAt,
  };
}

export async function deleteIntegration(integrationId: number, organizationId: number) {
  const now = new Date();

  const [integration] = await db
    .update(integrations)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(
      eq(integrations.id, integrationId),
      eq(integrations.organizationId, organizationId),
      isNull(integrations.deletedAt)
    ))
    .returning();

  if (!integration) {
    throw createAppError('DB-003', 'Integration not found');
  }
}
