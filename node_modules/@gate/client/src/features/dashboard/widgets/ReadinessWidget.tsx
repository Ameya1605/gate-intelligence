import { Card, SectionHeader, Spinner } from '@/shared/components/ui';
import { ReadinessGauge } from '@/features/analytics/components/ReadinessGauge';
import { useReadiness } from '@/features/analytics/hooks/useAnalytics';

/** Dashboard widget: GATE readiness score */
export function ReadinessWidget() {
  const { data, isLoading } = useReadiness();

  return (
    <Card>
      <SectionHeader title="Readiness" subtitle="GATE 2026 prediction" />
      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : data ? (
        <ReadinessGauge data={data} />
      ) : (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
          Insufficient data. Log sessions & mocks to compute readiness.
        </p>
      )}
    </Card>
  );
}
