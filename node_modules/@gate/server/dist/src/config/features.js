"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_CONFIG = void 0;
exports.isFeatureEnabled = isFeatureEnabled;
exports.getFeaturePrefix = getFeaturePrefix;
/**
 * Feature flags — toggle entire modules on/off.
 * Setting enabled: false prevents route registration and service init.
 */
exports.FEATURE_CONFIG = [
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
function isFeatureEnabled(name) {
    return exports.FEATURE_CONFIG.find((f) => f.name === name)?.enabled ?? false;
}
function getFeaturePrefix(name) {
    return exports.FEATURE_CONFIG.find((f) => f.name === name)?.apiPrefix ?? '';
}
