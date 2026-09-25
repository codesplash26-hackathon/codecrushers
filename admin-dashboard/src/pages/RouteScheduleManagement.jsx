import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const RouteScheduleManagement = () => {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('All Routes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [routesData, setRoutesData] = useState([
    { id: 'R001', name: 'Kandy ➔ Colombo Fort', mode: 'Train', stops: 12, departure: '6:00 AM', arrival: '8:30 AM', fare: 'Rs.160', status: 'Active' },
    { id: 'R002', name: 'Route 654 Kandy Loop', mode: 'Bus', stops: 28, departure: '5:30 AM', arrival: 'Frequent', fare: 'Rs.120', status: 'Active' },
    { id: 'R003', name: 'Peradeniya Express', mode: 'Train', stops: 4, departure: '7:15 AM', arrival: '7:35 AM', fare: 'Rs.80', status: 'Delayed' },
    { id: 'R004', name: 'Colombo Metro 5', mode: 'Bus', stops: 18, departure: '6:00 AM', arrival: 'Frequent', fare: 'Rs.50', status: 'Active' },
  ]);

  // Modal State
  const [routeName, setRouteName] = useState('');
  const [mode, setMode] = useState('Bus');
  const [stopsCount, setStopsCount] = useState(10);
  const [departure, setDeparture] = useState('6:30 AM');
  const [arrival, setArrival] = useState('8:30 AM');
  const [fare, setFare] = useState(150);

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!routeName) return;

    const newId = `R00${routesData.length + 1}`;
    const newRoute = {
      id: newId,
      name: routeName,
      mode,
      stops: Number(stopsCount),
      departure,
      arrival,
      fare: `Rs.${fare}`,
      status: 'Active',
    };

    setRoutesData([...routesData, newRoute]);
    addToast(`New route ${newId} (${routeName}) created!`, 'success');
    setIsModalOpen(false);
    setRouteName('');
  };

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
      {/* Subheader Toolbar */}
      <div className="page-toolbar">
        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All Routes' ? 'active' : ''}`} onClick={() => setFilter('All Routes')}>All Routes</button>
          <button className={`pill-btn ${filter === 'Train' ? 'active' : ''}`} onClick={() => setFilter('Train')}>Train</button>
          <button className={`pill-btn ${filter === 'Bus' ? 'active' : ''}`} onClick={() => setFilter('Bus')}>Bus</button>
          <button className={`pill-btn ${filter === 'Active' ? 'active' : ''}`} onClick={() => setFilter('Active')}>Active</button>
          <button className={`pill-btn ${filter === 'Disrupted' ? 'active' : ''}`} onClick={() => setFilter('Disrupted')}>Disrupted</button>
        </div>

        <button className="btn-blue-action" onClick={() => setIsModalOpen(true)}>
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
                    <button className="action-btn-sm" onClick={() => addToast(`Editing ${row.name}`, 'info')}>Edit</button>
                    <button className="action-btn-sm" onClick={() => addToast(`Viewing ${row.stops} stops for ${row.id}`, 'info')}>Stops</button>
                    <button className="action-btn-sm" onClick={() => addToast(`Schedule timetable for ${row.name}`, 'info')}>Schedule</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Route Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transit Route">
        <form onSubmit={handleAddRoute}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">ROUTE NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Colombo ➔ Galle Express"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">MODE</label>
              <select className="form-input" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
              </select>
            </div>

            <div>
              <label className="form-label">NUMBER OF STOPS</label>
              <input
                type="number"
                className="form-input"
                value={stopsCount}
                onChange={(e) => setStopsCount(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">DEPARTURE</label>
              <input
                type="text"
                className="form-input"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">ARRIVAL</label>
              <input
                type="text"
                className="form-input"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">FARE (LKR)</label>
              <input
                type="number"
                className="form-input"
                value={fare}
                onChange={(e) => setFare(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Create Route</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RouteScheduleManagement;
