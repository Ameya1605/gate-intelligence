import type { MockTest, TrendPoint } from '@gate/shared-types';

export function computeAverageScore(mocks: MockTest[]): number {
  if (mocks.length === 0) return 0;
  const total = mocks.reduce(
    (acc, m) => acc + (m.obtainedMarks / m.totalMarks) * 100,
    0
  );
  return Math.round(total / mocks.length);
}

export function computeScoreTrend(mocks: MockTest[]): TrendPoint[] {
  return [...mocks]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((m) => ({
      date: m.date,
      value: Math.round((m.obtainedMarks / m.totalMarks) * 100),
    }));
}

export function computeAverageNegativeMarks(mocks: MockTest[]): number {
  if (mocks.length === 0) return 0;
  return (
    Math.round(
      (mocks.reduce((acc, m) => acc + m.negativeMarks, 0) / mocks.length) * 10
    ) / 10
  );
}

export function computeAttemptRate(mocks: MockTest[]): number {
  if (mocks.length === 0) return 0;
  const avgRate =
    mocks.reduce((acc, m) => acc + m.attemptedQuestions / m.totalQuestions, 0) /
    mocks.length;
  return Math.round(avgRate * 100);
}
