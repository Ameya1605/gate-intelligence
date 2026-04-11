import type {
  StudySession,
  MockTest,
  EffortScore,
} from '../../../shared-types/src';

const DAILY_GOAL_MINUTES = 240; // 4 hours
const WEEKLY_GOAL_MINUTES = 1440; // 24 hours
const MONTHLY_GOAL_MINUTES = 5760; // 96 hours

/**
 * Compute consistency score — how many of the last N days had study activity.
 */
export function computeConsistencyScore(
  sessions: StudySession[],
  lookbackDays = 30
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - lookbackDays);

  const activeDays = new Set(
    sessions
      .filter((s) => new Date(s.date) >= cutoff)
      .map((s) => s.date.slice(0, 10))
  );

  return Math.round((activeDays.size / lookbackDays) * 100);
}

/**
 * Compute effort score for a given time window.
 */
function computeEffortForWindow(
  sessions: StudySession[],
  mocks: MockTest[],
  cutoffDate: Date,
  goalMinutes: number
): number {
  const windowSessions = sessions.filter(
    (s) => new Date(s.date) >= cutoffDate
  );
  const windowMocks = mocks.filter((m) => new Date(m.date) >= cutoffDate);

  const studyMinutes = windowSessions.reduce(
    (acc, s) => acc + s.durationMinutes,
    0
  );
  const mockMinutes = windowMocks.reduce(
    (acc, m) => acc + m.timeTakenMinutes,
    0
  );
  const totalMinutes = studyMinutes + mockMinutes;

  return Math.min(100, Math.round((totalMinutes / goalMinutes) * 100));
}

/**
 * Build full effort score breakdown.
 */
export function buildEffortScore(
  sessions: StudySession[],
  mocks: MockTest[]
): EffortScore {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const startOfMonth = new Date(now);
  startOfMonth.setDate(now.getDate() - 30);

  const studyHoursMonthly = sessions
    .filter((s) => new Date(s.date) >= startOfMonth)
    .reduce((acc, s) => acc + s.durationMinutes, 0) / 60;

  const topicsCovered = new Set(
    sessions
      .filter((s) => new Date(s.date) >= startOfMonth)
      .map((s) => `${s.subject}::${s.topic}`)
  ).size;

  return {
    daily: computeEffortForWindow(sessions, mocks, startOfDay, DAILY_GOAL_MINUTES),
    weekly: computeEffortForWindow(sessions, mocks, startOfWeek, WEEKLY_GOAL_MINUTES),
    monthly: computeEffortForWindow(sessions, mocks, startOfMonth, MONTHLY_GOAL_MINUTES),
    breakdown: {
      studyHours: Math.round(studyHoursMonthly * 10) / 10,
      mocksTaken: mocks.filter((m) => new Date(m.date) >= startOfMonth).length,
      topicsCovered,
      consistencyScore: computeConsistencyScore(sessions, 30),
    },
  };
}
