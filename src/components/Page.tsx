import type { ReactNode } from 'react';
import { Link } from '@/lib/router';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-mesh pt-32 pb-16 text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-96 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="container-page relative">
        <div className="max-w-3xl animate-fade-in-up">
          {eyebrow && <p className="section-eyebrow text-primary-300">{eyebrow}</p>}
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-100/90">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
      {/* bottom curve */}
      <svg className="absolute bottom-0 left-0 w-full text-ink-50" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,32 C320,64 720,0 1440,32 L1440,60 L0,60 Z" />
      </svg>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-primary-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-700">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-ink-300">/</span>}
        </span>
      ))}
    </nav>
  );
}

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl text-balance">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-ink-500">{subtitle}</p>}
    </div>
  );
}
