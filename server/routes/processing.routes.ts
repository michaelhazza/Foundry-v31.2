import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as ProcessingService from '../services/processing.service';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { getPaginationParams } from '../utils/pagination';

const router = Router({ mergeParams: true });

const createRunSchema = z.object({
  sourceId: z.number().int().positive(),
  config: z.record(z.any()).default({}),
});

const updateRunSchema = z.object({
  config: z.record(z.any()).optional(),
});

// GET /api/projects/:projectId/processing-runs
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const { page, limit, offset } = getPaginationParams(req.query as any);
    const status = req.query.status as string | undefined;
    const sourceId = req.query.sourceId ? parseInt(req.query.sourceId as string, 10) : undefined;
    const result = await ProcessingService.listProcessingRuns({
      projectId,
      organizationId: req.user!.organizationId,
      page,
      limit,
      offset,
      status,
      sourceId,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId/processing-runs/:runId
router.get('/:runId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const runId = parseInt(req.params.runId, 10);
    const result = await ProcessingService.getProcessingRun(runId, projectId, req.user!.organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId/processing-runs/:runId/logs
router.get('/:runId/logs', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const runId = parseInt(req.params.runId, 10);
    const result = await ProcessingService.getProcessingLogs(runId, projectId, req.user!.organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:projectId/processing-runs
router.post('/', requireAuth, validateBody(createRunSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const result = await ProcessingService.createProcessingRun({
      projectId,
      organizationId: req.user!.organizationId,
      sourceId: req.body.sourceId,
      config: req.body.config,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/projects/:projectId/processing-runs/:runId
router.patch('/:runId', requireAuth, validateBody(updateRunSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const runId = parseInt(req.params.runId, 10);
    const result = await ProcessingService.updateProcessingRun({
      runId,
      projectId,
      organizationId: req.user!.organizationId,
      config: req.body.config,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:projectId/processing-runs/:runId
router.delete('/:runId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const runId = parseInt(req.params.runId, 10);
    await ProcessingService.deleteProcessingRun(runId, projectId, req.user!.organizationId);
    res.json({ success: true, data: { message: 'Processing run deleted' } });
  } catch (error) {
    next(error);
  }
});

export default router;
