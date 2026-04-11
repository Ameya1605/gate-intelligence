import { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '../../../../packages/shared-types/src';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void {
  const payload: ApiResponse<T> = { success: true, data, message };
  res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400
): void {
  const payload: ApiResponse<null> = { success: false, data: null, message };
  res.status(statusCode).json(payload);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
): void {
  const payload: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
  res.json(payload);
}
