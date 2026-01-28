import { db } from '../db';
import { projects, sources, processingRuns, datasets } from '../db/schema';
import { eq, and, isNull, desc, sql, ilike } from 'drizzle-orm';
import { createAppError } from '../utils/errors';
import { buildPaginationMeta } from '../utils/pagination';

export async function listProjects(options: { organizationId: number; page: number; limit: number; offset: number; search?: string }) {
  const { organizationId, page, limit, offset, search } = options;

  const conditions = [eq(projects.organizationId, organizationId), isNull(projects.deletedAt)];
  if (search) {
    conditions.push(ilike(projects.name, `%${search}%`));
  }

  const projectList = await db
    .select()
    .from(projects)
    .where(and(...conditions))
    .orderBy(desc(projects.createdAt))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(projects)
    .where(and(...conditions));

  return {
    projects: projectList,
    pagination: buildPaginationMeta(page, limit, countResult.total),
  };
}

export async function getProject(projectId: number, organizationId: number) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.organizationId, organizationId), isNull(projects.deletedAt)))
    .limit(1);

  if (!project) {
    throw createAppError('DB-003', 'Project not found');
  }
  return project;
}

export async function getProjectStats(projectId: number, organizationId: number) {
  // Verify project exists
  await getProject(projectId, organizationId);

  const [sourceCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(sources)
    .where(and(eq(sources.projectId, projectId), isNull(sources.deletedAt)));

  const [runCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(processingRuns)
    .where(and(eq(processingRuns.projectId, projectId), isNull(processingRuns.deletedAt)));

  const [datasetCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(datasets)
    .where(and(eq(datasets.projectId, projectId), isNull(datasets.deletedAt)));

  return {
    projectId,
    sources: sourceCount.count,
    processingRuns: runCount.count,
    datasets: datasetCount.count,
  };
}

export async function createProject(data: { organizationId: number; ownerId: number; name: string; description?: string }) {
  const { organizationId, ownerId, name, description } = data;

  const [project] = await db.insert(projects).values({
    organizationId,
    ownerId,
    name,
    description: description || null,
  }).returning();

  return project;
}

export async function updateProject(data: { projectId: number; organizationId: number; name?: string; description?: string }) {
  const { projectId, organizationId, name, description } = data;

  const updates: Record<string, any> = { updatedAt: new Date() };
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;

  const [project] = await db
    .update(projects)
    .set(updates)
    .where(and(eq(projects.id, projectId), eq(projects.organizationId, organizationId), isNull(projects.deletedAt)))
    .returning();

  if (!project) {
    throw createAppError('DB-003', 'Project not found');
  }
  return project;
}

export async function deleteProject(projectId: number, organizationId: number) {
  const now = new Date();

  // Soft delete with cascade
  const [project] = await db
    .update(projects)
    .set({ deletedAt: now, updatedAt: now })
    .where(and(eq(projects.id, projectId), eq(projects.organizationId, organizationId), isNull(projects.deletedAt)))
    .returning();

  if (!project) {
    throw createAppError('DB-003', 'Project not found');
  }

  // Cascade soft delete to children
  await db.update(sources).set({ deletedAt: now, updatedAt: now }).where(eq(sources.projectId, projectId));
  await db.update(processingRuns).set({ deletedAt: now, updatedAt: now }).where(eq(processingRuns.projectId, projectId));
  await db.update(datasets).set({ deletedAt: now, updatedAt: now }).where(eq(datasets.projectId, projectId));
}
