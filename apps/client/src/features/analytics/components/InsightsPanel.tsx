import type { InsightItem } from '@gate/shared-types';

const iconMap = {
  strength: { icon: '💪', color: 'var(--accent)', bg: 'rgba(0,212,170,0.1)' },
  weakness: { icon: '⚠️', color: 'var(--warn)',  bg: 'rgba(255,107,107,0.1)' },
  warning:  { icon: '🔔', color: 'var(--gold)',  bg: 'rgba(255,209,102,0.1)' },
  tip:      { icon: '💡', color: 'var(--primary)', bg: 'rgba(108,99,255,0.1)' },
};

export function InsightsPanel({ insights }: { insights: InsightItem[] }) {
  if (!insights.length) {
    return (
      <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
        Log more sessions to generate personalised insights.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const style = iconMap[insight.type];
        return (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-xl"
            style={{ background: style.bg, border: `1px solid ${style.color}33` }}
          >
            <span className="text-base flex-shrink-0 mt-0.5">{style.icon}</span>
            <div>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                {insight.message}
              </p>
              {insight.subject && (
                <p className="text-xs mt-1 font-mono" style={{ color: style.color }}>
                  {insight.subject}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
