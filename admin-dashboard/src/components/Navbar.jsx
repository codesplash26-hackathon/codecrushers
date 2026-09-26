import React, { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Bell, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { adminService } from '../services/adminService';

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

  // Dynamic Date State
  const [currentDateFormatted, setCurrentDateFormatted] = useState(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  useEffect(() => {
    const updateDate = () => {
      setCurrentDateFormatted(
        new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateDate();
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, []);

  // 2. Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchLiveNotifications = async () => {
    try {
      const res = await adminService.getNotifications();
      let list = [];
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        list = res.data;
      }

      // Check if there is an offline/local submission from mobile app for driver app
      try {
        const localSub = localStorage.getItem('bestroute_latest_driver_app');
        if (localSub) {
          const parsed = JSON.parse(localSub);
          if (parsed && parsed.fullName) {
            const exists = list.some(
              (n) =>
                n.title?.includes(parsed.applicationId || '') ||
                n.message?.includes(parsed.fullName) ||
                n._id === `local-${parsed.applicationId}`
            );
            if (!exists) {
              list = [
                {
                  _id: `local-${parsed.applicationId || Date.now()}`,
                  type: 'journey_change',
                  title: `New Driver Application (${parsed.applicationId || 'Pending'})`,
                  message: `${parsed.fullName} applied for ${parsed.vehicleType || 'Taxi'} (${parsed.vehicleNo || 'Vehicle'}). Review required.`,
                  priority: 'HIGH',
                  isRead: false,
                  createdAt: new Date().toISOString(),
                },
                ...list,
              ];
            }
          }
        }
      } catch {
        // ignore
      }

      if (list.length > 0) {
        const formatted = list.map((n) => {
          let timeAgo = 'Just now';
          if (n.createdAt) {
            const diffMin = Math.floor((Date.now() - new Date(n.createdAt).getTime()) / 60000);
            if (diffMin < 1) timeAgo = 'Just now';
            else if (diffMin < 60) timeAgo = `${diffMin}m ago`;
            else if (diffMin < 1440) timeAgo = `${Math.floor(diffMin / 60)}h ago`;
            else timeAgo = `${Math.floor(diffMin / 1440)}d ago`;
          }

          let dotColor = '#3B82F6';
          const p = (n.priority || '').toUpperCase();
          const t = (n.type || '').toLowerCase();
          if (p === 'CRITICAL' || t === 'cancel') dotColor = '#EF4444';
          else if (p === 'HIGH' || t === 'delay') dotColor = '#F59E0B';
          else if (t === 'journey_change') dotColor = '#8B5CF6';
          else if (n.isRead) dotColor = '#94A3B8';

          return {
            id: n._id || n.id,
            title: n.title,
            message: n.message,
            time: timeAgo,
            unread: !n.isRead,
            dotColor,
            type: n.type,
            raw: n,
          };
        });
        setNotifications(formatted);
      }
    } catch (err) {
      console.warn('Failed to load admin notifications:', err?.message);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
    const interval = setInterval(fetchLiveNotifications, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false, dotColor: '#94A3B8' })));
    try {
      await adminService.markAllNotificationsRead();
      await fetchLiveNotifications();
    } catch (err) {
      console.warn('Failed to mark all notifications read:', err);
    }
  };

  const handleNotificationItemClick = async (notif) => {
    if (notif && notif.id && !notif.id.startsWith('local-')) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, unread: false, dotColor: '#94A3B8' } : n))
      );
      try {
        await adminService.markNotificationRead(notif.id);
      } catch {
        // ignore
      }
    } else if (notif && notif.id) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, unread: false, dotColor: '#94A3B8' } : n))
      );
    }

    setIsNotificationsOpen(false);

    const titleLower = ((notif && notif.title) || '').toLowerCase();
    const msgLower = ((notif && notif.message) || '').toLowerCase();

    if (titleLower.includes('driver') || msgLower.includes('driver')) {
      if (setActiveTab) setActiveTab('driver_apps');
    } else if (titleLower.includes('passenger') || msgLower.includes('passenger')) {
      if (setActiveTab) setActiveTab('passengers');
    } else if (titleLower.includes('route') && !titleLower.includes('delay') && !titleLower.includes('traffic')) {
      if (setActiveTab) setActiveTab('routes');
    } else {
      if (setActiveTab) setActiveTab('disruptions');
    }
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
          {currentDateFormatted} · Colombo, Sri Lanka
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
                {notifications.length === 0 ? (
                  <div style={{ padding: '28px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                    No notifications right now
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${notif.unread ? 'unread' : ''}`}
                      onClick={() => handleNotificationItemClick(notif)}
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
                  ))
                )}
              </div>

              <div className="notifications-footer">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    if (setActiveTab) setActiveTab('disruptions');
                  }}
                >
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
