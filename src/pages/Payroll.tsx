import { useEffect } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import type { Employee } from '../types/hr';

const GOSI_RATE = 9.75;
const currency = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 });

export interface PayrollRow {
  employee: Employee;
  grossSalary: number;
  deductions: number;
  netSalary: number;
}

/** Salary demo calculation: GOSI is applied to basic salary plus housing for Saudi employees only. */
export function calculatePayroll(employee: Employee): PayrollRow {
  const grossSalary = employee.basicSalary + employee.housingAllowance + employee.transportAllowance;
  const gosiBase = employee.basicSalary + employee.housingAllowance;
  const deductions = employee.nationality === 'سعودي' ? gosiBase * (GOSI_RATE / 100) : 0;
  return { employee, grossSalary, deductions, netSalary: grossSalary - deductions };
}

function csvCell(value: string | number) {
  let text = String(value);
  // Avoid spreadsheet formula execution when CSV cells contain user-provided text.
  if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** Downloads a bank-transfer summary CSV in UTF-8 with BOM for Arabic spreadsheet support. */
export function exportPayrollCsv(rows: PayrollRow[]) {
  const headers = ['اسم الموظف', 'رقم الهوية / الإقامة', 'رقم الآيبان', 'العملة', 'إجمالي الأجر', 'الاستقطاعات', 'صافي الأجر'];
  const lines = [
    headers.map(csvCell).join(','),
    ...rows.map(({ employee, grossSalary, deductions, netSalary }) => [
      employee.fullName,
      employee.nationalId,
      employee.bankIban || '',
      'SAR',
      grossSalary.toFixed(2),
      deductions.toFixed(2),
      netSalary.toFixed(2),
    ].map(csvCell).join(',')),
  ];
  const blob = new Blob(['\uFEFF', lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `payroll-${new Date().toISOString().slice(0, 7)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Payroll() {
  const employees = useEmployeeStore((state) => state.employees);
  const loadMockEmployees = useEmployeeStore((state) => state.loadMockEmployees);

  useEffect(() => {
    if (employees.length === 0) loadMockEmployees();
  }, [employees.length, loadMockEmployees]);

  const rows = employees.filter((employee) => employee.employmentStatus !== 'Terminated').map(calculatePayroll);
  const totalNet = rows.reduce((sum, row) => sum + row.netSalary, 0);
  const missingIbanCount = employees.filter((employee) => !employee.bankIban).length;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-slate-400">الرئيسية / الرواتب</p>
          <h1 className="text-2xl font-extrabold text-slate-900">مسيرات الرواتب</h1>
          <p className="mt-1 text-sm text-slate-500">احتساب إجمالي الأجور والاستقطاعات وصافي التحويل</p>
        </div>
        <button type="button" onClick={() => exportPayrollCsv(rows)} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50">
          <span aria-hidden="true">⇩</span> تصدير مسير الرواتب
        </button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">عدد الموظفين في المسير</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 shadow-soft">
          <p className="text-sm text-brand-700">إجمالي صافي الرواتب</p>
          <p className="mt-2 text-2xl font-extrabold text-brand-900">{currency.format(totalNet)}</p>
        </div>
      </div>

      {missingIbanCount > 0 && <div role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">يوجد {missingIbanCount} موظف بدون رقم آيبان. راجع بيانات الموظفين قبل تجهيز التحويلات.</div>}

      <div className="mb-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs leading-6 text-sky-800">
        معدل التأمينات في هذا العرض التجريبي ثابت عند {GOSI_RATE}% من الأساسي وبدل السكن للسعودي، ولا يطبق على غير السعودي. ملف CSV ملخص للتحويل البنكي ولا يمثل ملف حماية الأجور الرسمي.
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-800">تفاصيل مسير الرواتب</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">ريال سعودي</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-right text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500">
              <tr><th className="px-5 py-3.5">اسم الموظف</th><th className="px-4 py-3.5">رقم الحساب البنكي (IBAN)</th><th className="px-4 py-3.5">الإجمالي</th><th className="px-4 py-3.5">الاستقطاعات</th><th className="px-5 py-3.5">الصافي</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ employee, grossSalary, deductions, netSalary }) => (
                <tr key={employee.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-bold text-slate-800">{employee.fullName}</td>
                  <td dir="ltr" className="px-4 py-4 text-right font-medium text-slate-600">{employee.bankIban || <span dir="rtl" className="text-amber-700">غير مضاف</span>}</td>
                  <td className="px-4 py-4 text-slate-700">{currency.format(grossSalary)}</td>
                  <td className="px-4 py-4 text-rose-600">{currency.format(deductions)}</td>
                  <td className="px-5 py-4 font-extrabold text-brand-700">{currency.format(netSalary)}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400">لا يوجد موظفون في المسير حالياً.</td></tr>}
            </tbody>
            {rows.length > 0 && <tfoot className="border-t-2 border-slate-100 bg-slate-50 font-extrabold text-slate-800"><tr><td colSpan={2} className="px-5 py-4">الإجمالي</td><td className="px-4 py-4">{currency.format(rows.reduce((sum, row) => sum + row.grossSalary, 0))}</td><td className="px-4 py-4 text-rose-600">{currency.format(rows.reduce((sum, row) => sum + row.deductions, 0))}</td><td className="px-5 py-4 text-brand-700">{currency.format(totalNet)}</td></tr></tfoot>}
          </table>
        </div>
      </div>
    </section>
  );
}
