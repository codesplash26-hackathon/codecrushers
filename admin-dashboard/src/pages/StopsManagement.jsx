import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Route } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import adminService from '../services/adminService';

const StopsManagement = () => {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stopsData, setStopsData] = useState([
    { id: 'KBS-001', name: 'Kandy Bus Stand', type: 'Bus Terminal', routes: '12', latlng: '7.2905, 80.6337', status: 'Active' },
    { id: 'KRS-001', name: 'Kandy Railway Station', type: 'Train Station', routes: '5', latlng: '7.2961, 80.6350', status: 'Active' },
    { id: 'PER-001', name: 'Peradeniya Junction', type: 'Train Station', routes: '4', latlng: '7.2685, 80.5946', status: 'Active' },
    { id: 'COF-001', name: 'Colombo Fort Station', type: 'Bus + Train', routes: '24', latlng: '6.9344, 79.8428', status: 'Active' },
    { id: 'NUG-002', name: 'Nugegoda Stand', type: 'Bus Terminal', routes: '8', latlng: '6.8720, 79.8898', status: 'Maintenance' },
  ]);

  // Modal Form State (Add)
  const [name, setName] = useState('');
  const [type, setType] = useState('Bus Terminal');
  const [routes, setRoutes] = useState('8');
  const [lat, setLat] = useState('7.2905');
  const [lng, setLng] = useState('80.6337');
  const [status, setStatus] = useState('Active');

  // Modal Form State (Edit)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStopId, setEditingStopId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('Bus Terminal');
  const [editRoutes, setEditRoutes] = useState('8');
  const [editLat, setEditLat] = useState('');
  const [editLng, setEditLng] = useState('');
  const [editStatus, setEditStatus] = useState('Active');

  // Modal State (Routes Manager)
  const [isRoutesModalOpen, setIsRoutesModalOpen] = useState(false);
  const [selectedStopForRoutes, setSelectedStopForRoutes] = useState(null);
  const [stopRoutesList, setStopRoutesList] = useState([]);
  const [newRouteInput, setNewRouteInput] = useState('');

  const fetchStops = async () => {
    try {
      const res = await adminService.getStops();
      if (res.success && Array.isArray(res.stops) && res.stops.length > 0) {
        const apiStops = res.stops.map((s, idx) => {
          const typeStr = (s.type || '').toLowerCase();
          let displayType = 'Bus Terminal';
          if (typeStr.includes('rail') || typeStr.includes('train')) displayType = 'Train Station';
          else if (typeStr.includes('terminal') || typeStr.includes('both')) displayType = 'Bus + Train';

          let latVal = s.location?.latitude || (s.coordinates && s.coordinates[1]) || 7.2905;
          let lngVal = s.location?.longitude || (s.coordinates && s.coordinates[0]) || 80.6337;

          return {
            id: s._id || `STP-${idx + 1}`,
            name: s.name || 'Station',
            type: displayType,
            routes: s.routesCount ? String(s.routesCount) : '8',
            latlng: `${latVal}, ${lngVal}`,
            status: s.status || 'Active',
          };
        });
        setStopsData(apiStops);
      }
    } catch (err) {
      console.error('Failed to fetch stops:', err);
    }
  };

  useEffect(() => {
    fetchStops();
  }, []);

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      const stopType = type === 'Train Station' ? 'railway_station' : type === 'Bus + Train' ? 'terminal' : 'bus_stop';
      await adminService.createStop({
        name,
        type: stopType,
        location: {
          latitude: Number(lat) || 7.2905,
          longitude: Number(lng) || 80.6337,
        },
        lat: Number(lat) || 7.2905,
        lng: Number(lng) || 80.6337,
        routes: Number(routes) || 8,
        status,
      });
      addToast(`New stop "${name}" saved to database!`, 'success');
      setIsModalOpen(false);
      setName('');
      setType('Bus Terminal');
      setRoutes('8');
      setLat('7.2905');
      setLng('80.6337');
      setStatus('Active');
      await fetchStops();
    } catch (err) {
      addToast(`Failed to create stop: ${err.message}`, 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (stop) => {
    setEditingStopId(stop.id);
    setEditName(stop.name);
    setEditType(stop.type);
    setEditRoutes(stop.routes);
    const coords = stop.latlng.split(',').map(c => c.trim());
    setEditLat(coords[0] || '7.2905');
    setEditLng(coords[1] || '80.6337');
    setEditStatus(stop.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const stopType = editType === 'Train Station' ? 'railway_station' : editType === 'Bus + Train' ? 'terminal' : 'bus_stop';
      if (editingStopId && !editingStopId.startsWith('STP-')) {
        await adminService.updateStop(editingStopId, {
          name: editName,
          type: stopType,
          location: {
            latitude: Number(editLat) || 7.2905,
            longitude: Number(editLng) || 80.6337,
          },
          routes: Number(editRoutes) || 8,
          status: editStatus,
        });
      }
      addToast(`Stop "${editName}" updated successfully!`, 'success');
      setIsEditModalOpen(false);
      await fetchStops();
    } catch (err) {
      addToast(`Failed to update stop: ${err.message}`, 'error');
    }
  };

  // Open Routes Modal for Stop
  const handleOpenRoutesModal = (stop) => {
    setSelectedStopForRoutes(stop);
    
    const sampleRoutes = stop.name.includes('Kandy')
      ? ['Route 654: Kandy ➔ Colombo Fort', 'Route 780: Kandy ➔ Matale', 'Intercity Train: Kandy ➔ Colombo']
      : stop.name.includes('Peradeniya')
      ? ['Route 681: Kandy ➔ Peradeniya', 'Express Train: Kandy ➔ Colombo Fort']
      : ['Route 120: Colombo ➔ Horana', 'Route 100: Colombo ➔ Moratuwa', 'Coastal Line Express Train'];

    setStopRoutesList(sampleRoutes);
    setNewRouteInput('');
    setIsRoutesModalOpen(true);
  };

  const handleAddRouteToStop = (e) => {
    e.preventDefault();
    if (!newRouteInput.trim()) return;

    const updatedList = [...stopRoutesList, newRouteInput.trim()];
    setStopRoutesList(updatedList);

    if (selectedStopForRoutes) {
      setStopsData(prev => prev.map(s => s.id === selectedStopForRoutes.id ? { ...s, routes: String(updatedList.length) } : s));
    }

    addToast(`Associated route "${newRouteInput.trim()}" with stop`, 'success');
    setNewRouteInput('');
  };

  const handleRemoveRouteFromStop = (indexToRemove) => {
    const updatedList = stopRoutesList.filter((_, idx) => idx !== indexToRemove);
    setStopRoutesList(updatedList);

    if (selectedStopForRoutes) {
      setStopsData(prev => prev.map(s => s.id === selectedStopForRoutes.id ? { ...s, routes: String(updatedList.length) } : s));
    }

    addToast(`Route association removed from stop`, 'info');
  };

  const handleDeleteStop = async (id, stopName) => {
    setStopsData(prev => prev.filter(s => s.id !== id));
    try {
      if (id && !id.startsWith('K') && !id.startsWith('P') && !id.startsWith('C') && !id.startsWith('N')) {
        await adminService.deleteStop(id);
      }
      addToast(`Stop "${stopName}" removed`, 'info');
    } catch {
      addToast(`Stop "${stopName}" removed locally`, 'info');
    }
  };

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

        <button className="btn-blue-action" onClick={() => setIsModalOpen(true)}>
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
                    <button className="action-btn-sm" onClick={() => handleOpenEditModal(row)}>Edit</button>
                    <button className="action-btn-sm" onClick={() => handleOpenRoutesModal(row)}>Routes</button>
                    <button 
                      className="action-btn-sm" 
                      style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                      onClick={() => handleDeleteStop(row.id, row.name)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Stop Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transit Stop / Station">
        <form onSubmit={handleAddStop}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">STOP / STATION NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Galle Railway Station"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">STATION TYPE</label>
              <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Bus Terminal">Bus Terminal</option>
                <option value="Train Station">Train Station</option>
                <option value="Bus + Train">Bus + Train</option>
              </select>
            </div>

            <div>
              <label className="form-label">CONNECTED ROUTES</label>
              <input
                type="number"
                className="form-input"
                value={routes}
                onChange={(e) => setRoutes(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">LATITUDE</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 7.2905"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">LONGITUDE</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 80.6337"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">STATUS</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Create Stop</button>
          </div>
        </form>
      </Modal>

      {/* Edit Stop Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Transit Stop / Station">
        <form onSubmit={handleSaveEdit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">STOP / STATION NAME</label>
            <input
              type="text"
              className="form-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">STATION TYPE</label>
              <select className="form-input" value={editType} onChange={(e) => setEditType(e.target.value)}>
                <option value="Bus Terminal">Bus Terminal</option>
                <option value="Train Station">Train Station</option>
                <option value="Bus + Train">Bus + Train</option>
              </select>
            </div>

            <div>
              <label className="form-label">CONNECTED ROUTES</label>
              <input
                type="number"
                className="form-input"
                value={editRoutes}
                onChange={(e) => setEditRoutes(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">LATITUDE</label>
              <input
                type="text"
                className="form-input"
                value={editLat}
                onChange={(e) => setEditLat(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">LONGITUDE</label>
              <input
                type="text"
                className="form-input"
                value={editLng}
                onChange={(e) => setEditLng(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">STATUS</label>
              <select className="form-input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Routes Passing Through Stop Modal */}
      <Modal isOpen={isRoutesModalOpen} onClose={() => setIsRoutesModalOpen(false)} title={`Routes Passing Through: ${selectedStopForRoutes?.name || ''}`}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>
            <Route size={16} color="#2563EB" />
            <span>Connected Routes: <strong>{stopRoutesList.length}</strong></span>
          </div>

          {/* Add Route Form */}
          <form onSubmit={handleAddRouteToStop} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter route to associate..."
              value={newRouteInput}
              onChange={(e) => setNewRouteInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px', padding: '0 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
              <Plus size={14} /> Add Route
            </button>
          </form>

          {/* Routes List */}
          <div style={{ maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
            {stopRoutesList.map((routeItem, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563EB' }}>#{idx + 1}</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{routeItem}</span>
                </div>

                <button 
                  type="button" 
                  onClick={() => handleRemoveRouteFromStop(idx)}
                  style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                  title="Remove route association"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button 
              type="button" 
              className="btn-blue-action" 
              style={{ borderRadius: '10px', padding: '8px 24px' }} 
              onClick={() => setIsRoutesModalOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StopsManagement;


