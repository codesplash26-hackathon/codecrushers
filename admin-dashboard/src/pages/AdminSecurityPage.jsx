import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  FileText, 
  Lock, 
  Plus, 
  Laptop, 
  Smartphone, 
  Download, 
  Trash2, 
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const AdminSecurityPage = ({ initialSubTab = 'Profile' }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(initialSubTab);

  // Profile State
  const [fullName, setFullName] = useState('Admin User');
  const [email, setEmail] = useState('admin@bestroute.lk');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [department, setDepartment] = useState('Transport Operations');

  // Roles & Permissions State (matching Image 1)
  const [adminAccounts, setAdminAccounts] = useState([
    {
      id: '1',
      initials: 'AU',
      name: 'Admin User',
      email: 'admin@bestroute.lk',
      role: 'Administrator',
      roleBadgeClass: 'badge-admin',
      lastLogin: 'Today, 8:01 AM',
      status: 'Active',
      canRemove: true,
    },
    {
      id: '2',
      initials: 'SA',
      name: 'Super Admin',
      email: 'super@bestroute.lk',
      role: 'Super Admin',
      roleBadgeClass: 'badge-super-admin',
      lastLogin: 'Yesterday',
      status: 'Active',
      canRemove: false,
    },
    {
      id: '3',
      initials: 'OM',
      name: 'Ops Manager',
      email: 'ops@bestroute.lk',
      role: 'Read Only',
      roleBadgeClass: 'badge-read-only',
      lastLogin: '3 days ago',
      status: 'Inactive',
      canRemove: true,
    },
  ]);

  // Invite Admin Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Administrator');

  // Edit Role Modal State
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Administrator');

  // Audit Log State (matching Image 2)
  const [auditLogs] = useState([
    {
      id: 'log-1',
      title: 'Route R003 status updated to Delayed',
      author: 'admin',
      ip: '192.168.1.4',
      timestamp: '10:32 AM',
    },
    {
      id: 'log-2',
      title: 'Disruption #7 added — Kandy Express delay',
      author: 'admin',
      ip: '192.168.1.4',
      timestamp: '9:55 AM',
    },
    {
      id: 'log-3',
      title: 'Schedule SCH-004 deactivated',
      author: 'superadmin',
      ip: '10.0.0.1',
      timestamp: '9:10 AM',
    },
    {
      id: 'log-4',
      title: 'New service "Tuk Alliance LK" added',
      author: 'admin',
      ip: '192.168.1.4',
      timestamp: 'Yesterday 4:22 PM',
    },
    {
      id: 'log-5',
      title: 'Admin login — admin@bestroute.lk',
      author: 'admin',
      ip: '192.168.1.4',
      timestamp: 'Yesterday 8:01 AM',
    },
  ]);

  // Security Settings Toggles (matching Image 3)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [ipAllowlist, setIpAllowlist] = useState(false);

  // Active Sessions (matching Image 3)
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'Chrome on macOS',
      isCurrent: true,
      location: '192.168.1.4 · Colombo, LK · Active now',
      type: 'desktop',
    },
    {
      id: 'sess-2',
      device: 'Safari on iPhone',
      isCurrent: false,
      location: '192.168.1.8 · Kandy, LK · 2h ago',
      type: 'mobile',
    },
  ]);

  // Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    addToast('Profile information updated successfully!', 'success');
  };

  const handleInviteAdmin = (e) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const initials = inviteName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    let badgeClass = 'badge-admin';
    if (inviteRole === 'Super Admin') badgeClass = 'badge-super-admin';
    if (inviteRole === 'Read Only') badgeClass = 'badge-read-only';

    const newAdmin = {
      id: Date.now().toString(),
      initials,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      roleBadgeClass: badgeClass,
      lastLogin: 'Never',
      status: 'Active',
      canRemove: true,
    };

    setAdminAccounts((prev) => [...prev, newAdmin]);
    addToast(`Invitation sent to ${inviteEmail}!`, 'success');
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleOpenEditRole = (acc) => {
    setEditingAccount(acc);
    setSelectedRole(acc.role);
    setIsEditRoleModalOpen(true);
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    if (!editingAccount) return;

    let badgeClass = 'badge-admin';
    if (selectedRole === 'Super Admin') badgeClass = 'badge-super-admin';
    if (selectedRole === 'Read Only') badgeClass = 'badge-read-only';

    setAdminAccounts((prev) =>
      prev.map((acc) =>
        acc.id === editingAccount.id
          ? { ...acc, role: selectedRole, roleBadgeClass: badgeClass }
          : acc
      )
    );

    addToast(`Role updated for ${editingAccount.name}`, 'success');
    setIsEditRoleModalOpen(false);
  };

  const handleRemoveAdmin = (id, name) => {
    if (window.confirm(`Are you sure you want to remove administrator ${name}?`)) {
      setAdminAccounts((prev) => prev.filter((acc) => acc.id !== id));
      addToast(`Administrator ${name} has been removed.`, 'success');
    }
  };

  const handleExportLog = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Activity,Author,IP Address,Timestamp\n' +
      auditLogs
        .map((l) => `"${l.title}","${l.author}","${l.ip}","${l.timestamp}"`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bestroute_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Audit log exported successfully!', 'success');
  };

  const handleRevokeSession = (sessionId, device) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    addToast(`Session for ${device} has been revoked.`, 'success');
  };

  return (
    <div className="page-container fade-in">
      {/* Subheader Tab Bar matching screenshots */}
      <div className="admin-subnav-bar">
        <button
          className={`admin-subnav-btn ${activeTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('Profile')}
        >
          <User size={15} />
          <span>Profile</span>
        </button>

        <button
          className={`admin-subnav-btn ${activeTab === 'Roles & Permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Roles & Permissions')}
        >
          <Shield size={15} />
          <span>Roles & Permissions</span>
        </button>

        <button
          className={`admin-subnav-btn ${activeTab === 'Audit Log' ? 'active' : ''}`}
          onClick={() => setActiveTab('Audit Log')}
        >
          <FileText size={15} />
          <span>Audit Log</span>
        </button>

        <button
          className={`admin-subnav-btn ${activeTab === 'Security' ? 'active' : ''}`}
          onClick={() => setActiveTab('Security')}
        >
          <Lock size={15} />
          <span>Security</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PROFILE                                            */}
      {/* ========================================================= */}
      {activeTab === 'Profile' && (
        <div className="fade-in">
          <div className="admin-card-container" style={{ maxWidth: '680px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div className="avatar-blue" style={{ width: '54px', height: '54px', fontSize: '20px', fontWeight: '800' }}>
                AD
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Admin User</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>admin@bestroute.lk</div>
                <span className="badge-admin">Administrator</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
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

              <button type="submit" className="btn-primary" style={{ borderRadius: '10px' }}>
                Save Profile
              </button>
            </form>
          </div>

          <div className="admin-card-container" style={{ maxWidth: '680px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>Password</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Last changed 30 days ago</div>
            </div>

            <button
              className="action-btn-sm"
              style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}
              onClick={() => addToast('Password reset link sent to your email.', 'info')}
            >
              Change password
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ROLES & PERMISSIONS (Matching Image 1)             */}
      {/* ========================================================= */}
      {activeTab === 'Roles & Permissions' && (
        <div className="admin-card-container fade-in">
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              ADMIN ACCOUNTS
            </span>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563EB',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={16} />
              <span>Invite admin</span>
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px' }}>NAME</th>
                  <th style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px' }}>EMAIL</th>
                  <th style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px' }}>ROLE</th>
                  <th style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px' }}>LAST LOGIN</th>
                  <th style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px' }}>STATUS</th>
                  <th style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {adminAccounts.map((acc) => (
                  <tr key={acc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                        >
                          {acc.initials}
                        </div>
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>
                          {acc.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: '#475569', fontSize: '13px' }}>{acc.email}</td>
                    <td>
                      <span className={acc.roleBadgeClass}>{acc.role}</span>
                    </td>
                    <td style={{ color: '#64748B', fontSize: '13px' }}>{acc.lastLogin}</td>
                    <td>
                      <span className={acc.status === 'Active' ? 'badge-status-active-pill' : 'badge-status-inactive-pill'}>
                        {acc.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          className="action-btn-pill"
                          onClick={() => handleOpenEditRole(acc)}
                        >
                          Edit role
                        </button>
                        {acc.canRemove && (
                          <button
                            className="action-btn-pill btn-remove"
                            onClick={() => handleRemoveAdmin(acc.id, acc.name)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: AUDIT LOG (Matching Image 2)                       */}
      {/* ========================================================= */}
      {activeTab === 'Audit Log' && (
        <div className="fade-in">
          {/* Card Header Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
              Recent Activity
            </span>
            <button
              onClick={handleExportLog}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563EB',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Export log</span>
            </button>
          </div>

          {/* Activity Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {auditLogs.map((log) => (
              <div key={log.id} className="audit-log-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="audit-icon-box">
                    <FileText size={18} color="#64748B" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {log.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      by {log.author} · {log.ip}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SECURITY (Matching Image 3)                        */}
      {/* ========================================================= */}
      {activeTab === 'Security' && (
        <div className="fade-in">
          {/* Security Settings Card */}
          <div className="admin-card-container" style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px' }}>
              Security Settings
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Toggle 1: Two-factor authentication */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Two-factor authentication
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    Add an extra layer of security to your account
                  </div>
                </div>
                <div
                  className={`toggle-switch ${twoFactorAuth ? 'on' : ''}`}
                  onClick={() => {
                    setTwoFactorAuth(!twoFactorAuth);
                    addToast(`Two-factor authentication ${!twoFactorAuth ? 'enabled' : 'disabled'}`, 'info');
                  }}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>

              {/* Toggle 2: Login activity alerts */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Login activity alerts
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    Get notified of new sign-ins to your account
                  </div>
                </div>
                <div
                  className={`toggle-switch ${loginAlerts ? 'on' : ''}`}
                  onClick={() => {
                    setLoginAlerts(!loginAlerts);
                    addToast(`Login alerts ${!loginAlerts ? 'enabled' : 'disabled'}`, 'info');
                  }}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>

              {/* Toggle 3: Session timeout (30 min) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Session timeout (30 min)
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    Auto-logout after 30 minutes of inactivity
                  </div>
                </div>
                <div
                  className={`toggle-switch ${sessionTimeout ? 'on' : ''}`}
                  onClick={() => {
                    setSessionTimeout(!sessionTimeout);
                    addToast(`Session timeout ${!sessionTimeout ? 'activated' : 'deactivated'}`, 'info');
                  }}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>

              {/* Toggle 4: IP allowlist */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    IP allowlist
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    Restrict admin access to specific IP ranges
                  </div>
                </div>
                <div
                  className={`toggle-switch ${ipAllowlist ? 'on' : ''}`}
                  onClick={() => {
                    setIpAllowlist(!ipAllowlist);
                    addToast(`IP allowlist ${!ipAllowlist ? 'enabled' : 'disabled'}`, 'info');
                  }}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions Card */}
          <div className="admin-card-container">
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
              Active Sessions
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: sess.id !== sessions[sessions.length - 1].id ? '1px solid var(--border-color)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="session-icon-box">
                      {sess.type === 'desktop' ? (
                        <Laptop size={18} color="#2563EB" />
                      ) : (
                        <Smartphone size={18} color="#2563EB" />
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {sess.device}
                        </span>
                        {sess.isCurrent && (
                          <span className="badge-current-pill">Current</span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        {sess.location}
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(sess.id, sess.device)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#EF4444',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Admin Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New Administrator"
      >
        <form onSubmit={handleInviteAdmin}>
          <div className="form-group">
            <label className="form-label">FULL NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ruwan Weerasinghe"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. ruwan@bestroute.lk"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">ADMINISTRATIVE ROLE</label>
            <select
              className="form-input"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <option value="Administrator">Administrator</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Read Only">Read Only</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="action-btn-sm"
              onClick={() => setIsInviteModalOpen(false)}
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 20px', borderRadius: '10px' }}
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditRoleModalOpen}
        onClose={() => setIsEditRoleModalOpen(false)}
        title={`Edit Role for ${editingAccount?.name}`}
      >
        <form onSubmit={handleSaveRole}>
          <div className="form-group">
            <label className="form-label">SELECT ROLE</label>
            <select
              className="form-input"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="Administrator">Administrator</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Read Only">Read Only</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="action-btn-sm"
              onClick={() => setIsEditRoleModalOpen(false)}
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 20px', borderRadius: '10px' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSecurityPage;
