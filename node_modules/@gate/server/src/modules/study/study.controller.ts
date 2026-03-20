import { Request, Response } from 'express';
import { studyService } from './study.service';
import {
  CreateStudySessionSchema,
  UpdateStudySessionSchema,
  StudyQuerySchema,
} from './study.types';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response';

/**
 * Controllers are thin HTTP adapters.
 * Validate input → call service → send response.
 * Zero business logic here.
 */
export class StudyController {
  async create(req: Request, res: Response): Promise<void> {
    const parsed = CreateStudySessionSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.message, 422);
      return;
    }
    // In a real app, userId comes from JWT middleware
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const session = await studyService.createSession(userId, parsed.data);
    sendSuccess(res, session, 'Session created', 201);
  }

  async list(req: Request, res: Response): Promise<void> {
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const parsed = StudyQuerySchema.safeParse({ ...req.query, userId });
    if (!parsed.success) {
      sendError(res, parsed.error.message, 422);
      return;
    }
    const { data, total } = await studyService.getSessions(parsed.data);
    sendPaginated(res, data, total, parsed.data.page, parsed.data.limit);
  }

  async getOne(req: Request, res: Response): Promise<void> {
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const session = await studyService.getSessionById(req.params.id, userId);
    if (!session) {
      sendError(res, 'Session not found', 404);
      return;
    }
    sendSuccess(res, session);
  }

  async update(req: Request, res: Response): Promise<void> {
    const parsed = UpdateStudySessionSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.message, 422);
      return;
    }
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const session = await studyService.updateSession(
      req.params.id,
      userId,
      parsed.data
    );
    if (!session) {
      sendError(res, 'Session not found', 404);
      return;
    }
    sendSuccess(res, session, 'Session updated');
  }

  async remove(req: Request, res: Response): Promise<void> {
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const deleted = await studyService.deleteSession(req.params.id, userId);
    if (!deleted) {
      sendError(res, 'Session not found', 404);
      return;
    }
    sendSuccess(res, null, 'Session deleted');
  }

  async heatmap(req: Request, res: Response): Promise<void> {
    const userId = req.headers['x-user-id'] as string ?? 'demo-user';
    const days = parseInt(req.query.days as string ?? '365');
    const data = await studyService.getHeatmap(userId, days);
    sendSuccess(res, data);
  }
}

export const studyController = new StudyController();
