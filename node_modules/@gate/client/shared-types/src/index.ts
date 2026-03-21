// ─── User Types ────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Study Types ────────────────────────────────────────────────────────────────
export type GATESubject =
  | 'Engineering Mathematics'
  | 'General Aptitude'
  | 'Data Structures'
  | 'Algorithms'
  | 'Computer Networks'
  | 'Operating Systems'
  | 'Database Management'
  | 'Computer Organization'
  | 'Theory of Computation'
  | 'Compiler Design'
  | 'Digital Logic';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type StudySessionType = 'reading' | 'practice' | 'revision' | 'mock';

export interface StudySession {
  _id: string;
  userId: string;
  subject: GATESubject;
  topic: string;
  durationMinutes: number;
  sessionType: StudySessionType;
  questionsAttempted?: number;
  questionsCorrect?: number;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface CreateStudySessionDTO {
  subject: GATESubject;
  topic: string;
  durationMinutes: number;
  sessionType: StudySessionType;
  questionsAttempted?: number;
  questionsCorrect?: number;
  notes?: string;
  date?: string;
}

export interface StudyHeatmapEntry {
  date: string;
  minutes: number;
  sessions: number;
}

// ─── Mock Test Types ────────────────────────────────────────────────────────────
export interface MockTest {
  _id: string;
  userId: string;
  testName: string;
  year?: number;
  totalMarks: number;
  obtainedMarks: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  negativeMarks: number;
  timeTakenMinutes: number;
  subjectWiseBreakdown: SubjectScore[];
  date: string;
  createdAt: string;
}

export interface SubjectScore {
  subject: GATESubject;
  totalQuestions: number;
  attempted: number;
  correct: number;
  marks: number;
}

export interface CreateMockTestDTO {
  testName: string;
  year?: number;
  totalMarks: number;
  obtainedMarks: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  negativeMarks: number;
  timeTakenMinutes: number;
  subjectWiseBreakdown: SubjectScore[];
  date?: string;
}

// ─── Lifestyle Types ────────────────────────────────────────────────────────────
export interface LifestyleLog {
  _id: string;
  userId: string;
  date: string;
  sleepHours: number;
  exerciseMinutes: number;
  meditationMinutes: number;
  moodScore: number; // 1-10
  stressLevel: number; // 1-10
  notes?: string;
  createdAt: string;
}

export interface CreateLifestyleLogDTO {
  date?: string;
  sleepHours: number;
  exerciseMinutes: number;
  meditationMinutes: number;
  moodScore: number;
  stressLevel: number;
  notes?: string;
}

// ─── Analytics Types ────────────────────────────────────────────────────────────
export interface AccuracyMetrics {
  overall: number;
  bySubject: Record<GATESubject, number>;
  trend: TrendPoint[];
}

export interface EffortScore {
  daily: number;
  weekly: number;
  monthly: number;
  breakdown: {
    studyHours: number;
    mocksTaken: number;
    topicsCovered: number;
    consistencyScore: number;
  };
}

export interface ProductivityMetrics {
  studyEfficiency: number; // correct per hour
  peakHours: number[];
  subjectDistribution: Record<GATESubject, number>;
  weeklyGoalProgress: number;
}

export interface ReadinessScore {
  overall: number; // 0-100
  gate_prediction: string; // e.g. "AIR 500-1000"
  strengthAreas: GATESubject[];
  weakAreas: GATESubject[];
  recommendedFocus: string[];
  daysToGate: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface InsightItem {
  type: 'strength' | 'weakness' | 'warning' | 'tip';
  message: string;
  subject?: GATESubject;
  priority: 'high' | 'medium' | 'low';
}

// ─── API Response Types ─────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Feature Registry Types ─────────────────────────────────────────────────────
export type FeatureName = 'STUDY' | 'MOCKS' | 'ANALYTICS' | 'LIFESTYLE' | 'USERS';

export interface FeatureConfig {
  name: FeatureName;
  enabled: boolean;
  apiPrefix: string;
  description: string;
}
