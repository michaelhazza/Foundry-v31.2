import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as SourcesService from '../services/sources.service';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { upload } from '../middleware/upload';
import { uploadLimiter } from '../middleware/rateLimiter';
import { getPaginationParams } from '../utils/pagination';
import { createAppError } from '../utils/errors';
import fs from 'fs';

const router = Router({ mergeParams: true });

const updateSourceSchema = z.object({
  filename: z.string().min(1).optional(),
});

// GET /api/projects/:projectId/sources
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const { page, limit, offset } = getPaginationParams(req.query as any);
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;
    const result = await SourcesService.listSources({
      projectId,
      organizationId: req.user!.organizationId,
      page,
      limit,
      offset,
      type,
      status,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId/sources/:sourceId
router.get('/:sourceId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const sourceId = parseInt(req.params.sourceId, 10);
    const result = await SourcesService.getSource(sourceId, projectId, req.user!.organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId/sources/:sourceId/download
router.get('/:sourceId/download', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const sourceId = parseInt(req.params.sourceId, 10);
    const file = await SourcesService.getSourceFile(sourceId, projectId, req.user!.organizationId);
    if (!fs.existsSync(file.filepath)) {
      throw createAppError('DB-003', 'File not found on disk');
    }
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Type', file.mimetype);
    fs.createReadStream(file.filepath).pipe(res);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:projectId/sources
router.post('/', requireAuth, uploadLimiter, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (!req.file) {
      throw createAppError('FILE-001', 'No file uploaded');
    }
    const result = await SourcesService.createSource({
      projectId,
      organizationId: req.user!.organizationId,
      type: 'file',
      filename: req.file.originalname,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/projects/:projectId/sources/:sourceId
router.patch('/:sourceId', requireAuth, validateBody(updateSourceSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const sourceId = parseInt(req.params.sourceId, 10);
    const result = await SourcesService.updateSource({
      sourceId,
      projectId,
      organizationId: req.user!.organizationId,
      filename: req.body.filename,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:projectId/sources/:sourceId
router.delete('/:sourceId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const sourceId = parseInt(req.params.sourceId, 10);
    await SourcesService.deleteSource(sourceId, projectId, req.user!.organizationId);
    res.json({ success: true, data: { message: 'Source deleted' } });
  } catch (error) {
    next(error);
  }
});

export default router;
