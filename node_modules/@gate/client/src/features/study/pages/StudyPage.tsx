import { useState } from 'react';
import { PageWrapper, Card, SectionHeader, Badge, Spinner, EmptyState } from '@/shared/components/ui';
import { StudyHeatmap } from '../components/StudyHeatmap';
import { LogSessionForm } from '../components/LogSessionForm';
import { useStudySessions, useDeleteStudySession } from '../hooks/useStudy';
import type { StudySession } from '@gate/shared-types';

function SessionRow({ session, onDelete }: { session: StudySession; onDelete: (id: string) => void }) {
  const accuracy = session.questionsAttempted
    ? Math.round((session.questionsCorrect ?? 0) / session.questionsAttempted * 100)
    : null;

  const typeColorMap: Record<string, string> = {
    practice: 'primary',
    reading: 'muted',
    revision: 'gold',
    mock: 'warn',
  };

  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-xl transition-colors"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            {session.topic}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {session.subject} · {session.date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={typeColorMap[session.sessionType] as any}>
          {session.sessionType}
        </Badge>
        <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
          {session.durationMinutes}m
        </span>
        {accuracy !== null && (
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: accuracy >= 70 ? 'var(--accent)' : 'var(--warn)' }}
          >
            {accuracy}%
          </span>
        )}
        <button
          onClick={() => onDelete(session._id)}
          className="text-xs px-2 py-1 rounded-lg transition-colors hover:bg-red-500/10"
          style={{ color: 'var(--muted)' }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function StudyPage() {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useStudySessions({ page, limit: 15 });
  const { mutate: deleteSession } = useDeleteStudySession();

  return (
    <PageWrapper title="Study Tracker" subtitle="Log sessions, track topics, build consistency.">
      {/* Heatmap */}
      <Card className="mb-6">
        <StudyHeatmap />
      </Card>

      {/* Sessions list */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <SectionHeader
            title="Recent Sessions"
            subtitle={`${data?.pagination.total ?? 0} total sessions logged`}
            action={
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary px-4 py-2 text-sm"
              >
                {showForm ? '✕ Close' : '+ Log Session'}
              </button>
            }
          />

          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : !data?.data.length ? (
            <EmptyState
              icon="📚"
              title="No sessions yet"
              description="Start logging your study sessions to track progress."
            />
          ) : (
            <Card>
              {data.data.map((session) => (
                <SessionRow
                  key={session._id}
                  session={session}
                  onDelete={(id) => deleteSession(id)}
                />
              ))}

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
                      style={{
                        background: p === page ? 'var(--primary)' : 'var(--surface)',
                        color: p === page ? 'white' : 'var(--muted)',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Log form panel */}
        <div>
          {showForm && (
            <Card className="animate-slide-up">
              <h3 className="font-display font-bold text-base mb-4" style={{ color: 'var(--text)' }}>
                Log Study Session
              </h3>
              <LogSessionForm onSuccess={() => setShowForm(false)} />
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
