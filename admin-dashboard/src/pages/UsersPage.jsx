import React, { useState, useEffect } from 'react';
import { Users, Shield, Search, Plus, Trash2, CheckCircle2, UserCheck } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import adminService from '../services/adminService';

const UsersPage = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('passenger');
  const [newPassword, setNewPassword] = useState('password123');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      if (res && res.users) {
        setUsers(res.users);
      } else if (Array.isArray(res)) {
        setUsers(res);
      }
    } catch (err) {
      console.error('Failed to fetch real users:', err);
      addToast('Failed to load users from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    try {
      const res = await adminService.createUser({
        name: newName,
        email: newEmail,
        role: newRole,
        password: newPassword,
      });

      if (res && (res.user || res.success)) {
        addToast(`User ${newName} created successfully!`, 'success');
        setIsAddModalOpen(false);
        setNewName('');
        setNewEmail('');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create user', 'error');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove user "${name}"?`)) return;
    try {
      await adminService.deleteUser(id);
      addToast(`User "${name}" removed.`, 'success');
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } catch (err) {
      addToast('Failed to delete user', 'error');
    }
  };

  const getRoleBadge = (role) => {
    const r = (role || 'passenger').toLowerCase();
    if (r === 'super_admin') {
      return <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>Super Admin</span>;
    }
    if (r === 'admin' || r === 'administrator') {
      return <span style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>Administrator</span>;
    }
    if (r === 'operator' || r === 'read_only') {
      return <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>{r === 'read_only' ? 'Read Only' : 'Operator'}</span>;
    }
    return <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>Passenger</span>;
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (roleFilter === 'All') return matchesSearch;
    if (roleFilter === 'Admin') return matchesSearch && (u.role === 'admin' || u.role === 'super_admin');
    if (roleFilter === 'Operator') return matchesSearch && (u.role === 'operator' || u.role === 'read_only');
    if (roleFilter === 'Passenger') return matchesSearch && u.role === 'passenger';
    return matchesSearch;
  });

  return (
    <div className="page-container fade-in">
      {/* Page Toolbar */}
      <div className="page-toolbar" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="search-box" style={{ width: '280px' }}>
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            {['All', 'Admin', 'Operator', 'Passenger'].map((r) => (
              <button
                key={r}
                className={`pill-btn ${roleFilter === r ? 'active' : ''}`}
                onClick={() => setRoleFilter(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn-blue-action"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="table-container">
        <div className="table-header-box">
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#2563EB" />
            <span>Database Registered Accounts ({filteredUsers.length})</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Live MongoDB Collection: <code>users</code>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            Loading users from database...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            No matching user accounts found.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Preferences</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const id = u._id || u.id;
                const initials = (u.name || 'User')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                const dateStr = u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Recent';

                return (
                  <tr key={id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '12px',
                          }}
                        >
                          {initials}
                        </div>
                        <div style={{ fontWeight: '700', color: '#0F172A' }}>{u.name}</div>
                      </div>
                    </td>
                    <td style={{ color: '#475569' }}>{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td style={{ textTransform: 'capitalize', color: '#64748B', fontSize: '13px' }}>
                      {u.preferences || 'Fastest'}
                    </td>
                    <td style={{ color: '#64748B', fontSize: '13px' }}>{dateStr}</td>
                    <td>
                      <span className="badge-status-active" style={{ fontSize: '11px', padding: '3px 8px' }}>
                        Active
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(id, u.name)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                        title="Remove user"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User Account"
      >
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label className="form-label">FULL NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Priyantha Jayasuriya"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. user@bestroute.lk"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">SYSTEM ROLE</label>
            <select
              className="form-input"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="passenger">Passenger</option>
              <option value="admin">Administrator</option>
              <option value="super_admin">Super Admin</option>
              <option value="operator">Transport Operator</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              className="action-btn-sm"
              onClick={() => setIsAddModalOpen(false)}
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 20px', borderRadius: '10px' }}
            >
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
