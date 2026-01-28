import { db } from '../db';
import { processingRuns } from '../db/schema';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { createAppError } from '../utils/errors';
import { buildPaginationMeta } from '../utils/pagination';

export async function listProcessingRuns(options: {
  projectId: number;
  organizationId: number;
  page: number;
  limit: number;
  offset: number;
  status?: string;
  sourceId?: number;
}) {
  const { projectId, organizationId, page, limit, offset, status, sourceId } = options;

  const conditions = [
    eq(processingRuns.projectId, projectId),
    eq(processingRuns.organizationId, organizationId),
    isNull(processingRuns.deletedAt),
  ];
  if (status) conditions.push(eq(processingRuns.status, status));
  if (sourceId) conditions.push(eq(processingRuns.sourceId, sourceId));

  const runs = await db
    .select()
    .from(processingRuns)
    .where(and(...conditions))
    .orderBy(desc(processingRuns.createdAt))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(processingRuns)
    .where(and(...conditions));

  return {
    runs,
    pagination: buildPaginationMeta(page, limit, countResult.total),
  };
}

export async function getProcessingRun(runId: number, projectId: number, organizationId: number) {
  const [run] = await db
    .select()
    .from(processingRuns)
    .where(and(
      eq(processingRuns.id, runId),
      eq(processingRuns.projectId, projectId),
      eq(processingRuns.organizationId, organizationId),
      isNull(processingRuns.deletedAt)
    ))
    .limit(1);

  if (!run) {
    throw createAppError('DB-003', 'Processing run not found');
  }
  return run;
}

export async function getProcessingLogs(runId: number, projectId: number, organizationId: number) {
  const run = await getProcessingRun(runId, projectId, organizationId);
  // Logs stored in stats field for MVP
  const logs = run.stats && (run.stats as any).logs ? (run.stats as any).logs : [];
  return { runId: run.id, logs };
}

export async function createProcessingRun(data: {
  projectId: number;
  organizationId: number;
  sourceId: number;
  config: Record<string, any>;
}) {
  const [run] = await db.insert(processingRuns).values({
    projectId: data.projectId,
    organizationId: data.organizationId,
    sourceId: data.sourceId,
    config: data.config,
    status: 'queued',
  }).returning();

  return run;
}

export async function updateProcessingRun(data: {
  runId: number;
  projectId: number;
  organizationId: number;
  config?: Record<string, any>;
}) {
  const { runId, projectId, organizationId, config } = data;

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (config !== undefined) updates.config = config;

  const [run] = await db
    .update(processingRuns)
    .set(updates)
    .where(and(
      eq(processingRuns.id, runId),
      eq(processingRuns.projectId, projectId),
      eq(processingRuns.organizationId, organizationId),
      isNull(processingRuns.deletedAt)
    ))
    .returning();

  if (!run) {
    throw createAppError('DB-003', 'Processing run not found');
  }
  return run;
}

export async function deleteProcessingRun(runId: number, projectId: number, organizationId: number) {
  const now = new Date();

  const [run] = await db
    .update(processingRuns)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(
      eq(processingRuns.id, runId),
      eq(processingRuns.projectId, projectId),
      eq(processingRuns.organizationId, organizationId),
      isNull(processingRuns.deletedAt)
    ))
    .returning();

  if (!run) {
    throw createAppError('DB-003', 'Processing run not found');
  }
}
