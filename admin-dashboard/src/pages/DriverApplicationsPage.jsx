import React, { useState } from 'react';

const DriverApplicationsPage = () => {
  const [apps, setApps] = useState([
    { id: 'DAR01', driver: 'Kasun Perera', phone: '+94 77 123 4567', vehicleType: 'Taxi', vehicleNo: 'WP CAB-1234', submitted: '2024-01-15', status: 'Pending' },
    { id: 'DAR02', driver: 'Nimal Silva', phone: '+94 71 234 5678', vehicleType: 'Tuk-tuk', vehicleNo: 'WP TUK-3321', submitted: '2024-01-14', status: 'Approved' },
    { id: 'DAR03', driver: 'Priya Fernando', phone: '+94 76 345 6789', vehicleType: 'Taxi', vehicleNo: 'WP CAB-5512', submitted: '2024-01-13', status: 'Rejected' },
    { id: 'DAR04', driver: 'Roshan Jayawardena', phone: '+94 77 456 7890', vehicleType: 'Tuk-tuk', vehicleNo: 'CP TUK-0098', submitted: '2024-01-12', status: 'Pending' },
  ]);

  const handleAction = (id, newStatus) => {
    setApps(apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="page-container fade-in">
      <div className="page-toolbar" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Driver Applications</h2>
        <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>
          2 Pending
        </span>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DRIVER</th>
              <th>VEHICLE TYPE</th>
              <th>VEHICLE NO.</th>
              <th>SUBMITTED</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((row) => (
              <tr key={row.id}>
                <td style={{ color: '#94A3B8', fontFamily: 'monospace', fontWeight: '600' }}>{row.id}</td>
                <td>
                  <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.driver}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{row.phone}</div>
                </td>
                <td style={{ fontWeight: '500', color: '#475569' }}>{row.vehicleType}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '13px', color: '#334155' }}>{row.vehicleNo}</td>
                <td style={{ color: '#64748B', fontSize: '13px' }}>{row.submitted}</td>
                <td>
                  {row.status === 'Pending' && <span className="badge-status-delayed">Pending</span>}
                  {row.status === 'Approved' && <span className="badge-status-active">Approved</span>}
                  {row.status === 'Rejected' && <span className="badge-status-cancelled">Rejected</span>}
                </td>
                <td>
                  <div className="table-action-btns">
                    <button className="action-btn-sm">View</button>
                    {row.status === 'Pending' && (
                      <>
                        <button className="action-btn-sm" style={{ color: '#16A34A', border: 'none' }} onClick={() => handleAction(row.id, 'Approved')}>Approve</button>
                        <button className="action-btn-sm" style={{ color: '#DC2626', border: 'none' }} onClick={() => handleAction(row.id, 'Rejected')}>Reject</button>
                      </>
                    )}
                    {row.status === 'Approved' && (
                      <button className="action-btn-sm" style={{ color: '#D97706', border: 'none' }} onClick={() => handleAction(row.id, 'Pending')}>Suspend</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverApplicationsPage;
