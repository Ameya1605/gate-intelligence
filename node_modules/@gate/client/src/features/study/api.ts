import { get, post, patch, del, getPaginated } from '@/shared/utils/apiClient';
import type {
  StudySession,
  CreateStudySessionDTO,
  StudyHeatmapEntry,
} from '@gate/shared-types';

const BASE = '/study';

export const studyApi = {
  getSessions: (params?: {
    page?: number;
    limit?: number;
    subject?: string;
    startDate?: string;
    endDate?: string;
  }) => getPaginated<StudySession>(BASE, params as Record<string, unknown>),

  getSession: (id: string) => get<StudySession>(`${BASE}/${id}`),

  createSession: (dto: CreateStudySessionDTO) =>
    post<StudySession, CreateStudySessionDTO>(BASE, dto),

  updateSession: (id: string, dto: Partial<CreateStudySessionDTO>) =>
    patch<StudySession, Partial<CreateStudySessionDTO>>(`${BASE}/${id}`, dto),

  deleteSession: (id: string) => del(`${BASE}/${id}`),

  getHeatmap: (days = 365) =>
    get<StudyHeatmapEntry[]>(`${BASE}/heatmap`, { days }),
};
