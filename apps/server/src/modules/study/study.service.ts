import { StudySessionModel } from './study.model';
import type {
  CreateStudySessionInput,
  UpdateStudySessionInput,
  StudyQueryInput,
} from './study.types';
import type { StudySession, StudyHeatmapEntry } from '../../../../../packages/shared-types/src';

/**
 * All study business logic lives here.
 * This service has NO knowledge of HTTP, Express, or controllers.
 */
export class StudyService {
  // ─── Create ───────────────────────────────────────────────────────────────────
  async createSession(
    userId: string,
    dto: CreateStudySessionInput
  ): Promise<StudySession> {
    const date = dto.date ?? new Date().toISOString().slice(0, 10);
    const session = await StudySessionModel.create({ ...dto, userId, date });
    return session.toObject() as StudySession;
  }

  // ─── Read (paginated) ─────────────────────────────────────────────────────────
  async getSessions(query: StudyQueryInput): Promise<{
    data: StudySession[];
    total: number;
  }> {
    const filter: Record<string, unknown> = { userId: query.userId };

    if (query.subject) filter.subject = query.subject;
    if (query.startDate || query.endDate) {
      filter.date = {
        ...(query.startDate ? { $gte: query.startDate } : {}),
        ...(query.endDate ? { $lte: query.endDate } : {}),
      };
    }

    const skip = (query.page - 1) * query.limit;

    const [data, total] = await Promise.all([
      StudySessionModel.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean<StudySession[]>(),
      StudySessionModel.countDocuments(filter),
    ]);

    return { data, total };
  }

  // ─── Get single ───────────────────────────────────────────────────────────────
  async getSessionById(
    id: string,
    userId: string
  ): Promise<StudySession | null> {
    return StudySessionModel.findOne({ _id: id, userId }).lean<StudySession>();
  }

  // ─── Update ───────────────────────────────────────────────────────────────────
  async updateSession(
    id: string,
    userId: string,
    dto: UpdateStudySessionInput
  ): Promise<StudySession | null> {
    return StudySessionModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: dto },
      { new: true, runValidators: true }
    ).lean<StudySession>();
  }

  // ─── Delete ───────────────────────────────────────────────────────────────────
  async deleteSession(id: string, userId: string): Promise<boolean> {
    const result = await StudySessionModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  // ─── Heatmap ──────────────────────────────────────────────────────────────────
  async getHeatmap(
    userId: string,
    days = 365
  ): Promise<StudyHeatmapEntry[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().slice(0, 10);

    const aggregation = await StudySessionModel.aggregate([
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
      date: entry._id as string,
      minutes: entry.minutes as number,
      sessions: entry.sessions as number,
    }));
  }

  // ─── All sessions (for analytics engine) ─────────────────────────────────────
  async getAllForUser(userId: string): Promise<StudySession[]> {
    return StudySessionModel.find({ userId })
      .sort({ date: -1 })
      .lean<StudySession[]>();
  }
}

// Singleton export
export const studyService = new StudyService();
