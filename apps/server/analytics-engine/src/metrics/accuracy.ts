import type {
  StudySession,
  MockTest,
  GATESubject,
  AccuracyMetrics,
  TrendPoint,
} from '@gate/shared-types';

/**
 * Computes accuracy percentage from study sessions.
 * Pure function — no Express, no MongoDB.
 */
export function computeAccuracyFromSessions(
  sessions: StudySession[]
): number {
  const withQuestions = sessions.filter(
    (s) => s.questionsAttempted && s.questionsAttempted > 0
  );
  if (withQuestions.length === 0) return 0;

  const totalAttempted = withQuestions.reduce(
    (acc, s) => acc + (s.questionsAttempted ?? 0),
    0
  );
  const totalCorrect = withQuestions.reduce(
    (acc, s) => acc + (s.questionsCorrect ?? 0),
    0
  );

  return totalAttempted > 0
    ? Math.round((totalCorrect / totalAttempted) * 100)
    : 0;
}

/**
 * Computes accuracy percentage from mock tests.
 */
export function computeAccuracyFromMocks(mocks: MockTest[]): number {
  if (mocks.length === 0) return 0;

  const totalAttempted = mocks.reduce(
    (acc, m) => acc + m.attemptedQuestions,
    0
  );
  const totalCorrect = mocks.reduce((acc, m) => acc + m.correctAnswers, 0);

  return totalAttempted > 0
    ? Math.round((totalCorrect / totalAttempted) * 100)
    : 0;
}

/**
 * Computes subject-wise accuracy from mock tests.
 */
export function computeSubjectAccuracy(
  mocks: MockTest[]
): Partial<Record<GATESubject, number>> {
  const subjectMap: Partial<Record<GATESubject, { attempted: number; correct: number }>> = {};

  for (const mock of mocks) {
    for (const breakdown of mock.subjectWiseBreakdown) {
      if (!subjectMap[breakdown.subject]) {
        subjectMap[breakdown.subject] = { attempted: 0, correct: 0 };
      }
      subjectMap[breakdown.subject]!.attempted += breakdown.attempted;
      subjectMap[breakdown.subject]!.correct += breakdown.correct;
    }
  }

  const result: Partial<Record<GATESubject, number>> = {};
  for (const [subject, data] of Object.entries(subjectMap)) {
    const key = subject as GATESubject;
    result[key] =
      data.attempted > 0
        ? Math.round((data.correct / data.attempted) * 100)
        : 0;
  }

  return result;
}

/**
 * Computes accuracy trend over time from mock tests.
 */
export function computeAccuracyTrend(mocks: MockTest[]): TrendPoint[] {
  return [...mocks]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((mock) => ({
      date: mock.date,
      value:
        mock.attemptedQuestions > 0
          ? Math.round((mock.correctAnswers / mock.attemptedQuestions) * 100)
          : 0,
    }));
}

/**
 * Full accuracy metrics aggregation.
 */
export function buildAccuracyMetrics(
  sessions: StudySession[],
  mocks: MockTest[]
): AccuracyMetrics {
  const sessionAccuracy = computeAccuracyFromSessions(sessions);
  const mockAccuracy = computeAccuracyFromMocks(mocks);
  const overall =
    sessions.length + mocks.length > 0
      ? Math.round((sessionAccuracy + mockAccuracy) / 2)
      : 0;

  return {
    overall,
    bySubject: computeSubjectAccuracy(mocks) as Record<GATESubject, number>,
    trend: computeAccuracyTrend(mocks),
  };
}
