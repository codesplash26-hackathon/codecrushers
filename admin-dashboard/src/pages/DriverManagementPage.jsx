import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const DriverManagementPage = () => {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('All');

  const [driversData, setDriversData] = useState([
    { id: '1', name: 'Nimal Silva', phone: '+94 71 234 5678', vehicle: 'Taxi', plate: 'WP CAB-5512', rating: '4.8 ⭐', trips: 142, status: 'Available', verified: true },
    { id: '2', name: 'Kasun Perera', phone: '+94 77 123 4567', vehicle: 'Taxi', plate: 'WP CAB-1234', rating: '4.6 ⭐', trips: 89, status: 'Busy', verified: true },
    { id: '3', name: 'Roshan J.', phone: '+94 77 456 7890', vehicle: 'Tuk-tuk', plate: 'CP TUK-0098', rating: '4.9 ⭐', trips: 231, status: 'Offline', verified: true },
    { id: '4', name: 'Sampath K.', phone: '+94 70 567 8901', vehicle: 'Tuk-tuk', plate: 'WP TUK-3321', rating: '4.3 ⭐', trips: 55, status: 'On Break', verified: false },
  ]);

  // Add Driver Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addVehicle, setAddVehicle] = useState('Taxi');
  const [addPlate, setAddPlate] = useState('');
  const [addStatus, setAddStatus] = useState('Available');
  const [addVerified, setAddVerified] = useState(true);

  // View Driver Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingDriver, setViewingDriver] = useState(null);

  // Edit Driver Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editVehicle, setEditVehicle] = useState('Taxi');
  const [editPlate, setEditPlate] = useState('');
  const [editStatus, setEditStatus] = useState('Available');
  const [editVerified, setEditVerified] = useState(true);

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!addName || !addPhone) return;

    const newDriver = {
      id: Date.now().toString(),
      name: addName,
      phone: addPhone,
      vehicle: addVehicle,
      plate: addPlate || 'WP CAB-0000',
      rating: '5.0 ⭐',
      trips: 0,
      status: addStatus,
      verified: addVerified,
    };

    setDriversData([newDriver, ...driversData]);
    addToast(`Driver "${addName}" registered successfully!`, 'success');

    setIsAddModalOpen(false);
    setAddName('');
    setAddPhone('');
    setAddVehicle('Taxi');
    setAddPlate('');
    setAddStatus('Available');
    setAddVerified(true);
  };

  const handleOpenViewModal = (driver) => {
    setViewingDriver(driver);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = (driver) => {
    setEditingId(driver.id);
    setEditName(driver.name);
    setEditPhone(driver.phone);
    setEditVehicle(driver.vehicle);
    setEditPlate(driver.plate);
    setEditStatus(driver.status);
    setEditVerified(driver.verified);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setDriversData(prev => prev.map(d => {
      if (d.id === editingId) {
        return {
          ...d,
          name: editName,
          phone: editPhone,
          vehicle: editVehicle,
          plate: editPlate,
          status: editStatus,
          verified: editVerified,
        };
      }
      return d;
    }));

    addToast(`Driver profile for "${editName}" updated!`, 'success');
    setIsEditModalOpen(false);
  };

  const handleToggleSuspend = (id, driverName, currentStatus) => {
    const isSuspending = currentStatus !== 'Offline';
    const newStatus = isSuspending ? 'Offline' : 'Available';

    setDriversData(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));

    if (isSuspending) {
      addToast(`Driver "${driverName}" has been suspended`, 'warning');
    } else {
      addToast(`Driver "${driverName}" has been reactivated`, 'success');
    }
  };

  const filteredData = driversData.filter(d => {
    if (filter === 'All') return true;
    if (filter === 'Available') return d.status === 'Available';
    if (filter === 'Busy') return d.status === 'Busy';
    if (filter === 'Offline') return d.status === 'Offline';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="badge-status-active">● Available</span>;
      case 'Busy':
        return <span className="badge-status-delayed">● Busy</span>;
      case 'Offline':
        return <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>● Offline</span>;
      case 'On Break':
        return <span style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px' }}>● On Break</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="page-container fade-in">
      {/* Subheader Toolbar */}
      <div className="page-toolbar" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Driver Management</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="filter-pills">
            <button className={`pill-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
            <button className={`pill-btn ${filter === 'Available' ? 'active' : ''}`} onClick={() => setFilter('Available')}>Available</button>
            <button className={`pill-btn ${filter === 'Busy' ? 'active' : ''}`} onClick={() => setFilter('Busy')}>Busy</button>
            <button className={`pill-btn ${filter === 'Offline' ? 'active' : ''}`} onClick={() => setFilter('Offline')}>Offline</button>
          </div>

          <button className="btn-blue-action" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>DRIVER</th>
              <th>VEHICLE</th>
              <th>RATING</th>
              <th>TOTAL TRIPS</th>
              <th>STATUS</th>
              <th>VERIFIED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td>
                  <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.name}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{row.phone}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: '#334155' }}>{row.vehicle}</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748B' }}>{row.plate}</div>
                </td>
                <td style={{ fontWeight: '800', color: '#D97706' }}>{row.rating}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{row.trips}</td>
                <td>{getStatusBadge(row.status)}</td>
                <td>
                  {row.verified ? (
                    <span style={{ color: '#16A34A', fontWeight: '700', fontSize: '13px' }}>✓ Verified</span>
                  ) : (
                    <span style={{ color: '#DC2626', fontWeight: '700', fontSize: '13px' }}>X Unverified</span>
                  )}
                </td>
                <td>
                  <div className="table-action-btns">
                    <button className="action-btn-sm" onClick={() => handleOpenViewModal(row)}>View</button>
                    <button className="action-btn-sm" onClick={() => handleOpenEditModal(row)}>Edit</button>
                    <button 
                      className="action-btn-sm" 
                      style={{ color: row.status === 'Offline' ? '#16A34A' : '#D97706', borderColor: row.status === 'Offline' ? '#86EFAC' : '#FDE68A' }}
                      onClick={() => handleToggleSuspend(row.id, row.name, row.status)}
                    >
                      {row.status === 'Offline' ? 'Reactivate' : 'Suspend'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Driver Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Driver">
        <form onSubmit={handleAddDriver}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">FULL NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sunil Shantha"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">PHONE NUMBER</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +94 77 123 4567"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">VEHICLE TYPE</label>
              <select className="form-input" value={addVehicle} onChange={(e) => setAddVehicle(e.target.value)}>
                <option value="Taxi">Taxi</option>
                <option value="Tuk-tuk">Tuk-tuk</option>
                <option value="Bus">Bus</option>
                <option value="Van">Van</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="form-label">LICENSE PLATE NO.</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. WP CAB-8899"
                value={addPlate}
                onChange={(e) => setAddPlate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">INITIAL STATUS</label>
              <select className="form-input" value={addStatus} onChange={(e) => setAddStatus(e.target.value)}>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Register Driver</button>
          </div>
        </form>
      </Modal>

      {/* View Driver Profile Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Driver Profile Details">
        {viewingDriver && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{viewingDriver.name}</h4>
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500', marginTop: '2px' }}>{viewingDriver.phone}</div>
              </div>
              <div>{getStatusBadge(viewingDriver.status)}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Vehicle Type & Plate</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginTop: '4px' }}>{viewingDriver.vehicle} ({viewingDriver.plate})</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Rating & Trips</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#D97706', marginTop: '4px' }}>{viewingDriver.rating} · {viewingDriver.trips} Total Trips</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Verification Status</div>
              <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '4px', color: viewingDriver.verified ? '#16A34A' : '#DC2626' }}>
                {viewingDriver.verified ? '✓ Official Identity & Vehicle License Verified' : 'X Verification Documents Pending'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="action-btn-sm" 
                style={{ padding: '8px 16px' }} 
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEditModal(viewingDriver);
                }}
              >
                Edit Profile
              </button>
              <button 
                type="button" 
                className="btn-blue-action" 
                style={{ borderRadius: '10px', padding: '8px 20px' }} 
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Driver Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Driver Details">
        <form onSubmit={handleSaveEdit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">FULL NAME</label>
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
              <label className="form-label">PHONE NUMBER</label>
              <input
                type="text"
                className="form-input"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">VEHICLE TYPE</label>
              <select className="form-input" value={editVehicle} onChange={(e) => setEditVehicle(e.target.value)}>
                <option value="Taxi">Taxi</option>
                <option value="Tuk-tuk">Tuk-tuk</option>
                <option value="Bus">Bus</option>
                <option value="Van">Van</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">LICENSE PLATE NO.</label>
              <input
                type="text"
                className="form-input"
                value={editPlate}
                onChange={(e) => setEditPlate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">STATUS</label>
              <select className="form-input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Offline">Offline</option>
                <option value="On Break">On Break</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">VERIFICATION STATUS</label>
            <select className="form-input" value={editVerified ? 'true' : 'false'} onChange={(e) => setEditVerified(e.target.value === 'true')}>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn-sm" style={{ padding: '10px 18px' }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-blue-action" style={{ borderRadius: '10px' }}>Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DriverManagementPage;

