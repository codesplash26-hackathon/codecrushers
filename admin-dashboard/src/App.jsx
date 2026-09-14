import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardHome from './pages/DashboardHome';
import ServicesManagement from './pages/ServicesManagement';
import RouteScheduleManagement from './pages/RouteScheduleManagement';
import DisruptionManagement from './pages/DisruptionManagement';
import TransitDataMonitoring from './pages/TransitDataMonitoring';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Navbar />
          <div style={{ padding: '24px' }}>
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/services" element={<ServicesManagement />} />
              <Route path="/routes-schedules" element={<RouteScheduleManagement />} />
              <Route path="/disruptions" element={<DisruptionManagement />} />
              <Route path="/data-monitoring" element={<TransitDataMonitoring />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
