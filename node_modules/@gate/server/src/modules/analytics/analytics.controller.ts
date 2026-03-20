import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';
import { sendSuccess, sendError } from '../../utils/response';

export class AnalyticsController {
  private getUserId(req: Request): string {
    return (req.headers['x-user-id'] as string) ?? 'demo-user';
  }

  async accuracy(req: Request, res: Response): Promise<void> {
    const data = await analyticsService.getAccuracy(this.getUserId(req));
    sendSuccess(res, data);
  }

  async effort(req: Request, res: Response): Promise<void> {
    const data = await analyticsService.getEffortScore(this.getUserId(req));
    sendSuccess(res, data);
  }

  async productivity(req: Request, res: Response): Promise<void> {
    const data = await analyticsService.getProductivity(this.getUserId(req));
    sendSuccess(res, data);
  }

  async readiness(req: Request, res: Response): Promise<void> {
    const data = await analyticsService.getReadiness(this.getUserId(req));
    sendSuccess(res, data);
  }

  async insights(req: Request, res: Response): Promise<void> {
    const data = await analyticsService.getInsights(this.getUserId(req));
    sendSuccess(res, data);
  }

  async dashboard(req: Request, res: Response): Promise<void> {
    const data = await analyticsService.getFullDashboard(this.getUserId(req));
    sendSuccess(res, data);
  }
}

export const analyticsController = new AnalyticsController();
