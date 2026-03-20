import { useEffect } from 'react';
import { PageWrapper, StatCard, Card, SectionHeader, Spinner } from '@/shared/components/ui';
import { widgetRegistry } from '../widgetRegistry';
import { initDashboardWidgets } from '../widgets/index';
import { useAnalyticsDashboard } from '@/features/analytics/hooks/useAnalytics';
import { InsightsPanel } from '@/features/analytics/components/InsightsPanel';
import { isFeatureEnabled } from '@/app/featureRegistry';

// Initialize widgets once (idempotent on re-render because registry checks ids)
initDashboardWidgets();

function WidgetRenderer() {
  const widgets = widgetRegistry
    .getAll()
    .filter((w) => isFeatureEnabled(w.feature as any));

  const sizeClass: Record<string, string> = {
    sm: 'col-span-1',
    md: 'col-span-1',
    lg: 'col-span-2',
    xl: 'col-span-2',
  };

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {widgets.map((widget) => {
        const Component = widget.component;
        return (
          <div key={widget.id} className={sizeClass[widget.size]}>
            <Component />
          </div>
        );
      })}
    </div>
  );
}

function DashboardStats() {
  const { data, isLoading } = useAnalyticsDashboard();

  if (isLoading) return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {[0,1,2,3].map((i) => (
        <div key={i} className="card p-5 h-28 animate-pulse"
          style={{ background: 'var(--card)' }} />
      ))}
    </div>
  );

  if (!data) return null;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Readiness Score"
        value={data.readiness.overall}
        unit="/100"
        icon="🎯"
        accent="primary"
        delta={`${data.readiness.gate_prediction}`}
        deltaUp
      />
      <StatCard
        label="Overall Accuracy"
        value={data.accuracy.overall}
        unit="%"
        icon="✅"
        accent="accent"
      />
      <StatCard
        label="Study This Month"
        value={data.effort.breakdown.studyHours}
        unit="hrs"
        icon="📚"
        accent="gold"
      />
      <StatCard
        label="Consistency"
        value={data.effort.breakdown.consistencyScore}
        unit="%"
        icon="🔥"
        accent={data.effort.breakdown.consistencyScore >= 70 ? 'accent' : 'warn'}
      />
    </div>
  );
}

function DailyGreeting() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' : 'Good evening';

  const daysToGate = Math.max(
    0,
    Math.ceil((new Date('2026-02-01').getTime() - Date.now()) / 86400000)
  );

  return (
    <div
      className="relative rounded-2xl p-6 mb-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(0,212,170,0.08) 100%)',
        border: '1px solid rgba(108,99,255,0.25)',
      }}
    >
      {/* Decorative orb */}
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(108,99,255,0.3)' }}
      />
      <div
        className="absolute right-24 -bottom-8 w-20 h-20 rounded-full blur-2xl pointer-events-none"
        style={{ background: 'rgba(0,212,170,0.2)' }}
      />

      <p className="text-xs font-display font-semibold uppercase tracking-widest mb-2"
         style={{ color: 'rgba(108,99,255,0.8)' }}>
        {greeting}, Aspirant
      </p>
      <h1 className="font-display font-bold text-2xl mb-1 gradient-text">
        GATE 2026 — {daysToGate} days remaining
      </h1>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Every hour of focused preparation counts. Let's analyse where you stand.
      </p>
    </div>
  );
}

function QuickInsights() {
  const { data, isLoading } = useAnalyticsDashboard();

  if (!isFeatureEnabled('ANALYTICS')) return null;

  return (
    <Card>
      <SectionHeader
        title="Today's Insights"
        subtitle="Personalised recommendations"
        action={
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            AI-generated
          </span>
        }
      />
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner /></div>
      ) : (
        <InsightsPanel insights={(data?.insights ?? []).slice(0, 4)} />
      )}
    </Card>
  );
}

export function DashboardPage() {
  return (
    <PageWrapper title="" subtitle="">
      <div className="max-w-6xl mx-auto">
        {/* Greeting banner */}
        <DailyGreeting />

        {/* KPI stats */}
        <DashboardStats />

        {/* Dynamic widget grid */}
        <WidgetRenderer />

        {/* Quick insights */}
        <QuickInsights />
      </div>
    </PageWrapper>
  );
}
