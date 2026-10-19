import type { ReactNode } from 'react';

type MetricIconName = 'employees' | 'localization' | 'assets' | 'documents';

interface StatCardProps {
  title: string;
  value: string | number;
  detail: string;
  icon: MetricIconName;
  tone?: 'green' | 'blue' | 'amber' | 'rose';
}

const tones = {
  green: { icon: 'bg-brand-50 text-brand-700', value: 'text-brand-700', bar: 'bg-brand-500' },
  blue: { icon: 'bg-brand-50 text-brand-700', value: 'text-brand-800', bar: 'bg-brand-500' },
  amber: { icon: 'bg-sand-50 text-sand-600', value: 'text-sand-600', bar: 'bg-sand-500' },
  rose: { icon: 'bg-rose-50 text-rose-700', value: 'text-rose-700', bar: 'bg-rose-500' },
};

const metricIcons: Record<MetricIconName, ReactNode> = {
  employees: <><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M17 14a4.5 4.5 0 0 1 3.5 4.4"/></>,
  localization: <><circle cx="12" cy="12" r="8.5"/><path d="M3.8 9h16.4M3.8 15h16.4M12 3.5a13 13 0 0 1 0 17M12 3.5a13 13 0 0 0 0 17"/></>,
  assets: <><path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z"/><path d="m3.8 7.7 8.2 4.5 8.2-4.5M12 12.2V21"/></>,
  documents: <><path d="M6 3.5h8l4 4v13H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"/><path d="M14 3.5v5h5M8 13h8m-8 3.5h8"/></>,
};

export default function StatCard({ title, value, detail, icon, tone = 'blue' }: StatCardProps) {
  const styles = tones[tone];
  return (
    <article className="brand-card relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className={`mt-3 text-3xl font-extrabold tracking-tight ${styles.value}`}>{value}</p>
        </div>
        <span aria-hidden="true" className={`grid size-11 place-items-center rounded-xl ${styles.icon}`}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{metricIcons[icon]}</svg>
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-400">{detail}</p>
      <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1 ${styles.bar}`} />
    </article>
  );
}
