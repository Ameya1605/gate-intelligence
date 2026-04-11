"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lifestyle_service_1 = require("./lifestyle.service");
const response_1 = require("../../utils/response");
class LifestyleController {
    uid(req) { return req.headers['x-user-id'] ?? 'demo-user'; }
    async upsert(req, res) {
        const parsed = lifestyle_service_1.CreateLifestyleLogSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, response_1.sendError)(res, parsed.error.message, 422);
            return;
        }
        const log = await lifestyle_service_1.lifestyleService.upsertLog(this.uid(req), parsed.data);
        (0, response_1.sendSuccess)(res, log, 'Log saved', 200);
    }
    async list(req, res) {
        const days = parseInt(req.query.days ?? '30');
        const data = await lifestyle_service_1.lifestyleService.getLogs(this.uid(req), days);
        (0, response_1.sendSuccess)(res, data);
    }
    async averages(req, res) {
        const days = parseInt(req.query.days ?? '30');
        const data = await lifestyle_service_1.lifestyleService.getAverages(this.uid(req), days);
        (0, response_1.sendSuccess)(res, data);
    }
}
const lifestyleController = new LifestyleController();
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/', (req, res) => lifestyleController.upsert(req, res));
router.get('/', (req, res) => lifestyleController.list(req, res));
router.get('/averages', (req, res) => lifestyleController.averages(req, res));
exports.default = router;
