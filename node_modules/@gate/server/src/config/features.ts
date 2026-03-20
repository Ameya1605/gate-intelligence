import type { FeatureConfig } from '@gate/shared-types';

/**
 * Feature flags — toggle entire modules on/off.
 * Setting enabled: false prevents route registration and service init.
 */
export const FEATURE_CONFIG: FeatureConfig[] = [
  {
    name: 'STUDY',
    enabled: true,
    apiPrefix: '/api/study',
    description: 'Study session tracking and heatmaps',
  },
  {
    name: 'MOCKS',
    enabled: true,
    apiPrefix: '/api/mocks',
    description: 'Mock test management and analysis',
  },
  {
    name: 'ANALYTICS',
    enabled: true,
    apiPrefix: '/api/analytics',
    description: 'Analytics, readiness scores, and insights',
  },
  {
    name: 'LIFESTYLE',
    enabled: true,
    apiPrefix: '/api/lifestyle',
    description: 'Sleep, exercise, and wellness tracking',
  },
  {
    name: 'USERS',
    enabled: true,
    apiPrefix: '/api/users',
    description: 'User management',
  },
];

export function isFeatureEnabled(name: string): boolean {
  return FEATURE_CONFIG.find((f) => f.name === name)?.enabled ?? false;
}

export function getFeaturePrefix(name: string): string {
  return FEATURE_CONFIG.find((f) => f.name === name)?.apiPrefix ?? '';
}
