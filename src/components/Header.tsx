import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isAccountMenuOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setIsAccountMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
        accountButtonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  return (
    <header className="relative flex min-h-[76px] items-center justify-between border-b border-brand-100 bg-white px-5 sm:px-8">
      <span aria-hidden="true" className="absolute inset-y-0 right-0 w-1 bg-brand-500" />
      <div>
        <p className="text-sm font-bold text-slate-800">مرحباً بك</p>
        <p className="mt-0.5 text-xs text-slate-400">إليك ملخص أعمالك اليوم</p>
      </div>

      <div className="relative" ref={accountMenuRef}>
        <button
          ref={accountButtonRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={isAccountMenuOpen}
          aria-controls="account-menu"
          onClick={() => setIsAccountMenuOpen((open) => !open)}
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-right transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 sm:gap-3 sm:px-3"
        >
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-100">أع</span>
          <span className="hidden sm:block">
            <span className="block text-sm font-bold text-slate-700">أحمد العتيبي</span>
            <span className="mt-0.5 block text-xs text-slate-400">مدير الموارد البشرية</span>
          </span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-4 text-slate-400 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} fill="none">
            <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isAccountMenuOpen && (
          <div id="account-menu" role="menu" aria-label="قائمة حساب المستخدم" className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-card">
            <div className="border-b border-slate-100 px-4 pb-3 pt-2 sm:hidden">
              <p className="text-sm font-bold text-slate-700">أحمد العتيبي</p>
              <p className="mt-0.5 text-xs text-slate-400">مدير الموارد البشرية</p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => setIsAccountMenuOpen(false)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:bg-rose-50"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
                <path d="M8 3.5H4.8a1.3 1.3 0 0 0-1.3 1.3v10.4a1.3 1.3 0 0 0 1.3 1.3H8m4-3.2 3.3-3.3L12 6.7m3.3 3.3H7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
