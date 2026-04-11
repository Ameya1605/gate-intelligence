import mongoose, { Schema, Document } from 'mongoose';
import type { StudySession, GATESubject, StudySessionType } from '../../../../../packages/shared-types/src';

export type StudySessionDocument = StudySession & Document;

const GATE_SUBJECTS: GATESubject[] = [
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

const SESSION_TYPES: StudySessionType[] = [
  'reading',
  'practice',
  'revision',
  'mock',
];

const StudySessionSchema = new Schema<StudySessionDocument>(
  {
    userId: { type: String, required: true, index: true },
    subject: { type: String, enum: GATE_SUBJECTS, required: true },
    topic: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1, max: 720 },
    sessionType: { type: String, enum: SESSION_TYPES, required: true },
    questionsAttempted: { type: Number, min: 0, default: 0 },
    questionsCorrect: { type: Number, min: 0, default: 0 },
    notes: { type: String, trim: true, maxlength: 1000 },
    date: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for user + date queries (heatmap)
StudySessionSchema.index({ userId: 1, date: 1 });
StudySessionSchema.index({ userId: 1, subject: 1 });

// Validate correct <= attempted
StudySessionSchema.pre('save', function (next) {
  if (
    this.questionsCorrect !== undefined &&
    this.questionsAttempted !== undefined &&
    this.questionsCorrect > this.questionsAttempted
  ) {
    next(new Error('questionsCorrect cannot exceed questionsAttempted'));
  } else {
    next();
  }
});

export const StudySessionModel = mongoose.model<StudySessionDocument>(
  'StudySession',
  StudySessionSchema
);
