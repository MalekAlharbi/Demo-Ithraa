import { create } from 'zustand';
import type { Employee, EmployeeInput } from '../types/hr';

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (employee: EmployeeInput) => void;
  updateEmployee: (id: string, employee: EmployeeInput) => void;
  loadMockEmployees: () => void;
}

const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    fullName: 'نورة بنت خالد العتيبي',
    nationalId: '1023456789',
    bankIban: 'SA0380000000608010167519',
    idExpiryDate: '2028-06-15',
    nationality: 'سعودي',
    jobTitle: 'أخصائية موارد بشرية',
    basicSalary: 12000,
    housingAllowance: 3000,
    transportAllowance: 800,
    gosiRate: 9.75,
  },
  {
    id: 'emp-2',
    fullName: 'محمد علي حسن',
    nationalId: '2456789012',
    bankIban: 'SA0380000000608010167527',
    idExpiryDate: '2025-02-01',
    nationality: 'غير سعودي',
    jobTitle: 'محاسب',
    basicSalary: 8500,
    housingAllowance: 2000,
    transportAllowance: 600,
    gosiRate: 0,
    employmentStatus: 'Terminated',
    uncompensatedLeaveDays: 5,
  },
  {
    id: 'emp-3',
    fullName: 'عبدالرحمن بن سعد الدوسري',
    nationalId: '1098765432',
    bankIban: 'SA0380000000608010167535',
    idExpiryDate: '2027-11-30',
    nationality: 'سعودي',
    jobTitle: 'مدير العمليات',
    basicSalary: 18000,
    housingAllowance: 4500,
    transportAllowance: 1200,
    gosiRate: 9.75,
  },
];

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  addEmployee: (employee) => set((state) => ({
    employees: [...state.employees, { ...employee, id: crypto.randomUUID() }],
  })),
  updateEmployee: (id, employee) => set((state) => ({
    employees: state.employees.map((current) => current.id === id ? { ...current, ...employee, id } : current),
  })),
  loadMockEmployees: () => set({ employees: mockEmployees }),
}));
