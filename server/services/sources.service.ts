import { db } from '../db';
import { sources, processingRuns } from '../db/schema';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { createAppError } from '../utils/errors';
import { buildPaginationMeta } from '../utils/pagination';

export async function listSources(options: { projectId: number; organizationId: number; page: number; limit: number; offset: number; type?: string; status?: string }) {
  const { projectId, organizationId, page, limit, offset, type, status } = options;

  const conditions = [
    eq(sources.projectId, projectId),
    eq(sources.organizationId, organizationId),
    isNull(sources.deletedAt),
  ];
  if (type) conditions.push(eq(sources.type, type));
  if (status) conditions.push(eq(sources.status, status));

  const sourceList = await db
    .select()
    .from(sources)
    .where(and(...conditions))
    .orderBy(desc(sources.createdAt))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(sources)
    .where(and(...conditions));

  return {
    sources: sourceList,
    pagination: buildPaginationMeta(page, limit, countResult.total),
  };
}

export async function getSource(sourceId: number, projectId: number, organizationId: number) {
  const [source] = await db
    .select()
    .from(sources)
    .where(and(
      eq(sources.id, sourceId),
      eq(sources.projectId, projectId),
      eq(sources.organizationId, organizationId),
      isNull(sources.deletedAt)
    ))
    .limit(1);

  if (!source) {
    throw createAppError('DB-003', 'Source not found');
  }
  return source;
}

export async function getSourceFile(sourceId: number, projectId: number, organizationId: number) {
  const source = await getSource(sourceId, projectId, organizationId);
  return { filepath: source.filepath, filename: source.filename, mimetype: source.mimetype };
}

export async function createSource(data: {
  projectId: number;
  organizationId: number;
  type: string;
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
}) {
  const [source] = await db.insert(sources).values({
    projectId: data.projectId,
    organizationId: data.organizationId,
    type: data.type,
    filename: data.filename,
    filepath: data.filepath,
    mimetype: data.mimetype,
    size: data.size,
    status: 'ready',
  }).returning();

  return source;
}

export async function updateSource(data: { sourceId: number; projectId: number; organizationId: number; filename?: string }) {
  const { sourceId, projectId, organizationId, filename } = data;

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (filename !== undefined) updates.filename = filename;

  const [source] = await db
    .update(sources)
    .set(updates)
    .where(and(
      eq(sources.id, sourceId),
      eq(sources.projectId, projectId),
      eq(sources.organizationId, organizationId),
      isNull(sources.deletedAt)
    ))
    .returning();

  if (!source) {
    throw createAppError('DB-003', 'Source not found');
  }
  return source;
}

export async function deleteSource(sourceId: number, projectId: number, organizationId: number) {
  const now = new Date();

  const [source] = await db
    .update(sources)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(
      eq(sources.id, sourceId),
      eq(sources.projectId, projectId),
      eq(sources.organizationId, organizationId),
      isNull(sources.deletedAt)
    ))
    .returning();

  if (!source) {
    throw createAppError('DB-003', 'Source not found');
  }

  // Cascade soft delete to processing runs
  await db.update(processingRuns).set({ deletedAt: now, updatedAt: now }).where(eq(processingRuns.sourceId, sourceId));
}
