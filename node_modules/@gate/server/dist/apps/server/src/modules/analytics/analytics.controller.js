"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = exports.AnalyticsController = void 0;
const analytics_service_1 = require("./analytics.service");
const response_1 = require("../../utils/response");
class AnalyticsController {
    getUserId(req) {
        return req.headers['x-user-id'] ?? 'demo-user';
    }
    async accuracy(req, res) {
        const data = await analytics_service_1.analyticsService.getAccuracy(this.getUserId(req));
        (0, response_1.sendSuccess)(res, data);
    }
    async effort(req, res) {
        const data = await analytics_service_1.analyticsService.getEffortScore(this.getUserId(req));
        (0, response_1.sendSuccess)(res, data);
    }
    async productivity(req, res) {
        const data = await analytics_service_1.analyticsService.getProductivity(this.getUserId(req));
        (0, response_1.sendSuccess)(res, data);
    }
    async readiness(req, res) {
        const data = await analytics_service_1.analyticsService.getReadiness(this.getUserId(req));
        (0, response_1.sendSuccess)(res, data);
    }
    async insights(req, res) {
        const data = await analytics_service_1.analyticsService.getInsights(this.getUserId(req));
        (0, response_1.sendSuccess)(res, data);
    }
    async dashboard(req, res) {
        const data = await analytics_service_1.analyticsService.getFullDashboard(this.getUserId(req));
        (0, response_1.sendSuccess)(res, data);
    }
}
exports.AnalyticsController = AnalyticsController;
exports.analyticsController = new AnalyticsController();
