import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Clock } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import adminService from '../services/adminService';

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

  // Add Route Modal State
  const [routeName, setRouteName] = useState('');
  const [mode, setMode] = useState('Bus');
  const [stopsCount, setStopsCount] = useState(10);
  const [departure, setDeparture] = useState('6:30 AM');
  const [arrival, setArrival] = useState('8:30 AM');
  const [fare, setFare] = useState(150);

  // Edit Route Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [editRouteName, setEditRouteName] = useState('');
  const [editMode, setEditMode] = useState('Bus');
  const [editStops, setEditStops] = useState(10);
  const [editDeparture, setEditDeparture] = useState('');
  const [editArrival, setEditArrival] = useState('');
  const [editFare, setEditFare] = useState(150);
  const [editStatus, setEditStatus] = useState('Active');

  // Stops Modal State
  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);
  const [selectedRouteForStops, setSelectedRouteForStops] = useState(null);
  const [stopsList, setStopsList] = useState([]);
  const [newStopName, setNewStopName] = useState('');

  // Schedule Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedRouteForSchedule, setSelectedRouteForSchedule] = useState(null);
  const [scheduleDeparture, setScheduleDeparture] = useState('');
  const [scheduleArrival, setScheduleArrival] = useState('');
  const [scheduleDays, setScheduleDays] = useState('Mon-Sun (Daily)');
  const [scheduleFrequency, setScheduleFrequency] = useState('Every 20 mins');

  const fetchRoutes = async () => {
    try {
      const res = await adminService.getRoutes();
      if (res.success && Array.isArray(res.routes) && res.routes.length > 0) {
        const apiRoutes = res.routes.map((r, idx) => ({
          id: r._id || `R00${idx + 1}`,
          name: r.name || `${r.startLocation?.name || 'Kandy'} ➔ ${r.endLocation?.name || 'Colombo'}`,
          mode: (r.type?.toLowerCase().includes('train') || r.name?.toLowerCase().includes('express') || r.name?.toLowerCase().includes('rail')) ? 'Train' : 'Bus',
          stops: r.stops?.length || r.intermediateStops?.length || 12,
          departure: r.departure || '6:00 AM',
          arrival: r.arrival || `${r.estimatedDurationMinutes || 180} min`,
          fare: `Rs.${r.baseFare || 160}`,
          status: r.active === false ? 'Delayed' : 'Active',
        }));
        setRoutesData(apiRoutes);
      }
    } catch (err) {
      console.error('Failed to fetch routes:', err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (!routeName) return;

    try {
      await adminService.createRoute({
        name: routeName,
        type: mode.toLowerCase(),
        baseFare: Number(fare) || 150,
        estimatedDurationMinutes: 120,
        departure: departure || '6:30 AM',
        arrival: arrival || '8:30 AM',
        active: true,
      });
      addToast(`New route "${routeName}" created in database!`, 'success');
      setIsModalOpen(false);
      setRouteName('');
      await fetchRoutes();
    } catch (err) {
      addToast(`Failed to create route: ${err.message}`, 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (route) => {
    setEditingRouteId(route.id);
    setEditRouteName(route.name);
    setEditMode(route.mode);
    setEditStops(route.stops);
    setEditDeparture(route.departure);
    setEditArrival(route.arrival);
    setEditFare(route.fare.replace(/[^0-9]/g, '') || 150);
    setEditStatus(route.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      if (editingRouteId && !editingRouteId.startsWith('R00')) {
        await adminService.updateRoute(editingRouteId, {
          name: editRouteName,
          type: editMode.toLowerCase(),
          baseFare: Number(editFare) || 150,
          departure: editDeparture,
          arrival: editArrival,
          active: editStatus === 'Active',
        });
      }
      addToast(`Route ${editRouteName} updated successfully!`, 'success');
      setIsEditModalOpen(false);
      await fetchRoutes();
    } catch (err) {
      addToast(`Failed to update route: ${err.message}`, 'error');
    }
  };

  // Open Stops Modal
  const handleOpenStopsModal = (route) => {
    setSelectedRouteForStops(route);
    
    const initialStops = route.name.includes('Kandy') && route.name.includes('Colombo')
      ? ['Kandy Central Station', 'Peradeniya Junction', 'Kadugannawa', 'Rambukkana', 'Polgahawela', 'Gampaha', 'Ragama', 'Colombo Fort']
      : route.name.includes('Galle')
      ? ['Colombo Fort', 'Mount Lavinia', 'Panadura', 'Kalutara South', 'Bentota', 'Ambalangoda', 'Hikkaduwa', 'Galle Station']
      : ['Origin Terminal', 'Main Stop A', 'Junction B', 'Commercial Hub C', 'Destination Terminal'];

    setStopsList(initialStops);
    setNewStopName('');
    setIsStopsModalOpen(true);
  };

  const handleAddStopToSequence = (e) => {
    e.preventDefault();
    if (!newStopName.trim()) return;

    const updatedList = [...stopsList, newStopName.trim()];
    setStopsList(updatedList);

    if (selectedRouteForStops) {
      setRoutesData(prev => prev.map(r => r.id === selectedRouteForStops.id ? { ...r, stops: updatedList.length } : r));
    }

    addToast(`Added stop "${newStopName.trim()}" to route sequence`, 'success');
    setNewStopName('');
  };

  const handleRemoveStopFromSequence = (indexToRemove) => {
    const updatedList = stopsList.filter((_, idx) => idx !== indexToRemove);
    setStopsList(updatedList);

    if (selectedRouteForStops) {
      setRoutesData(prev => prev.map(r => r.id === selectedRouteForStops.id ? { ...r, stops: updatedList.length } : r));
    }

    addToast(`Stop removed from route sequence`, 'info');
  };

  // Open Schedule Modal
  const handleOpenScheduleModal = (route) => {
    setSelectedRouteForSchedule(route);
    setScheduleDeparture(route.departure);
    setScheduleArrival(route.arrival);
    setScheduleDays('Mon-Sun (Daily)');
    setScheduleFrequency(route.mode === 'Bus' ? 'Every 15-20 mins' : 'Fixed Daily Schedule');
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (selectedRouteForSchedule) {
      setRoutesData(prev => prev.map(r => {
        if (r.id === selectedRouteForSchedule.id) {
          return {
            ...r,
            departure: scheduleDeparture,
            arrival: scheduleArrival,
          };
        }
        return r;
      }));
    }

    addToast(`Schedule updated for ${selectedRouteForSchedule?.name}`, 'success');
    setIsScheduleModalOpen(false);
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
                    <button className="action-btn-sm" onClick={() => handleOpenEditModal(row)}>Edit</button>
                    <button className="action-btn-sm" onClick={() => handleOpenStopsModal(row)}>Stops</button>
                    <button className="action-btn-sm" onClick={() => handleOpenScheduleModal(row)}>Schedule</button>
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

      {/* Edit Route Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Transit Route">
        <form onSubmit={handleSaveEdit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">ROUTE NAME</label>
            <input
              type="text"
              className="form-input"
              value={editRouteName}
              onChange={(e) => setEditRouteName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">MODE</label>
              <select className="form-input" value={editMode} onChange={(e) => setEditMode(e.target.value)}>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
              </select>
            </div>

            <div>
              <label className="form-label">STOPS COUNT</label>
              <input
                type="number"
                className="form-input"
                value={editStops}
                onChange={(e) => setEditStops(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">DEPARTURE</label>
              <input
                type="text"
                className="form-input"
                value={editDeparture}
                onChange={(e) => setEditDeparture(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">ARRIVAL</label>
              <input
                type="text"
                className="form-input"
                value={editArrival}
                onChange={(e) => setEditArrival(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">FARE (LKR)</label>
              <input
                type="number"
                className="form-input"
                value={editFare}
                onChange={(e) => setEditFare(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">STATUS</label>
            <select className="form-input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Route Stops Sequence Modal */}
      <Modal isOpen={isStopsModalOpen} onClose={() => setIsStopsModalOpen(false)} title={`Route Stops Sequence: ${selectedRouteForStops?.name || ''}`}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>
            <MapPin size={16} color="#2563EB" />
            <span>Total Stations & Intermediate Stops: <strong>{stopsList.length}</strong></span>
          </div>

          {/* Form to Add New Stop */}
          <form onSubmit={handleAddStopToSequence} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter new stop / station name..."
              value={newStopName}
              onChange={(e) => setNewStopName(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px', padding: '0 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
              <Plus size={14} /> Add Stop
            </button>
          </form>

          {/* Stops List Timeline */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
            {stopsList.map((stop, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: idx === 0 || idx === stopsList.length - 1 ? '#EFF6FF' : '#F8FAFC',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  border: idx === 0 || idx === stopsList.length - 1 ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: idx === 0 || idx === stopsList.length - 1 ? '#2563EB' : '#94A3B8',
                    color: '#FFF', 
                    fontSize: '11px', 
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{stop}</span>
                    {idx === 0 && <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: '700', marginLeft: '8px' }}>(Origin)</span>}
                    {idx === stopsList.length - 1 && <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', marginLeft: '8px' }}>(Destination)</span>}
                  </div>
                </div>

                {stopsList.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveStopFromSequence(idx)}
                    style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                    title="Remove stop"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button 
              type="button" 
              className="btn-blue-action" 
              style={{ borderRadius: '10px', padding: '8px 24px' }} 
              onClick={() => setIsStopsModalOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* Route Schedule & Timetable Modal */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title={`Route Timetable: ${selectedRouteForSchedule?.name || ''}`}>
        <form onSubmit={handleSaveSchedule}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">DEPARTURE TIME</label>
              <input
                type="text"
                className="form-input"
                value={scheduleDeparture}
                onChange={(e) => setScheduleDeparture(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">ARRIVAL TIME</label>
              <input
                type="text"
                className="form-input"
                value={scheduleArrival}
                onChange={(e) => setScheduleArrival(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">OPERATING DAYS</label>
              <select className="form-input" value={scheduleDays} onChange={(e) => setScheduleDays(e.target.value)}>
                <option value="Mon-Sun (Daily)">Mon-Sun (Daily)</option>
                <option value="Mon-Fri (Weekdays)">Mon-Fri (Weekdays)</option>
                <option value="Sat-Sun (Weekends)">Sat-Sun (Weekends)</option>
              </select>
            </div>

            <div>
              <label className="form-label">SERVICE FREQUENCY</label>
              <input
                type="text"
                className="form-input"
                value={scheduleFrequency}
                onChange={(e) => setScheduleFrequency(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>
              <Clock size={16} color="#2563EB" /> Timetable Summary
            </div>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              Departs at <strong>{scheduleDeparture}</strong>, arrives by <strong>{scheduleArrival}</strong> running <strong>{scheduleDays}</strong>.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsScheduleModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Save Schedule</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RouteScheduleManagement;

