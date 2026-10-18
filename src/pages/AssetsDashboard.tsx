import { useEffect, useState } from 'react';
import AssignAssetModal from '../components/AssignAssetModal';
import EmployeeAssets from '../components/EmployeeAssets';
import { useEmployeeStore } from '../store/employeeStore';
import { useCustodyStore } from '../store/custodyStore';

export default function AssetsDashboard() {
  const employees = useEmployeeStore((state) => state.employees);
  const loadMockEmployees = useEmployeeStore((state) => state.loadMockEmployees);
  const assets = useCustodyStore((state) => state.assets);
  const loadMockAssets = useCustodyStore((state) => state.loadMockAssets);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (employees.length === 0) loadMockEmployees();
    if (assets.length === 0) loadMockAssets();
  }, [employees.length, assets.length, loadMockEmployees, loadMockAssets]);

  const activeCount = assets.filter((asset) => asset.status === 'Active').length;
  const lostCount = assets.filter((asset) => asset.status === 'Lost').length;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-sm font-medium text-slate-400">الرئيسية / إدارة الموارد البشرية</p><h1 className="text-2xl font-extrabold text-slate-900">إدارة العُهد</h1><p className="mt-1 text-sm text-slate-500">متابعة العُهد المسندة إلى موظفي المنشأة</p></div>
        <button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"><span className="text-lg leading-none">＋</span> إسناد عهدة</button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">إجمالي العُهد المصروفة</p><p className="mt-2 text-2xl font-extrabold text-brand-700">{activeCount}</p><p className="mt-1 text-xs text-slate-400">عهدة بحالة نشطة</p></article>
        <article className={`rounded-2xl border p-5 shadow-soft ${lostCount ? 'border-rose-100 bg-rose-50' : 'border-slate-100 bg-white'}`}><p className={`text-sm ${lostCount ? 'text-rose-700' : 'text-slate-500'}`}>العُهد المفقودة</p><p className={`mt-2 text-2xl font-extrabold ${lostCount ? 'text-rose-700' : 'text-slate-900'}`}>{lostCount}</p><p className="mt-1 text-xs text-slate-400">من إجمالي {assets.length} عهدة مسجلة</p></article>
      </div>

      <div className="space-y-4">
        {employees.map((employee) => <EmployeeAssets key={employee.id} employeeId={employee.id} employeeName={employee.fullName} />)}
        {employees.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">لا توجد بيانات موظفين. أضف موظفاً أولاً لإسناد العُهد.</div>}
      </div>
      {modalOpen && <AssignAssetModal onClose={() => setModalOpen(false)} />}
    </section>
  );
}
