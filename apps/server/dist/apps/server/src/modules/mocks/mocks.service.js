"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mocksService = exports.MocksService = void 0;
const mocks_model_1 = require("./mocks.model");
class MocksService {
    async createTest(userId, dto) {
        const date = dto.date ?? new Date().toISOString().slice(0, 10);
        const test = await mocks_model_1.MockTestModel.create({ ...dto, userId, date });
        return test.toObject();
    }
    async getTests(userId, page = 1, limit = 20) {
        const [data, total] = await Promise.all([
            mocks_model_1.MockTestModel.find({ userId })
                .sort({ date: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            mocks_model_1.MockTestModel.countDocuments({ userId }),
        ]);
        return { data, total };
    }
    async getTestById(id, userId) {
        return mocks_model_1.MockTestModel.findOne({ _id: id, userId }).lean();
    }
    async deleteTest(id, userId) {
        const result = await mocks_model_1.MockTestModel.deleteOne({ _id: id, userId });
        return result.deletedCount > 0;
    }
    async getAllForUser(userId) {
        return mocks_model_1.MockTestModel.find({ userId }).sort({ date: -1 }).lean();
    }
}
exports.MocksService = MocksService;
exports.mocksService = new MocksService();
