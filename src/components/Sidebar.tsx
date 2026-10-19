import { NavLink } from 'react-router-dom';
import ithraaMark from '../assets/ithraa-mark.png';

const HRLinks = [
  { to: '/', label: 'لوحة القيادة', icon: '▦', end: true },
  { to: '/employees', label: 'الموظفون', icon: '♙' },
  { to: '/payroll', label: 'مسيرات الرواتب', icon: 'ر.س' },
  { to: '/clearance', label: 'إخلاء الطرف', icon: '✓' },
];

const CustodyLinks = [{ to: '/custody', label: 'العُهد', icon: '▣' }];

export default function Sidebar() {
  return (
    <aside className="relative w-full shrink-0 overflow-hidden border-b border-slate-200 bg-white px-4 py-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-l lg:px-5">
      <div className="relative mb-8 flex items-center gap-3 px-2">
        <img src={ithraaMark} alt="شعار إثراء الخير" className="size-12 object-contain" />
        <div>
          <p className="text-lg font-extrabold leading-tight text-brand-700">إثراء الخير</p>
          <p className="mt-0.5 text-[11px] tracking-wide text-slate-400">إدارة الموارد البشرية</p>
        </div>
      </div>
      <p className="mb-3 px-3 text-[11px] font-bold tracking-wider text-slate-400">إدارة الموارد البشرية</p>
      <nav aria-label="إدارة الموارد البشرية" className="relative flex gap-1 overflow-x-auto lg:flex-col">
        {HRLinks.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100' : 'text-slate-500 hover:bg-slate-50 hover:text-brand-700'}`}>
            {({ isActive }) => <><span aria-hidden="true" className={`grid size-7 place-items-center rounded-lg text-xs font-bold ${isActive ? 'bg-white text-turquoise-600 shadow-sm' : 'bg-slate-50 text-slate-500'}`}>{icon}</span>{label}</>}
          </NavLink>
        ))}
      </nav>
      <p className="mb-3 mt-7 px-3 text-[11px] font-bold tracking-wider text-slate-400">إدارة العُهد</p>
      <nav aria-label="إدارة العُهد" className="relative flex gap-1 overflow-x-auto lg:flex-col">
        {CustodyLinks.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100' : 'text-slate-500 hover:bg-slate-50 hover:text-brand-700'}`}>
            {({ isActive }) => <><span aria-hidden="true" className={`grid size-7 place-items-center rounded-lg text-xs font-bold ${isActive ? 'bg-white text-turquoise-600 shadow-sm' : 'bg-slate-50 text-slate-500'}`}>{icon}</span>{label}</>}
          </NavLink>
        ))}
      </nav>
      <div className="relative mt-10 hidden rounded-2xl border border-brand-100 bg-gradient-to-bl from-brand-50 to-white p-4 lg:block">
        <div className="mb-2 size-1.5 rounded-full bg-sand-500" />
        <p className="text-sm font-bold text-brand-800">مساحة عمل آمنة</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">إدارة بيانات فريقك وعُهده من مكان واحد.</p>
      </div>
    </aside>
  );
}
