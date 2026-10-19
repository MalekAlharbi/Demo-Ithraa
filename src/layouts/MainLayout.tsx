import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div dir="rtl" className="app-shell min-h-screen text-slate-800 lg:flex">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main className="app-main relative flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
        <footer className="border-t border-slate-100 px-8 py-4 text-xs text-slate-400">© 2026 إثراء الخير — جميع الحقوق محفوظة</footer>
      </div>
    </div>
  );
}
