// ── api.ts ────────────────────────────────────────────────────────────────────
import { get } from '@/shared/utils/apiClient';
import type {
  AccuracyMetrics, EffortScore, ProductivityMetrics,
  ReadinessScore, InsightItem,
} from '@gate/shared-types';

const BASE = '/analytics';

export const analyticsApi = {
  getDashboard: () =>
    get<{
      accuracy: AccuracyMetrics;
      effort: EffortScore;
      productivity: ProductivityMetrics;
      readiness: ReadinessScore;
      insights: InsightItem[];
    }>(`${BASE}/dashboard`),

  getAccuracy:    () => get<AccuracyMetrics>(`${BASE}/accuracy`),
  getEffort:      () => get<EffortScore>(`${BASE}/effort`),
  getProductivity:() => get<ProductivityMetrics>(`${BASE}/productivity`),
  getReadiness:   () => get<ReadinessScore>(`${BASE}/readiness`),
  getInsights:    () => get<InsightItem[]>(`${BASE}/insights`),
};
