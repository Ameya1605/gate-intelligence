import { ComponentType } from 'react';

export interface WidgetDefinition {
  id: string;
  title: string;
  component: ComponentType;
  size: 'sm' | 'md' | 'lg' | 'xl';
  feature: string; // maps to FEATURE_CONFIG name
  order: number;
}

class WidgetRegistry {
  private widgets: Map<string, WidgetDefinition> = new Map();

  register(widget: WidgetDefinition): void {
    this.widgets.set(widget.id, widget);
  }

  unregister(id: string): void {
    this.widgets.delete(id);
  }

  getAll(): WidgetDefinition[] {
    return [...this.widgets.values()].sort((a, b) => a.order - b.order);
  }

  getByFeature(feature: string): WidgetDefinition[] {
    return this.getAll().filter((w) => w.feature === feature);
  }
}

export const widgetRegistry = new WidgetRegistry();

/** Convenience function matching spec */
export function registerWidget(widget: WidgetDefinition): void {
  widgetRegistry.register(widget);
}
