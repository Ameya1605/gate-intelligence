import { Card, SectionHeader, Badge, Spinner } from '@/shared/components/ui';
import { useAnalyticsDashboard } from '@/features/analytics/hooks/useAnalytics';

/** Dashboard widget: weak topics needing attention */
export function WeakTopicsWidget() {
  const { data, isLoading } = useAnalyticsDashboard();

  return (
    <Card>
      <SectionHeader title="Weak Areas" subtitle="Subjects needing focus" />
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner /></div>
      ) : (
        <div className="space-y-3">
          {(data?.readiness.weakAreas ?? []).length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>
              🎉 No critical weak areas! Keep it up.
            </p>
          ) : (
            data!.readiness.weakAreas.map((subject) => {
              const acc = data!.accuracy.bySubject[subject];
              return (
                <div key={subject} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'rgba(255,107,107,0.07)', border: '1px solid rgba(255,107,107,0.2)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{subject}</p>
                    <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)', width: 120 }}>
                      <div className="h-full rounded-full" style={{
                        width: `${acc ?? 0}%`,
                        background: (acc ?? 0) < 40 ? 'var(--warn)' : 'var(--gold)',
                      }} />
                    </div>
                  </div>
                  <Badge variant="warn">{acc !== undefined ? `${acc}%` : 'N/A'}</Badge>
                </div>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
}
