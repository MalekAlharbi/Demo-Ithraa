export type AssetType = 'سيارة' | 'لابتوب' | 'سلفة مالية';
export type AssetStatus = 'Active' | 'Returned' | 'Lost';

export interface Asset {
  id: string;
  employeeId: string;
  type: AssetType;
  description: string;
  serialNumber: string;
  assignedAt: string;
  status: AssetStatus;
}

export type AssetInput = Omit<Asset, 'id'>;
