import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mocksApi } from '../api';
import type { CreateMockTestDTO } from '@gate/shared-types';

export const mocksKeys = {
  all: ['mocks'] as const,
  tests: (params?: object) => [...mocksKeys.all, 'tests', params] as const,
};

export function useMockTests(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: mocksKeys.tests(params),
    queryFn: () => mocksApi.getTests(params),
  });
}

export function useCreateMockTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateMockTestDTO) => mocksApi.createTest(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mocksKeys.all });
      // Also invalidate analytics since new mock data affects scores
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useDeleteMockTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mocksApi.deleteTest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mocksKeys.all });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
