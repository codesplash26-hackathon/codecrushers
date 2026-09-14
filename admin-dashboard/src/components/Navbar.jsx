import React from 'react';

export default function Navbar() {
  return (
    <header style={{ height: '60px', borderBottom: '1px solid #E2E8F0', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h3 style={{ margin: 0, fontSize: '16px', color: '#334155' }}>Management Console</h3>
      <div>
        <span>Admin User</span>
      </div>
    </header>
  );
}
