import type {
  StudySession,
  MockTest,
  InsightItem,
  GATESubject,
} from '../../../shared-types/src';
import { computeSubjectAccuracy, computeAccuracyTrend } from '../metrics/accuracy';
import { computeConsistencyScore } from '../metrics/effortScore';

/**
 * Generate actionable insights from study and mock data.
 * Pure function — returns an array of insight items.
 */
export function generateInsights(
  sessions: StudySession[],
  mocks: MockTest[]
): InsightItem[] {
  const insights: InsightItem[] = [];

  // ─── Consistency insights ────────────────────────────────────────────────────
  const consistency = computeConsistencyScore(sessions, 14);
  if (consistency >= 80) {
    insights.push({
      type: 'strength',
      message: `Excellent consistency! You've studied ${Math.round(consistency)}% of the last 14 days.`,
      priority: 'low',
    });
  } else if (consistency < 50) {
    insights.push({
      type: 'warning',
      message: `Consistency is low (${consistency}%). Missing study days hurts long-term retention.`,
      priority: 'high',
    });
  }

  // ─── Accuracy trend insights ─────────────────────────────────────────────────
  if (mocks.length >= 3) {
    const trend = computeAccuracyTrend(mocks);
    const recent = trend.slice(-3);
    const isImproving =
      recent[2].value > recent[0].value;
    const isDeclining =
      recent[2].value < recent[0].value - 5;

    if (isImproving) {
      insights.push({
        type: 'strength',
        message: `Mock test accuracy is trending upward — great momentum!`,
        priority: 'low',
      });
    } else if (isDeclining) {
      insights.push({
        type: 'warning',
        message: `Mock accuracy has dropped over recent tests. Review weak topics before the next mock.`,
        priority: 'high',
      });
    }
  }

  // ─── Subject accuracy insights ───────────────────────────────────────────────
  const subjectAccuracy = computeSubjectAccuracy(mocks);
  for (const [subject, accuracy] of Object.entries(subjectAccuracy)) {
    if (accuracy >= 80) {
      insights.push({
        type: 'strength',
        message: `Strong in ${subject} (${accuracy}% accuracy). Maintain with periodic revision.`,
        subject: subject as GATESubject,
        priority: 'low',
      });
    } else if (accuracy < 40) {
      insights.push({
        type: 'weakness',
        message: `${subject} accuracy is critical (${accuracy}%). Focus on fundamentals immediately.`,
        subject: subject as GATESubject,
        priority: 'high',
      });
    }
  }

  // ─── Study session balance insights ─────────────────────────────────────────
  const practiceRatio = sessions.filter(s => s.sessionType === 'practice').length /
    Math.max(sessions.length, 1);
  if (practiceRatio < 0.2 && sessions.length > 10) {
    insights.push({
      type: 'tip',
      message: `Only ${Math.round(practiceRatio * 100)}% of sessions are practice. Increase problem-solving sessions.`,
      priority: 'medium',
    });
  }

  // ─── Mock frequency insights ─────────────────────────────────────────────────
  const recentMocks = mocks.filter(m => {
    const d = new Date(m.date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return d >= cutoff;
  });

  if (recentMocks.length === 0 && sessions.length > 0) {
    insights.push({
      type: 'tip',
      message: `No mock tests in the last 30 days. Take at least one full-length mock this week.`,
      priority: 'high',
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
