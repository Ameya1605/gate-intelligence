"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
// Full dashboard in one call
router.get('/dashboard', (req, res) => analytics_controller_1.analyticsController.dashboard(req, res));
// Individual metric endpoints
router.get('/accuracy', (req, res) => analytics_controller_1.analyticsController.accuracy(req, res));
router.get('/effort', (req, res) => analytics_controller_1.analyticsController.effort(req, res));
router.get('/productivity', (req, res) => analytics_controller_1.analyticsController.productivity(req, res));
router.get('/readiness', (req, res) => analytics_controller_1.analyticsController.readiness(req, res));
router.get('/insights', (req, res) => analytics_controller_1.analyticsController.insights(req, res));
exports.default = router;
