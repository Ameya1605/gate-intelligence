import { ReactNode } from 'react';
import clsx from 'clsx';

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'accent' | 'warn' | 'gold';
  onClick?: () => void;
}

export function Card({ children, className, glowColor, onClick }: CardProps) {
  const glowMap = {
    primary: 'hover:shadow-[0_0_20px_rgba(108,99,255,0.25)]',
    accent: 'hover:shadow-[0_0_20px_rgba(0,212,170,0.25)]',
    warn: 'hover:shadow-[0_0_20px_rgba(255,107,107,0.25)]',
    gold: 'hover:shadow-[0_0_20px_rgba(255,209,102,0.25)]',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'card p-5 transition-all duration-200',
        glowColor && glowMap[glowColor],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaUp?: boolean;
  icon?: string;
  accent?: 'primary' | 'accent' | 'warn' | 'gold';
}

const accentColorMap = {
  primary: 'var(--primary)',
  accent: 'var(--accent)',
  warn: 'var(--warn)',
  gold: 'var(--gold)',
};

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaUp,
  icon,
  accent = 'primary',
}: StatCardProps) {
  const color = accentColorMap[accent];

  return (
    <Card glowColor={accent}>
      <div className="flex items-start justify-between mb-4">
        <p
          className="text-xs font-display font-semibold uppercase tracking-widest"
          style={{ color: 'var(--muted)' }}
        >
          {label}
        </p>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: `${color}22`, border: `1px solid ${color}44` }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span
          className="font-display font-bold text-3xl"
          style={{ color }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-sm mb-1 font-medium"
            style={{ color: 'var(--muted)' }}
          >
            {unit}
          </span>
        )}
      </div>
      {delta && (
        <p
          className="mt-2 text-xs font-medium"
          style={{ color: deltaUp ? 'var(--accent)' : 'var(--warn)' }}
        >
          {deltaUp ? '↑' : '↓'} {delta}
        </p>
      )}
    </Card>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'primary' | 'accent' | 'warn' | 'gold' | 'muted';

export function Badge({
  children,
  variant = 'primary',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  const styles: Record<BadgeVariant, { bg: string; color: string }> = {
    primary: { bg: 'rgba(108,99,255,0.15)', color: 'var(--primary)' },
    accent: { bg: 'rgba(0,212,170,0.15)', color: 'var(--accent)' },
    warn: { bg: 'rgba(255,107,107,0.15)', color: 'var(--warn)' },
    gold: { bg: 'rgba(255,209,102,0.15)', color: 'var(--gold)' },
    muted: { bg: 'rgba(107,114,128,0.15)', color: 'var(--muted)' },
  };
  const s = styles[variant];

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-display font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {children}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div
      className={clsx(
        'rounded-full animate-spin border-2',
        sizeMap[size]
      )}
      style={{
        borderColor: 'var(--border)',
        borderTopColor: 'var(--primary)',
      }}
    />
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2
          className="font-display font-bold text-xl"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3
        className="font-display font-semibold text-lg mb-2"
        style={{ color: 'var(--text)' }}
      >
        {title}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: 'var(--muted)' }}>
        {description}
      </p>
    </div>
  );
}

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
export function PageWrapper({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1
          className="font-display font-bold text-3xl gradient-text"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
