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
  LogOut,
  Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      <div className="sidebar-header">
        <div className="login-logo-icon" style={{ width: '32px', height: '32px', fontSize: '16px' }}>
          <Navigation size={18} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="login-logo-text" style={{ fontSize: '18px', lineHeight: '1.2' }}>
            Best<span>Route</span>
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Admin Console</div>
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
        <div className="user-pill">
          <div className="avatar-blue">AD</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Admin User'}</div>
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
