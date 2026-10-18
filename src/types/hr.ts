export type EmployeeNationality = 'سعودي' | 'غير سعودي';
export type EmploymentStatus = 'Active' | 'Terminated';

export interface Employee {
  /** Internal application identifier. */
  id: string;
  fullName: string;
  nationalId: string;
  bankIban: string;
  idExpiryDate: string;
  nationality: EmployeeNationality;
  jobTitle: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  /** GOSI deduction percentage, from 0 to 100. */
  gosiRate: number;
  employmentStatus?: EmploymentStatus;
  /** Outstanding leave days that have not been compensated at termination. */
  uncompensatedLeaveDays?: number;
}

export type EmployeeInput = Omit<Employee, 'id'>;
