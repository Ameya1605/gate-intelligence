"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyService = exports.StudyService = void 0;
const study_model_1 = require("./study.model");
/**
 * All study business logic lives here.
 * This service has NO knowledge of HTTP, Express, or controllers.
 */
class StudyService {
    // ─── Create ───────────────────────────────────────────────────────────────────
    async createSession(userId, dto) {
        const date = dto.date ?? new Date().toISOString().slice(0, 10);
        const session = await study_model_1.StudySessionModel.create({ ...dto, userId, date });
        return session.toObject();
    }
    // ─── Read (paginated) ─────────────────────────────────────────────────────────
    async getSessions(query) {
        const filter = { userId: query.userId };
        if (query.subject)
            filter.subject = query.subject;
        if (query.startDate || query.endDate) {
            filter.date = {
                ...(query.startDate ? { $gte: query.startDate } : {}),
                ...(query.endDate ? { $lte: query.endDate } : {}),
            };
        }
        const skip = (query.page - 1) * query.limit;
        const [data, total] = await Promise.all([
            study_model_1.StudySessionModel.find(filter)
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(query.limit)
                .lean(),
            study_model_1.StudySessionModel.countDocuments(filter),
        ]);
        return { data, total };
    }
    // ─── Get single ───────────────────────────────────────────────────────────────
    async getSessionById(id, userId) {
        return study_model_1.StudySessionModel.findOne({ _id: id, userId }).lean();
    }
    // ─── Update ───────────────────────────────────────────────────────────────────
    async updateSession(id, userId, dto) {
        return study_model_1.StudySessionModel.findOneAndUpdate({ _id: id, userId }, { $set: dto }, { new: true, runValidators: true }).lean();
    }
    // ─── Delete ───────────────────────────────────────────────────────────────────
    async deleteSession(id, userId) {
        const result = await study_model_1.StudySessionModel.deleteOne({ _id: id, userId });
        return result.deletedCount > 0;
    }
    // ─── Heatmap ──────────────────────────────────────────────────────────────────
    async getHeatmap(userId, days = 365) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startStr = startDate.toISOString().slice(0, 10);
        const aggregation = await study_model_1.StudySessionModel.aggregate([
            { $match: { userId, date: { $gte: startStr } } },
            {
                $group: {
                    _id: '$date',
                    minutes: { $sum: '$durationMinutes' },
                    sessions: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return aggregation.map((entry) => ({
            date: entry._id,
            minutes: entry.minutes,
            sessions: entry.sessions,
        }));
    }
    // ─── All sessions (for analytics engine) ─────────────────────────────────────
    async getAllForUser(userId) {
        return study_model_1.StudySessionModel.find({ userId })
            .sort({ date: -1 })
            .lean();
    }
}
exports.StudyService = StudyService;
// Singleton export
exports.studyService = new StudyService();
