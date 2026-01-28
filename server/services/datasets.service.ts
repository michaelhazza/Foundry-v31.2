import { db } from '../db';
import { datasets } from '../db/schema';
import { eq, and, isNull, desc, sql } from 'drizzle-orm';
import { createAppError } from '../utils/errors';
import { buildPaginationMeta } from '../utils/pagination';

export async function listDatasets(options: {
  projectId: number;
  organizationId: number;
  page: number;
  limit: number;
  offset: number;
  format?: string;
}) {
  const { projectId, organizationId, page, limit, offset, format } = options;

  const conditions = [
    eq(datasets.projectId, projectId),
    eq(datasets.organizationId, organizationId),
    isNull(datasets.deletedAt),
  ];
  if (format) conditions.push(eq(datasets.format, format));

  const datasetList = await db
    .select()
    .from(datasets)
    .where(and(...conditions))
    .orderBy(desc(datasets.createdAt))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(datasets)
    .where(and(...conditions));

  return {
    datasets: datasetList,
    pagination: buildPaginationMeta(page, limit, countResult.total),
  };
}

export async function getDataset(datasetId: number, projectId: number, organizationId: number) {
  const [dataset] = await db
    .select()
    .from(datasets)
    .where(and(
      eq(datasets.id, datasetId),
      eq(datasets.projectId, projectId),
      eq(datasets.organizationId, organizationId),
      isNull(datasets.deletedAt)
    ))
    .limit(1);

  if (!dataset) {
    throw createAppError('DB-003', 'Dataset not found');
  }
  return dataset;
}

export async function getDatasetFile(datasetId: number, projectId: number, organizationId: number) {
  const dataset = await getDataset(datasetId, projectId, organizationId);
  return { fileUrl: dataset.fileUrl, filename: `${dataset.name}.${dataset.format}`, format: dataset.format };
}

export async function createDataset(data: {
  projectId: number;
  organizationId: number;
  name: string;
  format: string;
  rowCount: number;
  fileUrl: string;
  metadata?: Record<string, any>;
}) {
  const [dataset] = await db.insert(datasets).values({
    projectId: data.projectId,
    organizationId: data.organizationId,
    name: data.name,
    format: data.format,
    rowCount: data.rowCount,
    fileUrl: data.fileUrl,
    metadata: data.metadata || null,
  }).returning();

  return dataset;
}

export async function updateDataset(data: {
  datasetId: number;
  projectId: number;
  organizationId: number;
  name?: string;
}) {
  const { datasetId, projectId, organizationId, name } = data;

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (name !== undefined) updates.name = name;

  const [dataset] = await db
    .update(datasets)
    .set(updates)
    .where(and(
      eq(datasets.id, datasetId),
      eq(datasets.projectId, projectId),
      eq(datasets.organizationId, organizationId),
      isNull(datasets.deletedAt)
    ))
    .returning();

  if (!dataset) {
    throw createAppError('DB-003', 'Dataset not found');
  }
  return dataset;
}

export async function deleteDataset(datasetId: number, projectId: number, organizationId: number) {
  const now = new Date();

  const [dataset] = await db
    .update(datasets)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(
      eq(datasets.id, datasetId),
      eq(datasets.projectId, projectId),
      eq(datasets.organizationId, organizationId),
      isNull(datasets.deletedAt)
    ))
    .returning();

  if (!dataset) {
    throw createAppError('DB-003', 'Dataset not found');
  }
}
