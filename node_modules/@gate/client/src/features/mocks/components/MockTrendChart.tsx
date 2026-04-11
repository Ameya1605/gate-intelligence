import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { MockTest } from '@gate/shared-types';

interface Props { mocks: MockTest[] }

interface ChartData {
  testName: string;
  date: string;
  score: number;
  accuracy: number;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: unknown[] }) => {
  if (!active || !payload?.length) return null;
  const d = (payload[0] as { payload: ChartData }).payload;
  return (
    <div className="card px-3 py-2 text-xs space-y-1">
      <p className="font-display font-semibold" style={{ color: 'var(--text)' }}>
        {d.testName}
      </p>
      <p style={{ color: 'var(--muted)' }}>{d.date}</p>
      <p style={{ color: 'var(--primary)' }}>Score: {d.score}%</p>
      <p style={{ color: 'var(--accent)' }}>Accuracy: {d.accuracy}%</p>
    </div>
  );
};

export function MockTrendChart({ mocks }: Props) {
  const sorted = [...mocks].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sorted.map((m, i) => ({
    name: `#${i + 1}`,
    date: m.date,
    score: Math.round((m.obtainedMarks / m.totalMarks) * 100),
    accuracy: m.attemptedQuestions > 0
      ? Math.round((m.correctAnswers / m.attemptedQuestions) * 100)
      : 0,
    testName: m.testName,
  }));

  const avg = chartData.length
    ? Math.round(chartData.reduce((a, d) => a + d.score, 0) / chartData.length)
    : 0;

  if (!chartData.length) {
    return (
      <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
        No mock tests recorded yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {chartData.length} test{chartData.length !== 1 ? 's' : ''} · avg {avg}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
          <ReferenceLine y={avg} stroke="var(--muted)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5}
            dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} name="Score" />
          <Line type="monotone" dataKey="accuracy" stroke="var(--accent)" strokeWidth={2}
            dot={{ fill: 'var(--accent)', r: 3 }} strokeDasharray="5 3" name="Accuracy" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 justify-center">
        {[
          { color: 'var(--primary)', label: 'Score %' },
          { color: 'var(--accent)', label: 'Accuracy %' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded" style={{ background: color }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
