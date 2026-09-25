import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  Database, 
  Globe, 
  Bell, 
  Shield, 
  Save, 
  HardDrive, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('General');

  // General Settings State
  const [systemName, setSystemName] = useState('BestRoute LK Multimodal Admin');
  const [currency, setCurrency] = useState('LKR (Rs.)');
  const [timezone, setTimezone] = useState('Asia/Colombo (GMT+05:30)');
  const [language, setLanguage] = useState('English');
  const [autoRefreshRate, setAutoRefreshRate] = useState('30');

  // Backend & Algorithm Settings State
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api');
  const [dbHost, setDbHost] = useState('mongodb+srv://admin:cluster@bestroute.lk');
  const [gtfsSyncInterval, setGtfsSyncInterval] = useState('15');
  const [weightTime, setWeightTime] = useState(50);
  const [weightCost, setWeightCost] = useState(30);
  const [weightTransfers, setWeightTransfers] = useState(20);

  // Notification Settings State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [disruptionPush, setDisruptionPush] = useState(true);
  const [driverAppNotify, setDriverAppNotify] = useState(true);
  const [ratingThreshold, setRatingThreshold] = useState('4.0');

  // Security & System Maintenance State
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [require2FA, setRequire2FA] = useState(false);
  const [ipWhitelisting, setIpWhitelisting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState('Today at 03:00 AM');

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    addToast('General system preferences saved successfully!', 'success');
  };

  const handleSaveBackend = (e) => {
    e.preventDefault();
    addToast('Backend API and optimization weights updated!', 'success');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    addToast('Notification alert rules updated!', 'success');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    addToast('Security & access policies saved!', 'success');
  };

  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setLastBackupTime('Just now');
      addToast('Database snapshot created and stored securely!', 'success');
    }, 1200);
  };

  const handleFlushCache = () => {
    addToast('System Redis cache & transit routes flushed successfully!', 'info');
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="page-title">System Settings & Configuration</h1>
          <p className="page-desc">Manage API connections, routing algorithm weights, alert triggers, and security options</p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        <button 
          className={`pill-btn ${activeTab === 'General' ? 'active' : ''}`}
          onClick={() => setActiveTab('General')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Globe size={15} />
          <span>General</span>
        </button>

        <button 
          className={`pill-btn ${activeTab === 'Backend & Routing' ? 'active' : ''}`}
          onClick={() => setActiveTab('Backend & Routing')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Server size={15} />
          <span>Backend & Routing</span>
        </button>

        <button 
          className={`pill-btn ${activeTab === 'Notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('Notifications')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Bell size={15} />
          <span>Notifications</span>
        </button>

        <button 
          className={`pill-btn ${activeTab === 'Security & Backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('Security & Backup')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Shield size={15} />
          <span>Security & Backup</span>
        </button>
      </div>

      {/* Tab 1: General Preferences */}
      {activeTab === 'General' && (
        <form onSubmit={handleSaveGeneral} style={{ maxWidth: '680px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="#2563EB" />
              General System Preferences
            </h3>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">CONSOLE BRANDING / SYSTEM NAME</label>
              <input 
                type="text" 
                className="form-input" 
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">DEFAULT CURRENCY</label>
                <select className="form-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="LKR (Rs.)">LKR (Rs. - Sri Lankan Rupee)</option>
                  <option value="USD ($)">USD ($ - US Dollar)</option>
                  <option value="EUR (€)">EUR (€ - Euro)</option>
                </select>
              </div>

              <div>
                <label className="form-label">TIMEZONE</label>
                <select className="form-input" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="Asia/Colombo (GMT+05:30)">Asia/Colombo (GMT+05:30)</option>
                  <option value="UTC (GMT+00:00)">UTC (GMT+00:00)</option>
                  <option value="Asia/Singapore (GMT+08:00)">Asia/Singapore (GMT+08:00)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label className="form-label">LANGUAGE</label>
                <select className="form-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="English">English (US)</option>
                  <option value="Sinhala">Sinhala (සිංහල)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                </select>
              </div>

              <div>
                <label className="form-label">AUTO-REFRESH INTERVAL (SEC)</label>
                <select className="form-input" value={autoRefreshRate} onChange={(e) => setAutoRefreshRate(e.target.value)}>
                  <option value="15">15 Seconds</option>
                  <option value="30">30 Seconds</option>
                  <option value="60">60 Seconds</option>
                  <option value="0">Disabled</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>
                <Save size={16} /> Save Preferences
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Backend & Routing Optimization */}
      {activeTab === 'Backend & Routing' && (
        <form onSubmit={handleSaveBackend} style={{ maxWidth: '680px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={18} color="#2563EB" />
              Backend API & Database Connection
            </h3>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">BACKEND BASE API URL</label>
              <input 
                type="text" 
                className="form-input" 
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">DATABASE HOST URI</label>
              <input 
                type="text" 
                className="form-input" 
                value={dbHost}
                onChange={(e) => setDbHost(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">GTFS REALTIME SYNC FREQUENCY (MINUTES)</label>
              <input 
                type="number" 
                className="form-input" 
                value={gtfsSyncInterval}
                onChange={(e) => setGtfsSyncInterval(e.target.value)}
                required
              />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="#2563EB" />
              Route Optimization Algorithm Weights
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>TIME EFFICIENCY WEIGHT</label>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#2563EB' }}>{weightTime}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weightTime} 
                onChange={(e) => setWeightTime(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#2563EB' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>FARE COST SAVINGS WEIGHT</label>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#16A34A' }}>{weightCost}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weightCost} 
                onChange={(e) => setWeightCost(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#16A34A' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>MINIMUM TRANSFERS PENALTY</label>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#D97706' }}>{weightTransfers}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weightTransfers} 
                onChange={(e) => setWeightTransfers(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D97706' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>
                <Save size={16} /> Save Backend Settings
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Notifications & Alert Triggers */}
      {activeTab === 'Notifications' && (
        <form onSubmit={handleSaveNotifications} style={{ maxWidth: '680px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#2563EB" />
              Alert Rules & Dispatch Notifications
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Service Disruption Alerts</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Notify operations team on high-impact transit delays & cancellations</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={disruptionPush}
                  onChange={(e) => setDisruptionPush(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Driver Application Notifications</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Send instant alert when a new taxi/tuk-tuk driver submits registration</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={driverAppNotify}
                  onChange={(e) => setDriverAppNotify(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Email Reports & Digest</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Receive daily passenger trip analytics & service uptime summary</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">LOW DRIVER RATING WARNING THRESHOLD</label>
              <select className="form-input" value={ratingThreshold} onChange={(e) => setRatingThreshold(e.target.value)}>
                <option value="4.5">Below 4.5 ⭐ (Strict)</option>
                <option value="4.0">Below 4.0 ⭐ (Standard)</option>
                <option value="3.5">Below 3.5 ⭐ (Lenient)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>
                <Save size={16} /> Save Alert Settings
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Security & Backup */}
      {activeTab === 'Security & Backup' && (
        <div style={{ maxWidth: '680px' }}>
          <form onSubmit={handleSaveSecurity}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="#2563EB" />
                Security & Access Control
              </h3>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">ADMIN INACTIVITY TIMEOUT (MINUTES)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Enforce Two-Factor Auth (2FA)</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Require authenticator app code on admin login</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={require2FA}
                    onChange={(e) => setRequire2FA(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>IP Whitelisting</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Restrict admin console access to verified office IP addresses</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={ipWhitelisting}
                    onChange={(e) => setIpWhitelisting(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>
                  <Save size={16} /> Save Security Policies
                </button>
              </div>
            </div>
          </form>

          {/* Database Backup & Maintenance Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardDrive size={18} color="#2563EB" />
              Database Backup & Maintenance
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Last automatic backup: <strong>{lastBackupTime}</strong></p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn-blue-action" 
                style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={handleTriggerBackup}
                disabled={isBackingUp}
              >
                <RefreshCw size={15} />
                <span>{isBackingUp ? 'Creating Snapshot...' : 'Create Backup Snapshot'}</span>
              </button>

              <button 
                type="button" 
                className="action-btn-sm" 
                style={{ padding: '8px 18px', color: '#DC2626', borderColor: '#FCA5A5', borderRadius: '10px' }}
                onClick={handleFlushCache}
              >
                Flush System Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

