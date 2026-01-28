import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as IntegrationsService from '../services/integrations.service';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { getPaginationParams } from '../utils/pagination';

const router = Router({ mergeParams: true });

const createIntegrationSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  credentials: z.record(z.any()),
});

const updateIntegrationSchema = z.object({
  name: z.string().min(1).optional(),
  credentials: z.record(z.any()).optional(),
});

// GET /api/organizations/:organizationId/integrations
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const { page, limit, offset } = getPaginationParams(req.query as any);
    const type = req.query.type as string | undefined;
    const result = await IntegrationsService.listIntegrations({
      organizationId,
      page,
      limit,
      offset,
      type,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/organizations/:organizationId/integrations/:integrationId
router.get('/:integrationId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const integrationId = parseInt(req.params.integrationId, 10);
    const result = await IntegrationsService.getIntegration(integrationId, organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/organizations/:organizationId/integrations/:integrationId/test
router.get('/:integrationId/test', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const integrationId = parseInt(req.params.integrationId, 10);
    const result = await IntegrationsService.testIntegration(integrationId, organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/organizations/:organizationId/integrations
router.post('/', requireAuth, requireRole('admin', 'owner'), validateBody(createIntegrationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const result = await IntegrationsService.createIntegration({
      organizationId,
      type: req.body.type,
      name: req.body.name,
      credentials: req.body.credentials,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/organizations/:organizationId/integrations/:integrationId
router.patch('/:integrationId', requireAuth, requireRole('admin', 'owner'), validateBody(updateIntegrationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const integrationId = parseInt(req.params.integrationId, 10);
    const result = await IntegrationsService.updateIntegration({
      integrationId,
      organizationId,
      name: req.body.name,
      credentials: req.body.credentials,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/organizations/:organizationId/integrations/:integrationId
router.delete('/:integrationId', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const integrationId = parseInt(req.params.integrationId, 10);
    await IntegrationsService.deleteIntegration(integrationId, organizationId);
    res.json({ success: true, data: { message: 'Integration deleted' } });
  } catch (error) {
    next(error);
  }
});

export default router;
