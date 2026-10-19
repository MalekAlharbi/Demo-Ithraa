import { useEffect, useMemo, useState } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { useCustodyStore } from '../store/custodyStore';
import type { AssetStatus } from '../types/custody';
import PageHeading from '../components/PageHeading';

const statusLabel: Record<AssetStatus, string> = {
  Active: 'مصروفة للموظف',
  Returned: 'مُسترجعة',
  Lost: 'مفقودة',
};

const statusStyle: Record<AssetStatus, string> = {
  Active: 'bg-sand-50 text-sand-600',
  Returned: 'bg-brand-50 text-brand-700',
  Lost: 'bg-rose-50 text-rose-700',
};

/** Final clearance is permitted only when every asset assigned to the employee is returned. */
export function canIssueFinalClearance(assetStatuses: AssetStatus[]) {
  return assetStatuses.every((status) => status === 'Returned');
}

export default function Clearance() {
  const employees = useEmployeeStore((state) => state.employees);
  const loadMockEmployees = useEmployeeStore((state) => state.loadMockEmployees);
  const allAssets = useCustodyStore((state) => state.assets);
  const loadMockAssets = useCustodyStore((state) => state.loadMockAssets);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [issuedEmployeeId, setIssuedEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    if (employees.length === 0) loadMockEmployees();
    if (allAssets.length === 0) loadMockAssets();
  }, [employees.length, allAssets.length, loadMockEmployees, loadMockAssets]);

  const terminatedEmployees = useMemo(
    () => employees.filter((employee) => employee.employmentStatus === 'Terminated'),
    [employees],
  );

  useEffect(() => {
    if (!selectedEmployeeId && terminatedEmployees.length) setSelectedEmployeeId(terminatedEmployees[0].id);
    if (selectedEmployeeId && !terminatedEmployees.some((employee) => employee.id === selectedEmployeeId)) {
      setSelectedEmployeeId(terminatedEmployees[0]?.id ?? '');
    }
  }, [selectedEmployeeId, terminatedEmployees]);

  const employee = terminatedEmployees.find((item) => item.id === selectedEmployeeId);
  const employeeAssets = allAssets.filter((asset) => asset.employeeId === selectedEmployeeId);
  const allAssetsReturned = canIssueFinalClearance(employeeAssets.map((asset) => asset.status));
  const leaveDays = employee?.uncompensatedLeaveDays ?? 0;
  const isIssued = issuedEmployeeId === selectedEmployeeId;

  return (
    <section>
      <PageHeading title="إخلاء الطرف" description="مراجعة المستحقات والعُهد قبل إصدار المخالصة النهائية" eyebrow="إدارة الموارد البشرية" />

      <div className="mb-5 brand-card rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
        <label htmlFor="clearance-employee" className="block text-sm font-bold text-slate-700">اختر الموظف المنتهية خدمته</label>
        {terminatedEmployees.length ? (
          <select id="clearance-employee" value={selectedEmployeeId} onChange={(event) => { setSelectedEmployeeId(event.target.value); setIssuedEmployeeId(null); }} className="mt-2 w-full max-w-lg rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
            {terminatedEmployees.map((item) => <option key={item.id} value={item.id}>{item.fullName} — {item.jobTitle}</option>)}
          </select>
        ) : <p className="mt-2 text-sm text-slate-400">لا يوجد موظفون مسجلون كمنتهية خدمتهم.</p>}
      </div>

      {employee && <>
        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          <section className="brand-card rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-sky-50 text-lg text-sky-700" aria-hidden="true">HR</span>
              <div><h2 className="font-bold text-slate-800">قسم الموارد البشرية</h2><p className="text-xs text-slate-400">مراجعة الإجازات المستحقة غير المعوضة</p></div>
            </div>
            {leaveDays > 0 ? (
              <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-sand-600">توجد إجازات مستحقة غير معوضة: <strong>{leaveDays} أيام</strong>. يلزم مراجعتها ضمن التسوية النهائية.</div>
            ) : (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">لا توجد إجازات مستحقة غير معوضة.</div>
            )}
          </section>

          <section className="brand-card rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700" aria-hidden="true"><svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z"/><path d="m3.8 7.7 8.2 4.5 8.2-4.5M12 12.2V21"/></svg></span>
              <div><h2 className="font-bold text-slate-800">قسم العُهد</h2><p className="text-xs text-slate-400">{employeeAssets.length} عهدة مرتبطة بالموظف</p></div>
            </div>
            {employeeAssets.length ? <ul className="divide-y divide-slate-100">
              {employeeAssets.map((asset) => <li key={asset.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div><p className="text-sm font-bold text-slate-700">{asset.description}</p><p className="mt-1 text-xs text-slate-400">{asset.type} · <span dir="ltr" className="inline-block">{asset.serialNumber || '—'}</span></p></div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[asset.status]}`}>{statusLabel[asset.status]}</span>
              </li>)}
            </ul> : <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">لا توجد عُهد مسجلة على الموظف.</p>}
          </section>
        </div>

        {!allAssetsReturned && <div role="alert" className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span className="font-extrabold">!</span><p>لا يمكن إصدار المخالصة النهائية قبل تسوية جميع العُهد. يرجى استرجاع العُهد النشطة وتسوية العُهد المفقودة.</p>
        </div>}
        {isIssued && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">تم إصدار المخالصة النهائية لهذا الموظف في هذا العرض التجريبي.</div>}

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" disabled={!allAssetsReturned || isIssued} onClick={() => setIssuedEmployeeId(selectedEmployeeId)} className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
            {isIssued ? 'تم إصدار المخالصة' : 'إصدار مخالصة نهائية'}
          </button>
          {allAssetsReturned && !isIssued && <span className="text-xs text-emerald-700">تم استرجاع جميع العُهد ويمكن متابعة الإصدار.</span>}
        </div>
      </>}
    </section>
  );
}
