import { Request, Response } from 'express';
import { lifestyleService, CreateLifestyleLogSchema } from './lifestyle.service';
import { sendSuccess, sendError } from '../../utils/response';

class LifestyleController {
  private uid(req: Request) { return (req.headers['x-user-id'] as string) ?? 'demo-user'; }

  async upsert(req: Request, res: Response): Promise<void> {
    const parsed = CreateLifestyleLogSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.message, 422); return; }
    const log = await lifestyleService.upsertLog(this.uid(req), parsed.data);
    sendSuccess(res, log, 'Log saved', 200);
  }

  async list(req: Request, res: Response): Promise<void> {
    const days = parseInt(req.query.days as string ?? '30');
    const data = await lifestyleService.getLogs(this.uid(req), days);
    sendSuccess(res, data);
  }

  async averages(req: Request, res: Response): Promise<void> {
    const days = parseInt(req.query.days as string ?? '30');
    const data = await lifestyleService.getAverages(this.uid(req), days);
    sendSuccess(res, data);
  }
}

const lifestyleController = new LifestyleController();

import { Router } from 'express';
const router = Router();

router.post('/', (req, res) => lifestyleController.upsert(req, res));
router.get('/', (req, res) => lifestyleController.list(req, res));
router.get('/averages', (req, res) => lifestyleController.averages(req, res));

export default router;
