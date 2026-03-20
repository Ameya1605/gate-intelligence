import { Request, Response } from 'express';
import { mocksService } from './mocks.service';
import { CreateMockTestSchema } from './mocks.types';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response';

export class MocksController {
  async create(req: Request, res: Response): Promise<void> {
    const parsed = CreateMockTestSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.message, 422); return; }
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const test = await mocksService.createTest(userId, parsed.data);
    sendSuccess(res, test, 'Mock test recorded', 201);
  }

  async list(req: Request, res: Response): Promise<void> {
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const page = parseInt(req.query.page as string ?? '1');
    const limit = parseInt(req.query.limit as string ?? '20');
    const { data, total } = await mocksService.getTests(userId, page, limit);
    sendPaginated(res, data, total, page, limit);
  }

  async getOne(req: Request, res: Response): Promise<void> {
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const test = await mocksService.getTestById(req.params.id, userId);
    if (!test) { sendError(res, 'Test not found', 404); return; }
    sendSuccess(res, test);
  }

  async remove(req: Request, res: Response): Promise<void> {
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const deleted = await mocksService.deleteTest(req.params.id, userId);
    if (!deleted) { sendError(res, 'Test not found', 404); return; }
    sendSuccess(res, null, 'Test deleted');
  }
}

export const mocksController = new MocksController();
