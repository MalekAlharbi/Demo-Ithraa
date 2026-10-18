interface StatCardProps {
  title: string;
  value: string | number;
  detail: string;
  icon: string;
  tone?: 'green' | 'blue' | 'amber' | 'rose';
}

const tones = {
  green: { icon: 'bg-emerald-50 text-emerald-700', value: 'text-emerald-700', bar: 'bg-emerald-500' },
  blue: { icon: 'bg-sky-50 text-sky-700', value: 'text-slate-900', bar: 'bg-sky-500' },
  amber: { icon: 'bg-amber-50 text-amber-700', value: 'text-amber-700', bar: 'bg-amber-500' },
  rose: { icon: 'bg-rose-50 text-rose-700', value: 'text-rose-700', bar: 'bg-rose-500' },
};

export default function StatCard({ title, value, detail, icon, tone = 'blue' }: StatCardProps) {
  const styles = tones[tone];
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
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
