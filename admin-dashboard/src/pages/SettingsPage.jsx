import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sliders,
  Bell,
  Coins,
  Database,
  Save,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Server,
  Activity,
  Clock,
  Check,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const DEFAULT_SETTINGS = {
  systemName: 'BestRoute Multimodal Transit Platform',
  operationalRegion: 'Western & Central Province (Kandy - Colombo Corridor)',
  timezone: 'Asia/Colombo (UTC+05:30)',
  currency: 'LKR (Rs.)',
  maintenanceMode: false,
  allowUserRegistration: true,
  gpsRefreshIntervalSeconds: 5,
  algorithmWeights: {
    timeWeight: 40,
    costWeight: 30,
    reliabilityWeight: 20,
    walkingWeight: 10,
    transferBufferMinutes: 5,
    maxWalkingDistanceKm: 1.5,
    connectionRiskThresholdMinutes: 4,
  },
  disruptionSettings: {
    autoBroadcastAlerts: true,
    minSeverityForPush: 'MEDIUM',
    autoReoptimizeRoutes: true,
    monsoonDelayMultiplier: 1.25,
    autoResolveGraceHours: 24,
  },
  fareSettings: {
    busBaseFare: 30,
    busPerKmRate: 8,
    trainBaseFare: 50,
    trainPerKmRate: 3,
    tukBaseFare: 100,
    tukPerKmRate: 80,
    taxiBaseFare: 250,
    taxiPerKmRate: 120,
    driverCommissionPercentage: 10,
  },
  systemSettings: {
    apiBaseUrl: 'http://localhost:5000/api',
    databaseHost: 'mongodb://mongodb:27017/bestroute',
    cacheTtlSeconds: 300,
    logLevel: 'info',
  },
};

const TABS = [
  'General & Platform',
  'Optimization Engine',
  'Disruptions & Alerts',
  'Transit Fares & Rates',
  'Database & Operations',
];

const SettingsPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('General & Platform');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Modals for critical actions
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isReseedModalOpen, setIsReseedModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch settings from MongoDB
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res.success && res.data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...res.data,
          algorithmWeights: {
            ...DEFAULT_SETTINGS.algorithmWeights,
            ...(res.data.algorithmWeights || {}),
          },
          disruptionSettings: {
            ...DEFAULT_SETTINGS.disruptionSettings,
            ...(res.data.disruptionSettings || {}),
          },
          fareSettings: {
            ...DEFAULT_SETTINGS.fareSettings,
            ...(res.data.fareSettings || {}),
          },
          systemSettings: {
            ...DEFAULT_SETTINGS.systemSettings,
            ...(res.data.systemSettings || {}),
          },
        });
      }
    } catch (err) {
      console.warn('Could not load settings from server, using defaults:', err.message);
      addToast('Running with default system configuration.', 'info');
    } finally {
      setLoading(false);
      setHasChanges(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (path, value) => {
    setHasChanges(true);
    setSettings((prev) => {
      const parts = path.split('.');
      if (parts.length === 1) {
        return { ...prev, [parts[0]]: value };
      }
      if (parts.length === 2) {
        return {
          ...prev,
          [parts[0]]: {
            ...prev[parts[0]],
            [parts[1]]: value,
          },
        };
      }
      return prev;
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await adminService.updateSettings(settings);
      if (res.success) {
        addToast('System settings saved successfully to MongoDB!', 'success');
        setHasChanges(false);
      } else {
        addToast(res.message || 'Failed to save settings', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Error updating settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    try {
      setActionLoading(true);
      const res = await adminService.resetSettings();
      if (res.success) {
        setSettings(res.data || DEFAULT_SETTINGS);
        addToast('Settings restored to factory defaults!', 'success');
        setHasChanges(false);
        setIsResetModalOpen(false);
      }
    } catch (err) {
      addToast(err.message || 'Failed to reset settings', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReseedDatabase = async () => {
    try {
      setActionLoading(true);
      const res = await adminService.reseedDatabase();
      if (res.success) {
        addToast('Database re-seeded with demo transit data and users!', 'success');
        setIsReseedModalOpen(false);
      }
    } catch (err) {
      addToast(err.message || 'Failed to re-seed database', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate algorithm weights total
  const weightsTotal =
    Number(settings.algorithmWeights?.timeWeight || 0) +
    Number(settings.algorithmWeights?.costWeight || 0) +
    Number(settings.algorithmWeights?.reliabilityWeight || 0) +
    Number(settings.algorithmWeights?.walkingWeight || 0);

  if (loading) {
    return (
      <div className="page-container fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: '600', fontSize: '14px' }}>Loading System Configuration...</p>
        </div>
      </div>
    );
  }

  // Get active tab icon
  const getTabIcon = () => {
    switch (activeTab) {
      case 'General & Platform':
        return <Globe size={18} color="#2563EB" />;
      case 'Optimization Engine':
        return <Sliders size={18} color="#2563EB" />;
      case 'Disruptions & Alerts':
        return <Bell size={18} color="#2563EB" />;
      case 'Transit Fares & Rates':
        return <Coins size={18} color="#2563EB" />;
      case 'Database & Operations':
        return <Database size={18} color="#2563EB" />;
      default:
        return <Globe size={18} color="#2563EB" />;
    }
  };

  return (
    <div className="page-container fade-in">
      {/* 1. Page Toolbar matching Passengers Management (Photo 2) */}
      <div className="page-toolbar" style={{ marginBottom: '24px' }}>
        <div className="filter-pills">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`pill-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {hasChanges && (
            <span
              style={{
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '700',
              }}
            >
              ● Unsaved Changes
            </span>
          )}

          <button
            className="btn-blue-action"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Card Container matching Table Container (Photo 2) */}
      <div className="table-container">
        {/* Header Box matching Photo 2 */}
        <div className="table-header-box">
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {getTabIcon()}
            <span>
              {activeTab === 'General & Platform' && 'Platform Identity & Localization'}
              {activeTab === 'Optimization Engine' && 'Multimodal Journey Optimization Weights'}
              {activeTab === 'Disruptions & Alerts' && 'Incident Dispatch & Disruption Policies'}
              {activeTab === 'Transit Fares & Rates' && 'Standard Transit Tariffs & Commission'}
              {activeTab === 'Database & Operations' && 'Database & Infrastructure Diagnostics'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Live MongoDB Collection: <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#2563EB', fontWeight: '600' }}>settings</code>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* ========================================================= */}
          {/* TAB 1: GENERAL & PLATFORM                                 */}
          {/* ========================================================= */}
          {activeTab === 'General & Platform' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">PLATFORM BRAND NAME</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.systemName}
                    onChange={(e) => handleChange('systemName', e.target.value)}
                    placeholder="e.g. BestRoute Multimodal Transit Platform"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">OPERATIONAL CORRIDOR / REGION</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.operationalRegion}
                    onChange={(e) => handleChange('operationalRegion', e.target.value)}
                    placeholder="e.g. Western & Central Province"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SYSTEM TIMEZONE</label>
                  <select
                    className="form-select"
                    value={settings.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                  >
                    <option value="Asia/Colombo (UTC+05:30)">Asia/Colombo (UTC+05:30)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">CURRENCY CODE & SYMBOL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    placeholder="LKR (Rs.)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GPS LIVE TRACKING INTERVAL (SECONDS)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    className="form-input"
                    value={settings.gpsRefreshIntervalSeconds}
                    onChange={(e) => handleChange('gpsRefreshIntervalSeconds', Number(e.target.value))}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', display: 'block' }}>
                    Vehicle coordinate polling frequency for mobile commuters (default: 5s).
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '28px', paddingTop: '22px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '16px' }}>
                  System Availability Toggles
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#F8FAFC',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>Maintenance Mode</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Temporarily suspend passenger journey bookings during platform maintenance.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563EB' }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#F8FAFC',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>
                        Allow New Passenger Registrations
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Enable open account sign-up on the mobile commuter app.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.allowUserRegistration}
                      onChange={(e) => handleChange('allowUserRegistration', e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563EB' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: OPTIMIZATION ENGINE                                */}
          {/* ========================================================= */}
          {activeTab === 'Optimization Engine' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Calibrate weighting parameters used by the router (Fastest, Cheapest, Most Reliable).
                </div>
                <span
                  style={{
                    backgroundColor: weightsTotal === 100 ? '#DCFCE7' : '#FEF3C7',
                    color: weightsTotal === 100 ? '#15803D' : '#B45309',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                  }}
                >
                  Weights Sum: {weightsTotal}% {weightsTotal === 100 ? '✓ Balanced' : '(Target: 100%)'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>TRAVEL TIME WEIGHT (%)</span>
                    <span style={{ fontWeight: '800', color: '#2563EB' }}>{settings.algorithmWeights.timeWeight}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#2563EB' }}
                    value={settings.algorithmWeights.timeWeight}
                    onChange={(e) => handleChange('algorithmWeights.timeWeight', Number(e.target.value))}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Priority given to minimizing total journey duration.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>TRAVEL COST WEIGHT (%)</span>
                    <span style={{ fontWeight: '800', color: '#16A34A' }}>{settings.algorithmWeights.costWeight}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#16A34A' }}
                    value={settings.algorithmWeights.costWeight}
                    onChange={(e) => handleChange('algorithmWeights.costWeight', Number(e.target.value))}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Priority given to selecting cheaper transit modes.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>RELIABILITY WEIGHT (%)</span>
                    <span style={{ fontWeight: '800', color: '#D97706' }}>{settings.algorithmWeights.reliabilityWeight}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#D97706' }}
                    value={settings.algorithmWeights.reliabilityWeight}
                    onChange={(e) => handleChange('algorithmWeights.reliabilityWeight', Number(e.target.value))}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Favors services with fewer historical disruption delays.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>WALKING PENALTY WEIGHT (%)</span>
                    <span style={{ fontWeight: '800', color: '#7C3AED' }}>{settings.algorithmWeights.walkingWeight}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#7C3AED' }}
                    value={settings.algorithmWeights.walkingWeight}
                    onChange={(e) => handleChange('algorithmWeights.walkingWeight', Number(e.target.value))}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Discourages lengthy walking segments between transit stops.
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '14px' }}>
                  Transfer & Connection Constraints
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">MINIMUM TRANSFER BUFFER (MINUTES)</label>
                    <input
                      type="number"
                      min="2"
                      max="30"
                      className="form-input"
                      value={settings.algorithmWeights.transferBufferMinutes}
                      onChange={(e) => handleChange('algorithmWeights.transferBufferMinutes', Number(e.target.value))}
                    />
                    <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                      Safety window required when switching between train and bus connections.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">MAX WALKING RADIUS (KM)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="10"
                      className="form-input"
                      value={settings.algorithmWeights.maxWalkingDistanceKm}
                      onChange={(e) => handleChange('algorithmWeights.maxWalkingDistanceKm', Number(e.target.value))}
                    />
                    <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                      Maximum walking distance before proposing a tuk-tuk/taxi transfer.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">HIGH RISK CONNECTION THRESHOLD (MINUTES)</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      className="form-input"
                      value={settings.algorithmWeights.connectionRiskThresholdMinutes}
                      onChange={(e) => handleChange('algorithmWeights.connectionRiskThresholdMinutes', Number(e.target.value))}
                    />
                    <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                      Flags an amber warning if the connection buffer drops below this threshold.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DISRUPTIONS & ALERTS                               */}
          {/* ========================================================= */}
          {activeTab === 'Disruptions & Alerts' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">PUSH NOTIFICATION SEVERITY THRESHOLD</label>
                  <select
                    className="form-select"
                    value={settings.disruptionSettings.minSeverityForPush}
                    onChange={(e) => handleChange('disruptionSettings.minSeverityForPush', e.target.value)}
                  >
                    <option value="LOW">LOW (Notify all minor delays over 5 mins)</option>
                    <option value="MEDIUM">MEDIUM (Notify moderate delays over 15 mins)</option>
                    <option value="HIGH">HIGH (Notify major delays over 30 mins and diversions)</option>
                    <option value="CRITICAL">CRITICAL (Only notify cancellations and route closures)</option>
                  </select>
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Prevents alert fatigue by restricting push alerts to significant events.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">MONSOON / WEATHER DELAY MULTIPLIER</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="2.5"
                    className="form-input"
                    value={settings.disruptionSettings.monsoonDelayMultiplier}
                    onChange={(e) => handleChange('disruptionSettings.monsoonDelayMultiplier', Number(e.target.value))}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Estimated transit speed multiplier applied during adverse weather conditions (default: 1.25x).
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">AUTO-RESOLVE DISRUPTION EXPIRY (HOURS)</label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    className="form-input"
                    value={settings.disruptionSettings.autoResolveGraceHours}
                    onChange={(e) => handleChange('disruptionSettings.autoResolveGraceHours', Number(e.target.value))}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                    Active disruptions automatically resolve after this elapsed period.
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '14px' }}>
                  Automated Passenger Actions
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#F8FAFC',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>
                        Broadcast Disruptions Automatically
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Immediately dispatch real-time disruption banners to mobile app home feeds.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.disruptionSettings.autoBroadcastAlerts}
                      onChange={(e) => handleChange('disruptionSettings.autoBroadcastAlerts', e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563EB' }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#F8FAFC',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>
                        Dynamic Journey Re-Optimization
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Automatically calculate and suggest alternative routes to affected commuters.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.disruptionSettings.autoReoptimizeRoutes}
                      onChange={(e) => handleChange('disruptionSettings.autoReoptimizeRoutes', e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563EB' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: TRANSIT FARES & RATES                              */}
          {/* ========================================================= */}
          {activeTab === 'Transit Fares & Rates' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {/* Bus Tariffs */}
                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#1E40AF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-bus">Bus</span>
                    <span>SLTB & Private Bus Fares</span>
                  </div>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">BASE FARE (LKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={settings.fareSettings.busBaseFare}
                      onChange={(e) => handleChange('fareSettings.busBaseFare', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">PER KM RATE (LKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={settings.fareSettings.busPerKmRate}
                      onChange={(e) => handleChange('fareSettings.busPerKmRate', Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Train Tariffs */}
                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#15803D', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-train">Train</span>
                    <span>Sri Lanka Railways Fares</span>
                  </div>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">BASE FARE (LKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={settings.fareSettings.trainBaseFare}
                      onChange={(e) => handleChange('fareSettings.trainBaseFare', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">PER KM RATE (LKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={settings.fareSettings.trainPerKmRate}
                      onChange={(e) => handleChange('fareSettings.trainPerKmRate', Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Tuk-Tuk Tariffs */}
                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#B45309', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>Tuk-tuk</span>
                    <span>Three-Wheeler Fares</span>
                  </div>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">FIRST KM BASE (LKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={settings.fareSettings.tukBaseFare}
                      onChange={(e) => handleChange('fareSettings.tukBaseFare', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">SUBSEQUENT KM (LKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={settings.fareSettings.tukPerKmRate}
                      onChange={(e) => handleChange('fareSettings.tukPerKmRate', Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Taxi & Commission */}
                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#6D28D9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ backgroundColor: '#F3E8FF', color: '#6D28D9', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>Taxi</span>
                    <span>Taxi & Commission</span>
                  </div>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">TAXI BASE FARE (LKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={settings.fareSettings.taxiBaseFare}
                      onChange={(e) => handleChange('fareSettings.taxiBaseFare', Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">PLATFORM COMMISSION (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      className="form-input"
                      value={settings.fareSettings.driverCommissionPercentage}
                      onChange={(e) => handleChange('fareSettings.driverCommissionPercentage', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: DATABASE & SYSTEM OPERATIONS                       */}
          {/* ========================================================= */}
          {activeTab === 'Database & Operations' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Server size={16} color="#2563EB" />
                      MongoDB Connection
                    </span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                      Active
                    </span>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CONNECTION URI</label>
                    <input
                      type="text"
                      className="form-input"
                      value={settings.systemSettings.databaseHost}
                      readOnly
                      style={{ background: '#F1F5F9', color: '#475569' }}
                    />
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={16} color="#16A34A" />
                      Backend API Engine
                    </span>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                      Port 5000 Active
                    </span>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">API BASE URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={settings.systemSettings.apiBaseUrl}
                      readOnly
                      style={{ background: '#F1F5F9', color: '#475569' }}
                    />
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={16} color="#D97706" />
                      Transit Route Cache TTL
                    </span>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CACHE EXPIRATION (SECONDS)</label>
                    <input
                      type="number"
                      min="60"
                      max="3600"
                      className="form-input"
                      value={settings.systemSettings.cacheTtlSeconds}
                      onChange={(e) => handleChange('systemSettings.cacheTtlSeconds', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Recovery & Admin Operations */}
              <div style={{ marginTop: '28px', paddingTop: '22px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '14px' }}>
                  Administrative Operations
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '4px' }}>
                      Reset Platform Settings
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                      Restore all optimization weights, disruption policies, and tariffs to initial defaults.
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsResetModalOpen(true)}
                      className="action-btn-sm"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <RotateCcw size={14} />
                      <span>Reset to Defaults</span>
                    </button>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '4px' }}>
                      Re-seed System Demo Data
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                      Repopulate database with sample transit stops, routes, and test accounts in MongoDB.
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReseedModalOpen(true)}
                      className="action-btn-sm"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Sparkles size={14} />
                      <span>Re-seed Demo Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: RESET DEFAULTS CONFIRMATION                        */}
      {/* ========================================================= */}
      {isResetModalOpen && (
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Reset to Factory Defaults?"
        >
          <div style={{ padding: '6px 0' }}>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              This will overwrite all customized weights, fares, and policies with baseline defaults. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button
                type="button"
                className="action-btn-sm"
                onClick={() => setIsResetModalOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-red-action"
                onClick={handleResetDefaults}
                disabled={actionLoading}
                style={{ padding: '8px 16px', borderRadius: '20px' }}
              >
                {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* MODAL: RESEED DATABASE CONFIRMATION                       */}
      {/* ========================================================= */}
      {isReseedModalOpen && (
        <Modal
          isOpen={isReseedModalOpen}
          onClose={() => setIsReseedModalOpen(false)}
          title="Re-seed Transit Database?"
        >
          <div style={{ padding: '6px 0' }}>
            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              This will re-initialize transit stops, bus/train routes, schedules, active disruptions, and demo commuter accounts in MongoDB.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button
                type="button"
                className="action-btn-sm"
                onClick={() => setIsReseedModalOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-blue-action"
                onClick={handleReseedDatabase}
                disabled={actionLoading}
                style={{ padding: '8px 16px', borderRadius: '20px' }}
              >
                {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                <span>Confirm & Re-seed</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SettingsPage;
