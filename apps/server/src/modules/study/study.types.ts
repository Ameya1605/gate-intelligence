import { z } from 'zod';

const GATE_SUBJECTS = [
  'Engineering Mathematics',
  'General Aptitude',
  'Data Structures',
  'Algorithms',
  'Computer Networks',
  'Operating Systems',
  'Database Management',
  'Computer Organization',
  'Theory of Computation',
  'Compiler Design',
  'Digital Logic',
] as const;

const SESSION_TYPES = ['reading', 'practice', 'revision', 'mock'] as const;

export const CreateStudySessionSchema = z.object({
  subject: z.enum(GATE_SUBJECTS),
  topic: z.string().min(1).max(200).trim(),
  durationMinutes: z.number().int().min(1).max(720),
  sessionType: z.enum(SESSION_TYPES),
  questionsAttempted: z.number().int().min(0).optional().default(0),
  questionsCorrect: z.number().int().min(0).optional().default(0),
  notes: z.string().max(1000).optional(),
  date: z.string().optional(),
});

export const UpdateStudySessionSchema = z.object({
  subject: z.enum(GATE_SUBJECTS).optional(),
  topic: z.string().min(1).max(200).trim().optional(),
  durationMinutes: z.number().int().min(1).max(720).optional(),
  sessionType: z.enum(SESSION_TYPES).optional(),
  questionsAttempted: z.number().int().min(0).optional(),
  questionsCorrect: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional(),
  date: z.string().optional(),
});

export const StudyQuerySchema = z.object({
  userId: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  subject: z.enum(GATE_SUBJECTS).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateStudySessionInput = z.infer<typeof CreateStudySessionSchema>;
export type UpdateStudySessionInput = z.infer<typeof UpdateStudySessionSchema>;
export type StudyQueryInput = z.infer<typeof StudyQuerySchema>;
