import axios from 'axios';
import type { ApiResponse, PaginatedResponse } from '@gate/shared-types';

const USER_ID = 'demo-user';

export const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': USER_ID,
  },
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ?? err.message ?? 'Unknown error';
    return Promise.reject(new Error(message));
  }
);

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await apiClient.get<ApiResponse<T>>(url, { params });
  return res.data.data;
}

export async function post<T, B = unknown>(url: string, body: B): Promise<T> {
  const res = await apiClient.post<ApiResponse<T>>(url, body);
  return res.data.data;
}

export async function patch<T, B = unknown>(url: string, body: B): Promise<T> {
  const res = await apiClient.patch<ApiResponse<T>>(url, body);
  return res.data.data;
}

export async function del<T = null>(url: string): Promise<T> {
  const res = await apiClient.delete<ApiResponse<T>>(url);
  return res.data.data;
}

export async function getPaginated<T>(
  url: string,
  params?: Record<string, unknown>
): Promise<PaginatedResponse<T>> {
  const res = await apiClient.get<PaginatedResponse<T>>(url, { params });
  return res.data;
}