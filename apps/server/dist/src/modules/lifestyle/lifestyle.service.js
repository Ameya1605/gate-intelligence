"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lifestyleService = exports.LifestyleService = exports.CreateLifestyleLogSchema = void 0;
const lifestyle_model_1 = require("./lifestyle.model");
const zod_1 = require("zod");
exports.CreateLifestyleLogSchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    sleepHours: zod_1.z.number().min(0).max(24),
    exerciseMinutes: zod_1.z.number().min(0).max(300),
    meditationMinutes: zod_1.z.number().min(0).max(120),
    moodScore: zod_1.z.number().int().min(1).max(10),
    stressLevel: zod_1.z.number().int().min(1).max(10),
    notes: zod_1.z.string().max(500).optional(),
});
class LifestyleService {
    async upsertLog(userId, dto) {
        const date = dto.date ?? new Date().toISOString().slice(0, 10);
        const log = await lifestyle_model_1.LifestyleLogModel.findOneAndUpdate({ userId, date }, { ...dto, userId, date }, { upsert: true, new: true, runValidators: true });
        return log.toObject();
    }
    async getLogs(userId, days = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().slice(0, 10);
        return lifestyle_model_1.LifestyleLogModel.find({ userId, date: { $gte: cutoffStr } })
            .sort({ date: -1 })
            .lean();
    }
    async getAverages(userId, days = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffStr = cutoff.toISOString().slice(0, 10);
        const agg = await lifestyle_model_1.LifestyleLogModel.aggregate([
            { $match: { userId, date: { $gte: cutoffStr } } },
            {
                $group: {
                    _id: null,
                    avgSleep: { $avg: '$sleepHours' },
                    avgMood: { $avg: '$moodScore' },
                    avgStress: { $avg: '$stressLevel' },
                    avgExercise: { $avg: '$exerciseMinutes' },
                    avgMeditation: { $avg: '$meditationMinutes' },
                },
            },
        ]);
        if (agg.length === 0) {
            return { avgSleep: 0, avgMood: 0, avgStress: 0, avgExercise: 0, avgMeditation: 0 };
        }
        const r = agg[0];
        return {
            avgSleep: Math.round(r.avgSleep * 10) / 10,
            avgMood: Math.round(r.avgMood * 10) / 10,
            avgStress: Math.round(r.avgStress * 10) / 10,
            avgExercise: Math.round(r.avgExercise),
            avgMeditation: Math.round(r.avgMeditation),
        };
    }
}
exports.LifestyleService = LifestyleService;
exports.lifestyleService = new LifestyleService();
