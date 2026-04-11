"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyController = exports.StudyController = void 0;
const study_service_1 = require("./study.service");
const study_types_1 = require("./study.types");
const response_1 = require("../../utils/response");
/**
 * Controllers are thin HTTP adapters.
 * Validate input → call service → send response.
 * Zero business logic here.
 */
class StudyController {
    async create(req, res) {
        const parsed = study_types_1.CreateStudySessionSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, response_1.sendError)(res, parsed.error.message, 422);
            return;
        }
        // In a real app, userId comes from JWT middleware
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const session = await study_service_1.studyService.createSession(userId, parsed.data);
        (0, response_1.sendSuccess)(res, session, 'Session created', 201);
    }
    async list(req, res) {
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const parsed = study_types_1.StudyQuerySchema.safeParse({ ...req.query, userId });
        if (!parsed.success) {
            (0, response_1.sendError)(res, parsed.error.message, 422);
            return;
        }
        const { data, total } = await study_service_1.studyService.getSessions(parsed.data);
        (0, response_1.sendPaginated)(res, data, total, parsed.data.page, parsed.data.limit);
    }
    async getOne(req, res) {
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const session = await study_service_1.studyService.getSessionById(req.params.id, userId);
        if (!session) {
            (0, response_1.sendError)(res, 'Session not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, session);
    }
    async update(req, res) {
        const parsed = study_types_1.UpdateStudySessionSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, response_1.sendError)(res, parsed.error.message, 422);
            return;
        }
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const session = await study_service_1.studyService.updateSession(req.params.id, userId, parsed.data);
        if (!session) {
            (0, response_1.sendError)(res, 'Session not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, session, 'Session updated');
    }
    async remove(req, res) {
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const deleted = await study_service_1.studyService.deleteSession(req.params.id, userId);
        if (!deleted) {
            (0, response_1.sendError)(res, 'Session not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Session deleted');
    }
    async heatmap(req, res) {
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const days = parseInt(req.query.days ?? '365');
        const data = await study_service_1.studyService.getHeatmap(userId, days);
        (0, response_1.sendSuccess)(res, data);
    }
}
exports.StudyController = StudyController;
exports.studyController = new StudyController();
