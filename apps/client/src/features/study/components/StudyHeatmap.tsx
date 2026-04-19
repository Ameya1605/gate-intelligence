import { useMemo, useState } from 'react';
import type { StudyHeatmapEntry } from '@gate/shared-types';
import { Spinner } from '@/shared/components/ui';
import { useStudyHeatmap } from '../hooks/useStudy';
import { format, subWeeks, startOfSunday, addDays, getMonth } from 'date-fns';

function getColor(minutes: number): string {
  if (minutes === 0) return 'var(--border)';
  if (minutes < 30) return '#2D225E';
  if (minutes < 90) return '#4535A6';
  if (minutes < 180) return '#6C63FF';
  if (minutes < 300) return '#8B7FF5';
  return 'var(--accent)';
}

function buildGrid(entries: StudyHeatmapEntry[]): Map<string, StudyHeatmapEntry> {
  const map = new Map<string, StudyHeatmapEntry>();
  for (const e of entries) map.set(e.date, e);
  return map;
}

const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function StudyHeatmap() {
  const { data, isLoading } = useStudyHeatmap(365);
  const [hoveredDate, setHoveredDate] = useState<{ date: string; mins: number; x: number; y: number } | null>(null);

  const grid = useMemo(() => buildGrid(data ?? []), [data]);

  const weeks = useMemo(() => {
    const today = new Date();
    const sunday = startOfSunday(subWeeks(today, 51));
    const result: string[][] = [];

    for (let w = 0; w < 52; w++) {
      const week: string[] = [];
      for (let d = 0; d < 7; d++) {
        const date = addDays(sunday, w * 7 + d);
        week.push(format(date, 'yyyy-MM-dd'));
      }
      result.push(week);
    }
    return result;
  }, []);

  const monthLabels = useMemo(() => {
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const date = new Date(week[0]);
      const month = getMonth(date);
      if (month !== lastMonth) {
        labels.push({ label: MONTHS[month], index: i });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalMinutes = (data ?? []).reduce((acc, e) => acc + e.minutes, 0);
  const totalDays = (data ?? []).filter((e) => e.minutes > 0).length;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>
            Study Momentum
          </h3>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Your consistency over the last 365 days
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xl font-display font-bold" style={{ color: 'var(--primary)' }}>
              {Math.round(totalMinutes / 60)}h
            </p>
            <p className="text-[10px] uppercase tracking-tighter" style={{ color: 'var(--muted)' }}>Total Time</p>
          </div>
          <div>
            <p className="text-xl font-display font-bold" style={{ color: 'var(--accent)' }}>
              {totalDays}
            </p>
            <p className="text-[10px] uppercase tracking-tighter" style={{ color: 'var(--muted)' }}>Active Days</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Day Labels */}
        <div className="flex flex-col gap-[4px] pt-5">
          {DAYS.map((day, i) => (
            <div key={i} className="h-[12px] text-[9px] flex items-center" style={{ color: 'var(--muted)' }}>
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
          {/* Month Labels */}
          <div className="relative h-5 mb-1">
            {monthLabels.map((m) => (
              <span
                key={`${m.label}-${m.index}`}
                className="absolute text-[10px] font-medium"
                style={{ left: `${m.index * 16}px`, color: 'var(--muted)' }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[4px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[4px]">
                {week.map((date) => {
                  const entry = grid.get(date);
                  const mins = entry?.minutes ?? 0;
                  return (
                    <div
                      key={date}
                      className="w-[12px] h-[12px] rounded-[3px] transition-all hover:scale-125 hover:z-10"
                      style={{ 
                        background: getColor(mins),
                        boxShadow: mins > 0 ? `0 0 8px ${getColor(mins)}44` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredDate({ date, mins, x: rect.left, y: rect.top });
                      }}
                      onMouseLeave={() => setHoveredDate(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Less</span>
        {[0, 20, 60, 120, 240, 400].map((m) => (
          <div
            key={m}
            className="w-[10px] h-[10px] rounded-[2px]"
            style={{ background: getColor(m) }}
          />
        ))}
        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>More</span>
      </div>

      {/* Dynamic Tooltip */}
      {hoveredDate && (
        <div 
          className="fixed z-50 pointer-events-none p-2 rounded-lg border shadow-xl animate-in fade-in zoom-in duration-200"
          style={{ 
            left: hoveredDate.x + 15, 
            top: hoveredDate.y - 40,
            background: 'var(--card)',
            borderColor: 'var(--border)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <p className="text-[10px] font-bold" style={{ color: 'white' }}>
            {format(new Date(hoveredDate.date), 'MMM do, yyyy')}
          </p>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--primary)' }}>
            {hoveredDate.mins} mins study
          </p>
        </div>
      )}
    </div>
  );
}
