import { LifestyleLogModel } from './lifestyle.model';
import type { LifestyleLog } from '@gate/shared-types';
import { z } from 'zod';

export const CreateLifestyleLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sleepHours: z.number().min(0).max(24),
  exerciseMinutes: z.number().min(0).max(300),
  meditationMinutes: z.number().min(0).max(120),
  moodScore: z.number().int().min(1).max(10),
  stressLevel: z.number().int().min(1).max(10),
  notes: z.string().max(500).optional(),
});

export type CreateLifestyleLogInput = z.infer<typeof CreateLifestyleLogSchema>;

export class LifestyleService {
  async upsertLog(userId: string, dto: CreateLifestyleLogInput): Promise<LifestyleLog> {
    const date = dto.date ?? new Date().toISOString().slice(0, 10);
    const log = await LifestyleLogModel.findOneAndUpdate(
      { userId, date },
      { ...dto, userId, date },
      { upsert: true, new: true, runValidators: true }
    );
    return log.toObject() as LifestyleLog;
  }

  async getLogs(userId: string, days = 30): Promise<LifestyleLog[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return LifestyleLogModel.find({ userId, date: { $gte: cutoffStr } })
      .sort({ date: -1 })
      .lean<LifestyleLog[]>();
  }

  async getAverages(userId: string, days = 30): Promise<{
    avgSleep: number;
    avgMood: number;
    avgStress: number;
    avgExercise: number;
    avgMeditation: number;
  }> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    const agg = await LifestyleLogModel.aggregate([
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

export const lifestyleService = new LifestyleService();
