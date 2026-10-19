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
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700" aria-hidden="true">
          {asset.type === 'سيارة' && <svg viewBox="0 0 24 24" className="size-5" fill="none"><path d="m5 11 1.5-4h11L19 11l1.5 2v5h-17v-5L5 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M4 13h16M7 18v1m10-1v1M7 14.5h.01M17 14.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
          {asset.type === 'لابتوب' && <svg viewBox="0 0 24 24" className="size-5" fill="none"><rect x="5" y="4" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><path d="M3 19h18l-1.5-3H4.5L3 19Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>}
          {asset.type === 'سلفة مالية' && <span className="text-xs font-extrabold">ر.س</span>}
        </span>
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
