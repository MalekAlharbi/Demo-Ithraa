interface StatCardProps {
  title: string;
  value: string | number;
  detail: string;
  icon: string;
  tone?: 'green' | 'blue' | 'amber' | 'rose';
}

const tones = {
  green: { icon: 'bg-brand-50 text-brand-700', value: 'text-brand-700', bar: 'bg-brand-500' },
  blue: { icon: 'bg-brand-50 text-brand-700', value: 'text-brand-800', bar: 'bg-brand-500' },
  amber: { icon: 'bg-sand-50 text-sand-600', value: 'text-sand-600', bar: 'bg-sand-500' },
  rose: { icon: 'bg-rose-50 text-rose-700', value: 'text-rose-700', bar: 'bg-rose-500' },
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
        <span aria-hidden="true" className={`grid size-11 place-items-center rounded-xl text-lg font-bold ${styles.icon}`}>{icon}</span>
      </div>
      <p className="mt-3 text-xs text-slate-400">{detail}</p>
      <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1 ${styles.bar}`} />
    </article>
  );
}
