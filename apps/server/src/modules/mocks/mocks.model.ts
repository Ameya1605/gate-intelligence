import mongoose, { Schema, Document } from 'mongoose';
import type { MockTest, GATESubject } from '@gate/shared-types';

export type MockTestDocument = MockTest & Document;

const GATE_SUBJECTS: GATESubject[] = [
  'Engineering Mathematics', 'General Aptitude', 'Data Structures',
  'Algorithms', 'Computer Networks', 'Operating Systems',
  'Database Management', 'Computer Organization', 'Theory of Computation',
  'Compiler Design', 'Digital Logic',
];

const SubjectScoreSchema = new Schema(
  {
    subject: { type: String, enum: GATE_SUBJECTS, required: true },
    totalQuestions: { type: Number, required: true, min: 0 },
    attempted: { type: Number, required: true, min: 0 },
    correct: { type: Number, required: true, min: 0 },
    marks: { type: Number, required: true },
  },
  { _id: false }
);

const MockTestSchema = new Schema<MockTestDocument>(
  {
    userId: { type: String, required: true, index: true },
    testName: { type: String, required: true, trim: true },
    year: { type: Number, min: 2010, max: 2030 },
    totalMarks: { type: Number, required: true, min: 0 },
    obtainedMarks: { type: Number, required: true },
    totalQuestions: { type: Number, required: true, min: 0 },
    attemptedQuestions: { type: Number, required: true, min: 0 },
    correctAnswers: { type: Number, required: true, min: 0 },
    negativeMarks: { type: Number, required: true, min: 0, default: 0 },
    timeTakenMinutes: { type: Number, required: true, min: 0 },
    subjectWiseBreakdown: [SubjectScoreSchema],
    date: { type: String, required: true, index: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MockTestSchema.index({ userId: 1, date: -1 });

export const MockTestModel = mongoose.model<MockTestDocument>(
  'MockTest',
  MockTestSchema
);
