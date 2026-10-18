import { NavLink } from 'react-router-dom';

const HRLinks = [
  { to: '/', label: 'لوحة القيادة', icon: '▦', end: true },
  { to: '/employees', label: 'الموظفون', icon: '♙' },
  { to: '/payroll', label: 'مسيرات الرواتب', icon: 'ر.س' },
  { to: '/clearance', label: 'إخلاء الطرف', icon: '✓' },
];

const CustodyLinks = [
  { to: '/custody', label: 'العُهد', icon: '▣' },
]

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white px-4 py-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-l lg:px-5">
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="grid size-11 place-items-center rounded-2xl bg-brand-600 text-xl font-bold text-white">ر</div>
        <div>
          <p className="text-lg font-extrabold leading-tight text-brand-900">روافد</p>
          <p className="text-xs text-slate-400">إدارة الموارد البشرية</p>
        </div>
      </div>
      <p className="mb-3 px-3 text-[11px] font-bold tracking-wider text-slate-400">إدارة الموارد البشرية</p>
      <nav aria-label="إدارة الموارد البشرية" className="flex gap-1 overflow-x-auto lg:flex-col">
        {HRLinks.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-lg bg-white text-xs font-bold shadow-sm">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <p className="mb-3 px-3 text-[11px] font-bold tracking-wider text-slate-400">إدارة العهد</p>
      <nav aria-label="إدارة العهد" className="flex gap-1 overflow-x-auto lg:flex-col">
        {CustodyLinks.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
          >
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-lg bg-white text-xs font-bold shadow-sm">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-10 hidden rounded-2xl bg-brand-50 p-4 lg:block">
        <p className="text-sm font-bold text-brand-900">مساحة عمل آمنة</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">إدارة بيانات فريقك وعُهده من مكان واحد.</p>
      </div>
    </aside>
  );
}
