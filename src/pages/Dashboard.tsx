import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardCharts from '../components/DashboardCharts';
import StatCard from '../components/StatCard';
import { useEmployeeStore } from '../store/employeeStore';
import { useCustodyStore } from '../store/custodyStore';
import type { AssetType } from '../types/custody';

const EXPIRY_WINDOW_DAYS = 30;
const SAUDIZATION_GREEN_THRESHOLD = 50;

function daysUntilExpiry(expiryDate: string) {
  const [year, month, day] = expiryDate.split('-').map(Number);
  const expiryUtc = Date.UTC(year, month - 1, day);
  const now = new Date();
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((expiryUtc - todayUtc) / 86_400_000);
}

function formatExpiryDate(value: string) {
  return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium' }).format(new Date(`${value}T00:00:00`));
}

export default function Dashboard() {
  const employees = useEmployeeStore((state) => state.employees);
  const loadMockEmployees = useEmployeeStore((state) => state.loadMockEmployees);
  const assets = useCustodyStore((state) => state.assets);
  const loadMockAssets = useCustodyStore((state) => state.loadMockAssets);

  useEffect(() => {
    if (employees.length === 0) loadMockEmployees();
    if (assets.length === 0) loadMockAssets();
  }, [employees.length, assets.length, loadMockEmployees, loadMockAssets]);

  const activeEmployees = useMemo(() => employees.filter((employee) => employee.employmentStatus !== 'Terminated'), [employees]);
  const saudiCount = activeEmployees.filter((employee) => employee.nationality === 'سعودي').length;
  const nonSaudiCount = activeEmployees.length - saudiCount;
  const saudizationRate = activeEmployees.length ? Math.round((saudiCount / activeEmployees.length) * 100) : 0;
  const activeAssets = assets.filter((asset) => asset.status === 'Active');

  const expiringEmployees = useMemo(() => employees
    .map((employee) => ({ employee, days: daysUntilExpiry(employee.idExpiryDate) }))
    .filter(({ days }) => days <= EXPIRY_WINDOW_DAYS)
    .sort((left, right) => left.days - right.days), [employees]);

  const pendingClearance = useMemo(() => employees
    .filter((employee) => employee.employmentStatus === 'Terminated')
    .map((employee) => ({
      employee,
      unsettledAssets: assets.filter((asset) => asset.employeeId === employee.id && asset.status !== 'Returned'),
    }))
    .filter(({ unsettledAssets }) => unsettledAssets.length > 0), [employees, assets]);

  const assetsByType = useMemo(() => {
    const counts: Record<AssetType, number> = { سيارة: 0, لابتوب: 0, 'سلفة مالية': 0 };
    assets.forEach((asset) => { counts[asset.type] += 1; });
    return counts;
  }, [assets]);

  const saudizationTone = saudizationRate >= SAUDIZATION_GREEN_THRESHOLD ? 'green' : 'amber';

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="mb-2 text-sm font-medium text-slate-400">نظرة عامة</p><h1 className="text-2xl font-extrabold text-slate-900">لوحة القيادة</h1><p className="mt-1 text-sm text-slate-500">ملخص مؤشرات الموارد البشرية والعُهد</p></div>
        <p className="text-xs font-medium text-slate-400">آخر تحديث: {new Intl.DateTimeFormat('ar-SA', { dateStyle: 'full' }).format(new Date())}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="إجمالي الموظفين" value={activeEmployees.length} detail="الموظفون على رأس العمل" icon="♙" tone="blue" />
        <StatCard title="نسبة التوطين" value={`${saudizationRate}%`} detail={`${saudiCount} سعودي من ${activeEmployees.length} موظف نشط`} icon="٪" tone={saudizationTone} />
        <StatCard title="العُهد النشطة" value={activeAssets.length} detail="عهد لم يتم استرجاعها بعد" icon="▣" tone="green" />
        <StatCard title="تنبيهات الوثائق" value={expiringEmployees.length} detail="منتهية أو تنتهي خلال 30 يوماً" icon="!" tone={expiringEmployees.length ? 'rose' : 'blue'} />
      </div>

      <DashboardCharts saudiCount={saudiCount} nonSaudiCount={nonSaudiCount} assetsByType={assetsByType} />

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h2 className="font-bold text-slate-800">إجراءات عاجلة</h2><p className="mt-1 text-xs text-slate-400">هويات وإقامات منتهية أو قاربت على الانتهاء</p></div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{expiringEmployees.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-right text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500"><tr><th className="px-5 py-3">الموظف</th><th className="px-4 py-3">تاريخ الانتهاء</th><th className="px-5 py-3">الإجراء</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {expiringEmployees.map(({ employee, days }) => <tr key={employee.id}>
                  <td className="px-5 py-3.5"><p className="font-bold text-slate-700">{employee.fullName}</p><p className="mt-0.5 text-xs text-slate-400">{employee.nationality === 'سعودي' ? 'الهوية الوطنية' : 'الإقامة'}</p></td>
                  <td className="px-4 py-3.5"><span className={`text-xs font-semibold ${days < 0 ? 'text-rose-700' : 'text-amber-700'}`}>{formatExpiryDate(employee.idExpiryDate)}</span><p className="mt-0.5 text-[11px] text-slate-400">{days < 0 ? `منتهية منذ ${Math.abs(days)} يوم` : days === 0 ? 'تنتهي اليوم' : `متبقي ${days} يوم`}</p></td>
                  <td className="px-5 py-3.5"><Link to="/employees" className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50">تحديث البيانات</Link></td>
                </tr>)}
                {!expiringEmployees.length && <tr><td colSpan={3} className="px-5 py-10 text-center text-sm text-slate-400">لا توجد هويات أو إقامات تستدعي إجراءً حالياً.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h2 className="font-bold text-slate-800">طلبات إخلاء الطرف المعلقة</h2><p className="mt-1 text-xs text-slate-400">موظفون منتهية خدمتهم ولديهم عُهد غير مسترجعة</p></div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{pendingClearance.length}</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {pendingClearance.map(({ employee, unsettledAssets }) => <li key={employee.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div><p className="text-sm font-bold text-slate-700">{employee.fullName}</p><p className="mt-1 text-xs text-slate-400">{unsettledAssets.length} عهدة تحتاج إلى تسوية: {unsettledAssets.map((asset) => asset.type).join('، ')}</p></div>
              <Link to="/clearance" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">مراجعة الطلب</Link>
            </li>)}
            {!pendingClearance.length && <li className="px-5 py-10 text-center text-sm text-slate-400">لا توجد طلبات إخلاء طرف معلقة.</li>}
          </ul>
        </section>
      </div>
    </section>
  );
}
