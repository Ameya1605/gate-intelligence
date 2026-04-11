"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeStudyEfficiency = computeStudyEfficiency;
exports.computeSubjectDistribution = computeSubjectDistribution;
exports.computePeakStudyHours = computePeakStudyHours;
exports.computeWeeklyGoalProgress = computeWeeklyGoalProgress;
exports.buildProductivityMetrics = buildProductivityMetrics;
/**
 * Computes questions correct per study hour (efficiency).
 */
function computeStudyEfficiency(sessions) {
    const totalHours = sessions.reduce((acc, s) => acc + s.durationMinutes / 60, 0);
    const totalCorrect = sessions.reduce((acc, s) => acc + (s.questionsCorrect ?? 0), 0);
    return totalHours > 0
        ? Math.round((totalCorrect / totalHours) * 10) / 10
        : 0;
}
/**
 * Computes subject time distribution as percentage.
 */
function computeSubjectDistribution(sessions) {
    const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    if (totalMinutes === 0)
        return {};
    const subjectMinutes = {};
    for (const session of sessions) {
        subjectMinutes[session.subject] =
            (subjectMinutes[session.subject] ?? 0) + session.durationMinutes;
    }
    const distribution = {};
    for (const [subject, minutes] of Object.entries(subjectMinutes)) {
        distribution[subject] = Math.round((minutes / totalMinutes) * 100);
    }
    return distribution;
}
/**
 * Identify peak study hours from session dates.
 * Returns array of hours (0-23) sorted by activity.
 */
function computePeakStudyHours(sessions) {
    const hourCounts = {};
    for (const session of sessions) {
        const hour = new Date(session.createdAt).getHours();
        hourCounts[hour] = (hourCounts[hour] ?? 0) + session.durationMinutes;
    }
    return Object.entries(hourCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));
}
/**
 * Compute weekly study goal progress (0-100).
 * Goal: 24 hours per week.
 */
function computeWeeklyGoalProgress(sessions, weeklyGoalHours = 24) {
    const weekCutoff = new Date();
    weekCutoff.setDate(weekCutoff.getDate() - 7);
    const weeklyMinutes = sessions
        .filter((s) => new Date(s.date) >= weekCutoff)
        .reduce((acc, s) => acc + s.durationMinutes, 0);
    return Math.min(100, Math.round((weeklyMinutes / (weeklyGoalHours * 60)) * 100));
}
/**
 * Build full productivity metrics.
 */
function buildProductivityMetrics(sessions) {
    return {
        studyEfficiency: computeStudyEfficiency(sessions),
        peakHours: computePeakStudyHours(sessions),
        subjectDistribution: computeSubjectDistribution(sessions),
        weeklyGoalProgress: computeWeeklyGoalProgress(sessions),
    };
}
