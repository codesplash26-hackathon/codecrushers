import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import adminService from '../services/adminService';

const DisruptionManagement = () => {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [disruptionsData, setDisruptionsData] = useState([
    { id: '1', service: 'Kandy Express', mode: 'Train', location: 'Peradeniya', status: 'Delayed', impact: 'High', updated: '2 min ago' },
    { id: '2', service: 'Route 654', mode: 'Bus', location: 'Kandy Rd', status: 'Diverted', impact: 'Medium', updated: '8 min ago' },
    { id: '3', service: 'Intercity 55', mode: 'Train', location: 'Colombo Fort', status: 'Cancelled', impact: 'High', updated: '15 min ago' },
    { id: '4', service: 'Route 120', mode: 'Bus', location: 'Nugegoda', status: 'Delayed', impact: 'Low', updated: '22 min ago' },
    { id: '5', service: 'Night Mail', mode: 'Train', location: 'Galle', status: 'On Time', impact: 'None', updated: '1h ago' },
  ]);

  // Modal Form State
  const [service, setService] = useState('');
  const [mode, setMode] = useState('Bus');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Delayed');
  const [impact, setImpact] = useState('High');

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.getDisruptions();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const apiData = res.data.map((d, idx) => ({
            id: d._id || `api-dis-${idx}`,
            service: d.title || d.affectedService?.name || 'Service Disruption',
            mode: d.affectedService?.type === 'train' ? 'Train' : 'Bus',
            location: d.description || 'Active Section',
            status: d.status === 'RESOLVED' ? 'On Time' : d.disruptionType || 'Delayed',
            impact: d.severity || 'High',
            updated: 'Just now',
          }));
          setDisruptionsData(apiData);
        }
      } catch {
        // Fallback to default
      }
    })();
  }, []);

  const handleAddDisruption = async (e) => {
    e.preventDefault();
    if (!service || !location) return;

    const newEntry = {
      id: Date.now().toString(),
      service,
      mode,
      location,
      status,
      impact,
      updated: 'Just now',
    };

    setDisruptionsData([newEntry, ...disruptionsData]);

    try {
      await adminService.createDisruption({
        title: service,
        description: location,
        disruptionType: status,
        severity: impact,
      });
      addToast(`Disruption broadcasted for ${service}!`, 'success');
    } catch {
      addToast(`Disruption created locally for ${service}`, 'success');
    }

    setIsModalOpen(false);
    setService('');
    setLocation('');
  };

  const handleResolve = async (id, serviceName) => {
    setDisruptionsData(disruptionsData.map(d => d.id === id ? { ...d, status: 'On Time', impact: 'None', updated: 'Just now' } : d));
    try {
      if (id && !id.startsWith('1') && !id.startsWith('2')) {
        await adminService.resolveDisruption(id);
      }
    } catch {
      // ignore
    }
    addToast(`Disruption resolved for ${serviceName}`, 'success');
  };

  const filteredData = disruptionsData.filter(d => {
    if (filter === 'All') return true;
    if (filter === 'Train') return d.mode === 'Train';
    if (filter === 'Bus') return d.mode === 'Bus';
    if (filter === 'High Impact') return d.impact === 'High';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delayed': return <span className="badge-status-delayed">Delayed</span>;
      case 'Diverted': return <span className="badge-status-diverted">Diverted</span>;
      case 'Cancelled': return <span className="badge-status-cancelled">Cancelled</span>;
      case 'On Time': return <span className="badge-status-ontime">On Time</span>;
      default: return <span className="badge-status-ontime">{status}</span>;
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
      {/* Subheader Toolbar */}
      <div className="page-toolbar">
        <div className="filter-pills">
          <button className={`pill-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          <button className={`pill-btn ${filter === 'Train' ? 'active' : ''}`} onClick={() => setFilter('Train')}>Train</button>
          <button className={`pill-btn ${filter === 'Bus' ? 'active' : ''}`} onClick={() => setFilter('Bus')}>Bus</button>
          <button className={`pill-btn ${filter === 'High Impact' ? 'active' : ''}`} onClick={() => setFilter('High Impact')}>High Impact</button>
        </div>

        <button className="btn-red-action" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add Disruption</span>
        </button>
      </div>

      {/* Table */}
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
                    <button className="action-btn-sm" onClick={() => addToast(`Inspecting ${row.service}`, 'info')}>View</button>
                    <button className="action-btn-sm" onClick={() => addToast(`Editing ${row.service}`, 'info')}>Edit</button>
                    {row.status !== 'On Time' && (
                      <button className="action-btn-sm" style={{ color: '#16A34A' }} onClick={() => handleResolve(row.id, row.service)}>Resolve</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Smart Modal for Adding Disruption */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast New Service Disruption">
        <form onSubmit={handleAddDisruption}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">SERVICE NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Kandy Express Bus"
              value={service}
              onChange={(e) => setService(e.target.value)}
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
              <label className="form-label">STATUS</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Delayed">Delayed</option>
                <option value="Diverted">Diverted</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">LOCATION</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Peradeniya / Kandy Rd"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">IMPACT LEVEL</label>
              <select className="form-input" value={impact} onChange={(e) => setImpact(e.target.value)}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-red-action" style={{ borderRadius: '10px' }}>Broadcast Incident</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DisruptionManagement;
