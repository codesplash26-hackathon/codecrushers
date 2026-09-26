import React, { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Bell, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';

const Navbar = ({ activeTabTitle, setActiveTab }) => {
  // 1. Dark Mode State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Kandy Express Delayed',
      message: 'Signal failure at Peradeniya causing 20-min delay.',
      time: '2m ago',
      type: 'delay',
      dotColor: '#F59E0B',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Route 654 Diverted',
      message: 'Road maintenance along Kandy Rd. Buses rerouted.',
      time: '8m ago',
      type: 'divert',
      dotColor: '#F59E0B',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Intercity 55 Cancelled',
      message: 'Colombo Fort service cancelled due to locomotive maintenance.',
      time: '15m ago',
      type: 'cancel',
      dotColor: '#EF4444',
      unread: true,
    },
    {
      id: 'notif-4',
      title: 'Route 120 Slow Traffic',
      message: 'Traffic congestion at Nugegoda junction causing 10-min delay.',
      time: '22m ago',
      type: 'delay',
      dotColor: '#F59E0B',
      unread: true,
    },
    {
      id: 'notif-5',
      title: 'Coastal Express Delay',
      message: 'Panadura level-crossing delay of 25 minutes reported.',
      time: '45m ago',
      type: 'delay',
      dotColor: '#F59E0B',
      unread: true,
    },
    {
      id: 'notif-6',
      title: 'Galle Shuttle Rerouted',
      message: 'Temporary detour active around Hikkaduwa station.',
      time: '1h ago',
      type: 'divert',
      dotColor: '#F59E0B',
      unread: true,
    },
    {
      id: 'notif-7',
      title: 'Matale Local Delay',
      message: 'Platform clearance delay of 12 mins at Katugastota.',
      time: '1h ago',
      type: 'delay',
      dotColor: '#10B981',
      unread: true,
    },
  ]);

  const notifRef = useRef(null);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationItemClick = () => {
    setIsNotificationsOpen(false);
    if (setActiveTab) setActiveTab('disruptions');
  };

  // 3. Profile Click Handler
  const handleProfileClick = () => {
    if (setActiveTab) {
      setActiveTab('security');
    }
  };

  return (
    <div className="navbar" style={{ position: 'relative' }}>
      <div className="navbar-title-box">
        <div className="navbar-title">
          {activeTabTitle || 'Transportation Overview'}
        </div>
        <div className="navbar-subtitle">
          Monday, 15 September 2026 · Colombo, Sri Lanka
        </div>
      </div>

      <div className="navbar-actions">
        {/* Search input */}
        <div className="search-box">
          <Search size={16} className="text-slate-400" />
          <input type="text" className="search-input" placeholder="Search services..." />
        </div>

        {/* Dark Mode Toggle Button */}
        <div
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={18} color="#FBBF24" />
          ) : (
            <Moon size={18} />
          )}
        </div>

        {/* Notifications Button with Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <div
            className="icon-btn"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            title="System Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="icon-btn-badge">{unreadCount}</span>}
          </div>

          {isNotificationsOpen && (
            <div className="notifications-popover fade-in">
              <div className="notifications-header">
                <div className="notifications-title">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="disruptions-count-badge" style={{ fontSize: '10px' }}>
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2563EB',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notifications-list">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.unread ? 'unread' : ''}`}
                    onClick={handleNotificationItemClick}
                  >
                    <span
                      className="notification-icon-dot"
                      style={{ backgroundColor: notif.dotColor }}
                    />
                    <div className="notification-content">
                      <div className="notification-text">{notif.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        {notif.message}
                      </div>
                      <div className="notification-time">{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notifications-footer">
                <button onClick={handleNotificationItemClick}>
                  View all disruptions →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Icon leading to Profile page */}
        <div
          className="avatar-blue"
          style={{
            width: '36px',
            height: '36px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onClick={handleProfileClick}
          title="Open Admin Profile (Admin & Security)"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        >
          AD
        </div>
      </div>
    </div>
  );
};

export default Navbar;
