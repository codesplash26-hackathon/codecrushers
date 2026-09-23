import React, { useState } from 'react';

const DriverManagementPage = () => {
  const [filter, setFilter] = useState('All');

  const driversData = [
    { id: '1', name: 'Nimal Silva', phone: '+94 71 234 5678', vehicle: 'Taxi', plate: 'WP CAB-5512', rating: '4.8 ⭐', trips: 142, status: 'Available', verified: true },
    { id: '2', name: 'Kasun Perera', phone: '+94 77 123 4567', vehicle: 'Taxi', plate: 'WP CAB-1234', rating: '4.6 ⭐', trips: 89, status: 'Busy', verified: true },
    { id: '3', name: 'Roshan J.', phone: '+94 77 456 7890', vehicle: 'Tuk-tuk', plate: 'CP TUK-0098', rating: '4.9 ⭐', trips: 231, status: 'Offline', verified: true },
    { id: '4', name: 'Sampath K.', phone: '+94 70 567 8901', vehicle: 'Tuk-tuk', plate: 'WP TUK-3321', rating: '4.3 ⭐', trips: 55, status: 'On Break', verified: false },
  ];

  const filteredData = driversData.filter(d => {
    if (filter === 'All') return true;
    if (filter === 'Available') return d.status === 'Available';
    if (filter === 'Busy') return d.status === 'Busy';
    if (filter === 'Offline') return d.status === 'Offline';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge-status-active">● Available</span>;
      case 'Busy':
        return <span className="badge-status-delayed">● Busy</span>;
      case 'Offline':
        return <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>● Offline</span>;
      case 'On Break':
        return <span style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>● On Break</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="page-container fade-in">
      {/* Subheader Toolbar */}
      <div className="page-toolbar" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Driver Management</h2>

        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          <button className={`pill-btn ${filter === 'Available' ? 'active' : ''}`} onClick={() => setFilter('Available')}>Available</button>
          <button className={`pill-btn ${filter === 'Busy' ? 'active' : ''}`} onClick={() => setFilter('Busy')}>Busy</button>
          <button className={`pill-btn ${filter === 'Offline' ? 'active' : ''}`} onClick={() => setFilter('Offline')}>Offline</button>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>DRIVER</th>
              <th>VEHICLE</th>
              <th>RATING</th>
              <th>TOTAL TRIPS</th>
              <th>STATUS</th>
              <th>VERIFIED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td>
                  <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.name}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{row.phone}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: '#334155' }}>{row.vehicle}</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748B' }}>{row.plate}</div>
                </td>
                <td style={{ fontWeight: '800', color: '#D97706' }}>{row.rating}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.trips}</td>
                <td>{getStatusBadge(row.status)}</td>
                <td>
                  {row.verified ? (
                    <span style={{ color: '#16A34A', fontWeight: '700', fontSize: '13px' }}>✓ Verified</span>
                  ) : (
                    <span style={{ color: '#DC2626', fontWeight: '700', fontSize: '13px' }}>X Unverified</span>
                  )}
                </td>
                <td>
                  <div className="table-action-btns">
                    <button className="action-btn-sm">View</button>
                    <button className="action-btn-sm">Edit</button>
                    <button className="action-btn-sm" style={{ color: '#D97706', border: 'none' }}>
                      {row.status === 'Offline' ? 'Reactivate' : 'Suspend'}
                    </button>
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

export default DriverManagementPage;
