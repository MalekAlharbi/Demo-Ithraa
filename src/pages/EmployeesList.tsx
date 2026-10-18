import { useEffect, useMemo, useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployeeStore } from '../store/employeeStore';
import type { Employee } from '../types/hr';

const currency = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 });

function isExpired(date: string) {
  return date < new Date().toISOString().slice(0, 10);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium' }).format(new Date(`${date}T00:00:00`));
}

export default function EmployeesList() {
  const employees = useEmployeeStore((state) => state.employees);
  const loadMockEmployees = useEmployeeStore((state) => state.loadMockEmployees);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  useEffect(() => {
    if (employees.length === 0) loadMockEmployees();
  }, [employees.length, loadMockEmployees]);

  const expiredCount = useMemo(() => employees.filter((employee) => isExpired(employee.idExpiryDate)).length, [employees]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingEmployee(undefined);
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-400">الرئيسية / إدارة الموارد البشرية</p>
          <h1 className="text-2xl font-extrabold text-slate-900">الموظفون</h1>
          <p className="mt-1 text-sm text-slate-500">عرض وإدارة بيانات موظفي المنشأة</p>
        </div>
        <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"><span className="text-lg leading-none">＋</span> إضافة موظف</button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">إجمالي الموظفين</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{employees.length}</p>
        </div>
        <div className={`rounded-2xl border p-5 shadow-soft ${expiredCount ? 'border-rose-100 bg-rose-50' : 'border-slate-100 bg-white'}`}>
          <p className={`text-sm ${expiredCount ? 'text-rose-700' : 'text-slate-500'}`}>هويات / إقامات منتهية</p>
          <p className={`mt-2 text-2xl font-extrabold ${expiredCount ? 'text-rose-700' : 'text-slate-900'}`}>{expiredCount}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-800">قائمة الموظفين</h2>
          <span className="text-xs text-slate-400">{employees.length} موظف</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500">
              <tr>
                <th className="px-5 py-3.5">الموظف</th><th className="px-4 py-3.5">رقم الهوية / الإقامة</th><th className="px-4 py-3.5">الجنسية</th><th className="px-4 py-3.5">المسمى الوظيفي</th><th className="px-4 py-3.5">الراتب الأساسي</th><th className="px-4 py-3.5">انتهاء الوثيقة</th><th className="px-5 py-3.5">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((employee) => {
                const expired = isExpired(employee.idExpiryDate);
                return (
                  <tr key={employee.id} className={`transition hover:bg-slate-50/70 ${expired ? 'bg-rose-50/50' : ''}`}>
                    <td className="px-5 py-4"><p className="font-bold text-slate-800">{employee.fullName}</p><p className="mt-0.5 text-xs text-slate-400">{employee.jobTitle}</p></td>
                    <td dir="ltr" className="px-4 py-4 text-right font-medium text-slate-600">{employee.nationalId}</td>
                    <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${employee.nationality === 'سعودي' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>{employee.nationality}</span></td>
                    <td className="px-4 py-4 text-slate-600">{employee.jobTitle}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{currency.format(employee.basicSalary)}</td>
                    <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${expired ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                      {expired && <span aria-hidden="true">!</span>}{formatDate(employee.idExpiryDate)}{expired && <span>منتهية</span>}
                    </span></td>
                    <td className="px-5 py-4"><button type="button" onClick={() => { setEditingEmployee(employee); setFormOpen(true); }} className="rounded-lg px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50">تعديل</button></td>
                  </tr>
                );
              })}
              {employees.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">لا يوجد موظفون لعرضهم.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {formOpen && <EmployeeForm employee={editingEmployee} onClose={closeForm} />}
    </section>
  );
}
