import mongoose, { Schema, Document } from 'mongoose';
import type { LifestyleLog } from '../../../../../packages/shared-types/src';

export type LifestyleLogDocument = LifestyleLog & Document;

const LifestyleLogSchema = new Schema<LifestyleLogDocument>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    sleepHours: { type: Number, required: true, min: 0, max: 24 },
    exerciseMinutes: { type: Number, required: true, min: 0, max: 300 },
    meditationMinutes: { type: Number, required: true, min: 0, max: 120 },
    moodScore: { type: Number, required: true, min: 1, max: 10 },
    stressLevel: { type: Number, required: true, min: 1, max: 10 },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

LifestyleLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const LifestyleLogModel = mongoose.model<LifestyleLogDocument>(
  'LifestyleLog',
  LifestyleLogSchema
);
