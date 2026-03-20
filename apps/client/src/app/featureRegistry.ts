import type { FeatureName } from '@gate/shared-types';

const DEFAULT_FEATURES: Record<FeatureName, boolean> = {
  STUDY: true,
  MOCKS: true,
  ANALYTICS: true,
  LIFESTYLE: true,
  USERS: true,
};

class FeatureRegistry {
  private features: Record<FeatureName, boolean>;

  constructor() {
    this.features = { ...DEFAULT_FEATURES };
  }

  enable(name: FeatureName): void {
    this.features[name] = true;
  }

  disable(name: FeatureName): void {
    this.features[name] = false;
  }

  isEnabled(name: FeatureName): boolean {
    return this.features[name] ?? false;
  }

  getAll(): Record<FeatureName, boolean> {
    return { ...this.features };
  }
}

export const featureRegistry = new FeatureRegistry();

/** Spec-compliant helpers */
export const enableFeature = (name: FeatureName) => featureRegistry.enable(name);
export const disableFeature = (name: FeatureName) => featureRegistry.disable(name);
export const isFeatureEnabled = (name: FeatureName) => featureRegistry.isEnabled(name);
