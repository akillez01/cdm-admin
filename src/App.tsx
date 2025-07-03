import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import Dashboard from './pages/Dashboard';
import DashboardEnhanced from './pages/DashboardEnhanced';
import Events from './pages/Events';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';
import Members from './pages/Members';
import RealtimeReports from './pages/RealtimeReports';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardEnhanced />} />
                <Route path="dashboard-old" element={<Dashboard />} />
                <Route path="members" element={<Members />} />
                <Route path="finance" element={<Finance />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="events" element={<Events />} />
                <Route path="reports" element={<Reports />} />
                <Route path="realtime" element={<RealtimeReports />} />
                <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ProtectedRoute>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;