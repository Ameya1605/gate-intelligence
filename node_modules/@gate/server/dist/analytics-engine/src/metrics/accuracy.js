"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAccuracyFromSessions = computeAccuracyFromSessions;
exports.computeAccuracyFromMocks = computeAccuracyFromMocks;
exports.computeSubjectAccuracy = computeSubjectAccuracy;
exports.computeAccuracyTrend = computeAccuracyTrend;
exports.buildAccuracyMetrics = buildAccuracyMetrics;
/**
 * Computes accuracy percentage from study sessions.
 * Pure function — no Express, no MongoDB.
 */
function computeAccuracyFromSessions(sessions) {
    const withQuestions = sessions.filter((s) => s.questionsAttempted && s.questionsAttempted > 0);
    if (withQuestions.length === 0)
        return 0;
    const totalAttempted = withQuestions.reduce((acc, s) => acc + (s.questionsAttempted ?? 0), 0);
    const totalCorrect = withQuestions.reduce((acc, s) => acc + (s.questionsCorrect ?? 0), 0);
    return totalAttempted > 0
        ? Math.round((totalCorrect / totalAttempted) * 100)
        : 0;
}
/**
 * Computes accuracy percentage from mock tests.
 */
function computeAccuracyFromMocks(mocks) {
    if (mocks.length === 0)
        return 0;
    const totalAttempted = mocks.reduce((acc, m) => acc + m.attemptedQuestions, 0);
    const totalCorrect = mocks.reduce((acc, m) => acc + m.correctAnswers, 0);
    return totalAttempted > 0
        ? Math.round((totalCorrect / totalAttempted) * 100)
        : 0;
}
/**
 * Computes subject-wise accuracy from mock tests.
 */
function computeSubjectAccuracy(mocks) {
    const subjectMap = {};
    for (const mock of mocks) {
        for (const breakdown of mock.subjectWiseBreakdown) {
            if (!subjectMap[breakdown.subject]) {
                subjectMap[breakdown.subject] = { attempted: 0, correct: 0 };
            }
            subjectMap[breakdown.subject].attempted += breakdown.attempted;
            subjectMap[breakdown.subject].correct += breakdown.correct;
        }
    }
    const result = {};
    for (const [subject, data] of Object.entries(subjectMap)) {
        const key = subject;
        result[key] =
            data.attempted > 0
                ? Math.round((data.correct / data.attempted) * 100)
                : 0;
    }
    return result;
}
/**
 * Computes accuracy trend over time from mock tests.
 */
function computeAccuracyTrend(mocks) {
    return [...mocks]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((mock) => ({
        date: mock.date,
        value: mock.attemptedQuestions > 0
            ? Math.round((mock.correctAnswers / mock.attemptedQuestions) * 100)
            : 0,
    }));
}
/**
 * Full accuracy metrics aggregation.
 */
function buildAccuracyMetrics(sessions, mocks) {
    const sessionAccuracy = computeAccuracyFromSessions(sessions);
    const mockAccuracy = computeAccuracyFromMocks(mocks);
    const overall = sessions.length + mocks.length > 0
        ? Math.round((sessionAccuracy + mockAccuracy) / 2)
        : 0;
    return {
        overall,
        bySubject: computeSubjectAccuracy(mocks),
        trend: computeAccuracyTrend(mocks),
    };
}
