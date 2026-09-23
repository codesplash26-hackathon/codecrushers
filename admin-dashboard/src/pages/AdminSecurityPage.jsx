import React, { useState } from 'react';
import { User, Shield, FileText, Lock } from 'lucide-react';

const AdminSecurityPage = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [fullName, setFullName] = useState('Admin User');
  const [email, setEmail] = useState('admin@bestroute.lk');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [department, setDepartment] = useState('Transport Operations');

  return (
    <div className="page-container fade-in">
      {/* Subheader Tab Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        <button 
          className={`pill-btn ${activeTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('Profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <User size={15} />
          <span>Profile</span>
        </button>

        <button 
          className={`pill-btn ${activeTab === 'Roles & Permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Roles & Permissions')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Shield size={15} />
          <span>Roles & Permissions</span>
        </button>

        <button 
          className={`pill-btn ${activeTab === 'Audit Log' ? 'active' : ''}`}
          onClick={() => setActiveTab('Audit Log')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FileText size={15} />
          <span>Audit Log</span>
        </button>

        <button 
          className={`pill-btn ${activeTab === 'Security' ? 'active' : ''}`}
          onClick={() => setActiveTab('Security')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Lock size={15} />
          <span>Security</span>
        </button>
      </div>

      {/* Profile Details Card */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '28px', marginBottom: '24px', maxWidth: '680px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div className="avatar-blue" style={{ width: '54px', height: '54px', fontSize: '20px', fontWeight: '800' }}>
            AD
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Admin User</div>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>admin@bestroute.lk</div>
            <span className="badge-bus" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>Administrator</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label className="form-label">FULL NAME</label>
            <input 
              type="text" 
              className="form-input" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

          <div>
            <label className="form-label">EMAIL</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div>
            <label className="form-label">PHONE</label>
            <input 
              type="text" 
              className="form-input" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)} 
            />
          </div>

          <div>
            <label className="form-label">DEPARTMENT</label>
            <input 
              type="text" 
              className="form-input" 
              value={department}
              onChange={(e) => setDepartment(e.target.value)} 
            />
          </div>
        </div>

        <button className="btn-primary" style={{ borderRadius: '10px' }}>Save Profile</button>
      </div>

      {/* Password Security Card */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '680px' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#0F172A' }}>Password</div>
          <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>Last changed 30 days ago</div>
        </div>

        <button className="action-btn-sm" style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}>
          Change password
        </button>
      </div>
    </div>
  );
};

export default AdminSecurityPage;
