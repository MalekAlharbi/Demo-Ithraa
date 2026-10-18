import { create } from 'zustand';
import type { Asset, AssetInput, AssetStatus } from '../types/custody';

interface CustodyStore {
  assets: Asset[];
  addAsset: (asset: AssetInput) => void;
  updateAssetStatus: (id: string, status: AssetStatus) => void;
  loadMockAssets: () => void;
}

const mockAssets: Asset[] = [
  { id: 'asset-1', employeeId: 'emp-1', type: 'لابتوب', description: 'MacBook Pro 14 بوصة', serialNumber: 'MBP-2025-1042', assignedAt: '2025-09-01', status: 'Active' },
  { id: 'asset-2', employeeId: 'emp-1', type: 'سيارة', description: 'تويوتا كامري — لوحة أ ب ج 1234', serialNumber: 'VIN-92K4-3310', assignedAt: '2025-08-15', status: 'Active' },
  { id: 'asset-3', employeeId: 'emp-2', type: 'لابتوب', description: 'Dell Latitude 5450', serialNumber: 'DL-5450-7821', assignedAt: '2025-10-10', status: 'Lost' },
  { id: 'asset-4', employeeId: 'emp-3', type: 'سلفة مالية', description: 'سلفة سفر لمهمة عمل', serialNumber: 'ADV-2025-008', assignedAt: '2025-11-02', status: 'Active' },
];

export const useCustodyStore = create<CustodyStore>((set) => ({
  assets: [],
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, { ...asset, id: crypto.randomUUID() }] })),
  updateAssetStatus: (id, status) => set((state) => ({
    assets: state.assets.map((asset) => asset.id === id ? { ...asset, status } : asset),
  })),
  loadMockAssets: () => set({ assets: mockAssets }),
}));
