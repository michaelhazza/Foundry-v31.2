import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as ProjectsService from '../services/projects.service';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { getPaginationParams } from '../utils/pagination';

const router = Router();

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
});

// GET /api/projects
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as any);
    const search = req.query.search as string | undefined;
    const result = await ProjectsService.listProjects({
      organizationId: req.user!.organizationId,
      page,
      limit,
      offset,
      search,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId
router.get('/:projectId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const result = await ProjectsService.getProject(projectId, req.user!.organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId/stats
router.get('/:projectId/stats', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const result = await ProjectsService.getProjectStats(projectId, req.user!.organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects
router.post('/', requireAuth, validateBody(createProjectSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ProjectsService.createProject({
      organizationId: req.user!.organizationId,
      ownerId: req.user!.id,
      name: req.body.name,
      description: req.body.description,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/projects/:projectId
router.patch('/:projectId', requireAuth, validateBody(updateProjectSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const result = await ProjectsService.updateProject({
      projectId,
      organizationId: req.user!.organizationId,
      name: req.body.name,
      description: req.body.description,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:projectId
router.delete('/:projectId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    await ProjectsService.deleteProject(projectId, req.user!.organizationId);
    res.json({ success: true, data: { message: 'Project deleted' } });
  } catch (error) {
    next(error);
  }
});

export default router;
