import type { ReadinessScore } from '@gate/shared-types';
import { Badge } from '@/shared/components/ui';

interface Props {
  data: ReadinessScore;
}

export function ReadinessGauge({ data }: Props) {
  const score = data.overall;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - score / 100);

  const color =
    score >= 75 ? 'var(--accent)' :
    score >= 50 ? 'var(--gold)' :
    'var(--warn)';

  return (
    <div className="flex flex-col items-center">
      {/* SVG Gauge */}
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="var(--border)"
            strokeWidth="10"
          />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display font-bold text-3xl"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            /100
          </span>
        </div>
      </div>

      {/* Prediction */}
      <div className="mt-3 text-center">
        <p className="text-xs font-display font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
          Predicted Rank
        </p>
        <p className="font-display font-bold text-lg" style={{ color }}>
          {data.gate_prediction}
        </p>
      </div>

      {/* Days remaining */}
      <div
        className="mt-4 px-4 py-2 rounded-xl text-center"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Days to GATE 2026</p>
        <p className="font-display font-bold text-2xl" style={{ color: 'var(--gold)' }}>
          {data.daysToGate}
        </p>
      </div>

      {/* Strength / Weakness pills */}
      {data.strengthAreas.length > 0 && (
        <div className="mt-4 w-full">
          <p className="text-xs font-display font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
            Strengths
          </p>
          <div className="flex flex-wrap gap-1">
            {data.strengthAreas.slice(0, 3).map((s) => (
              <Badge key={s} variant="accent">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {data.weakAreas.length > 0 && (
        <div className="mt-3 w-full">
          <p className="text-xs font-display font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
            Focus Areas
          </p>
          <div className="flex flex-wrap gap-1">
            {data.weakAreas.slice(0, 3).map((s) => (
              <Badge key={s} variant="warn">{s}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
