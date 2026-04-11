"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = exports.AnalyticsService = void 0;
const analytics_engine_1 = require("@gate/analytics-engine");
const study_service_1 = require("../study/study.service");
const mocks_service_1 = require("../mocks/mocks.service");
/**
 * Analytics service acts as an orchestrator:
 * 1. Fetches raw data from study + mocks services
 * 2. Passes data to the pure analytics-engine package
 * 3. Returns computed metrics
 *
 * No business logic is duplicated — it all lives in analytics-engine.
 */
class AnalyticsService {
    async getAccuracy(userId) {
        const [sessions, mocks] = await Promise.all([
            study_service_1.studyService.getAllForUser(userId),
            mocks_service_1.mocksService.getAllForUser(userId),
        ]);
        return (0, analytics_engine_1.buildAccuracyMetrics)(sessions, mocks);
    }
    async getEffortScore(userId) {
        const [sessions, mocks] = await Promise.all([
            study_service_1.studyService.getAllForUser(userId),
            mocks_service_1.mocksService.getAllForUser(userId),
        ]);
        return (0, analytics_engine_1.buildEffortScore)(sessions, mocks);
    }
    async getProductivity(userId) {
        const sessions = await study_service_1.studyService.getAllForUser(userId);
        return (0, analytics_engine_1.buildProductivityMetrics)(sessions);
    }
    async getReadiness(userId) {
        const [sessions, mocks] = await Promise.all([
            study_service_1.studyService.getAllForUser(userId),
            mocks_service_1.mocksService.getAllForUser(userId),
        ]);
        return (0, analytics_engine_1.buildReadinessScore)(sessions, mocks);
    }
    async getInsights(userId) {
        const [sessions, mocks] = await Promise.all([
            study_service_1.studyService.getAllForUser(userId),
            mocks_service_1.mocksService.getAllForUser(userId),
        ]);
        return (0, analytics_engine_1.generateInsights)(sessions, mocks);
    }
    async getFullDashboard(userId) {
        const [sessions, mocks] = await Promise.all([
            study_service_1.studyService.getAllForUser(userId),
            mocks_service_1.mocksService.getAllForUser(userId),
        ]);
        const [accuracy, effort, productivity, readiness, insights] = await Promise.all([
            Promise.resolve((0, analytics_engine_1.buildAccuracyMetrics)(sessions, mocks)),
            Promise.resolve((0, analytics_engine_1.buildEffortScore)(sessions, mocks)),
            Promise.resolve((0, analytics_engine_1.buildProductivityMetrics)(sessions)),
            Promise.resolve((0, analytics_engine_1.buildReadinessScore)(sessions, mocks)),
            Promise.resolve((0, analytics_engine_1.generateInsights)(sessions, mocks)),
        ]);
        return { accuracy, effort, productivity, readiness, insights };
    }
}
exports.AnalyticsService = AnalyticsService;
exports.analyticsService = new AnalyticsService();
