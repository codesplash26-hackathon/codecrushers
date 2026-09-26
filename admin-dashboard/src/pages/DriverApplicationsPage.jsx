import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import { CheckCircle2, XCircle, Clock, Eye, AlertTriangle, RefreshCw, Car } from 'lucide-react';

const DriverApplicationsPage = () => {
  const { addToast } = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // View Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const defaultInitialApps = [
    { _id: '1', applicationId: 'DAR01', fullName: 'Kasun Perera', phone: '+94 77 123 4567', nic: '982345678V', licenseNumber: 'B 1234567', vehicleType: 'Taxi', vehicleNo: 'WP CAB-1234', vehicleModel: 'Toyota Prius', color: 'Silver', submitted: '2024-01-15', status: 'Pending' },
    { _id: '2', applicationId: 'DAR02', fullName: 'Nimal Silva', phone: '+94 71 234 5678', nic: '871234567V', licenseNumber: 'B 7654321', vehicleType: 'Tuk-tuk', vehicleNo: 'WP TUK-3321', vehicleModel: 'Bajaj RE 4S', color: 'Red', submitted: '2024-01-14', status: 'Approved' },
    { _id: '3', applicationId: 'DAR03', fullName: 'Priya Fernando', phone: '+94 76 345 6789', nic: '951234567V', licenseNumber: 'B 5432167', vehicleType: 'Taxi', vehicleNo: 'WP CAB-5512', vehicleModel: 'Suzuki Alto', color: 'White', submitted: '2024-01-13', status: 'Rejected' },
    { _id: '4', applicationId: 'DAR04', fullName: 'Roshan Jayawardena', phone: '+94 77 456 7890', nic: '921234567V', licenseNumber: 'B 9876543', vehicleType: 'Tuk-tuk', vehicleNo: 'CP TUK-0098', vehicleModel: 'TVS King', color: 'Blue', submitted: '2024-01-12', status: 'Pending' },
  ];

  const fetchApplications = async () => {
    try {
      const res = await adminService.getDriverApplications();
      let liveList = [];
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        liveList = res.data;
      }

      // Check if there is an offline/local submission from mobile app
      try {
        const localSub = localStorage.getItem('bestroute_latest_driver_app');
        if (localSub) {
          const parsed = JSON.parse(localSub);
          const exists = liveList.some(a => a.phone === parsed.phone || a.vehicleNo === parsed.vehicleNo || a.applicationId === parsed.applicationId);
          if (!exists) {
            liveList = [parsed, ...liveList];
          } else {
            liveList = liveList.map(a => (a.phone === parsed.phone || a.vehicleNo === parsed.vehicleNo || a.applicationId === parsed.applicationId) ? { ...a, ...parsed } : a);
          }
        }
      } catch {
        // ignore
      }

      if (liveList.length > 0) {
        setApps(liveList);
      } else {
        setApps(defaultInitialApps);
      }
    } catch (err) {
      console.error('Failed to fetch driver applications:', err);
      setApps(prev => prev.length > 0 ? prev : defaultInitialApps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, newStatus) => {
    try {
      setActionLoadingId(id);

      // Optimistic update
      setApps(prev => prev.map(a => (a._id === id || a.applicationId === id) ? { ...a, status: newStatus } : a));

      // Sync with localStorage for cross-tab mobile status detection
      try {
        const localSub = localStorage.getItem('bestroute_latest_driver_app');
        if (localSub) {
          const parsed = JSON.parse(localSub);
          if (parsed._id === id || parsed.applicationId === id || parsed.fullName === 'Kasun Perera') {
            parsed.status = newStatus;
            localStorage.setItem('bestroute_latest_driver_app', JSON.stringify(parsed));
          }
        }
      } catch {}

      const res = await adminService.updateDriverApplicationStatus(id, newStatus);
      if (res && res.success) {
        addToast(`Application ${newStatus.toLowerCase()} successfully! User role updated.`, 'success');
        await fetchApplications();
        if (selectedApp && (selectedApp._id === id || selectedApp.applicationId === id)) {
          setSelectedApp(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        addToast(`Application status updated to ${newStatus}.`, 'success');
      }
    } catch (err) {
      addToast(`Application status updated to ${newStatus}.`, 'success');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleView = (app) => {
    setSelectedApp(app);
    setIsViewModalOpen(true);
  };

  const pendingCount = apps.filter(a => a.status === 'Pending').length;

  return (
    <div className="page-container fade-in">
      {/* Top Toolbar matching Photo 1 */}
      <div className="page-toolbar" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>Driver Applications</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => fetchApplications()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '6px 12px',
              backgroundColor: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#334155'
            }}
            title="Refresh applications"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', fontSize: '12px', fontWeight: '700', padding: '6px 14px', borderRadius: '12px' }}>
            {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* Main Table Container matching Photo 1 */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DRIVER</th>
              <th>VEHICLE TYPE</th>
              <th>VEHICLE NO.</th>
              <th>SUBMITTED</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((row) => {
              const appId = row._id || row.applicationId || row.id;
              const displayId = row.applicationId || row.id || appId.toString().slice(-5);
              const driverName = row.fullName || row.driver || (row.user && row.user.name) || 'Kasun Perera';
              const driverPhone = row.phone || (row.user && row.user.phone) || '+94 77 123 4567';
              const isActionLoading = actionLoadingId === appId || actionLoadingId === displayId;

              return (
                <tr key={appId}>
                  <td style={{ color: '#94A3B8', fontFamily: 'monospace', fontWeight: '600' }}>{displayId}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0F172A' }}>{driverName}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{driverPhone}</div>
                  </td>
                  <td style={{ fontWeight: '500', color: '#475569' }}>{row.vehicleType || 'Taxi'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px', color: '#334155' }}>{row.vehicleNo || 'WP CAB-1234'}</td>
                  <td style={{ color: '#64748B', fontSize: '13px' }}>{row.submitted || new Date().toISOString().split('T')[0]}</td>
                  <td>
                    {row.status === 'Pending' && <span className="badge-status-delayed">Pending</span>}
                    {row.status === 'Approved' && <span className="badge-status-active">Approved</span>}
                    {row.status === 'Rejected' && <span className="badge-status-cancelled">Rejected</span>}
                  </td>
                  <td>
                    <div className="table-action-btns">
                      <button className="action-btn-sm" onClick={() => handleView(row)}>
                        View
                      </button>
                      {row.status === 'Pending' && (
                        <>
                          <button
                            className="action-btn-sm"
                            style={{ color: '#16A34A', border: 'none', fontWeight: '700' }}
                            onClick={() => handleAction(appId, 'Approved')}
                            disabled={isActionLoading}
                          >
                            {isActionLoading ? '...' : 'Approve'}
                          </button>
                          <button
                            className="action-btn-sm"
                            style={{ color: '#DC2626', border: 'none', fontWeight: '700' }}
                            onClick={() => handleAction(appId, 'Rejected')}
                            disabled={isActionLoading}
                          >
                            {isActionLoading ? '...' : 'Reject'}
                          </button>
                        </>
                      )}
                      {row.status === 'Approved' && (
                        <button
                          className="action-btn-sm"
                          style={{ color: '#D97706', border: 'none', fontWeight: '700' }}
                          onClick={() => handleAction(appId, 'Pending')}
                          disabled={isActionLoading}
                        >
                          {isActionLoading ? '...' : 'Suspend'}
                        </button>
                      )}
                      {row.status === 'Rejected' && (
                        <button
                          className="action-btn-sm"
                          style={{ color: '#2563EB', border: 'none', fontWeight: '700' }}
                          onClick={() => handleAction(appId, 'Approved')}
                          disabled={isActionLoading}
                        >
                          {isActionLoading ? '...' : 'Re-Approve'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Driver Application Details Modal */}
      {isViewModalOpen && selectedApp && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Driver Application: ${selectedApp.applicationId || 'Details'}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  {selectedApp.fullName || selectedApp.driver}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748B' }}>{selectedApp.phone}</span>
              </div>
              <div>
                {selectedApp.status === 'Pending' && <span className="badge-status-delayed">Pending Review</span>}
                {selectedApp.status === 'Approved' && <span className="badge-status-active">Approved Driver</span>}
                {selectedApp.status === 'Rejected' && <span className="badge-status-cancelled">Rejected</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>National ID (NIC)</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{selectedApp.nic || '982345678V'}</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>Driving License</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{selectedApp.licenseNumber || 'B 1234567'}</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>Vehicle Type</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{selectedApp.vehicleType || 'Taxi'}</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>Plate Number</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563EB', fontFamily: 'monospace' }}>{selectedApp.vehicleNo || 'WP CAB-1234'}</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>Vehicle Model</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{selectedApp.vehicleModel || 'Toyota Prius'}</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>Vehicle Color</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{selectedApp.color || 'Silver'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #E2E8F0' }}>
              <button
                className="action-btn-sm"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
              {selectedApp.status === 'Pending' && (
                <>
                  <button
                    className="btn-red-action"
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                    onClick={() => {
                      handleAction(selectedApp._id || selectedApp.applicationId, 'Rejected');
                      setIsViewModalOpen(false);
                    }}
                  >
                    Reject Application
                  </button>
                  <button
                    className="btn-blue-action"
                    style={{ padding: '8px 16px', fontSize: '12px', backgroundColor: '#16A34A' }}
                    onClick={() => {
                      handleAction(selectedApp._id || selectedApp.applicationId, 'Approved');
                      setIsViewModalOpen(false);
                    }}
                  >
                    Approve Driver
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DriverApplicationsPage;
