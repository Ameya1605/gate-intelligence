import { PageWrapper, Card, StatCard, SectionHeader, Spinner } from '@/shared/components/ui';
import { useAnalyticsDashboard } from '../hooks/useAnalytics';
import { ReadinessGauge } from '../components/ReadinessGauge';
import { SubjectAccuracyChart } from '../components/SubjectAccuracyChart';
import { InsightsPanel } from '../components/InsightsPanel';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

export function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsDashboard();

  if (isLoading) {
    return (
      <PageWrapper title="Analytics">
        <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
      </PageWrapper>
    );
  }

  if (!data) {
    return (
      <PageWrapper title="Analytics">
        <p style={{ color: 'var(--muted)' }}>No analytics data available yet. Start logging sessions!</p>
      </PageWrapper>
    );
  }

  const { accuracy, effort, productivity, readiness, insights } = data;

  return (
    <PageWrapper title="Analytics" subtitle="Deep insights into your GATE preparation.">

      {/* ── Top Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Overall Accuracy"
          value={accuracy.overall}
          unit="%"
          icon="🎯"
          accent="primary"
        />
        <StatCard
          label="Daily Effort"
          value={effort.daily}
          unit="%"
          icon="⚡"
          accent="accent"
        />
        <StatCard
          label="Weekly Goal"
          value={productivity.weeklyGoalProgress}
          unit="%"
          icon="📅"
          accent="gold"
        />
        <StatCard
          label="Study Efficiency"
          value={productivity.studyEfficiency}
          unit="Q/hr"
          icon="🧠"
          accent="primary"
        />
      </div>

      {/* ── Effort Breakdown ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-xs font-display font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
            Monthly Effort
          </p>
          <div className="space-y-3">
            {[
              { label: 'Study Hours', value: `${effort.breakdown.studyHours}h`, color: 'var(--primary)' },
              { label: 'Mocks Taken', value: effort.breakdown.mocksTaken, color: 'var(--accent)' },
              { label: 'Topics Covered', value: effort.breakdown.topicsCovered, color: 'var(--gold)' },
              { label: 'Consistency', value: `${effort.breakdown.consistencyScore}%`, color: 'var(--warn)' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.label}</span>
                <span className="text-sm font-mono font-bold" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject Accuracy Chart spanning 3 cols */}
        <Card className="col-span-3">
          <SubjectAccuracyChart data={accuracy} />
        </Card>
      </div>

      {/* ── Accuracy Trend + Readiness ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Trend chart */}
        <Card className="col-span-2">
          <SectionHeader title="Accuracy Trend" subtitle="Mock test accuracy over time" />
          {accuracy.trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={accuracy.trend} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: 'var(--muted)' }}
                  tickFormatter={(d) => d.slice(5)}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted)' }} />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, 'Accuracy']}
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }}
                  labelStyle={{ color: 'var(--muted)' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--primary)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm py-12 text-center" style={{ color: 'var(--muted)' }}>
              Take mock tests to see accuracy trend.
            </p>
          )}
        </Card>

        {/* Readiness Gauge */}
        <Card>
          <SectionHeader title="Readiness" />
          <ReadinessGauge data={readiness} />
        </Card>
      </div>

      {/* ── Insights ─────────────────────────────────────────────────────────── */}
      <Card>
        <SectionHeader title="AI Insights" subtitle="Personalised recommendations based on your data" />
        <InsightsPanel insights={insights} />
      </Card>
    </PageWrapper>
  );
}
