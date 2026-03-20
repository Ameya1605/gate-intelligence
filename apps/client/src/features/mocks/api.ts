// ── api.ts ────────────────────────────────────────────────────────────────────
import { get, post, del, getPaginated } from '@/shared/utils/apiClient';
import type { MockTest, CreateMockTestDTO } from '@gate/shared-types';

const BASE = '/mocks';

export const mocksApi = {
  getTests:   (params?: { page?: number; limit?: number }) =>
    getPaginated<MockTest>(BASE, params as Record<string, unknown>),
  getTest:    (id: string) => get<MockTest>(`${BASE}/${id}`),
  createTest: (dto: CreateMockTestDTO) => post<MockTest, CreateMockTestDTO>(BASE, dto),
  deleteTest: (id: string) => del(`${BASE}/${id}`),
};
