"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMockTestSchema = void 0;
const zod_1 = require("zod");
const GATE_SUBJECTS = [
    'Engineering Mathematics', 'General Aptitude', 'Data Structures',
    'Algorithms', 'Computer Networks', 'Operating Systems',
    'Database Management', 'Computer Organization', 'Theory of Computation',
    'Compiler Design', 'Digital Logic',
];
const SubjectScoreSchema = zod_1.z.object({
    subject: zod_1.z.enum(GATE_SUBJECTS),
    totalQuestions: zod_1.z.number().int().min(0),
    attempted: zod_1.z.number().int().min(0),
    correct: zod_1.z.number().int().min(0),
    marks: zod_1.z.number(),
});
exports.CreateMockTestSchema = zod_1.z.object({
    testName: zod_1.z.string().min(1).max(200).trim(),
    year: zod_1.z.number().int().min(2010).max(2030).optional(),
    totalMarks: zod_1.z.number().min(0),
    obtainedMarks: zod_1.z.number(),
    totalQuestions: zod_1.z.number().int().min(0),
    attemptedQuestions: zod_1.z.number().int().min(0),
    correctAnswers: zod_1.z.number().int().min(0),
    negativeMarks: zod_1.z.number().min(0).default(0),
    timeTakenMinutes: zod_1.z.number().min(0),
    subjectWiseBreakdown: zod_1.z.array(SubjectScoreSchema).default([]),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
