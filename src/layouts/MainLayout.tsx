import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800 lg:flex">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
        <footer className="px-8 py-4 text-xs text-slate-400">© 2026 روافد — جميع الحقوق محفوظة</footer>
      </div>
    </div>
  );
}
