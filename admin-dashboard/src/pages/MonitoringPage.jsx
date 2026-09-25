import React, { useState } from 'react';
import { RefreshCw, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const MonitoringPage = () => {
  const { addToast } = useToast();

  const [feeds, setFeeds] = useState([
    { name: 'SLTB Bus Feed', mode: 'Bus', status: 'Live', statusColor: '#16A34A', lastUpdate: '12s ago', coverage: 94, coverageColor: '#16A34A', issues: '✓ Clean', issuesColor: '#16A34A', actions: ['Inspect'], latency: '42 ms', packets: '14,208 / sec', protocol: 'GTFS Realtime (Protobuf)' },
    { name: 'SLR Train GTFS', mode: 'Train', status: 'Live', statusColor: '#16A34A', lastUpdate: '2m ago', coverage: 88, coverageColor: '#16A34A', issues: '2 issues', issuesColor: '#DC2626', actions: ['Inspect'], latency: '128 ms', packets: '3,850 / sec', protocol: 'GTFS-RT VehiclePositions' },
    { name: 'PickMe Taxi API', mode: 'Taxi', status: 'Live', statusColor: '#16A34A', lastUpdate: '5s ago', coverage: 100, coverageColor: '#16A34A', issues: '✓ Clean', issuesColor: '#16A34A', actions: ['Inspect'], latency: '18 ms', packets: '28,100 / sec', protocol: 'REST Websocket API v2' },
    { name: 'Private Bus Network', mode: 'Bus', status: 'Stale', statusColor: '#D97706', lastUpdate: '18m ago', coverage: 71, coverageColor: '#D97706', issues: '5 issues', issuesColor: '#DC2626', actions: ['Inspect', 'Reconnect'], latency: '480 ms', packets: '210 / sec', protocol: 'MQTT Telemetry Stream' },
    { name: 'Tuk Alliance Feed', mode: 'Tuk-tuk', status: 'Live', statusColor: '#16A34A', lastUpdate: '1m ago', coverage: 83, coverageColor: '#D97706', issues: '1 issues', issuesColor: '#DC2626', actions: ['Inspect'], latency: '85 ms', packets: '5,420 / sec', protocol: 'JSON Polling Endpoint' },
    { name: 'Night Schedule Feed', mode: 'Train', status: 'Offline', statusColor: '#DC2626', lastUpdate: '3h ago', coverage: 0, coverageColor: '#CBD5E1', issues: '8 issues', issuesColor: '#DC2626', actions: ['Inspect', 'Reconnect'], latency: 'Timeout (>5000ms)', packets: '0 / sec', protocol: 'GTFS Static Scheduler' },
  ]);

  // Inspect Modal State
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);

  const handleOpenInspect = (feed) => {
    setSelectedFeed(feed);
    setIsInspectModalOpen(true);
  };

  const handleForceSyncFeed = (feedName) => {
    setFeeds(prev => prev.map(f => {
      if (f.name === feedName) {
        return {
          ...f,
          status: 'Live',
          statusColor: '#16A34A',
          lastUpdate: 'Just now',
          issues: '✓ Clean',
          issuesColor: '#16A34A',
          coverage: 98,
          coverageColor: '#16A34A',
        };
      }
      return f;
    }));

    addToast(`Force sync initiated for "${feedName}". Stream live!`, 'success');
    setIsInspectModalOpen(false);
  };

  const handleReconnectFeed = (feedName) => {
    setFeeds(prev => prev.map(f => {
      if (f.name === feedName) {
        return {
          ...f,
          status: 'Live',
          statusColor: '#16A34A',
          lastUpdate: 'Just now',
          coverage: 100,
          coverageColor: '#16A34A',
          issues: '✓ Clean',
          issuesColor: '#16A34A',
          actions: ['Inspect'],
        };
      }
      return f;
    }));

    addToast(`Feed "${feedName}" reconnected successfully!`, 'success');
  };

  const handleRefreshAllFeeds = () => {
    setFeeds(prev => prev.map(f => ({
      ...f,
      lastUpdate: 'Just now',
    })));
    addToast('Telemetry data feeds refreshed!', 'info');
  };

  const liveFeedsCount = feeds.filter(f => f.status === 'Live').length;
  const staleFeedsCount = feeds.filter(f => f.status === 'Stale').length;
  const offlineFeedsCount = feeds.filter(f => f.status === 'Offline').length;

  return (
    <div className="page-container fade-in">
      {/* System Operational Top Banner */}
      <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
          <div>
            <div style={{ fontWeight: '800', color: '#166534', fontSize: '14px' }}>Transportation data system operational</div>
            <div style={{ fontSize: '12px', color: '#15803D' }}>{liveFeedsCount} of {feeds.length} data feeds live - Last full sync 2 min ago</div>
          </div>
        </div>
        <div style={{ fontWeight: '800', color: '#166534', fontSize: '14px' }}>99.2% uptime</div>
      </div>

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div className="kpi-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{liveFeedsCount}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>Live feeds</div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{staleFeedsCount}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>Stale feeds</div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{offlineFeedsCount}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>Offline feeds</div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>⚠️</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>16</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>Open Issues</div>
        </div>
      </div>

      {/* Data Feed Status Table */}
      <div className="table-container" style={{ marginBottom: '24px' }}>
        <div className="table-header-box">
          <div style={{ fontWeight: '700', fontSize: '13px', color: '#64748B', letterSpacing: '0.5px' }}>DATA FEED STATUS</div>
          <button 
            onClick={handleRefreshAllFeeds}
            style={{ background: 'transparent', color: '#2563EB', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RefreshCw size={12} />
            <span>Refresh all</span>
          </button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>FEED NAME</th>
              <th>MODE</th>
              <th>STATUS</th>
              <th>LAST UPDATE</th>
              <th>COVERAGE</th>
              <th>ISSUES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map((feed, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '700', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: feed.statusColor }}></span>
                  {feed.name}
                </td>
                <td style={{ color: '#475569', fontWeight: '500' }}>{feed.mode}</td>
                <td style={{ fontWeight: '700', color: feed.statusColor }}>{feed.status}</td>
                <td style={{ color: '#94A3B8', fontSize: '13px' }}>{feed.lastUpdate}</td>
                <td style={{ width: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="progress-bar-bg" style={{ flex: 1, height: '6px', margin: 0 }}>
                      <div className="progress-bar-fill" style={{ width: `${feed.coverage}%`, backgroundColor: feed.coverageColor }}></div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', width: '32px' }}>{feed.coverage}%</span>
                  </div>
                </td>
                <td style={{ fontWeight: '700', color: feed.issuesColor }}>{feed.issues}</td>
                <td>
                  <div className="table-action-btns">
                    {feed.actions.map((act, i) => (
                      <button 
                        key={i} 
                        className="action-btn-sm" 
                        style={act === 'Reconnect' ? { color: '#2563EB', borderColor: '#BFDBFE' } : {}}
                        onClick={() => {
                          if (act === 'Inspect') handleOpenInspect(feed);
                          else if (act === 'Reconnect') handleReconnectFeed(feed.name);
                        }}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dataset Coverage by Transport Mode Card */}
      <div className="chart-card">
        <div className="chart-title" style={{ marginBottom: '20px' }}>Dataset Coverage by Transport Mode</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                <span>🚍 Bus</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
                <span style={{ fontWeight: '800', color: '#0F172A', marginRight: '12px' }}>82%</span>
                22 routes · 186 schedules
              </div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '82%', backgroundColor: '#D97706' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                <span>🚆 Train</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
                <span style={{ fontWeight: '800', color: '#0F172A', marginRight: '12px' }}>88%</span>
                7 routes · 56 schedules
              </div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '88%', backgroundColor: '#D97706' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                <span>🚖 Taxi</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>100%</div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '100%', backgroundColor: '#16A34A' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                <span>🛺 Tuk-tuk</span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>83%</div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '83%', backgroundColor: '#D97706' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspect Feed Modal */}
      <Modal isOpen={isInspectModalOpen} onClose={() => setIsInspectModalOpen(false)} title="Data Feed Diagnostics">
        {selectedFeed && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>{selectedFeed.name}</h4>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>Protocol: <strong>{selectedFeed.protocol}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: selectedFeed.statusColor }}>
                <Activity size={16} />
                <span>{selectedFeed.status}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Network Latency</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>{selectedFeed.latency}</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Throughput (Packets)</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>{selectedFeed.packets}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Feed Coverage</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: selectedFeed.coverageColor, marginTop: '4px' }}>{selectedFeed.coverage}%</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Reported Issues</div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: selectedFeed.issuesColor, marginTop: '4px' }}>{selectedFeed.issues}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                className="action-btn-sm" 
                style={{ padding: '8px 16px' }} 
                onClick={() => setIsInspectModalOpen(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn-blue-action" 
                style={{ borderRadius: '10px', padding: '8px 20px' }} 
                onClick={() => handleForceSyncFeed(selectedFeed.name)}
              >
                Force Sync Feed
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MonitoringPage;

