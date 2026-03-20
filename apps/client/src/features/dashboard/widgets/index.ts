import { registerWidget } from '../widgetRegistry';
import { StudyHeatmapWidget } from './StudyHeatmapWidget';
import { MockTrendWidget } from './MockTrendWidget';
import { WeakTopicsWidget } from './WeakTopicsWidget';
import { ReadinessWidget } from './ReadinessWidget';

/**
 * Call this once at app startup.
 * Removing a widget file and its import here removes it from the dashboard.
 */
export function initDashboardWidgets() {
  registerWidget({
    id: 'study-heatmap',
    title: 'Study Activity',
    component: StudyHeatmapWidget,
    size: 'xl',
    feature: 'STUDY',
    order: 1,
  });

  registerWidget({
    id: 'readiness-score',
    title: 'Readiness Score',
    component: ReadinessWidget,
    size: 'md',
    feature: 'ANALYTICS',
    order: 2,
  });

  registerWidget({
    id: 'weak-topics',
    title: 'Weak Areas',
    component: WeakTopicsWidget,
    size: 'md',
    feature: 'ANALYTICS',
    order: 3,
  });

  registerWidget({
    id: 'mock-trend',
    title: 'Mock Trend',
    component: MockTrendWidget,
    size: 'lg',
    feature: 'MOCKS',
    order: 4,
  });
}
