"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyQuerySchema = exports.UpdateStudySessionSchema = exports.CreateStudySessionSchema = void 0;
const zod_1 = require("zod");
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
];
const SESSION_TYPES = ['reading', 'practice', 'revision', 'mock'];
exports.CreateStudySessionSchema = zod_1.z.object({
    subject: zod_1.z.enum(GATE_SUBJECTS),
    topic: zod_1.z.string().min(1).max(200).trim(),
    durationMinutes: zod_1.z.number().int().min(1).max(720),
    sessionType: zod_1.z.enum(SESSION_TYPES),
    questionsAttempted: zod_1.z.number().int().min(0).optional().default(0),
    questionsCorrect: zod_1.z.number().int().min(0).optional().default(0),
    notes: zod_1.z.string().max(1000).optional(),
    date: zod_1.z.string().optional(),
});
exports.UpdateStudySessionSchema = zod_1.z.object({
    subject: zod_1.z.enum(GATE_SUBJECTS).optional(),
    topic: zod_1.z.string().min(1).max(200).trim().optional(),
    durationMinutes: zod_1.z.number().int().min(1).max(720).optional(),
    sessionType: zod_1.z.enum(SESSION_TYPES).optional(),
    questionsAttempted: zod_1.z.number().int().min(0).optional(),
    questionsCorrect: zod_1.z.number().int().min(0).optional(),
    notes: zod_1.z.string().max(1000).optional(),
    date: zod_1.z.string().optional(),
});
exports.StudyQuerySchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    subject: zod_1.z.enum(GATE_SUBJECTS).optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
