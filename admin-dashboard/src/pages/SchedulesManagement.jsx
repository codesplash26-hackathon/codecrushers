import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import adminService from '../services/adminService';

const SchedulesManagement = () => {
  const [filter, setFilter] = useState('All Schedules');
  const [schedulesData, setSchedulesData] = useState([
    { id: 'SCH-001', route: 'Kandy ➔ Colombo Fort', service: 'Route 654', departure: '6:00 AM', arrival: '8:30 AM', days: 'Mon-Sun', stops: '17', fare: 'Rs. 120', status: 'Active' },
    { id: 'SCH-002', route: 'Kandy ➔ Colombo Fort', service: 'IC Express', departure: '7:30 AM', arrival: '9:45 AM', days: 'Mon-Fri', stops: '8', fare: 'Rs. 160', status: 'Active' },
    { id: 'SCH-003', route: 'Kandy ➔ Peradeniya', service: 'Route 681', departure: '5:30 AM', arrival: '5:55 AM', days: 'Mon-Sun', stops: '6', fare: 'Rs. 40', status: 'Active' },
    { id: 'SCH-004', route: 'Colombo ➔ Galle', service: 'Night Mail', departure: '9:15 PM', arrival: '11:30 PM', days: 'Fri-Sun', stops: '12', fare: 'Rs. 200', status: 'Inactive' },
    { id: 'SCH-005', route: 'Kandy ➔ Matale', service: 'Route 780', departure: '7:00 AM', arrival: '7:45 AM', days: 'Mon-Sat', stops: '14', fare: 'Rs. 95', status: 'Active' },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.getSchedules();
        if (res.success && Array.isArray(res.schedules) && res.schedules.length > 0) {
          const apiData = res.schedules.map((s, idx) => ({
            id: s._id || `SCH-00${idx + 1}`,
            route: s.route?.name || 'Kandy ➔ Colombo Fort',
            service: s.service?.name || 'Express Service',
            departure: s.departureTime || '6:00 AM',
            arrival: s.arrivalTime || '8:30 AM',
            days: s.operatingDays?.join(', ') || 'Mon-Sun',
            stops: '12',
            fare: `Rs. ${s.fare || 150}`,
            status: s.isActive === false ? 'Inactive' : 'Active',
          }));
          setSchedulesData(apiData);
        }
      } catch {
        // Fallback
      }
    })();
  }, []);

  const filteredData = schedulesData.filter(s => {
    if (filter === 'All Schedules') return true;
    if (filter === 'Active') return s.status === 'Active';
    if (filter === 'Inactive') return s.status === 'Inactive';
    if (filter === 'Needs Review') return false;
    return true;
  });

  return (
    <div className="page-container fade-in">
      {/* Subheader Toolbar */}
      <div className="page-toolbar">
        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All Schedules' ? 'active' : ''}`} onClick={() => setFilter('All Schedules')}>All Schedules</button>
          <button className={`pill-btn ${filter === 'Active' ? 'active' : ''}`} onClick={() => setFilter('Active')}>Active</button>
          <button className={`pill-btn ${filter === 'Inactive' ? 'active' : ''}`} onClick={() => setFilter('Inactive')}>Inactive</button>
          <button className={`pill-btn ${filter === 'Needs Review' ? 'active' : ''}`} onClick={() => setFilter('Needs Review')}>Needs Review</button>
        </div>

        <button className="btn-blue-action">
          <Plus size={16} />
          <span>Add Schedule</span>
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ROUTE</th>
              <th>SERVICE</th>
              <th>DEPARTURE</th>
              <th>ARRIVAL</th>
              <th>DAYS</th>
              <th>STOPS</th>
              <th>FARE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td style={{ color: '#94A3B8', fontFamily: 'monospace', fontWeight: '600' }}>{row.id}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.route}</td>
                <td style={{ fontWeight: '500', color: '#475569' }}>{row.service}</td>
                <td style={{ fontWeight: '800', color: '#2563EB' }}>{row.departure}</td>
                <td style={{ fontWeight: '800', color: '#16A34A' }}>{row.arrival}</td>
                <td style={{ fontWeight: '500', color: '#64748B', fontSize: '13px' }}>{row.days}</td>
                <td style={{ fontWeight: '600', color: '#0F172A' }}>{row.stops}</td>
                <td style={{ fontWeight: '800', color: '#16A34A' }}>{row.fare}</td>
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
                    <button className="action-btn-sm">Stops</button>
                    {row.status === 'Active' ? (
                      <button className="action-btn-sm" style={{ color: '#DC2626', borderColor: '#FCA5A5' }}>Deactivate</button>
                    ) : (
                      <button className="action-btn-sm" style={{ color: '#16A34A', borderColor: '#86EFAC' }}>Activate</button>
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

export default SchedulesManagement;
