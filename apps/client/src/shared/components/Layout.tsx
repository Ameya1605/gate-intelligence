import { Outlet, NavLink } from 'react-router-dom';
import { isFeatureEnabled } from '@/app/featureRegistry';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⬡', feature: null },
  { to: '/study', label: 'Study', icon: '📚', feature: 'STUDY' as const },
  { to: '/mocks', label: 'Mock Tests', icon: '🎯', feature: 'MOCKS' as const },
  { to: '/analytics', label: 'Analytics', icon: '📊', feature: 'ANALYTICS' as const },
];

export function Layout() {
  const visibleNav = NAV_ITEMS.filter(
    (item) => item.feature === null || isFeatureEnabled(item.feature)
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ── Sidebar ── */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col border-r"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-display font-bold"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              G
            </div>
            <div>
              <p className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
                GATE Intel
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                2026 Prep
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white'
                    : 'hover:bg-white/5'
                )
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,170,0.1))',
                      color: 'var(--primary)',
                      borderLeft: '3px solid var(--primary)',
                    }
                  : { color: 'var(--muted)' }
              }
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-display">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'var(--card)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              D
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                Demo User
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                GATE CS 2026
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
