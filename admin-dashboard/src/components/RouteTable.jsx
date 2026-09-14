import React from 'react';

export default function RouteTable({ routes }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
      <thead>
        <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
          <th style={{ padding: '12px' }}>Route Code</th>
          <th style={{ padding: '12px' }}>Name</th>
          <th style={{ padding: '12px' }}>Mode</th>
          <th style={{ padding: '12px' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: '12px' }}>R-001</td>
          <td style={{ padding: '12px' }}>Colombo - Kandy Express</td>
          <td style={{ padding: '12px' }}>BUS</td>
          <td style={{ padding: '12px', color: '#10B981' }}>Active</td>
        </tr>
      </tbody>
    </table>
  );
}
