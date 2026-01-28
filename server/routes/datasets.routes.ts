import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as DatasetsService from '../services/datasets.service';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { getPaginationParams } from '../utils/pagination';
import fs from 'fs';
import { createAppError } from '../utils/errors';

const router = Router({ mergeParams: true });

const createDatasetSchema = z.object({
  name: z.string().min(1),
  format: z.enum(['conversational_jsonl', 'qa_pairs', 'structured_json']),
  rowCount: z.number().int().positive(),
  fileUrl: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

const updateDatasetSchema = z.object({
  name: z.string().min(1).optional(),
});

// GET /api/projects/:projectId/datasets
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const { page, limit, offset } = getPaginationParams(req.query as any);
    const format = req.query.format as string | undefined;
    const result = await DatasetsService.listDatasets({
      projectId,
      organizationId: req.user!.organizationId,
      page,
      limit,
      offset,
      format,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId/datasets/:datasetId
router.get('/:datasetId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const datasetId = parseInt(req.params.datasetId, 10);
    const result = await DatasetsService.getDataset(datasetId, projectId, req.user!.organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId/datasets/:datasetId/download
router.get('/:datasetId/download', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const datasetId = parseInt(req.params.datasetId, 10);
    const file = await DatasetsService.getDatasetFile(datasetId, projectId, req.user!.organizationId);
    if (!fs.existsSync(file.fileUrl)) {
      throw createAppError('DB-003', 'Dataset file not found on disk');
    }
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    fs.createReadStream(file.fileUrl).pipe(res);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:projectId/datasets
router.post('/', requireAuth, validateBody(createDatasetSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const result = await DatasetsService.createDataset({
      projectId,
      organizationId: req.user!.organizationId,
      name: req.body.name,
      format: req.body.format,
      rowCount: req.body.rowCount,
      fileUrl: req.body.fileUrl,
      metadata: req.body.metadata,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/projects/:projectId/datasets/:datasetId
router.patch('/:datasetId', requireAuth, validateBody(updateDatasetSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const datasetId = parseInt(req.params.datasetId, 10);
    const result = await DatasetsService.updateDataset({
      datasetId,
      projectId,
      organizationId: req.user!.organizationId,
      name: req.body.name,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:projectId/datasets/:datasetId
router.delete('/:datasetId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const datasetId = parseInt(req.params.datasetId, 10);
    await DatasetsService.deleteDataset(datasetId, projectId, req.user!.organizationId);
    res.json({ success: true, data: { message: 'Dataset deleted' } });
  } catch (error) {
    next(error);
  }
});

export default router;
