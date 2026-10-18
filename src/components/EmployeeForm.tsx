import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Employee, EmployeeInput } from '../types/hr';
import { useEmployeeStore } from '../store/employeeStore';

const employeeSchema = z.object({
  fullName: z.string().trim().min(2, 'أدخل اسم الموظف').max(100, 'الاسم طويل جداً'),
  nationalId: z.string().regex(/^\d{10}$/, 'رقم الهوية أو الإقامة يجب أن يتكون من 10 أرقام'),
  bankIban: z.string().trim().regex(/^SA\d{22}$/i, 'أدخل آيباناً سعودياً صحيح البنية (SA متبوعاً بـ 22 رقماً)'),
  idExpiryDate: z.string().min(1, 'حدد تاريخ انتهاء الهوية أو الإقامة'),
  nationality: z.enum(['سعودي', 'غير سعودي']),
  jobTitle: z.string().trim().min(2, 'أدخل المسمى الوظيفي'),
  basicSalary: z.coerce.number().min(0, 'الراتب الأساسي لا يمكن أن يكون سالباً'),
  housingAllowance: z.coerce.number().min(0, 'بدل السكن لا يمكن أن يكون سالباً'),
  transportAllowance: z.coerce.number().min(0, 'بدل النقل لا يمكن أن يكون سالباً'),
  gosiRate: z.coerce.number().min(0, 'النسبة لا يمكن أن تقل عن 0').max(100, 'النسبة لا يمكن أن تتجاوز 100'),
}).superRefine((employee, context) => {
  const expectedFirstDigit = employee.nationality === 'سعودي' ? '1' : '2';
  if (employee.nationalId.length === 10 && !employee.nationalId.startsWith(expectedFirstDigit)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['nationalId'],
      message: employee.nationality === 'سعودي'
        ? 'رقم هوية المواطن السعودي يجب أن يبدأ بالرقم 1'
        : 'رقم إقامة غير السعودي يجب أن يبدأ بالرقم 2',
    });
  }
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
}

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100';

export default function EmployeeForm({ employee, onClose }: EmployeeFormProps) {
  const addEmployee = useEmployeeStore((state) => state.addEmployee);
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<z.input<typeof employeeSchema>, unknown, EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? {
      fullName: employee.fullName,
      nationalId: employee.nationalId,
      bankIban: employee.bankIban,
      idExpiryDate: employee.idExpiryDate,
      nationality: employee.nationality,
      jobTitle: employee.jobTitle,
      basicSalary: employee.basicSalary,
      housingAllowance: employee.housingAllowance,
      transportAllowance: employee.transportAllowance,
      gosiRate: employee.gosiRate,
    } : {
      fullName: '', nationalId: '', bankIban: '', idExpiryDate: '', nationality: 'سعودي', jobTitle: '',
      basicSalary: 0, housingAllowance: 0, transportAllowance: 0, gosiRate: 9.75,
    },
  });
  const nationality = watch('nationality');

  useEffect(() => {
    if (!employee) setValue('gosiRate', nationality === 'سعودي' ? 9.75 : 0);
  }, [employee, nationality, setValue]);

  const onSubmit = (values: EmployeeFormValues) => {
    const employeeInput: EmployeeInput = values;
    if (employee) updateEmployee(employee.id, employeeInput);
    else addEmployee(employeeInput);
    onClose();
  };

  const fieldError = (name: keyof EmployeeFormValues) => errors[name]?.message && (
    <p className="mt-1 text-xs text-rose-600" role="alert">{String(errors[name]?.message)}</p>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="employee-form-title" className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="employee-form-title" className="text-lg font-extrabold text-slate-900">{employee ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h2>
            <p className="mt-1 text-sm text-slate-400">أدخل البيانات الأساسية والمالية للموظف</p>
          </div>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100">×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="max-h-[calc(100vh-11rem)] space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">اسم الموظف<input {...register('fullName')} className={inputClass} placeholder="الاسم كما يظهر في الوثائق" />{fieldError('fullName')}</label>
            <label className="text-sm font-semibold text-slate-700">الجنسية<select {...register('nationality')} className={inputClass}><option value="سعودي">سعودي</option><option value="غير سعودي">غير سعودي</option></select>{fieldError('nationality')}</label>
            <label className="text-sm font-semibold text-slate-700">رقم الهوية / الإقامة<input {...register('nationalId')} inputMode="numeric" maxLength={10} dir="ltr" className={`${inputClass} text-right`} placeholder={nationality === 'سعودي' ? '1xxxxxxxxx' : '2xxxxxxxxx'} />{fieldError('nationalId')}</label>
            <label className="text-sm font-semibold text-slate-700">رقم الآيبان البنكي<input {...register('bankIban')} dir="ltr" className={`${inputClass} text-right uppercase`} placeholder="SAxxxxxxxxxxxxxxxxxxxxxx" />{fieldError('bankIban')}</label>
            <label className="text-sm font-semibold text-slate-700">تاريخ انتهاء الهوية / الإقامة<input {...register('idExpiryDate')} type="date" className={inputClass} />{fieldError('idExpiryDate')}</label>
            <label className="text-sm font-semibold text-slate-700">المسمى الوظيفي<input {...register('jobTitle')} className={inputClass} placeholder="مثال: أخصائي موارد بشرية" />{fieldError('jobTitle')}</label>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <h3 className="mb-4 text-sm font-bold text-slate-800">البيانات المالية (ر.س)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">الراتب الأساسي<input {...register('basicSalary')} type="number" min="0" step="0.01" className={inputClass} />{fieldError('basicSalary')}</label>
              <label className="text-sm font-semibold text-slate-700">بدل السكن<input {...register('housingAllowance')} type="number" min="0" step="0.01" className={inputClass} />{fieldError('housingAllowance')}</label>
              <label className="text-sm font-semibold text-slate-700">بدل النقل<input {...register('transportAllowance')} type="number" min="0" step="0.01" className={inputClass} />{fieldError('transportAllowance')}</label>
              <label className="text-sm font-semibold text-slate-700">خصم التأمينات الاجتماعية (GOSI %)<input {...register('gosiRate')} type="number" min="0" max="100" step="0.01" className={inputClass} />{fieldError('gosiRate')}</label>
            </div>
          </div>
          <div className="flex justify-start gap-3 border-t border-slate-100 pt-4">
            <button disabled={isSubmitting} type="submit" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50">{employee ? 'حفظ التعديلات' : 'إضافة الموظف'}</button>
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">إلغاء</button>
          </div>
        </form>
      </section>
    </div>
  );
}
