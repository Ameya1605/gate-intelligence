import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer,
} from 'recharts';
import type { AccuracyMetrics } from '@gate/shared-types';

interface Props {
  data: AccuracyMetrics;
}

const SHORT: Record<string, string> = {
  'Engineering Mathematics': 'EM',
  'General Aptitude': 'GA',
  'Data Structures': 'DS',
  'Algorithms': 'Algo',
  'Computer Networks': 'CN',
  'Operating Systems': 'OS',
  'Database Management': 'DBMS',
  'Computer Organization': 'CO',
  'Theory of Computation': 'TOC',
  'Compiler Design': 'CD',
  'Digital Logic': 'DL',
};

function barColor(value: number): string {
  if (value >= 70) return 'var(--accent)';
  if (value >= 50) return 'var(--gold)';
  return 'var(--warn)';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-xs" style={{ minWidth: 160 }}>
        <p className="font-display font-semibold mb-1" style={{ color: 'var(--text)' }}>{label}</p>
        <p style={{ color: barColor(payload[0].value) }}>
          Accuracy: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export function SubjectAccuracyChart({ data }: Props) {
  const chartData = Object.entries(data.bySubject).map(([subject, accuracy]) => ({
    name: SHORT[subject] ?? subject.slice(0, 4),
    fullName: subject,
    accuracy,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-display font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          Subject Accuracy
        </p>
        <span className="font-mono text-xs" style={{ color: 'var(--primary)' }}>
          Overall {data.overall}%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.accuracy)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
