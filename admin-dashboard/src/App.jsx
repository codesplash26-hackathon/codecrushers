import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import DashboardHome from './pages/DashboardHome';
import ServicesManagement from './pages/ServicesManagement';
import RouteScheduleManagement from './pages/RouteScheduleManagement';
import StopsManagement from './pages/StopsManagement';
import SchedulesManagement from './pages/SchedulesManagement';
import DisruptionManagement from './pages/DisruptionManagement';
import MonitoringPage from './pages/MonitoringPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminSecurityPage from './pages/AdminSecurityPage';
import DriverApplicationsPage from './pages/DriverApplicationsPage';
import DriverManagementPage from './pages/DriverManagementPage';
import VehicleManagementPage from './pages/VehicleManagementPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

import './App.css';

const AdminConsole = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabTitles = {
    dashboard: 'Transportation Overview',
    disruptions: 'Service Disruptions',
    routes: 'Routes & Schedules',
    analytics: 'Analytics Dashboard',
    services: 'Transport Services',
    stops: 'Stops & Stations',
    schedules: 'Schedule Management',
    monitoring: 'Data Monitoring',
    security: 'Admin & Security',
    driver_apps: 'Driver Applications',
    drivers: 'Driver Management',
    vehicles: 'Vehicle Management',
    passengers: 'Passengers Management',
    settings: 'System Configuration',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome setActiveTab={setActiveTab} />;
      case 'disruptions':
        return <DisruptionManagement />;
      case 'routes':
        return <RouteScheduleManagement />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'services':
        return <ServicesManagement />;
      case 'stops':
        return <StopsManagement />;
      case 'schedules':
        return <SchedulesManagement />;
      case 'monitoring':
        return <MonitoringPage />;
      case 'security':
        return <AdminSecurityPage />;
      case 'driver_apps':
        return <DriverApplicationsPage />;
      case 'drivers':
        return <DriverManagementPage />;
      case 'vehicles':
        return <VehicleManagementPage />;
      case 'users':
      case 'passengers':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="dashboard-layout fade-in">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Navbar activeTabTitle={tabTitles[activeTab]} setActiveTab={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
};

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        Loading Admin Operations Console...
      </div>
    );
  }

  return isAuthenticated ? <AdminConsole /> : <Login />;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
