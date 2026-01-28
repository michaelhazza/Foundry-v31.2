import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as OrganizationsService from '../services/organizations.service';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { sendError } from '../utils/errors';
import { getPaginationParams } from '../utils/pagination';

const router = Router();

// Zod schemas
const addUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.string().min(1),
});

const updateOrgSchema = z.object({
  name: z.string().min(1).optional(),
});

// GET /api/organizations/:organizationId
router.get('/:organizationId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const result = await OrganizationsService.getOrganization(organizationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/organizations/:organizationId/users
router.get('/:organizationId/users', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const { page, limit, offset } = getPaginationParams(req.query as any);
    const result = await OrganizationsService.listUsers({ organizationId, page, limit, offset });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/organizations/:organizationId/users
router.post('/:organizationId/users', requireAuth, requireRole('admin', 'owner'), validateBody(addUserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const result = await OrganizationsService.addUser({ organizationId, ...req.body });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/organizations/:organizationId
router.patch('/:organizationId', requireAuth, requireRole('admin', 'owner'), validateBody(updateOrgSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = parseInt(req.params.organizationId, 10);
    const result = await OrganizationsService.updateOrganization({ organizationId, ...req.body });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
