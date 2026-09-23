import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const StopsManagement = () => {
  const [filter, setFilter] = useState('All');

  const stopsData = [
    { id: 'KBS-001', name: 'Kandy Bus Stand', type: 'Bus Terminal', routes: '12', latlng: '7.2905, 80.6337', status: 'Active' },
    { id: 'KRS-001', name: 'Kandy Railway Station', type: 'Train Station', routes: '5', latlng: '7.2961, 80.6350', status: 'Active' },
    { id: 'PER-001', name: 'Peradeniya Junction', type: 'Train Station', routes: '4', latlng: '7.2685, 80.5946', status: 'Active' },
    { id: 'COF-001', name: 'Colombo Fort Station', type: 'Bus + Train', routes: '24', latlng: '6.9344, 79.8428', status: 'Active' },
    { id: 'NUG-002', name: 'Nugegoda Stand', type: 'Bus Terminal', routes: '8', latlng: '6.8720, 79.8898', status: 'Maintenance' },
  ];

  const filteredData = stopsData.filter(s => {
    if (filter === 'All') return true;
    if (filter === 'Bus Terminal') return s.type === 'Bus Terminal';
    if (filter === 'Train Station') return s.type === 'Train Station';
    if (filter === 'Bus + Train') return s.type === 'Bus + Train';
    return true;
  });

  return (
    <div className="page-container fade-in">
      {/* Subheader Toolbar */}
      <div className="page-toolbar">
        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          <button className={`pill-btn ${filter === 'Bus Terminal' ? 'active' : ''}`} onClick={() => setFilter('Bus Terminal')}>Bus Terminal</button>
          <button className={`pill-btn ${filter === 'Train Station' ? 'active' : ''}`} onClick={() => setFilter('Train Station')}>Train Station</button>
          <button className={`pill-btn ${filter === 'Bus + Train' ? 'active' : ''}`} onClick={() => setFilter('Bus + Train')}>Bus + Train</button>
        </div>

        <button className="btn-blue-action">
          <Plus size={16} />
          <span>Add Stop</span>
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>STOP NAME</th>
              <th>TYPE</th>
              <th>ROUTES</th>
              <th>LAT/LNG</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td style={{ color: '#94A3B8', fontFamily: 'monospace', fontWeight: '600' }}>{row.id}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.name}</td>
                <td style={{ fontWeight: '500', color: '#475569' }}>{row.type}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.routes}</td>
                <td style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '13px' }}>{row.latlng}</td>
                <td>
                  {row.status === 'Active' ? (
                    <span className="badge-status-active">Active</span>
                  ) : (
                    <span className="badge-status-delayed">Maintenance</span>
                  )}
                </td>
                <td>
                  <div className="table-action-btns">
                    <button className="action-btn-sm">Edit</button>
                    <button className="action-btn-sm">Routes</button>
                    <button className="action-btn-sm" style={{ color: '#DC2626', borderColor: '#FCA5A5' }}>Remove</button>
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

export default StopsManagement;
