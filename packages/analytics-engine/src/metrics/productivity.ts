import type {
  StudySession,
  GATESubject,
  ProductivityMetrics,
} from '@gate/shared-types';

/**
 * Computes questions correct per study hour (efficiency).
 */
export function computeStudyEfficiency(sessions: StudySession[]): number {
  const totalHours = sessions.reduce(
    (acc, s) => acc + s.durationMinutes / 60,
    0
  );
  const totalCorrect = sessions.reduce(
    (acc, s) => acc + (s.questionsCorrect ?? 0),
    0
  );

  return totalHours > 0
    ? Math.round((totalCorrect / totalHours) * 10) / 10
    : 0;
}

/**
 * Computes subject time distribution as percentage.
 */
export function computeSubjectDistribution(
  sessions: StudySession[]
): Partial<Record<GATESubject, number>> {
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  if (totalMinutes === 0) return {};

  const subjectMinutes: Partial<Record<GATESubject, number>> = {};
  for (const session of sessions) {
    subjectMinutes[session.subject] =
      (subjectMinutes[session.subject] ?? 0) + session.durationMinutes;
  }

  const distribution: Partial<Record<GATESubject, number>> = {};
  for (const [subject, minutes] of Object.entries(subjectMinutes)) {
    distribution[subject as GATESubject] = Math.round(
      (minutes / totalMinutes) * 100
    );
  }

  return distribution;
}

/**
 * Identify peak study hours from session dates.
 * Returns array of hours (0-23) sorted by activity.
 */
export function computePeakStudyHours(sessions: StudySession[]): number[] {
  const hourCounts: Record<number, number> = {};

  for (const session of sessions) {
    const hour = new Date(session.createdAt).getHours();
    hourCounts[hour] = (hourCounts[hour] ?? 0) + session.durationMinutes;
  }

  return Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));
}

/**
 * Compute weekly study goal progress (0-100).
 * Goal: 24 hours per week.
 */
export function computeWeeklyGoalProgress(
  sessions: StudySession[],
  weeklyGoalHours = 24
): number {
  const weekCutoff = new Date();
  weekCutoff.setDate(weekCutoff.getDate() - 7);

  const weeklyMinutes = sessions
    .filter((s) => new Date(s.date) >= weekCutoff)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  return Math.min(
    100,
    Math.round((weeklyMinutes / (weeklyGoalHours * 60)) * 100)
  );
}

/**
 * Build full productivity metrics.
 */
export function buildProductivityMetrics(
  sessions: StudySession[]
): ProductivityMetrics {
  return {
    studyEfficiency: computeStudyEfficiency(sessions),
    peakHours: computePeakStudyHours(sessions),
    subjectDistribution: computeSubjectDistribution(
      sessions
    ) as Record<GATESubject, number>,
    weeklyGoalProgress: computeWeeklyGoalProgress(sessions),
  };
}
