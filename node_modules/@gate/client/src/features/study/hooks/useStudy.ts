import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studyApi } from '../api';
import type { CreateStudySessionDTO } from '@gate/shared-types';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const studyKeys = {
  all: ['study'] as const,
  sessions: (params?: object) => [...studyKeys.all, 'sessions', params] as const,
  heatmap: (days?: number) => [...studyKeys.all, 'heatmap', days] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useStudySessions(params?: {
  page?: number;
  limit?: number;
  subject?: string;
}) {
  return useQuery({
    queryKey: studyKeys.sessions(params),
    queryFn: () => studyApi.getSessions(params),
  });
}

export function useStudyHeatmap(days = 365) {
  return useQuery({
    queryKey: studyKeys.heatmap(days),
    queryFn: () => studyApi.getHeatmap(days),
  });
}

export function useCreateStudySession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateStudySessionDTO) => studyApi.createSession(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studyKeys.all });
    },
  });
}

export function useDeleteStudySession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studyApi.deleteSession(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studyKeys.all });
    },
  });
}
