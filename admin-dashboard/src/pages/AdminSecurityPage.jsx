import React, { useState } from 'react';
import { 
<<<<<<< HEAD
  User, Shield, FileText, Lock, Plus, Key, Smartphone, Laptop, 
  CheckCircle2, AlertTriangle, Eye, Download, Search, Trash2, Edit, 
  RefreshCw, Check, Copy, ShieldAlert, Globe, Clock, ChevronRight
=======
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
>>>>>>> main
} from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

<<<<<<< HEAD
const AdminSecurityPage = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Profile');

  // --- Profile State ---
  const [profile, setProfile] = useState({
    fullName: 'Admin User',
    email: 'admin@bestroute.lk',
    phone: '+94 77 123 4567',
    department: 'Transport Operations',
    emergencyPhone: '+94 71 987 6543',
    timezone: 'Asia/Colombo (GMT+5:30)',
    role: 'Super Admin'
  });

  // --- Roles & Permissions State ---
  const [roles, setRoles] = useState([
    {
      id: 'role-1',
      title: 'Super Admin',
      badgeColor: '#DBEAFE',
      textColor: '#1D4ED8',
      description: 'Full unrestricted access to all modules, telemetry data feeds, and system configuration settings.',
      usersCount: 5,
      permissions: ['Services Management', 'Stops & Stations', 'Schedules', 'Drivers', 'Monitoring & Diagnostics', 'Settings', 'Admin & Security']
    },
    {
      id: 'role-2',
      title: 'Transit Operations Manager',
      badgeColor: '#E0E7FF',
      textColor: '#4338CA',
      description: 'Manages routes, bus stops, service timetables, driver approvals, and real-time transit telemetry.',
      usersCount: 12,
      permissions: ['Services Management', 'Stops & Stations', 'Schedules', 'Drivers', 'Monitoring & Diagnostics']
    },
    {
      id: 'role-3',
      title: 'Route Dispatcher',
      badgeColor: '#FEF3C7',
      textColor: '#B45309',
      description: 'Monitors active vehicle positions, creates live disruption alerts, and manages daily service schedules.',
      usersCount: 28,
      permissions: ['Services Management', 'Schedules', 'Monitoring & Diagnostics']
    },
    {
      id: 'role-4',
      title: 'Driver Supervisor',
      badgeColor: '#DCFCE7',
      textColor: '#15803D',
      description: 'Reviews driver applications, manages license verification, performance scores, and driver suspensions.',
      usersCount: 8,
      permissions: ['Drivers']
    },
    {
      id: 'role-5',
      title: 'System Auditor',
      badgeColor: '#F3E8FF',
      textColor: '#7E22CE',
      description: 'Read-only access to audit trail history, operational analytics, telemetry logs, and compliance records.',
      usersCount: 3,
      permissions: ['Monitoring & Diagnostics', 'Admin & Security']
    }
  ]);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ title: '', description: '', permissions: [] });
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [roleMembers, setRoleMembers] = useState([]);

  // --- Audit Log State ---
  const [auditSearch, setAuditSearch] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const [auditLogs] = useState([
    {
      id: 'LOG-8941',
      timestamp: '2026-09-25 21:15:02',
      user: 'Admin User',
      email: 'admin@bestroute.lk',
      action: 'Updated Service Details',
      resource: 'SRV-102 (Route 100 - Colombo Express)',
      module: 'Services',
      ip: '192.168.1.45',
      status: 'Success',
      payload: { serviceId: 'SRV-102', fieldChanged: 'frequency', oldValue: '15 mins', newValue: '10 mins' }
    },
    {
      id: 'LOG-8940',
      timestamp: '2026-09-25 20:42:18',
      user: 'Sarah Connor',
      email: 's.connor@bestroute.lk',
      action: 'Approved Driver Application',
      resource: 'DRV-882 (K. Perera)',
      module: 'Drivers',
      ip: '192.168.1.88',
      status: 'Success',
      payload: { driverId: 'DRV-882', status: 'Approved', verifiedBy: 's.connor' }
    },
    {
      id: 'LOG-8939',
      timestamp: '2026-09-25 19:30:10',
      user: 'GTFS Telemetry Worker',
      email: 'system-bot@bestroute.lk',
      action: 'Resynced Telemetry Feed',
      resource: 'Node #3 (Pettah Central Hub)',
      module: 'Monitoring',
      ip: '127.0.0.1',
      status: 'Success',
      payload: { feedUrl: 'https://api.bestroute.lk/gtfs/realtime', packetsProcessed: 1420 }
    },
    {
      id: 'LOG-8938',
      timestamp: '2026-09-25 18:12:44',
      user: 'Unknown User',
      email: 'operator@external-api.lk',
      action: 'Failed Login Attempt',
      resource: 'Admin Portal Login',
      module: 'Security',
      ip: '203.0.113.195',
      status: 'Denied',
      payload: { attemptCount: 3, Reason: 'Invalid Password Credentials' }
    },
    {
      id: 'LOG-8937',
      timestamp: '2026-09-25 16:05:00',
      user: 'Admin User',
      email: 'admin@bestroute.lk',
      action: 'Modified Role Permissions',
      resource: 'Transit Operations Manager',
      module: 'Admin & Security',
      ip: '192.168.1.45',
      status: 'Success',
      payload: { roleId: 'role-2', permissionAdded: 'Monitoring & Diagnostics' }
    },
    {
      id: 'LOG-8936',
      timestamp: '2026-09-25 14:22:11',
      user: 'Nimal Jayasinghe',
      email: 'n.jayasinghe@bestroute.lk',
      action: 'Created Disruption Alert',
      resource: 'DIS-502 (Galle Road Maintenance)',
      module: 'Services',
      ip: '192.168.2.14',
      status: 'Success',
      payload: { disruptionId: 'DIS-502', severity: 'High', affectRoutes: ['Route 100', 'Route 101'] }
    }
  ]);

  // --- Security & Password State ---
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [is2faModalOpen, setIs2faModalOpen] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess-1',
      device: 'Chrome 128 on Windows 11',
      location: 'Colombo, Sri Lanka',
      ip: '192.168.1.45',
      lastActive: 'Active Now (Current Session)',
      isCurrent: true,
      icon: Laptop
    },
    {
      id: 'sess-2',
      device: 'Safari on iPhone 15 Pro',
      location: 'Kandy, Sri Lanka',
      ip: '112.134.5.12',
      lastActive: '2 hours ago',
      isCurrent: false,
      icon: Smartphone
    },
    {
      id: 'sess-3',
      device: 'Firefox 129 on macOS Sonoma',
      location: 'Colombo, Sri Lanka',
      ip: '175.157.2.90',
      lastActive: '1 day ago',
      isCurrent: false,
      icon: Laptop
    }
  ]);

  const [allowedIps, setAllowedIps] = useState([
    { id: 'ip-1', ip: '192.168.1.0/24', label: 'HQ Office Subnet', dateAdded: '2026-01-15' },
    { id: 'ip-2', ip: '203.0.113.50', label: 'Data Center Gateway', dateAdded: '2026-03-10' }
  ]);
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [newIpRule, setNewIpRule] = useState({ ip: '', label: '' });

  // --- Handlers ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Admin Profile updated successfully!', 'success');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (passwords.newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    showToast('Password changed successfully! Next login requires new password.', 'success');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveRolePermissions = () => {
    if (!selectedRole) return;
    setRoles(roles.map(r => r.id === selectedRole.id ? selectedRole : r));
    showToast(`Updated permissions for ${selectedRole.title}`, 'success');
    setIsRoleModalOpen(false);
  };

  const handleCreateRole = () => {
    if (!newRole.title) {
      showToast('Role Title is required', 'error');
      return;
    }
    const created = {
      id: `role-${Date.now()}`,
      title: newRole.title,
      badgeColor: '#E2E8F0',
      textColor: '#334155',
      description: newRole.description || 'Custom administrator role.',
      usersCount: 0,
      permissions: newRole.permissions
    };
    setRoles([...roles, created]);
    showToast(`Role '${newRole.title}' created successfully!`, 'success');
    setIsNewRoleModalOpen(false);
    setNewRole({ title: '', description: '', permissions: [] });
  };

  const handleRevokeSession = (sessionId) => {
    setActiveSessions(activeSessions.filter(s => s.id !== sessionId));
    showToast('Session revoked successfully.', 'info');
  };

  const handleRevokeAllOtherSessions = () => {
    setActiveSessions(activeSessions.filter(s => s.isCurrent));
    showToast('All other sessions terminated!', 'warning');
  };

  const handleAddIpRule = () => {
    if (!newIpRule.ip) {
      showToast('IP Address or CIDR block is required', 'error');
      return;
    }
    const item = {
      id: `ip-${Date.now()}`,
      ip: newIpRule.ip,
      label: newIpRule.label || 'Allowed Network',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setAllowedIps([...allowedIps, item]);
    showToast(`Added ${newIpRule.ip} to allowed IP list.`, 'success');
    setIsIpModalOpen(false);
    setNewIpRule({ ip: '', label: '' });
  };

  const handleRemoveIpRule = (id) => {
    setAllowedIps(allowedIps.filter(i => i.id !== id));
    showToast('IP Rule removed.', 'info');
  };

  const handleExportAuditLogs = () => {
    showToast('Exporting Audit Logs to CSV format...', 'info');
    setTimeout(() => {
      showToast('Audit Log exported to audit_logs_20260925.csv', 'success');
    }, 1200);
  };

  const allAvailablePermissions = [
    'Services Management', 
    'Stops & Stations', 
    'Schedules', 
    'Drivers', 
    'Monitoring & Diagnostics', 
    'Settings', 
    'Admin & Security'
  ];

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.resource.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ip.includes(auditSearch);
    const matchesModule = auditModuleFilter === 'All' || log.module === auditModuleFilter;
    return matchesSearch && matchesModule;
  });
=======
const AdminSecurityPage = ({ initialSubTab = 'Profile' }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState(initialSubTab);

  // Profile State
  const [fullName, setFullName] = useState('Admin User');
  const [email, setEmail] = useState('admin@bestroute.lk');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [department, setDepartment] = useState('Transport Operations');
>>>>>>> main

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
<<<<<<< HEAD
    <div className="page-container fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
          Admin & Security Hub
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
          Manage administrator profile, role access control policies, system audit trails, and security settings.
        </p>
      </div>

      {/* Subheader Tab Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px', 
        backgroundColor: '#F1F5F9', 
        padding: '6px', 
        borderRadius: '12px', 
        width: 'fit-content',
        border: '1px solid #E2E8F0'
      }}>
        <button 
          className={`pill-btn ${activeTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('Profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', padding: '8px 16px' }}
=======
    <div className="page-container fade-in">
      {/* Subheader Tab Bar matching screenshots */}
      <div className="admin-subnav-bar">
        <button
          className={`admin-subnav-btn ${activeTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('Profile')}
>>>>>>> main
        >
          <User size={16} />
          <span>Profile</span>
        </button>

        <button
          className={`admin-subnav-btn ${activeTab === 'Roles & Permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Roles & Permissions')}
<<<<<<< HEAD
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', padding: '8px 16px' }}
=======
>>>>>>> main
        >
          <Shield size={16} />
          <span>Roles & Permissions</span>
        </button>

        <button
          className={`admin-subnav-btn ${activeTab === 'Audit Log' ? 'active' : ''}`}
          onClick={() => setActiveTab('Audit Log')}
<<<<<<< HEAD
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', padding: '8px 16px' }}
=======
>>>>>>> main
        >
          <FileText size={16} />
          <span>Audit Log</span>
        </button>

        <button
          className={`admin-subnav-btn ${activeTab === 'Security' ? 'active' : ''}`}
          onClick={() => setActiveTab('Security')}
<<<<<<< HEAD
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', padding: '8px 16px' }}
=======
>>>>>>> main
        >
          <Lock size={16} />
          <span>Security & Access</span>
        </button>
      </div>

<<<<<<< HEAD
      {/* ========================================================================= */}
      {/* TAB 1: PROFILE */}
      {/* ========================================================================= */}
      {activeTab === 'Profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', maxWidth: '1100px' }}>
          {/* Main Edit Profile Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', borderBottom: '1px solid #F1F5F9', paddingBottom: '20px' }}>
              <div className="avatar-blue" style={{ width: '64px', height: '64px', fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFF' }}>
                AD
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{profile.fullName}</div>
                <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>{profile.email}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge-bus" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', fontWeight: '700' }}>
                    <Shield size={12} style={{ marginRight: '4px' }} />
                    {profile.role}
                  </span>
                  <span className="badge-bus" style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: '600' }}>
                    Active Status
                  </span>
                </div>
=======
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
>>>>>>> main
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
<<<<<<< HEAD
                  <label className="form-label" style={{ fontWeight: '700', color: '#475569' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    required 
=======
                  <label className="form-label">FULL NAME</label>
                  <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
>>>>>>> main
                  />
                </div>

                <div>
<<<<<<< HEAD
                  <label className="form-label" style={{ fontWeight: '700', color: '#475569' }}>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required 
=======
                  <label className="form-label">EMAIL</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
>>>>>>> main
                  />
                </div>

                <div>
<<<<<<< HEAD
                  <label className="form-label" style={{ fontWeight: '700', color: '#475569' }}>PHONE NUMBER</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
=======
                  <label className="form-label">PHONE</label>
                  <input
                    type="text"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
>>>>>>> main
                  />
                </div>

                <div>
<<<<<<< HEAD
                  <label className="form-label" style={{ fontWeight: '700', color: '#475569' }}>DEPARTMENT</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#475569' }}>EMERGENCY CONTACT</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profile.emergencyPhone}
                    onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: '700', color: '#475569' }}>TIMEZONE PREFERENCE</label>
                  <select 
                    className="form-input" 
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  >
                    <option value="Asia/Colombo (GMT+5:30)">Asia/Colombo (GMT+5:30)</option>
                    <option value="UTC (GMT+0:00)">UTC (GMT+0:00)</option>
                    <option value="Asia/Singapore (GMT+8:00)">Asia/Singapore (GMT+8:00)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px', borderRadius: '10px' }}>
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Profile Sidebar Quick Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="#2563EB" />
                Security Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                  <span style={{ color: '#64748B' }}>Two-Factor Auth:</span>
                  <span style={{ fontWeight: '700', color: '#16A34A' }}>Enabled (TOTP)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                  <span style={{ color: '#64748B' }}>Password Changed:</span>
                  <span style={{ fontWeight: '600', color: '#334155' }}>30 days ago</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                  <span style={{ color: '#64748B' }}>Last Login IP:</span>
                  <span style={{ fontWeight: '600', color: '#334155' }}>192.168.1.45</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Assigned Modules:</span>
                  <span style={{ fontWeight: '700', color: '#2563EB' }}>7 of 7</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderRadius: '16px', padding: '24px', color: '#FFFFFF' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>Need Access Elevation?</div>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
                To request permissions for additional transport authorities or custom reporting APIs, submit an access ticket to system admin.
              </p>
              <button 
                onClick={() => showToast('Support ticket draft initialized.', 'info')}
                style={{ marginTop: '16px', background: '#3B82F6', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >
                Request Access Change
              </button>
            </div>
=======
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
>>>>>>> main
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* ========================================================================= */}
      {/* TAB 2: ROLES & PERMISSIONS */}
      {/* ========================================================================= */}
      {activeTab === 'Roles & Permissions' && (
        <div style={{ maxWidth: '1100px' }}>
          {/* Action Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>System Roles & Access Control</h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>Configure module-level permissions for admin team members.</p>
            </div>
            <button 
              className="btn-primary"
              onClick={() => setIsNewRoleModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}
            >
              <Plus size={16} />
              Create Custom Role
            </button>
          </div>

          {/* Roles Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {roles.map((role) => (
              <div 
                key={role.id} 
                style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '20px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span 
                      style={{ 
                        backgroundColor: role.badgeColor, 
                        color: role.textColor, 
                        fontSize: '14px', 
                        fontWeight: '800', 
                        padding: '4px 12px', 
                        borderRadius: '20px' 
                      }}
                    >
                      {role.title}
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>
                      {role.usersCount} Active Users Assigned
                    </span>
                  </div>

                  <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    {role.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {role.permissions.map((perm, idx) => (
                      <span key={idx} style={{ background: '#F1F5F9', color: '#334155', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        ✓ {perm}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="action-btn-sm" 
                    onClick={() => {
                      setRoleMembers([
                        { name: 'Admin User', email: 'admin@bestroute.lk', department: 'Operations' },
                        { name: 'Kasun Wickramasinghe', email: 'k.wickrama@bestroute.lk', department: 'Dispatch' }
                      ]);
                      setIsMembersModalOpen(true);
                    }}
                    style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}
                  >
                    View Members
                  </button>
                  <button 
                    className="action-btn-sm" 
                    onClick={() => {
                      setSelectedRole(role);
                      setIsRoleModalOpen(true);
                    }}
                    style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}
                  >
                    Edit Permissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AUDIT LOG */}
      {/* ========================================================================= */}
      {activeTab === 'Audit Log' && (
        <div style={{ maxWidth: '1100px' }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>System Audit Trail</h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>Real-time immutable log of administrative actions and security events.</p>
            </div>
            <button 
              className="action-btn-sm"
              onClick={handleExportAuditLogs}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontWeight: '600' }}
            >
              <Download size={15} />
              Export Audit Log (CSV)
            </button>
          </div>

          {/* Filter Toolbar */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search audit log by user, action, resource, or IP address..." 
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>

            <div style={{ width: '220px' }}>
              <select 
                className="form-input" 
                value={auditModuleFilter}
                onChange={(e) => setAuditModuleFilter(e.target.value)}
              >
                <option value="All">All Modules</option>
                <option value="Services">Services</option>
                <option value="Drivers">Drivers</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Security">Security</option>
                <option value="Admin & Security">Admin & Security</option>
              </select>
            </div>
          </div>

          {/* Audit Log Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>TIMESTAMP</th>
                  <th style={{ padding: '14px 20px' }}>ADMIN USER</th>
                  <th style={{ padding: '14px 20px' }}>ACTION / EVENT</th>
                  <th style={{ padding: '14px 20px' }}>TARGET RESOURCE</th>
                  <th style={{ padding: '14px 20px' }}>IP ADDRESS</th>
                  <th style={{ padding: '14px 20px' }}>STATUS</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}>
                    <td style={{ padding: '14px 20px', color: '#64748B', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                      {log.timestamp}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#0F172A' }}>{log.user}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{log.email}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: '600', color: '#1E293B' }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#475569', fontSize: '12px' }}>
                      {log.resource}
                    </td>
                    <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#64748B' }}>
                      {log.ip}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {log.status === 'Success' ? (
                        <span className="badge-bus" style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: '700' }}>
                          ✓ Success
                        </span>
                      ) : (
                        <span className="badge-bus" style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', fontWeight: '700' }}>
                          ✕ Denied
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button 
                        className="action-btn-sm" 
                        onClick={() => {
                          setSelectedLog(log);
                          setIsLogModalOpen(true);
                        }}
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAuditLogs.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                      No audit log entries matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SECURITY & ACCESS */}
      {/* ========================================================================= */}
      {activeTab === 'Security' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1100px' }}>
          {/* Password Security Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="#2563EB" />
              Password Credentials
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              Update your account password regularly to ensure admin portal security.
            </p>

            <form onSubmit={handlePasswordUpdate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">CURRENT PASSWORD</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••••••"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">NEW PASSWORD</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Minimum 8 characters"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">CONFIRM NEW PASSWORD</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Repeat new password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', borderRadius: '10px' }}>
                Update Password
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="#2563EB" />
              Two-Factor Authentication (2FA)
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
              Protect your account with TOTP authenticator apps (Google Authenticator, Authy).
            </p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>
                  Authenticator App Status
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {twoFactorEnabled ? '2FA is currently ENFORCED' : '2FA is currently Disabled'}
                </div>
              </div>

              <input 
                type="checkbox" 
                checked={twoFactorEnabled} 
                onChange={(e) => {
                  setTwoFactorEnabled(e.target.checked);
                  showToast(e.target.checked ? '2FA Enabled' : '2FA Disabled', 'info');
                }}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            <button 
              className="action-btn-sm"
              onClick={() => setIs2faModalOpen(true)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', fontWeight: '600', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}
            >
              Configure TOTP Authenticator & Backup Keys
            </button>
          </div>

          {/* Active User Sessions (Full Width) */}
          <div style={{ gridColumn: 'span 2', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Laptop size={18} color="#2563EB" />
                  Active Admin Sessions
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Devices and locations currently logged into your administrator account.
                </p>
              </div>

              <button 
                onClick={handleRevokeAllOtherSessions}
                style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                Terminate All Other Sessions
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeSessions.map((session) => {
                const IconComp = session.icon;
                return (
                  <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '12px', background: session.isCurrent ? '#F0F9FF' : '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ background: session.isCurrent ? '#DBEAFE' : '#F1F5F9', padding: '10px', borderRadius: '10px', color: session.isCurrent ? '#1D4ED8' : '#64748B' }}>
                        <IconComp size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {session.device}
                          {session.isCurrent && (
                            <span className="badge-bus" style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '11px' }}>
                              Current Session
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                          {session.location} • IP: <span style={{ fontFamily: 'monospace' }}>{session.ip}</span> • {session.lastActive}
                        </div>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <button 
                        onClick={() => handleRevokeSession(session.id)}
                        style={{ color: '#DC2626', background: 'transparent', border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allowed IP Rules (Full Width) */}
          <div style={{ gridColumn: 'span 2', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={18} color="#2563EB" />
                  IP Access Rules & Whitelist
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>Restrict admin panel access to authorized network subnets.</p>
              </div>

              <button 
                className="action-btn-sm"
                onClick={() => setIsIpModalOpen(true)}
                style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}
              >
                + Add Allowed IP
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {allowedIps.map(rule => (
                <div key={rule.id} style={{ padding: '14px', border: '1px solid #E2E8F0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0F172A' }}>{rule.ip}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{rule.label} • Added {rule.dateAdded}</div>
                  </div>
                  <button 
                    onClick={() => handleRemoveIpRule(rule.id)}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Edit Role Permissions Modal */}
      <Modal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
        title={selectedRole ? `Edit Permissions: ${selectedRole.title}` : 'Edit Role'}
      >
        {selectedRole && (
          <div>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
              Select which system modules users with the <strong>{selectedRole.title}</strong> role can view and manage.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {allAvailablePermissions.map(perm => {
                const isChecked = selectedRole.permissions.includes(perm);
                return (
                  <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#334155', cursor: 'pointer', padding: '8px', border: '1px solid #F1F5F9', borderRadius: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selectedRole.permissions, perm]
                          : selectedRole.permissions.filter(p => p !== perm);
                        setSelectedRole({ ...selectedRole, permissions: updated });
                      }}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span>{perm}</span>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="action-btn-sm" onClick={() => setIsRoleModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveRolePermissions}>Save Permissions</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Custom Role Modal */}
      <Modal 
        isOpen={isNewRoleModalOpen} 
        onClose={() => setIsNewRoleModalOpen(false)} 
        title="Create Custom Administrator Role"
      >
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">ROLE TITLE</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Regional Fleet Coordinator" 
              value={newRole.title}
              onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">DESCRIPTION</label>
            <textarea 
              className="form-input" 
              rows="3" 
              placeholder="Brief summary of duties and access level..."
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">MODULE PERMISSIONS</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
              {allAvailablePermissions.map(perm => (
                <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <input 
                    type="checkbox" 
                    checked={newRole.permissions.includes(perm)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...newRole.permissions, perm]
                        : newRole.permissions.filter(p => p !== perm);
                      setNewRole({ ...newRole, permissions: updated });
                    }}
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="action-btn-sm" onClick={() => setIsNewRoleModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleCreateRole}>Create Role</button>
          </div>
        </div>
      </Modal>

      {/* View Role Members Modal */}
      <Modal 
        isOpen={isMembersModalOpen} 
        onClose={() => setIsMembersModalOpen(false)} 
        title="Assigned Role Members"
      >
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {roleMembers.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#F8FAFC' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>{m.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{m.email} • {m.department}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={() => setIsMembersModalOpen(false)}>Close</button>
          </div>
        </div>
      </Modal>

      {/* Inspect Audit Log Entry Modal */}
      <Modal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        title={selectedLog ? `Audit Event Details #${selectedLog.id}` : 'Log Entry'}
      >
        {selectedLog && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748B' }}>User:</span> <strong style={{ color: '#0F172A' }}>{selectedLog.user}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>IP Address:</span> <code style={{ color: '#0F172A' }}>{selectedLog.ip}</code>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Module:</span> <strong>{selectedLog.module}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B' }}>Timestamp:</span> <span>{selectedLog.timestamp}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">RAW JSON PAYLOAD</label>
              <pre style={{ background: '#0F172A', color: '#38BDF8', padding: '14px', borderRadius: '10px', fontSize: '12px', overflowX: 'auto' }}>
                {JSON.stringify(selectedLog.payload, null, 2)}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setIsLogModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* 2FA Configuration Modal */}
      <Modal 
        isOpen={is2faModalOpen} 
        onClose={() => setIs2faModalOpen(false)} 
        title="Configure 2FA Authenticator App"
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
            Scan the QR code using Google Authenticator or Authy to bind your device.
          </p>

          <div style={{ display: 'inline-block', padding: '16px', background: '#FFF', border: '2px dashed #94A3B8', borderRadius: '14px', marginBottom: '16px' }}>
            <div style={{ width: '140px', height: '140px', background: '#0F172A', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', borderRadius: '8px', margin: '0 auto' }}>
              [ QR CODE PREVIEW ]
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>Secret Setup Key:</div>
          <div style={{ fontFamily: 'monospace', fontWeight: '800', background: '#F1F5F9', padding: '8px', borderRadius: '6px', fontSize: '14px', letterSpacing: '2px', color: '#0F172A', marginBottom: '20px' }}>
            HX7B - 991K - BEST - ROUT
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button className="btn-primary" onClick={() => {
              showToast('2FA Authenticator verified and active!', 'success');
              setIs2faModalOpen(false);
            }}>
              Verify & Activate
            </button>
          </div>
        </div>
      </Modal>

      {/* Add IP Rule Modal */}
      <Modal 
        isOpen={isIpModalOpen} 
        onClose={() => setIsIpModalOpen(false)} 
        title="Add Allowed IP / Subnet Rule"
      >
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">IP ADDRESS OR CIDR BLOCK</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 192.168.1.100 or 10.0.0.0/16" 
              value={newIpRule.ip}
              onChange={(e) => setNewIpRule({ ...newIpRule, ip: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">LABEL / DESCRIPTION</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Colombo Operations Subnet" 
              value={newIpRule.label}
              onChange={(e) => setNewIpRule({ ...newIpRule, label: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="action-btn-sm" onClick={() => setIsIpModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleAddIpRule}>Add IP Rule</button>
          </div>
        </div>
=======
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
>>>>>>> main
      </Modal>
    </div>
  );
};

export default AdminSecurityPage;

