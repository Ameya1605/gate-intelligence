"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudySessionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
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
const SESSION_TYPES = [
    'reading',
    'practice',
    'revision',
    'mock',
];
const StudySessionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    subject: { type: String, enum: GATE_SUBJECTS, required: true },
    topic: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1, max: 720 },
    sessionType: { type: String, enum: SESSION_TYPES, required: true },
    questionsAttempted: { type: Number, min: 0, default: 0 },
    questionsCorrect: { type: Number, min: 0, default: 0 },
    notes: { type: String, trim: true, maxlength: 1000 },
    date: { type: String, required: true, index: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Compound index for user + date queries (heatmap)
StudySessionSchema.index({ userId: 1, date: 1 });
StudySessionSchema.index({ userId: 1, subject: 1 });
// Validate correct <= attempted
StudySessionSchema.pre('save', function (next) {
    if (this.questionsCorrect !== undefined &&
        this.questionsAttempted !== undefined &&
        this.questionsCorrect > this.questionsAttempted) {
        next(new Error('questionsCorrect cannot exceed questionsAttempted'));
    }
    else {
        next();
    }
});
exports.StudySessionModel = mongoose_1.default.model('StudySession', StudySessionSchema);
