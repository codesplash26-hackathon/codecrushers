import React, { useState } from 'react';

const VehicleManagementPage = () => {
  const [filter, setFilter] = useState('All');

  const vehiclesData = [
    { id: 'V001', type: '🚖 Taxi', number: 'WP CAB-5512', model: 'Toyota Prius (Silver)', driver: 'Nimal Silva', status: 'Available', location: 'Kandy City', rating: '4.8 ⭐' },
    { id: 'V002', type: '🚖 Taxi', number: 'WP CAB-1234', model: 'Honda Fit (White)', driver: 'Kasun Perera', status: 'Busy', location: 'Peradeniya', rating: '4.6 ⭐' },
    { id: 'V003', type: '🛺 Tuk-tuk', number: 'CP TUK-0098', model: 'Bajaj RE (Yellow)', driver: 'Roshan J.', status: 'Offline', location: 'Last seen: Kandy', rating: '4.9 ⭐' },
    { id: 'V004', type: '🛺 Tuk-tuk', number: 'WP TUK-3321', model: 'Piaggio Ape (Green)', driver: 'Sampath K.', status: 'On Break', location: 'Colombo Fort', rating: '4.3 ⭐' },
    { id: 'V005', type: '🚖 Taxi', number: 'WP CAK-8871', model: 'Suzuki Alto (Blue)', driver: 'Priya F.', status: 'Suspended', location: 'N/A', rating: '3.9 ⭐' },
  ];

  const filteredData = vehiclesData.filter(v => {
    if (filter === 'All') return true;
    if (filter === 'Taxi') return v.type.includes('Taxi');
    if (filter === 'Tuk-tuk') return v.type.includes('Tuk-tuk');
    if (filter === 'Available') return v.status === 'Available';
    if (filter === 'Busy') return v.status === 'Busy';
    if (filter === 'Offline') return v.status === 'Offline';
    if (filter === 'Suspended') return v.status === 'Suspended';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge-status-active">Available</span>;
      case 'Busy':
        return <span className="badge-status-delayed">Busy</span>;
      case 'Offline':
        return <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>Offline</span>;
      case 'On Break':
        return <span style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>On Break</span>;
      case 'Suspended':
        return <span className="badge-status-cancelled">Suspended</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="page-container fade-in">
      {/* Subheader Toolbar */}
      <div className="page-toolbar" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Vehicle Management</h2>

        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          <button className={`pill-btn ${filter === 'Taxi' ? 'active' : ''}`} onClick={() => setFilter('Taxi')}>Taxi</button>
          <button className={`pill-btn ${filter === 'Tuk-tuk' ? 'active' : ''}`} onClick={() => setFilter('Tuk-tuk')}>Tuk-tuk</button>
          <button className={`pill-btn ${filter === 'Available' ? 'active' : ''}`} onClick={() => setFilter('Available')}>Available</button>
          <button className={`pill-btn ${filter === 'Busy' ? 'active' : ''}`} onClick={() => setFilter('Busy')}>Busy</button>
          <button className={`pill-btn ${filter === 'Offline' ? 'active' : ''}`} onClick={() => setFilter('Offline')}>Offline</button>
          <button className={`pill-btn ${filter === 'Suspended' ? 'active' : ''}`} onClick={() => setFilter('Suspended')}>Suspended</button>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>TYPE</th>
              <th>NUMBER</th>
              <th>MODEL</th>
              <th>DRIVER</th>
              <th>STATUS</th>
              <th>LOCATION</th>
              <th>RATING</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td style={{ color: '#94A3B8', fontFamily: 'monospace', fontWeight: '600' }}>{row.id}</td>
                <td style={{ fontWeight: '600', color: '#334155' }}>{row.type}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0F172A' }}>{row.number}</td>
                <td style={{ color: '#475569', fontSize: '13px' }}>{row.model}</td>
                <td style={{ fontWeight: '600', color: '#0F172A' }}>{row.driver}</td>
                <td>{getStatusBadge(row.status)}</td>
                <td style={{ color: '#64748B', fontSize: '13px' }}>{row.location}</td>
                <td style={{ fontWeight: '800', color: '#D97706' }}>{row.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleManagementPage;
