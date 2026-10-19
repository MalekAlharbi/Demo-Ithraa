export default function Header() {
  return (
    <header className="relative flex min-h-[76px] items-center justify-between overflow-hidden border-b border-brand-100 bg-white px-5 sm:px-8">
      <span aria-hidden="true" className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-turquoise-500 to-brand-500" />
      <div>
        <p className="text-sm font-bold text-slate-800">مرحباً بك 👋</p>
        <p className="mt-0.5 text-xs text-slate-400">إليك ملخص أعمالك اليوم</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-left sm:block">
          <p className="text-sm font-bold text-slate-700">أحمد العتيبي</p>
          <p className="text-xs text-slate-400">مدير الموارد البشرية</p>
        </div>
        <div aria-label="صورة أحمد العتيبي" className="grid size-10 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-100">أع</div>
        <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
          تسجيل الخروج
        </button>
      </div>
    </header>
  );
}
