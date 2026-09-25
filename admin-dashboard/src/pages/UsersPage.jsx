import React, { useState } from 'react';
import { Users, Shield, UserCheck, Plus } from 'lucide-react';

const UsersPage = () => {
  const [users] = useState([
    { id: '1', name: 'Avishka Weerasinghe', email: 'avishka@codecrushers.lk', role: 'SUPER_ADMIN', status: 'ACTIVE' },
    { id: '2', name: 'Transport Dispatcher', email: 'dispatcher@sltb.lk', role: 'OPERATOR', status: 'ACTIVE' },
    { id: '3', name: 'Passenger User #102', email: 'passenger@gmail.com', role: 'PASSENGER', status: 'ACTIVE' },
  ]);

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">User & Access Management</h1>
          <p className="page-desc">Manage system administrators, transport operators, and registered passengers</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header-box">
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#0F172A' }}>
            User Account List ({users.length})
          </div>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: '600' }}>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`tag-badge ${u.role === 'SUPER_ADMIN' ? 'tag-train' : 'tag-bus'}`}>
                    {u.role}
                  </span>
                </td>
                <td><span className="tag-badge tag-active">ACTIVE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
