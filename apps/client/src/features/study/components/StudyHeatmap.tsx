import { useMemo } from 'react';
import type { StudyHeatmapEntry } from '@gate/shared-types';
import { Spinner } from '@/shared/components/ui';
import { useStudyHeatmap } from '../hooks/useStudy';

function getColor(minutes: number): string {
  if (minutes === 0) return 'var(--border)';
  if (minutes < 60) return 'rgba(108,99,255,0.25)';
  if (minutes < 120) return 'rgba(108,99,255,0.5)';
  if (minutes < 240) return 'rgba(108,99,255,0.75)';
  return 'var(--primary)';
}

function buildGrid(entries: StudyHeatmapEntry[]): Map<string, StudyHeatmapEntry> {
  const map = new Map<string, StudyHeatmapEntry>();
  for (const e of entries) map.set(e.date, e);
  return map;
}

function getLast52Weeks(): string[][] {
  const weeks: string[][] = [];
  const today = new Date();

  // Align to Sunday
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - today.getDay() - 7 * 51);

  for (let w = 0; w < 52; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + w * 7 + d);
      week.push(date.toISOString().slice(0, 10));
    }
    weeks.push(week);
  }
  return weeks;
}



export function StudyHeatmap() {
  const { data, isLoading } = useStudyHeatmap(365);
  const grid = useMemo(() => buildGrid(data ?? []), [data]);
  const weeks = useMemo(() => getLast52Weeks(), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner />
      </div>
    );
  }

  const totalMinutes = (data ?? []).reduce((acc, e) => acc + e.minutes, 0);
  const totalDays = (data ?? []).filter((e) => e.minutes > 0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-display font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          Study Activity
        </p>
        <div className="flex gap-4 text-xs" style={{ color: 'var(--muted)' }}>
          <span>
            <span style={{ color: 'var(--primary)' }} className="font-semibold">
              {Math.round(totalMinutes / 60)}h
            </span> total
          </span>
          <span>
            <span style={{ color: 'var(--accent)' }} className="font-semibold">
              {totalDays}
            </span> days
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px]" style={{ minWidth: 'max-content' }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((date) => {
                const entry = grid.get(date);
                const mins = entry?.minutes ?? 0;
                return (
                  <div
                    key={date}
                    title={`${date}: ${mins}min${entry ? `, ${entry.sessions} session(s)` : ''}`}
                    className="w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-transform hover:scale-125"
                    style={{ background: getColor(mins) }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Less</span>
        {[0, 30, 90, 180, 300].map((m) => (
          <div
            key={m}
            className="w-[11px] h-[11px] rounded-[2px]"
            style={{ background: getColor(m) }}
          />
        ))}
        <span className="text-xs" style={{ color: 'var(--muted)' }}>More</span>
      </div>
    </div>
  );
}
