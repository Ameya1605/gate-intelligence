"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mocksController = exports.MocksController = void 0;
const mocks_service_1 = require("./mocks.service");
const mocks_types_1 = require("./mocks.types");
const response_1 = require("../../utils/response");
class MocksController {
    async create(req, res) {
        const parsed = mocks_types_1.CreateMockTestSchema.safeParse(req.body);
        if (!parsed.success) {
            (0, response_1.sendError)(res, parsed.error.message, 422);
            return;
        }
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const test = await mocks_service_1.mocksService.createTest(userId, parsed.data);
        (0, response_1.sendSuccess)(res, test, 'Mock test recorded', 201);
    }
    async list(req, res) {
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const page = parseInt(req.query.page ?? '1');
        const limit = parseInt(req.query.limit ?? '20');
        const { data, total } = await mocks_service_1.mocksService.getTests(userId, page, limit);
        (0, response_1.sendPaginated)(res, data, total, page, limit);
    }
    async getOne(req, res) {
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const test = await mocks_service_1.mocksService.getTestById(req.params.id, userId);
        if (!test) {
            (0, response_1.sendError)(res, 'Test not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, test);
    }
    async remove(req, res) {
        const userId = req.headers['x-user-id'] ?? 'demo-user';
        const deleted = await mocks_service_1.mocksService.deleteTest(req.params.id, userId);
        if (!deleted) {
            (0, response_1.sendError)(res, 'Test not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, null, 'Test deleted');
    }
}
exports.MocksController = MocksController;
exports.mocksController = new MocksController();
