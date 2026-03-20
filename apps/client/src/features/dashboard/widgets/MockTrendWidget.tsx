import { Card, SectionHeader, Spinner } from '@/shared/components/ui';
import { MockTrendChart } from '@/features/mocks/components/MockTrendChart';
import { useMockTests } from '@/features/mocks/hooks/useMocks';

/** Dashboard widget: mock score trend */
export function MockTrendWidget() {
  const { data, isLoading } = useMockTests({ limit: 20 });

  return (
    <Card>
      <SectionHeader title="Mock Trend" subtitle="Score over time" />
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <MockTrendChart mocks={data?.data ?? []} />
      )}
    </Card>
  );
}
