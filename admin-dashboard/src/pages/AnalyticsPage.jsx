import React, { useState } from 'react';

const AnalyticsPage = () => {
  const [range, setRange] = useState('Today');

  return (
    <div className="page-container fade-in">
      {/* Subheader Toolbar */}
      <div className="page-toolbar" style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '500' }}>
          Showing data for Sri Lanka Transport Network
        </div>

        <div className="filter-pills">
          <button className={`pill-btn ${range === 'Today' ? 'active' : ''}`} onClick={() => setRange('Today')}>Today</button>
          <button className={`pill-btn ${range === '7 Days' ? 'active' : ''}`} onClick={() => setRange('7 Days')}>7 Days</button>
          <button className={`pill-btn ${range === '30 Days' ? 'active' : ''}`} onClick={() => setRange('30 Days')}>30 Days</button>
          <button className={`pill-btn ${range === 'Custom' ? 'active' : ''}`} onClick={() => setRange('Custom')}>Custom</button>
        </div>
      </div>

      {/* Top Row: 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', marginBottom: '24px' }}>
        <div className="chart-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600', marginBottom: '8px' }}>Avg Journey Duration</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>1h 28m</div>
          <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700' }}>-3 min vs last period</div>
        </div>

        <div className="chart-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600', marginBottom: '8px' }}>Avg Journey Cost</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>Rs. 285</div>
          <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700' }}>+Rs.12 vs last period</div>
        </div>

        <div className="chart-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600', marginBottom: '8px' }}>Disruption Frequency</div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>4.2/day</div>
          <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700' }}>-0.8 vs last period</div>
        </div>
      </div>

      {/* Middle Row: 2 Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
        {/* Most Popular Routes */}
        <div className="chart-card">
          <div className="chart-title" style={{ marginBottom: '20px' }}>Most Popular Routes</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#0F172A' }}>Kandy ➔ Colombo Fort</span>
                <span style={{ color: '#2563EB', fontWeight: '700' }}>486</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '80%', backgroundColor: '#2563EB' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#0F172A' }}>Colombo ➔ Nugegoda</span>
                <span style={{ color: '#2563EB', fontWeight: '700' }}>342</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '60%', backgroundColor: '#2563EB' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#0F172A' }}>Kandy ➔ Peradeniya</span>
                <span style={{ color: '#2563EB', fontWeight: '700' }}>218</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '38%', backgroundColor: '#2563EB' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#0F172A' }}>Galle ➔ Colombo</span>
                <span style={{ color: '#2563EB', fontWeight: '700' }}>195</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '32%', backgroundColor: '#2563EB' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Risk Frequency */}
        <div className="chart-card">
          <div className="chart-title" style={{ marginBottom: '20px' }}>Connection Risk Frequency</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#0F172A' }}>Low Risk</span>
                <span style={{ color: '#16A34A', fontWeight: '700' }}>1842 (76%)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '76%', backgroundColor: '#16A34A' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#0F172A' }}>Medium Risk</span>
                <span style={{ color: '#D97706', fontWeight: '700' }}>421 (17%)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '17%', backgroundColor: '#D97706' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#0F172A' }}>High Risk</span>
                <span style={{ color: '#DC2626', fontWeight: '700' }}>175 (7%)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '7%', backgroundColor: '#DC2626' }}></div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600', marginBottom: '4px' }}>Avg connection risk score</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#16A34A' }}>
              2.1 <span style={{ fontSize: '16px', color: '#94A3B8', fontWeight: '600' }}>/ 10</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Well within acceptable thresholds</div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Journeys per Day (Last 14 Days) */}
      <div className="chart-card">
        <div className="chart-title" style={{ marginBottom: '20px' }}>Journeys per Day (Last 14 Days)</div>

        <div className="bar-chart-container" style={{ gap: '10px' }}>
          <div className="bar-col" style={{ height: '45%' }}></div>
          <div className="bar-col" style={{ height: '50%' }}></div>
          <div className="bar-col" style={{ height: '48%' }}></div>
          <div className="bar-col" style={{ height: '62%' }}></div>
          <div className="bar-col" style={{ height: '58%' }}></div>
          <div className="bar-col" style={{ height: '40%' }}></div>
          <div className="bar-col" style={{ height: '52%' }}></div>
          <div className="bar-col" style={{ height: '56%' }}></div>
          <div className="bar-col" style={{ height: '54%' }}></div>
          <div className="bar-col" style={{ height: '68%' }}></div>
          <div className="bar-col" style={{ height: '60%' }}></div>
          <div className="bar-col" style={{ height: '50%' }}></div>
          <div className="bar-col" style={{ height: '55%' }}></div>
          <div className="bar-col current" style={{ height: '100%' }}></div>
        </div>

        <div className="bar-labels">
          <span>Sept 1</span>
          <span style={{ fontWeight: '700', color: '#2563EB' }}>Today: 2,438</span>
          <span>Sept 15</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
