import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import adminService from '../services/adminService';

const SchedulesManagement = () => {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('All Schedules');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [schedulesData, setSchedulesData] = useState([
    { id: 'SCH-001', route: 'Kandy ➔ Colombo Fort', service: 'Route 654', departure: '6:00 AM', arrival: '8:30 AM', days: 'Mon-Sun', stops: '17', fare: 'Rs. 120', status: 'Active' },
    { id: 'SCH-002', route: 'Kandy ➔ Colombo Fort', service: 'IC Express', departure: '7:30 AM', arrival: '9:45 AM', days: 'Mon-Fri', stops: '8', fare: 'Rs. 160', status: 'Active' },
    { id: 'SCH-003', route: 'Kandy ➔ Peradeniya', service: 'Route 681', departure: '5:30 AM', arrival: '5:55 AM', days: 'Mon-Sun', stops: '6', fare: 'Rs. 40', status: 'Active' },
    { id: 'SCH-004', route: 'Colombo ➔ Galle', service: 'Night Mail', departure: '9:15 PM', arrival: '11:30 PM', days: 'Fri-Sun', stops: '12', fare: 'Rs. 200', status: 'Inactive' },
    { id: 'SCH-005', route: 'Kandy ➔ Matale', service: 'Route 780', departure: '7:00 AM', arrival: '7:45 AM', days: 'Mon-Sat', stops: '14', fare: 'Rs. 95', status: 'Active' },
  ]);

  // Modal Form State (Add)
  const [routeName, setRouteName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [departure, setDeparture] = useState('6:30 AM');
  const [arrival, setArrival] = useState('8:45 AM');
  const [days, setDays] = useState('Mon-Sun');
  const [stopsCount, setStopsCount] = useState('10');
  const [fare, setFare] = useState('150');
  const [status, setStatus] = useState('Active');

  // Modal Form State (Edit)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [editRouteName, setEditRouteName] = useState('');
  const [editServiceName, setEditServiceName] = useState('');
  const [editDeparture, setEditDeparture] = useState('');
  const [editArrival, setEditArrival] = useState('');
  const [editDays, setEditDays] = useState('Mon-Sun');
  const [editStopsCount, setEditStopsCount] = useState('10');
  const [editFare, setEditFare] = useState('150');
  const [editStatus, setEditStatus] = useState('Active');

  // Modal State (Stops Sequence Manager)
  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);
  const [selectedScheduleForStops, setSelectedScheduleForStops] = useState(null);
  const [scheduleStopsList, setScheduleStopsList] = useState([]);
  const [newStopInput, setNewStopInput] = useState('');

  const fetchSchedules = async () => {
    try {
      const res = await adminService.getSchedules();
      if (res.success && Array.isArray(res.schedules) && res.schedules.length > 0) {
        const apiData = res.schedules.map((s, idx) => ({
          id: s._id || `SCH-00${idx + 1}`,
          route: s.route?.name || 'Kandy ➔ Colombo Fort',
          service: s.service?.name || (s.service ? String(s.service) : 'Express Transit'),
          departure: s.departureTime || '6:00 AM',
          arrival: s.arrivalTime || '8:30 AM',
          days: s.days || s.operatingDays?.join(', ') || 'Mon-Sun',
          stops: s.stopsCount ? String(s.stopsCount) : '10',
          fare: `Rs. ${s.fare || 150}`,
          status: s.isActive === false || s.status === 'Inactive' ? 'Inactive' : 'Active',
        }));
        setSchedulesData(apiData);
      }
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!routeName || !serviceName) return;

    try {
      await adminService.createSchedule({
        route: routeName,
        service: serviceName,
        departureTime: departure,
        arrivalTime: arrival,
        days: days,
        operatingDays: days.includes('-') ? days.split('-') : [days],
        stopsCount: Number(stopsCount) || 10,
        fare: Number(fare) || 150,
        status: status,
        isActive: status === 'Active',
      });
      addToast(`New schedule "${routeName}" saved to database!`, 'success');
      setIsModalOpen(false);
      setRouteName('');
      setServiceName('');
      setDeparture('6:30 AM');
      setArrival('8:45 AM');
      setDays('Mon-Sun');
      setStopsCount('10');
      setFare('150');
      setStatus('Active');
      await fetchSchedules();
    } catch (err) {
      addToast(`Failed to create schedule: ${err.message}`, 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (sched) => {
    setEditingScheduleId(sched.id);
    setEditRouteName(sched.route);
    setEditServiceName(sched.service);
    setEditDeparture(sched.departure);
    setEditArrival(sched.arrival);
    setEditDays(sched.days);
    setEditStopsCount(sched.stops);
    setEditFare(sched.fare.replace(/[^0-9]/g, '') || 150);
    setEditStatus(sched.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      if (editingScheduleId && !editingScheduleId.startsWith('SCH-')) {
        await adminService.updateSchedule(editingScheduleId, {
          route: editRouteName,
          service: editServiceName,
          departureTime: editDeparture,
          arrivalTime: editArrival,
          days: editDays,
          operatingDays: editDays.includes('-') ? editDays.split('-') : [editDays],
          stopsCount: Number(editStopsCount) || 10,
          fare: Number(editFare) || 150,
          status: editStatus,
          isActive: editStatus === 'Active',
        });
      }
      addToast(`Schedule updated successfully!`, 'success');
      setIsEditModalOpen(false);
      await fetchSchedules();
    } catch (err) {
      addToast(`Failed to update schedule: ${err.message}`, 'error');
    }
  };

  // Open Stops Modal for Schedule
  const handleOpenStopsModal = (sched) => {
    setSelectedScheduleForStops(sched);
    
    const initialStops = sched.route.includes('Kandy')
      ? ['Kandy Terminal', 'Peradeniya', 'Kadugannawa', 'Polgahawela', 'Gampaha', 'Colombo Fort']
      : ['Colombo Fort', 'Kalutara', 'Bentota', 'Ambalangoda', 'Galle Station'];

    setScheduleStopsList(initialStops);
    setNewStopInput('');
    setIsStopsModalOpen(true);
  };

  const handleAddStopToSchedule = (e) => {
    e.preventDefault();
    if (!newStopInput.trim()) return;

    const updatedList = [...scheduleStopsList, newStopInput.trim()];
    setScheduleStopsList(updatedList);

    if (selectedScheduleForStops) {
      setSchedulesData(prev => prev.map(s => s.id === selectedScheduleForStops.id ? { ...s, stops: String(updatedList.length) } : s));
    }

    addToast(`Added stop "${newStopInput.trim()}" to schedule`, 'success');
    setNewStopInput('');
  };

  const handleRemoveStopFromSchedule = (indexToRemove) => {
    const updatedList = scheduleStopsList.filter((_, idx) => idx !== indexToRemove);
    setScheduleStopsList(updatedList);

    if (selectedScheduleForStops) {
      setSchedulesData(prev => prev.map(s => s.id === selectedScheduleForStops.id ? { ...s, stops: String(updatedList.length) } : s));
    }

    addToast(`Stop removed from schedule`, 'info');
  };

  const handleToggleStatus = (id, newStatus) => {
    setSchedulesData(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    addToast(`Schedule status updated to ${newStatus}`, 'info');
  };

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

        <button className="btn-blue-action" onClick={() => setIsModalOpen(true)}>
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
                    <button className="action-btn-sm" onClick={() => handleOpenEditModal(row)}>Edit</button>
                    <button className="action-btn-sm" onClick={() => handleOpenStopsModal(row)}>Stops</button>
                    {row.status === 'Active' ? (
                      <button 
                        className="action-btn-sm" 
                        style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                        onClick={() => handleToggleStatus(row.id, 'Inactive')}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        className="action-btn-sm" 
                        style={{ color: '#16A34A', borderColor: '#86EFAC' }}
                        onClick={() => handleToggleStatus(row.id, 'Active')}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transit Schedule">
        <form onSubmit={handleAddSchedule}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">ROUTE NAME</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Kandy ➔ Colombo Fort"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">SERVICE / BUS NAME</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Route 654 Express"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
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
                placeholder="e.g. 6:30 AM"
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
                placeholder="e.g. 8:45 AM"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">OPERATING DAYS</label>
              <select className="form-input" value={days} onChange={(e) => setDays(e.target.value)}>
                <option value="Mon-Sun">Mon-Sun (Daily)</option>
                <option value="Mon-Fri">Mon-Fri (Weekdays)</option>
                <option value="Sat-Sun">Sat-Sun (Weekends)</option>
                <option value="Fri-Sun">Fri-Sun</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">STOPS</label>
              <input
                type="number"
                className="form-input"
                value={stopsCount}
                onChange={(e) => setStopsCount(e.target.value)}
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

            <div>
              <label className="form-label">STATUS</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Create Schedule</button>
          </div>
        </form>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Transit Schedule">
        <form onSubmit={handleSaveEdit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">ROUTE NAME</label>
              <input
                type="text"
                className="form-input"
                value={editRouteName}
                onChange={(e) => setEditRouteName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">SERVICE / BUS NAME</label>
              <input
                type="text"
                className="form-input"
                value={editServiceName}
                onChange={(e) => setEditServiceName(e.target.value)}
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
              <label className="form-label">OPERATING DAYS</label>
              <select className="form-input" value={editDays} onChange={(e) => setEditDays(e.target.value)}>
                <option value="Mon-Sun">Mon-Sun (Daily)</option>
                <option value="Mon-Fri">Mon-Fri (Weekdays)</option>
                <option value="Sat-Sun">Sat-Sun (Weekends)</option>
                <option value="Fri-Sun">Fri-Sun</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">STOPS</label>
              <input
                type="number"
                className="form-input"
                value={editStopsCount}
                onChange={(e) => setEditStopsCount(e.target.value)}
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

            <div>
              <label className="form-label">STATUS</label>
              <select className="form-input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Schedule Stops Sequence Modal */}
      <Modal isOpen={isStopsModalOpen} onClose={() => setIsStopsModalOpen(false)} title={`Schedule Stops: ${selectedScheduleForStops?.route || ''}`}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>
            <MapPin size={16} color="#2563EB" />
            <span>Intermediate Stops Sequence: <strong>{scheduleStopsList.length}</strong></span>
          </div>

          {/* Add Stop Form */}
          <form onSubmit={handleAddStopToSchedule} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Add stop name to schedule..."
              value={newStopInput}
              onChange={(e) => setNewStopInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px', padding: '0 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
              <Plus size={14} /> Add Stop
            </button>
          </form>

          {/* Stops List */}
          <div style={{ maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
            {scheduleStopsList.map((stop, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: idx === 0 || idx === scheduleStopsList.length - 1 ? '#EFF6FF' : '#F8FAFC',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  border: idx === 0 || idx === scheduleStopsList.length - 1 ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563EB' }}>#{idx + 1}</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{stop}</span>
                </div>

                {scheduleStopsList.length > 2 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveStopFromSchedule(idx)}
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
    </div>
  );
};

export default SchedulesManagement;


