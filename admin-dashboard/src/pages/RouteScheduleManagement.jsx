import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const RouteScheduleManagement = () => {
  const [filter, setFilter] = useState('All Routes');

  const routesData = [
    { id: 'R001', name: 'Kandy ➔ Colombo Fort', mode: 'Train', stops: 12, departure: '6:00 AM', arrival: '8:30 AM', fare: 'Rs.160', status: 'Active' },
    { id: 'R002', name: 'Route 654 Kandy Loop', mode: 'Bus', stops: 28, departure: '5:30 AM', arrival: 'Frequent', fare: 'Rs.120', status: 'Active' },
    { id: 'R003', name: 'Peradeniya Express', mode: 'Train', stops: 4, departure: '7:15 AM', arrival: '7:35 AM', fare: 'Rs.80', status: 'Delayed' },
    { id: 'R004', name: 'Colombo Metro 5', mode: 'Bus', stops: 18, departure: '6:00 AM', arrival: 'Frequent', fare: 'Rs.50', status: 'Active' },
  ];

  const filteredData = routesData.filter(r => {
    if (filter === 'All Routes') return true;
    if (filter === 'Train') return r.mode === 'Train';
    if (filter === 'Bus') return r.mode === 'Bus';
    if (filter === 'Active') return r.status === 'Active';
    if (filter === 'Disrupted') return r.status === 'Delayed';
    return true;
  });

  return (
    <div className="page-container fade-in">
      {/* Subheader Filter Bar & Action Button */}
      <div className="page-toolbar">
        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All Routes' ? 'active' : ''}`} onClick={() => setFilter('All Routes')}>All Routes</button>
          <button className={`pill-btn ${filter === 'Train' ? 'active' : ''}`} onClick={() => setFilter('Train')}>Train</button>
          <button className={`pill-btn ${filter === 'Bus' ? 'active' : ''}`} onClick={() => setFilter('Bus')}>Bus</button>
          <button className={`pill-btn ${filter === 'Active' ? 'active' : ''}`} onClick={() => setFilter('Active')}>Active</button>
          <button className={`pill-btn ${filter === 'Disrupted' ? 'active' : ''}`} onClick={() => setFilter('Disrupted')}>Disrupted</button>
        </div>

        <button className="btn-blue-action">
          <Plus size={16} />
          <span>Add Route</span>
        </button>
      </div>

      {/* Routes Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ROUTE ID</th>
              <th>ROUTE NAME</th>
              <th>MODE</th>
              <th>STOPS</th>
              <th>DEPARTURE</th>
              <th>ARRIVAL</th>
              <th>FARE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td style={{ color: '#94A3B8', fontFamily: 'monospace', fontWeight: '600' }}>{row.id}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.name}</td>
                <td>
                  <span className={row.mode === 'Train' ? 'badge-train' : 'badge-bus'}>
                    {row.mode}
                  </span>
                </td>
                <td style={{ fontWeight: '600', color: '#475569' }}>{row.stops}</td>
                <td style={{ fontWeight: '500', color: '#334155' }}>{row.departure}</td>
                <td style={{ fontWeight: '500', color: '#334155' }}>{row.arrival}</td>
                <td style={{ fontWeight: '800', color: '#16A34A' }}>{row.fare}</td>
                <td>
                  {row.status === 'Active' ? (
                    <span className="badge-status-active">Active</span>
                  ) : (
                    <span className="badge-status-delayed">Delayed</span>
                  )}
                </td>
                <td>
                  <div className="table-action-btns">
                    <button className="action-btn-sm">Edit</button>
                    <button className="action-btn-sm">Stops</button>
                    <button className="action-btn-sm">Schedule</button>
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

export default RouteScheduleManagement;
