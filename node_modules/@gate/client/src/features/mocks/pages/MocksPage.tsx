import { useState } from 'react';
import { PageWrapper, Card, StatCard, SectionHeader, Badge, Spinner, EmptyState } from '@/shared/components/ui';
import { useMockTests, useDeleteMockTest } from '../hooks/useMocks';
import { LogMockForm } from '../components/LogMockForm';
import { MockTrendChart } from '../components/MockTrendChart';
import type { MockTest } from '@gate/shared-types';

function MockCard({ test, onDelete }: { test: MockTest; onDelete: () => void }) {
  const scorePercent = Math.round((test.obtainedMarks / test.totalMarks) * 100);
  const accuracy = test.attemptedQuestions > 0
    ? Math.round((test.correctAnswers / test.attemptedQuestions) * 100)
    : 0;
  const attemptRate = Math.round((test.attemptedQuestions / test.totalQuestions) * 100);

  const scoreColor = scorePercent >= 70 ? 'var(--accent)'
    : scorePercent >= 50 ? 'var(--gold)' : 'var(--warn)';

  return (
    <Card className="hover:border-primary/30">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-display font-semibold text-sm" style={{ color: 'var(--text)' }}>
            {test.testName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {test.date} · {test.timeTakenMinutes}min
          </p>
        </div>
        <div className="flex items-center gap-2">
          {test.year && <Badge variant="muted">{test.year}</Badge>}
          <button onClick={onDelete} className="text-xs px-2 py-1 rounded-lg hover:bg-red-500/10"
            style={{ color: 'var(--muted)' }}>✕</button>
        </div>
      </div>

      {/* Score circle */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
            <circle cx="30" cy="30" r="25" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle cx="30" cy="30" r="25" fill="none" stroke={scoreColor} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 25}
              strokeDashoffset={2 * Math.PI * 25 * (1 - scorePercent / 100)} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono font-bold text-xs" style={{ color: scoreColor }}>{scorePercent}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { label: 'Marks', value: `${test.obtainedMarks}/${test.totalMarks}`, color: scoreColor },
            { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 70 ? 'var(--accent)' : 'var(--warn)' },
            { label: 'Attempt Rate', value: `${attemptRate}%`, color: 'var(--primary)' },
            { label: 'Negatives', value: `-${test.negativeMarks}`, color: 'var(--warn)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
              <span className="text-xs font-mono font-semibold" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function MocksPage() {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMockTests({ page, limit: 12 });
  const { mutate: deleteTest } = useDeleteMockTest();

  const mocks = data?.data ?? [];
  const avgScore = mocks.length
    ? Math.round(mocks.reduce((a, m) => a + (m.obtainedMarks / m.totalMarks) * 100, 0) / mocks.length)
    : 0;
  const bestScore = mocks.length
    ? Math.round(Math.max(...mocks.map((m) => (m.obtainedMarks / m.totalMarks) * 100)))
    : 0;
  const totalNeg = mocks.reduce((a, m) => a + m.negativeMarks, 0);

  return (
    <PageWrapper title="Mock Tests" subtitle="Track GATE mock performance and identify patterns.">

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Tests Taken" value={data?.pagination.total ?? 0} icon="📝" accent="primary" />
        <StatCard label="Avg Score" value={avgScore} unit="%" icon="📊" accent="accent" />
        <StatCard label="Best Score" value={bestScore} unit="%" icon="🏆" accent="gold" />
        <StatCard label="Total Negatives" value={`-${totalNeg}`} icon="⚠️" accent="warn" />
      </div>

      {/* Trend Chart */}
      {mocks.length > 1 && (
        <Card className="mb-6">
          <SectionHeader title="Score Trend" subtitle="Score vs Accuracy across all mocks" />
          <MockTrendChart mocks={mocks} />
        </Card>
      )}

      {/* Header + Form toggle */}
      <SectionHeader
        title="All Mock Tests"
        subtitle={`${data?.pagination.total ?? 0} recorded`}
        action={
          <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 text-sm">
            {showForm ? '✕ Close' : '+ Log Mock Test'}
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-6">
        {/* List */}
        <div className="col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : !mocks.length ? (
            <EmptyState icon="🎯" title="No mock tests yet"
              description="Record your first GATE mock test to track performance." />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {mocks.map((test) => (
                  <MockCard key={test._id} test={test} onDelete={() => deleteTest(test._id)} />
                ))}
              </div>

              {(data?.pagination.totalPages ?? 1) > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: data!.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className="w-8 h-8 rounded-lg text-xs font-semibold"
                      style={{
                        background: p === page ? 'var(--primary)' : 'var(--surface)',
                        color: p === page ? 'white' : 'var(--muted)',
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Form panel */}
        <div>
          {showForm && (
            <Card className="animate-slide-up">
              <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--text)' }}>
                Log Mock Test
              </h3>
              <LogMockForm onSuccess={() => setShowForm(false)} />
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
