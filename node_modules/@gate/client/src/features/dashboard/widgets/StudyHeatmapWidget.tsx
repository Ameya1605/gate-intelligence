import { Card } from '@/shared/components/ui';
import { StudyHeatmap } from '@/features/study/components/StudyHeatmap';

/** Dashboard widget: study heatmap */
export function StudyHeatmapWidget() {
  return (
    <Card className="col-span-2">
      <StudyHeatmap />
    </Card>
  );
}
