export default function Header() {
  return (
    <header className="flex min-h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div>
        <p className="text-sm font-bold text-slate-800">مرحباً بك 👋</p>
        <p className="mt-0.5 text-xs text-slate-400">إليك ملخص أعمالك اليوم</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-left sm:block">
          <p className="text-sm font-bold text-slate-700">أحمد العتيبي</p>
          <p className="text-xs text-slate-400">مدير الموارد البشرية</p>
        </div>
        <div aria-label="صورة أحمد العتيبي" className="grid size-10 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">أع</div>
        <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
          تسجيل الخروج
        </button>
      </div>
    </header>
  );
}
