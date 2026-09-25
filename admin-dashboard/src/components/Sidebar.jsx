import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Map, 
  BarChart3, 
  Bus, 
  MapPin, 
  Clock, 
  Radio, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Truck, 
  Users, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'disruptions', label: 'Disruptions', icon: AlertTriangle, badge: '7' },
    { id: 'routes', label: 'Routes', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Bus },
    { id: 'stops', label: 'Stops & Stations', icon: MapPin },
    { id: 'schedules', label: 'Schedules', icon: Clock },
    { id: 'monitoring', label: 'Monitoring', icon: Radio, badge: '1' },
    { id: 'security', label: 'Admin & Security', icon: ShieldCheck },
    { id: 'driver_apps', label: 'Driver Applications', icon: FileText, badge: '2' },
    { id: 'drivers', label: 'Driver Management', icon: UserCheck },
    { id: 'vehicles', label: 'Vehicle Management', icon: Truck },
    { id: 'passengers', label: 'Passengers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
        <img 
          src={logoImg} 
          alt="BestRoute Logo" 
          style={{ height: '54px', width: 'auto', objectFit: 'contain' }} 
        />
        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', paddingLeft: '4px' }}>
          Admin Console
        </div>
      </div>

      <div className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="sidebar-item-left">
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div
          className="user-pill"
          onClick={() => setActiveTab('security')}
          style={{ cursor: 'pointer' }}
          title="Open Admin Profile"
        >
          <div className="avatar-blue">AD</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'BestRoute Admin'}</div>
            <div className="user-role">{user?.email || 'admin@bestroute.lk'}</div>
          </div>
        </div>
        <button 
          onClick={logout} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'transparent', 
            color: '#EF4444', 
            fontSize: '12px', 
            fontWeight: '700', 
            marginTop: '12px',
            cursor: 'pointer' 
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
