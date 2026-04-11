"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAverageScore = computeAverageScore;
exports.computeScoreTrend = computeScoreTrend;
exports.computeAverageNegativeMarks = computeAverageNegativeMarks;
exports.computeAttemptRate = computeAttemptRate;
function computeAverageScore(mocks) {
    if (mocks.length === 0)
        return 0;
    const total = mocks.reduce((acc, m) => acc + (m.obtainedMarks / m.totalMarks) * 100, 0);
    return Math.round(total / mocks.length);
}
function computeScoreTrend(mocks) {
    return [...mocks]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((m) => ({
        date: m.date,
        value: Math.round((m.obtainedMarks / m.totalMarks) * 100),
    }));
}
function computeAverageNegativeMarks(mocks) {
    if (mocks.length === 0)
        return 0;
    return (Math.round((mocks.reduce((acc, m) => acc + m.negativeMarks, 0) / mocks.length) * 10) / 10);
}
function computeAttemptRate(mocks) {
    if (mocks.length === 0)
        return 0;
    const avgRate = mocks.reduce((acc, m) => acc + m.attemptedQuestions / m.totalQuestions, 0) /
        mocks.length;
    return Math.round(avgRate * 100);
}
