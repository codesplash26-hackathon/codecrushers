import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const DisruptionManagement = () => {
  const [filter, setFilter] = useState('All');

  const disruptionsData = [
    { id: '1', service: 'Kandy Express', mode: 'Train', location: 'Peradeniya', status: 'Delayed', impact: 'High', updated: '2 min ago' },
    { id: '2', service: 'Route 654', mode: 'Bus', location: 'Kandy Rd', status: 'Diverted', impact: 'Medium', updated: '8 min ago' },
    { id: '3', service: 'Intercity 55', mode: 'Train', location: 'Colombo Fort', status: 'Cancelled', impact: 'High', updated: '15 min ago' },
    { id: '4', service: 'Route 120', mode: 'Bus', location: 'Nugegoda', status: 'Delayed', impact: 'Low', updated: '22 min ago' },
    { id: '5', service: 'Night Mail', mode: 'Train', location: 'Galle', status: 'On Time', impact: 'None', updated: '1h ago' },
  ];

  const filteredData = disruptionsData.filter(d => {
    if (filter === 'All') return true;
    if (filter === 'Train') return d.mode === 'Train';
    if (filter === 'Bus') return d.mode === 'Bus';
    if (filter === 'High Impact') return d.impact === 'High';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delayed':
        return <span className="badge-status-delayed">Delayed</span>;
      case 'Diverted':
        return <span className="badge-status-diverted">Diverted</span>;
      case 'Cancelled':
        return <span className="badge-status-cancelled">Cancelled</span>;
      case 'On Time':
        return <span className="badge-status-ontime">On Time</span>;
      default:
        return <span className="badge-status-ontime">{status}</span>;
    }
  };

  const getImpactStyle = (impact) => {
    switch (impact) {
      case 'High': return 'impact-high';
      case 'Medium': return 'impact-medium';
      case 'Low': return 'impact-low';
      default: return 'impact-none';
    }
  };

  return (
    <div className="page-container fade-in">
      {/* Subheader Filter Bar & Action Button */}
      <div className="page-toolbar">
        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          <button className={`pill-btn ${filter === 'Train' ? 'active' : ''}`} onClick={() => setFilter('Train')}>Train</button>
          <button className={`pill-btn ${filter === 'Bus' ? 'active' : ''}`} onClick={() => setFilter('Bus')}>Bus</button>
          <button className={`pill-btn ${filter === 'High Impact' ? 'active' : ''}`} onClick={() => setFilter('High Impact')}>High Impact</button>
        </div>

        <button className="btn-red-action">
          <Plus size={16} />
          <span>Add Disruption</span>
        </button>
      </div>

      {/* Main Disruptions Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>SERVICE</th>
              <th>MODE</th>
              <th>LOCATION</th>
              <th>STATUS</th>
              <th>IMPACT</th>
              <th>UPDATED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.service}</td>
                <td>
                  <span className={row.mode === 'Train' ? 'badge-train' : 'badge-bus'}>
                    {row.mode}
                  </span>
                </td>
                <td style={{ color: '#475569', fontWeight: '500' }}>{row.location}</td>
                <td>{getStatusBadge(row.status)}</td>
                <td><span className={getImpactStyle(row.impact)}>{row.impact}</span></td>
                <td style={{ color: '#94A3B8', fontSize: '13px' }}>{row.updated}</td>
                <td>
                  <div className="table-action-btns">
                    <button className="action-btn-sm">View</button>
                    <button className="action-btn-sm">Edit</button>
                    <button className="action-btn-sm">Resolve</button>
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

export default DisruptionManagement;
