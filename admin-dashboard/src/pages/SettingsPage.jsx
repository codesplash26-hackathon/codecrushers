import React from 'react';
import { Settings, Server, Key, Database, RefreshCw } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-desc">Configure backend API endpoints, optimization algorithm weights, and database connections</p>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', maxWidth: '640px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={20} />
          Backend API Connection
        </h3>

        <div className="form-group">
          <label className="form-label">BACKEND API URL</label>
          <input type="text" className="form-input" defaultValue="http://localhost:5000/api" readOnly />
        </div>

        <div className="form-group">
          <label className="form-label">DATABASE HOST</label>
          <input type="text" className="form-input" defaultValue="MongoDB Atlas (BestRouteCluster)" readOnly />
        </div>

        <div className="form-group">
          <label className="form-label">JWT AUTH ALGORITHM</label>
          <input type="text" className="form-input" defaultValue="HS256 (JWT Token valid for 24h)" readOnly />
        </div>

        <button className="btn-primary" style={{ marginTop: '8px' }}>
          <RefreshCw size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
