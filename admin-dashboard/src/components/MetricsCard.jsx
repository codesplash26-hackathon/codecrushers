import React from 'react';

export default function MetricsCard({ title, value, change }) {
  return (
    <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
      <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 8px 0' }}>{title}</p>
      <h3 style={{ fontSize: '24px', margin: 0, color: '#0F172A' }}>{value}</h3>
      {change && <span style={{ fontSize: '12px', color: '#10B981' }}>{change}</span>}
    </div>
  );
}
