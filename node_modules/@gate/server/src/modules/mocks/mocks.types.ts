import { z } from 'zod';

const GATE_SUBJECTS = [
  'Engineering Mathematics', 'General Aptitude', 'Data Structures',
  'Algorithms', 'Computer Networks', 'Operating Systems',
  'Database Management', 'Computer Organization', 'Theory of Computation',
  'Compiler Design', 'Digital Logic',
] as const;

const SubjectScoreSchema = z.object({
  subject: z.enum(GATE_SUBJECTS),
  totalQuestions: z.number().int().min(0),
  attempted: z.number().int().min(0),
  correct: z.number().int().min(0),
  marks: z.number(),
});

export const CreateMockTestSchema = z.object({
  testName: z.string().min(1).max(200).trim(),
  year: z.number().int().min(2010).max(2030).optional(),
  totalMarks: z.number().min(0),
  obtainedMarks: z.number(),
  totalQuestions: z.number().int().min(0),
  attemptedQuestions: z.number().int().min(0),
  correctAnswers: z.number().int().min(0),
  negativeMarks: z.number().min(0).default(0),
  timeTakenMinutes: z.number().min(0),
  subjectWiseBreakdown: z.array(SubjectScoreSchema).default([]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type CreateMockTestInput = z.infer<typeof CreateMockTestSchema>;
