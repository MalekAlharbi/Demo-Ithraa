import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import EmployeesList from './pages/EmployeesList';
import Payroll from './pages/Payroll';
import AssetsDashboard from './pages/AssetsDashboard';
import Clearance from './pages/Clearance';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<EmployeesList />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="custody" element={<AssetsDashboard />} />
        <Route path="clearance" element={<Clearance />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
