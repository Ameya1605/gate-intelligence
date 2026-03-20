import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api';

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  readiness: () => [...analyticsKeys.all, 'readiness'] as const,
  insights: () => [...analyticsKeys.all, 'insights'] as const,
};

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: analyticsApi.getDashboard,
  });
}

export function useReadiness() {
  return useQuery({
    queryKey: analyticsKeys.readiness(),
    queryFn: analyticsApi.getReadiness,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: analyticsKeys.insights(),
    queryFn: analyticsApi.getInsights,
  });
}
