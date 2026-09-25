import React from 'react';
import { RefreshCw } from 'lucide-react';

const MonitoringPage = () => {
  const feeds = [
    { name: 'SLTB Bus Feed', mode: 'Bus', status: 'Live', statusColor: '#16A34A', lastUpdate: '12s ago', coverage: 94, coverageColor: '#16A34A', issues: '✓ Clean', issuesColor: '#16A34A', actions: ['Inspect'] },
    { name: 'SLR Train GTFS', mode: 'Train', status: 'Live', statusColor: '#16A34A', lastUpdate: '2m ago', coverage: 88, coverageColor: '#16A34A', issues: '2 issues', issuesColor: '#DC2626', actions: ['Inspect'] },
    { name: 'PickMe Taxi API', mode: 'Taxi', status: 'Live', statusColor: '#16A34A', lastUpdate: '5s ago', coverage: 100, coverageColor: '#16A34A', issues: '✓ Clean', issuesColor: '#16A34A', actions: ['Inspect'] },
    { name: 'Private Bus Network', mode: 'Bus', status: 'Stale', statusColor: '#D97706', lastUpdate: '18m ago', coverage: 71, coverageColor: '#D97706', issues: '5 issues', issuesColor: '#DC2626', actions: ['Inspect', 'Reconnect'] },
    { name: 'Tuk Alliance Feed', mode: 'Tuk-tuk', status: 'Live', statusColor: '#16A34A', lastUpdate: '1m ago', coverage: 83, coverageColor: '#D97706', issues: '1 issues', issuesColor: '#DC2626', actions: ['Inspect'] },
    { name: 'Night Schedule Feed', mode: 'Train', status: 'Offline', statusColor: '#DC2626', lastUpdate: '3h ago', coverage: 0, coverageColor: '#CBD5E1', issues: '8 issues', issuesColor: '#DC2626', actions: ['Inspect', 'Reconnect'] },
  ];

  return (
    <div className="page-container fade-in">
      {/* System Operational Top Banner */}
      <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
          <div>
            <div style={{ fontWeight: '800', color: '#166534', fontSize: '14px' }}>Transportation data system operational</div>
            <div style={{ fontSize: '12px', color: '#15803D' }}>5 of 6 data feeds live - Last full sync 2 min ago</div>
          </div>
        </div>
        <div style={{ fontWeight: '800', color: '#166534', fontSize: '14px' }}>99.2% uptime</div>
      </div>

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div className="kpi-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>4</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>Live feeds</div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>1</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>Stale feeds</div>
        </div>

        <div className="kpi-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>1</span>
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
          <button style={{ background: 'transparent', color: '#2563EB', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                      <button key={i} className="action-btn-sm" style={act === 'Reconnect' ? { color: '#2563EB', borderColor: '#BFDBFE' } : {}}>
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
    </div>
  );
};

export default MonitoringPage;
