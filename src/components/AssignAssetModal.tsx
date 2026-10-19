import { useState, type FormEvent } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { useCustodyStore } from '../store/custodyStore';
import type { AssetType } from '../types/custody';

interface AssignAssetModalProps {
  onClose: () => void;
}

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100';

export default function AssignAssetModal({ onClose }: AssignAssetModalProps) {
  const employees = useEmployeeStore((state) => state.employees);
  const addAsset = useCustodyStore((state) => state.addAsset);
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? '');
  const [type, setType] = useState<AssetType>('لابتوب');
  const [description, setDescription] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [assignedAt, setAssignedAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!employeeId) return setError('أضف موظفاً أولاً قبل إسناد عهدة.');
    if (!description.trim()) return setError('أدخل وصف العهدة.');
    if (!assignedAt) return setError('حدد تاريخ التسليم.');
    addAsset({ employeeId, type, description: description.trim(), serialNumber: serialNumber.trim(), assignedAt, status: 'Active' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="assign-asset-title" className="my-auto w-full max-w-lg brand-card rounded-2xl bg-white shadow-2xl">
        <div className="modal-heading relative flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div><h2 id="assign-asset-title" className="text-lg font-extrabold text-brand-800">إسناد عهدة جديدة</h2><p className="mt-1 text-sm text-slate-500">اختر الموظف وأدخل تفاصيل العهدة</p></div>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
        </div>
        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          <label className="block text-sm font-semibold text-slate-700">الموظف<select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} className={fieldClass} required><option value="" disabled>اختر الموظف</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}</select></label>
          <label className="block text-sm font-semibold text-slate-700">نوع العهدة<select value={type} onChange={(event) => setType(event.target.value as AssetType)} className={fieldClass}><option value="سيارة">سيارة</option><option value="لابتوب">لابتوب</option><option value="سلفة مالية">سلفة مالية</option></select></label>
          <label className="block text-sm font-semibold text-slate-700">الوصف<input value={description} onChange={(event) => setDescription(event.target.value)} className={fieldClass} placeholder="مثال: جهاز عمل أو سلفة سفر" required /></label>
          <label className="block text-sm font-semibold text-slate-700">الرقم التسلسلي<input value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} dir="ltr" className={`${fieldClass} text-right`} placeholder="اختياري للسلفة المالية" /></label>
          <label className="block text-sm font-semibold text-slate-700">تاريخ التسليم<input value={assignedAt} onChange={(event) => setAssignedAt(event.target.value)} type="date" className={fieldClass} required /></label>
          {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-start gap-3 border-t border-slate-100 pt-4">
            <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">إسناد العهدة</button>
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">إلغاء</button>
          </div>
        </form>
      </section>
    </div>
  );
}
