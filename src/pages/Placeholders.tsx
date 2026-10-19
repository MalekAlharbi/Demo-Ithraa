import { useLocation } from 'react-router-dom';
import PageHeading from '../components/PageHeading';

const pageTitles: Record<string, string> = {
  '/': 'لوحة القيادة',
  '/employees': 'الموظفون',
  '/payroll': 'مسيرات الرواتب',
  '/custody': 'العُهد',
  '/clearance': 'إخلاء الطرف',
};

function Placeholder() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'الصفحة';
  return (
    <section>
      <PageHeading title={title} description={`إدارة ${title} ضمن منصة إثراء الخير`} eyebrow="مساحة العمل" />
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-600">✦</div>
        <h2 className="mt-4 font-bold text-slate-700">صفحة {title}</h2>
        <p className="mt-1 text-sm text-slate-400">سيظهر محتوى هذه الصفحة هنا قريباً.</p>
      </div>
    </section>
  );
}

export const DashboardPage = Placeholder;
export const EmployeesPage = Placeholder;
export const PayrollPage = Placeholder;
export const CustodyPage = Placeholder;
export const ClearancePage = Placeholder;
