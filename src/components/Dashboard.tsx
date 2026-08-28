import { useState, type ReactNode } from 'react';
import {
  Menu, X, Bell, Search, ChevronDown, LogOut, Home, GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  type DashboardRole,
  type NavItem,
  roleLabels,
  roleNavMap,
  roleBasePaths,
} from '@/lib/dashboard-data';

// ── Stat Card ──
export function StatCard({
  label,
  value,
  icon: Icon,
  color = 'primary',
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
}) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-sm text-ink-500">{label}</p>
    </div>
  );
}

// ── Card ──
export function DashCard({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card p-5 ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink-900">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Bar Chart (pure CSS) ──
export function BarChart({ data, height = 140 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-primary-500 to-primary-400 transition-all duration-500 hover:from-primary-600 hover:to-primary-500"
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-2xs font-medium text-ink-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Line Chart (pure SVG) ──
export function LineChart({ data, height = 140 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const w = 100;
  const h = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.value - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <div style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(37,99,235,0.25)" />
            <stop offset="100%" stopColor="rgba(37,99,235,0)" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#lineGrad)" />
        <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * w;
          const y = h - ((d.value - min) / range) * h;
          return <circle key={i} cx={x} cy={y} r="1.5" fill="#2563eb" vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="mt-1 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="text-2xs font-medium text-ink-400">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── Progress Bar ──
export function ProgressBar({ value, color = 'primary' }: { value: number; color?: string }) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
      <div className={`h-full rounded-full ${colorMap[color] || colorMap.primary} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );
}

// ── Badge ──
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pass: 'badge-success',
    Fail: 'badge-error',
    Paid: 'badge-success',
    Pending: 'badge-accent',
    Upcoming: 'badge-primary',
    Registered: 'badge-primary',
    Approved: 'badge-success',
    Rejected: 'badge-error',
    Active: 'badge-success',
    Inactive: 'badge-ink',
    Completed: 'badge-ink',
  };
  return <span className={map[status] || 'badge-ink'}>{status}</span>;
}

// ── Page Header (inside dashboard) ──
export function DashPageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

// ── Empty State ──
export function EmptyState({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-10 w-10 text-ink-300" />
      <p className="mt-3 text-sm text-ink-400">{message}</p>
    </div>
  );
}

// ── Dashboard Layout ──
export function DashboardLayout({
  role,
  children,
}: {
  role: DashboardRole;
  children: ReactNode;
}) {
  const { route } = useRouter();
  const { session, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = roleNavMap[role];
  const basePath = roleBasePaths[role];
  const roleLabel = roleLabels[role];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/';
  };

  const isActive = (to: string) =>
    to === basePath ? route.path === to : route.path.startsWith(to);

  const userDisplayName = user?.email?.split('@')[0] ?? 'User';
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-ink-200 bg-white lg:flex">
        <SidebarContent
          role={role}
          roleLabel={roleLabel}
          nav={nav}
          isActive={isActive}
          onNavigate={() => {}}
        />
      </aside>

      {/* Sidebar — mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 animate-slide-in-right border-r border-ink-200 bg-white">
            <SidebarContent
              role={role}
              roleLabel={roleLabel}
              nav={nav}
              isActive={isActive}
              onNavigate={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/85 backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link to="/" className="flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-primary-600">
                <Home className="h-4 w-4" />
                Back to Site
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 rounded-xl border border-ink-200 bg-ink-50 py-2 pl-9 pr-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
              <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error-500" />
              </button>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
                  {userInitials}
                </span>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-ink-900">{userDisplayName}</p>
                  <p className="text-2xs text-ink-400">{roleLabel}</p>
                </div>
                <button onClick={handleSignOut} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:bg-error-50 hover:text-error-600">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container-page py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  role,
  roleLabel,
  nav,
  isActive,
  onNavigate,
}: {
  role: DashboardRole;
  roleLabel: string;
  nav: NavItem[];
  isActive: (to: string) => boolean;
  onNavigate: () => void;
}) {
  const roleColors: Record<string, string> = {
    'student': 'from-primary-500 to-primary-700',
    'parent': 'from-success-500 to-success-700',
    'teacher': 'from-accent-500 to-accent-700',
    'lecturer': 'from-primary-600 to-primary-800',
    'school-admin': 'from-warning-500 to-warning-700',
    'tertiary-education-admin': 'from-primary-700 to-primary-900',
    'super-admin': 'from-ink-800 to-ink-950',
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-ink-200 px-5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${roleColors[role]} text-white`}>
          <GraduationCap className="h-5 w-5" />
        </span>
        <div className="flex flex-col leading-none">
          <span className="text-base font-extrabold tracking-tight text-ink-900">I-LearnAce</span>
          <span className="text-2xs font-medium text-ink-500">{roleLabel} Portal</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 scrollbar-hide">
        <div className="space-y-0.5">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive(item.to) ? 'text-primary-600' : 'text-ink-400'}`} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-ink-200 p-3">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50">
          <Home className="h-4 w-4 text-ink-400" />
          Back to Website
        </Link>
      </div>
    </div>
  );
}


