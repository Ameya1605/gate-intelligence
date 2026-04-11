import {
  buildAccuracyMetrics,
  buildEffortScore,
  buildProductivityMetrics,
  buildReadinessScore,
  generateInsights,
} from '../../../../../packages/analytics-engine/src';
import { studyService } from '../study/study.service';
import { mocksService } from '../mocks/mocks.service';
import type {
  AccuracyMetrics,
  EffortScore,
  ProductivityMetrics,
  ReadinessScore,
  InsightItem,
} from '../../../../../packages/shared-types/src';

/**
 * Analytics service acts as an orchestrator:
 * 1. Fetches raw data from study + mocks services
 * 2. Passes data to the pure analytics-engine package
 * 3. Returns computed metrics
 *
 * No business logic is duplicated — it all lives in analytics-engine.
 */
export class AnalyticsService {
  async getAccuracy(userId: string): Promise<AccuracyMetrics> {
    const [sessions, mocks] = await Promise.all([
      studyService.getAllForUser(userId),
      mocksService.getAllForUser(userId),
    ]);
    return buildAccuracyMetrics(sessions, mocks);
  }

  async getEffortScore(userId: string): Promise<EffortScore> {
    const [sessions, mocks] = await Promise.all([
      studyService.getAllForUser(userId),
      mocksService.getAllForUser(userId),
    ]);
    return buildEffortScore(sessions, mocks);
  }

  async getProductivity(userId: string): Promise<ProductivityMetrics> {
    const sessions = await studyService.getAllForUser(userId);
    return buildProductivityMetrics(sessions);
  }

  async getReadiness(userId: string): Promise<ReadinessScore> {
    const [sessions, mocks] = await Promise.all([
      studyService.getAllForUser(userId),
      mocksService.getAllForUser(userId),
    ]);
    return buildReadinessScore(sessions, mocks);
  }

  async getInsights(userId: string): Promise<InsightItem[]> {
    const [sessions, mocks] = await Promise.all([
      studyService.getAllForUser(userId),
      mocksService.getAllForUser(userId),
    ]);
    return generateInsights(sessions, mocks);
  }

  async getFullDashboard(userId: string): Promise<{
    accuracy: AccuracyMetrics;
    effort: EffortScore;
    productivity: ProductivityMetrics;
    readiness: ReadinessScore;
    insights: InsightItem[];
  }> {
    const [sessions, mocks] = await Promise.all([
      studyService.getAllForUser(userId),
      mocksService.getAllForUser(userId),
    ]);

    const [accuracy, effort, productivity, readiness, insights] =
      await Promise.all([
        Promise.resolve(buildAccuracyMetrics(sessions, mocks)),
        Promise.resolve(buildEffortScore(sessions, mocks)),
        Promise.resolve(buildProductivityMetrics(sessions)),
        Promise.resolve(buildReadinessScore(sessions, mocks)),
        Promise.resolve(generateInsights(sessions, mocks)),
      ]);

    return { accuracy, effort, productivity, readiness, insights };
  }
}

export const analyticsService = new AnalyticsService();
