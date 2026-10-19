import { useCustodyStore } from '../store/custodyStore';
import type { Asset, AssetStatus } from '../types/custody';

interface EmployeeAssetsProps {
  employeeId: string;
  employeeName: string;
}

const statusLabel: Record<AssetStatus, string> = {
  Active: 'مصروفة',
  Returned: 'مُسترجعة',
  Lost: 'مفقودة',
};

const statusClass: Record<AssetStatus, string> = {
  Active: 'bg-brand-50 text-brand-700',
  Returned: 'bg-slate-100 text-slate-600',
  Lost: 'bg-rose-50 text-rose-700',
};

function AssetRow({ asset }: { asset: Asset }) {
  const updateAssetStatus = useCustodyStore((state) => state.updateAssetStatus);
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 first:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-lg" aria-hidden="true">{asset.type === 'سيارة' ? '🚘' : asset.type === 'لابتوب' ? '💻' : 'ر.س'}</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">{asset.description}</p>
          <p className="mt-1 text-xs text-slate-400">{asset.type} · الرقم التسلسلي: <span dir="ltr" className="inline-block">{asset.serialNumber || '—'}</span> · تاريخ التسليم: {new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium' }).format(new Date(`${asset.assignedAt}T00:00:00`))}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[asset.status]}`}>{statusLabel[asset.status]}</span>
        {asset.status === 'Active' && <>
          <button type="button" onClick={() => updateAssetStatus(asset.id, 'Returned')} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">استرجاع</button>
          <button type="button" onClick={() => updateAssetStatus(asset.id, 'Lost')} className="rounded-lg border border-rose-100 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">تسجيل فقدان</button>
        </>}
      </div>
    </li>
  );
}

export default function EmployeeAssets({ employeeId, employeeName }: EmployeeAssetsProps) {
  const allAssets = useCustodyStore((state) => state.assets);
  const assets = allAssets.filter((asset) => asset.employeeId === employeeId);
  return (
    <section className="overflow-hidden brand-card rounded-2xl border border-slate-100 bg-white shadow-soft">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="font-bold text-slate-800">{employeeName}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{assets.length} عهدة</span>
      </div>
      {assets.length ? <ul>{assets.map((asset) => <AssetRow key={asset.id} asset={asset} />)}</ul> : <p className="border-t border-slate-100 px-5 py-6 text-sm text-slate-400">لا توجد عهد مسجلة لهذا الموظف.</p>}
    </section>
  );
}
