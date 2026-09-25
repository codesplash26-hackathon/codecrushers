import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const ServicesManagement = () => {
  const [filter, setFilter] = useState('All');

  const servicesData = [
    { id: 'S001', icon: '🚍', name: 'SLTB Kandy Express', mode: 'Bus', modeColor: '#2563EB', operator: 'SLTB', routes: '8', vehicles: '24', status: 'Active' },
    { id: 'S002', icon: '🚆', name: 'Sri Lanka Railways', mode: 'Train', modeColor: '#16A34A', operator: 'SLR', routes: '5', vehicles: '12', status: 'Active' },
    { id: 'S003', icon: '🚍', name: 'Kandy Private Bus', mode: 'Bus', modeColor: '#2563EB', operator: 'Private', routes: '14', vehicles: '38', status: 'Active' },
    { id: 'S004', icon: '🚖', name: 'PickMe Taxi', mode: 'Taxi', modeColor: '#D97706', operator: 'PickMe', routes: '-', vehicles: '142', status: 'Active' },
    { id: 'S005', icon: '🛺', name: 'Tuk Alliance LK', mode: 'Tuk-tuk', modeColor: '#DC2626', operator: 'Alliance', routes: '-', vehicles: '89', status: 'Active' },
    { id: 'S006', icon: '🚆', name: 'Night Mail Service', mode: 'Train', modeColor: '#16A34A', operator: 'SLR', routes: '2', vehicles: '3', status: 'Inactive' },
  ];

  const filteredData = servicesData.filter(s => {
    if (filter === 'All') return true;
    if (filter === 'Bus') return s.mode === 'Bus';
    if (filter === 'Train') return s.mode === 'Train';
    if (filter === 'Taxi') return s.mode === 'Taxi';
    if (filter === 'Tuk-tuk') return s.mode === 'Tuk-tuk';
    if (filter === 'Active') return s.status === 'Active';
    if (filter === 'Inactive') return s.status === 'Inactive';
    return true;
  });

  return (
    <div className="page-container fade-in">
      {/* Filter Bar & Action Button */}
      <div className="page-toolbar">
        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          <button className={`pill-btn ${filter === 'Bus' ? 'active' : ''}`} onClick={() => setFilter('Bus')}>Bus</button>
          <button className={`pill-btn ${filter === 'Train' ? 'active' : ''}`} onClick={() => setFilter('Train')}>Train</button>
          <button className={`pill-btn ${filter === 'Taxi' ? 'active' : ''}`} onClick={() => setFilter('Taxi')}>Taxi</button>
          <button className={`pill-btn ${filter === 'Tuk-tuk' ? 'active' : ''}`} onClick={() => setFilter('Tuk-tuk')}>Tuk-tuk</button>
          <button className={`pill-btn ${filter === 'Active' ? 'active' : ''}`} onClick={() => setFilter('Active')}>Active</button>
          <button className={`pill-btn ${filter === 'Inactive' ? 'active' : ''}`} onClick={() => setFilter('Inactive')}>Inactive</button>
        </div>

        <button className="btn-blue-action">
          <Plus size={16} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Top Row 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div className="kpi-card" style={{ padding: '18px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#2563EB', marginBottom: '2px' }}>6</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Total Services</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#16A34A', marginBottom: '2px' }}>5</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Active</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#0EA5E9', marginBottom: '2px' }}>308</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Total Vehicles</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#D97706', marginBottom: '2px' }}>29</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Total Routes</div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>SERVICE NAME</th>
              <th>MODE</th>
              <th>OPERATOR</th>
              <th>ROUTES</th>
              <th>VEHICLES</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td style={{ color: '#94A3B8', fontFamily: 'monospace', fontWeight: '600' }}>{row.id}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>
                  <span style={{ marginRight: '8px' }}>{row.icon}</span>
                  {row.name}
                </td>
                <td style={{ fontWeight: '700', color: row.modeColor, fontSize: '13px' }}>{row.mode}</td>
                <td style={{ fontWeight: '500', color: '#475569' }}>{row.operator}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.routes}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.vehicles}</td>
                <td>
                  {row.status === 'Active' ? (
                    <span className="badge-status-active">Active</span>
                  ) : (
                    <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>
                      Inactive
                    </span>
                  )}
                </td>
                <td>
                  <div className="table-action-btns">
                    <button className="action-btn-sm">Edit</button>
                    <button className="action-btn-sm">Routes</button>
                    {row.status === 'Active' ? (
                      <button className="action-btn-sm" style={{ color: '#DC2626', borderColor: '#FCA5A5' }}>Disable</button>
                    ) : (
                      <button className="action-btn-sm" style={{ color: '#16A34A', borderColor: '#86EFAC' }}>Enable</button>
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

export default ServicesManagement;
