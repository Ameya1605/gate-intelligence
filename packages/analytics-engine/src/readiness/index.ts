import type {
  StudySession,
  MockTest,
  GATESubject,
  ReadinessScore,
} from '../../../shared-types/src';
import { computeSubjectAccuracy } from '../metrics/accuracy';
import { buildEffortScore } from '../metrics/effortScore';

const GATE_DATE = new Date('2027-02-01'); // Approximate GATE 2027 date
const SUBJECT_WEIGHTS: Partial<Record<GATESubject, number>> = {
  'Engineering Mathematics': 15,
  'General Aptitude': 15,
  'Data Structures': 10,
  Algorithms: 10,
  'Computer Networks': 8,
  'Operating Systems': 8,
  'Database Management': 7,
  'Computer Organization': 7,
  'Theory of Computation': 7,
  'Compiler Design': 7,
  'Digital Logic': 6,
};

function predictAIR(readinessScore: number): string {
  if (readinessScore >= 90) return 'AIR 1–100';
  if (readinessScore >= 80) return 'AIR 100–500';
  if (readinessScore >= 70) return 'AIR 500–1500';
  if (readinessScore >= 60) return 'AIR 1500–3000';
  if (readinessScore >= 50) return 'AIR 3000–6000';
  return 'AIR 6000+';
}

function daysUntilGate(): number {
  const today = new Date();
  const diff = GATE_DATE.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Compute an overall GATE readiness score (0-100).
 */
export function buildReadinessScore(
  sessions: StudySession[],
  mocks: MockTest[]
): ReadinessScore {
  const subjectAccuracy = computeSubjectAccuracy(mocks);
  const effort = buildEffortScore(sessions, mocks);

  // Weighted accuracy across subjects
  let weightedAccuracy = 0;
  let totalWeight = 0;
  for (const [subject, weight] of Object.entries(SUBJECT_WEIGHTS)) {
    const acc = subjectAccuracy[subject as GATESubject];
    if (acc !== undefined) {
      weightedAccuracy += acc * weight;
      totalWeight += weight;
    }
  }
  const accuracyScore = totalWeight > 0 ? weightedAccuracy / totalWeight : 0;

  // Mock performance factor
  const avgMockScore =
    mocks.length > 0
      ? mocks.reduce((acc, m) => acc + (m.obtainedMarks / m.totalMarks) * 100, 0) /
        mocks.length
      : 0;

  // Final readiness: 50% accuracy + 30% mock + 20% consistency
  const overall = Math.round(
    accuracyScore * 0.5 +
      avgMockScore * 0.3 +
      effort.breakdown.consistencyScore * 0.2
  );

  // Identify strong vs weak subjects
  const subjectEntries = Object.entries(subjectAccuracy) as [GATESubject, number][];
  const strengthAreas = subjectEntries
    .filter(([, acc]) => acc >= 70)
    .map(([s]) => s);
  const weakAreas = subjectEntries
    .filter(([, acc]) => acc < 50)
    .map(([s]) => s);

  const recommendedFocus: string[] = [];
  for (const weak of weakAreas.slice(0, 3)) {
    const weight = SUBJECT_WEIGHTS[weak] ?? 5;
    if (weight >= 8) {
      recommendedFocus.push(`High priority: Spend 3+ hours daily on ${weak}`);
    } else {
      recommendedFocus.push(`Review core concepts in ${weak}`);
    }
  }
  if (effort.breakdown.consistencyScore < 60) {
    recommendedFocus.push('Improve daily study consistency — aim for 4+ hours daily');
  }
  if (mocks.length < 5) {
    recommendedFocus.push('Attempt more full-length mock tests for exam conditioning');
  }

  return {
    overall: Math.min(100, Math.max(0, overall)),
    gate_prediction: predictAIR(overall),
    strengthAreas,
    weakAreas,
    recommendedFocus,
    daysToGate: daysUntilGate(),
  };
}
