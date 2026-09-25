import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Route } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import adminService from '../services/adminService';

const ServicesManagement = () => {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [servicesData, setServicesData] = useState([
    { id: 'S001', icon: '🚍', name: 'SLTB Kandy Express', mode: 'Bus', modeColor: '#2563EB', operator: 'SLTB', routes: '8', vehicles: '24', status: 'Active' },
    { id: 'S002', icon: '🚆', name: 'Sri Lanka Railways', mode: 'Train', modeColor: '#16A34A', operator: 'SLR', routes: '5', vehicles: '12', status: 'Active' },
    { id: 'S003', icon: '🚍', name: 'Kandy Private Bus', mode: 'Bus', modeColor: '#2563EB', operator: 'Private', routes: '14', vehicles: '38', status: 'Active' },
    { id: 'S004', icon: '🚖', name: 'PickMe Taxi', mode: 'Taxi', modeColor: '#D97706', operator: 'PickMe', routes: '-', vehicles: '142', status: 'Active' },
    { id: 'S005', icon: '𛲡', name: 'Tuk Alliance LK', mode: 'Tuk-tuk', modeColor: '#DC2626', operator: 'Alliance', routes: '-', vehicles: '89', status: 'Active' },
    { id: 'S006', icon: '🚆', name: 'Night Mail Service', mode: 'Train', modeColor: '#16A34A', operator: 'SLR', routes: '2', vehicles: '3', status: 'Inactive' },
  ]);

  // Modal Form State (Add)
  const [name, setName] = useState('');
  const [mode, setMode] = useState('Bus');
  const [operator, setOperator] = useState('');
  const [routes, setRoutes] = useState('5');
  const [vehicles, setVehicles] = useState('10');
  const [status, setStatus] = useState('Active');

  // Modal Form State (Edit)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMode, setEditMode] = useState('Bus');
  const [editOperator, setEditOperator] = useState('');
  const [editRoutes, setEditRoutes] = useState('5');
  const [editVehicles, setEditVehicles] = useState('10');
  const [editStatus, setEditStatus] = useState('Active');

  // Modal State (Routes Manager)
  const [isRoutesModalOpen, setIsRoutesModalOpen] = useState(false);
  const [selectedServiceForRoutes, setSelectedServiceForRoutes] = useState(null);
  const [serviceRoutesList, setServiceRoutesList] = useState([]);
  const [newRouteInput, setNewRouteInput] = useState('');

  const fetchServices = async () => {
    try {
      const res = await adminService.getServices();
      if (res.success && Array.isArray(res.services) && res.services.length > 0) {
        const apiList = res.services.map((s, idx) => {
          const typeStr = (s.type || '').toLowerCase();
          const isTrain = typeStr === 'train';
          const isTuk = typeStr.includes('tuk') || typeStr.includes('three');
          const isTaxi = typeStr.includes('taxi');

          return {
            id: s._id || `S00${idx + 1}`,
            icon: isTrain ? '🚆' : isTuk ? '𛲡' : isTaxi ? '🚖' : '🚍',
            name: s.name || s.driverName || 'Transport Service',
            mode: isTrain ? 'Train' : isTuk ? 'Tuk-tuk' : isTaxi ? 'Taxi' : 'Bus',
            modeColor: isTrain ? '#16A34A' : isTuk ? '#DC2626' : isTaxi ? '#D97706' : '#2563EB',
            operator: s.operator || 'Official Operator',
            routes: s.routes ? String(s.routes) : '-',
            vehicles: s.vehicles ? String(s.vehicles) : '10',
            status: (s.status === 'inactive' || s.status === 'Inactive') ? 'Inactive' : 'Active',
          };
        });
        setServicesData(apiList);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getModeDetails = (modeType) => {
    switch (modeType) {
      case 'Train':
        return { icon: '🚆', modeColor: '#16A34A' };
      case 'Taxi':
        return { icon: '🚖', modeColor: '#D97706' };
      case 'Tuk-tuk':
        return { icon: '𛲡', modeColor: '#DC2626' };
      case 'Bus':
      default:
        return { icon: '🚍', modeColor: '#2563EB' };
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!name || !operator) return;

    const formattedRoutes = mode === 'Taxi' || mode === 'Tuk-tuk' ? 0 : Number(routes || 0);

    try {
      await adminService.createService({
        name,
        type: mode.toLowerCase(),
        operator,
        routes: formattedRoutes,
        vehicles: Number(vehicles || 10),
        status: status.toLowerCase(),
      });
      addToast(`New service "${name}" saved to database!`, 'success');
      setIsModalOpen(false);
      setName('');
      setOperator('');
      setRoutes('5');
      setVehicles('10');
      setMode('Bus');
      setStatus('Active');
      await fetchServices();
    } catch (err) {
      addToast(`Failed to create service: ${err.message}`, 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (service) => {
    setEditingServiceId(service.id);
    setEditName(service.name);
    setEditMode(service.mode);
    setEditOperator(service.operator);
    setEditRoutes(service.routes === '-' ? '0' : service.routes);
    setEditVehicles(service.vehicles);
    setEditStatus(service.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      if (editingServiceId && !editingServiceId.startsWith('S00')) {
        await adminService.updateService(editingServiceId, {
          name: editName,
          type: editMode.toLowerCase(),
          operator: editOperator,
          routes: editRoutes === '-' ? 0 : Number(editRoutes),
          vehicles: Number(editVehicles),
          status: editStatus.toLowerCase(),
        });
      }
      addToast(`Service "${editName}" updated successfully!`, 'success');
      setIsEditModalOpen(false);
      await fetchServices();
    } catch (err) {
      addToast(`Failed to update service: ${err.message}`, 'error');
    }
  };

  // Open Routes Manager Modal
  const handleOpenRoutesModal = (service) => {
    setSelectedServiceForRoutes(service);
    
    const defaultRoutes = service.mode === 'Train'
      ? ['Main Line (Colombo ➔ Badulla)', 'Coastal Line (Colombo ➔ Matara)', 'Northern Line (Colombo ➔ Jaffna)', 'Kelani Valley Line']
      : service.mode === 'Bus'
      ? ['Route 654: Kandy ➔ Colombo Fort', 'Route 120: Colombo ➔ Horana', 'Route 100: Colombo ➔ Moratuwa', 'Route 138: Pettah ➔ Maharagama', 'Route 780: Kandy ➔ Matale']
      : ['City Express On-Demand Network', 'Metropolitan Zone Dispatch', 'High-Speed Airport Link'];

    setServiceRoutesList(defaultRoutes);
    setNewRouteInput('');
    setIsRoutesModalOpen(true);
  };

  const handleAddRouteToService = (e) => {
    e.preventDefault();
    if (!newRouteInput.trim()) return;

    const updatedList = [...serviceRoutesList, newRouteInput.trim()];
    setServiceRoutesList(updatedList);

    if (selectedServiceForRoutes) {
      setServicesData(prev => prev.map(s => s.id === selectedServiceForRoutes.id ? { ...s, routes: String(updatedList.length) } : s));
    }

    addToast(`Added route "${newRouteInput.trim()}" to service`, 'success');
    setNewRouteInput('');
  };

  const handleRemoveRouteFromService = (indexToRemove) => {
    const updatedList = serviceRoutesList.filter((_, idx) => idx !== indexToRemove);
    setServiceRoutesList(updatedList);

    if (selectedServiceForRoutes) {
      setServicesData(prev => prev.map(s => s.id === selectedServiceForRoutes.id ? { ...s, routes: updatedList.length > 0 ? String(updatedList.length) : '-' } : s));
    }

    addToast(`Route removed from service`, 'info');
  };

  const handleToggleStatus = async (id, newStatus) => {
    setServicesData(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    try {
      await adminService.updateServiceStatus(id, newStatus.toLowerCase());
      addToast(`Service status changed to ${newStatus}`, 'success');
    } catch {
      addToast(`Service status updated locally to ${newStatus}`, 'info');
    }
  };

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

  const totalServices = servicesData.length;
  const activeServicesCount = servicesData.filter(s => s.status === 'Active').length;
  const totalVehiclesCount = servicesData.reduce((acc, s) => acc + (parseInt(s.vehicles, 10) || 0), 0);
  const totalRoutesCount = servicesData.reduce((acc, s) => acc + (parseInt(s.routes, 10) || 0), 0);

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

        <button className="btn-blue-action" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Top Row 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div className="kpi-card" style={{ padding: '18px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#2563EB', marginBottom: '2px' }}>{totalServices}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Total Services</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#16A34A', marginBottom: '2px' }}>{activeServicesCount}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Active</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#0EA5E9', marginBottom: '2px' }}>{totalVehiclesCount}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Total Vehicles</div>
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#D97706', marginBottom: '2px' }}>{totalRoutesCount}</div>
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
                    <button className="action-btn-sm" onClick={() => handleOpenEditModal(row)}>Edit</button>
                    <button className="action-btn-sm" onClick={() => handleOpenRoutesModal(row)}>Routes</button>
                    {row.status === 'Active' ? (
                      <button 
                        className="action-btn-sm" 
                        style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                        onClick={() => handleToggleStatus(row.id, 'Inactive')}
                      >
                        Disable
                      </button>
                    ) : (
                      <button 
                        className="action-btn-sm" 
                        style={{ color: '#16A34A', borderColor: '#86EFAC' }}
                        onClick={() => handleToggleStatus(row.id, 'Active')}
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Service Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transport Service">
        <form onSubmit={handleAddService}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">SERVICE NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. SLTB Southern Highway Express"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">TRANSPORT MODE</label>
              <select className="form-input" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Taxi">Taxi</option>
                <option value="Tuk-tuk">Tuk-tuk</option>
              </select>
            </div>

            <div>
              <label className="form-label">OPERATOR</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. SLTB / SLR / Private"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">NO. OF ROUTES</label>
              <input
                type="number"
                className="form-input"
                value={routes}
                onChange={(e) => setRoutes(e.target.value)}
                disabled={mode === 'Taxi' || mode === 'Tuk-tuk'}
                required={mode !== 'Taxi' && mode !== 'Tuk-tuk'}
              />
            </div>

            <div>
              <label className="form-label">VEHICLES</label>
              <input
                type="number"
                className="form-input"
                value={vehicles}
                onChange={(e) => setVehicles(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">INITIAL STATUS</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Create Service</button>
          </div>
        </form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Transport Service">
        <form onSubmit={handleSaveEdit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">SERVICE NAME</label>
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
              <label className="form-label">TRANSPORT MODE</label>
              <select className="form-input" value={editMode} onChange={(e) => setEditMode(e.target.value)}>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Taxi">Taxi</option>
                <option value="Tuk-tuk">Tuk-tuk</option>
              </select>
            </div>

            <div>
              <label className="form-label">OPERATOR</label>
              <input
                type="text"
                className="form-input"
                value={editOperator}
                onChange={(e) => setEditOperator(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">NO. OF ROUTES</label>
              <input
                type="number"
                className="form-input"
                value={editRoutes}
                onChange={(e) => setEditRoutes(e.target.value)}
                disabled={editMode === 'Taxi' || editMode === 'Tuk-tuk'}
                required={editMode !== 'Taxi' && editMode !== 'Tuk-tuk'}
              />
            </div>

            <div>
              <label className="form-label">VEHICLES</label>
              <input
                type="number"
                className="form-input"
                value={editVehicles}
                onChange={(e) => setEditVehicles(e.target.value)}
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

      {/* Connected Routes Manager Modal */}
      <Modal isOpen={isRoutesModalOpen} onClose={() => setIsRoutesModalOpen(false)} title={`Connected Routes: ${selectedServiceForRoutes?.name || ''}`}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>
            <Route size={16} color="#2563EB" />
            <span>Assigned Transit Routes: <strong>{serviceRoutesList.length}</strong></span>
          </div>

          {/* Form to Add New Route Association */}
          <form onSubmit={handleAddRouteToService} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter new route to assign..."
              value={newRouteInput}
              onChange={(e) => setNewRouteInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px', padding: '0 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
              <Plus size={14} /> Assign Route
            </button>
          </form>

          {/* Routes List */}
          <div style={{ maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
            {serviceRoutesList.map((routeItem, idx) => (
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
                  onClick={() => handleRemoveRouteFromService(idx)}
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

export default ServicesManagement;


