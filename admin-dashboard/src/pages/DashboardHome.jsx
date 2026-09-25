import React, { useState } from 'react';
import { Bus, Map, AlertTriangle, Users, ArrowRight } from 'lucide-react';

const DashboardHome = () => {
  const [timeFilter, setTimeFilter] = useState('7D');

  return (
    <div className="page-container fade-in">
      {/* 4 Top KPI Metric Cards */}
      <div className="stats-cards-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Active Services</div>
            <div className="kpi-value">124</div>
            <div className="kpi-trend">+3 from yesterday</div>
          </div>
          <div className="kpi-icon-box bg-light-blue">
            <Bus size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Active Routes</div>
            <div className="kpi-value">58</div>
            <div className="kpi-trend">+1 from yesterday</div>
          </div>
          <div className="kpi-icon-box bg-light-green">
            <Map size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Disruptions</div>
            <div className="kpi-value">7</div>
            <div className="kpi-trend">+2 from yesterday</div>
          </div>
          <div className="kpi-icon-box bg-light-amber">
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Journeys Today</div>
            <div className="kpi-value" style={{ color: '#0EA5E9' }}>2,438</div>
            <div className="kpi-trend">+12% from yesterday</div>
          </div>
          <div className="kpi-icon-box bg-light-purple">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Middle Row: Charts Grid */}
      <div className="charts-grid">
        {/* Journeys per Day Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Journeys per Day</div>
            <div className="chart-filter-group">
              <button className={`filter-btn ${timeFilter === '7D' ? 'active' : ''}`} onClick={() => setTimeFilter('7D')}>7D</button>
              <button className={`filter-btn ${timeFilter === '30D' ? 'active' : ''}`} onClick={() => setTimeFilter('30D')}>30D</button>
              <button className={`filter-btn ${timeFilter === 'All' ? 'active' : ''}`} onClick={() => setTimeFilter('All')}>All</button>
            </div>
          </div>

          <div className="bar-chart-container">
            <div className="bar-col" style={{ height: '40%' }}></div>
            <div className="bar-col" style={{ height: '55%' }}></div>
            <div className="bar-col" style={{ height: '50%' }}></div>
            <div className="bar-col" style={{ height: '45%' }}></div>
            <div className="bar-col" style={{ height: '75%' }}></div>
            <div className="bar-col" style={{ height: '65%' }}></div>
            <div className="bar-col current"></div>
          </div>

          <div className="bar-labels">
            <span>7d ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Mode Split Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Mode Split</div>
          </div>

          <div className="donut-chart-box">
            <div className="donut-ring">
              <div className="donut-hole"></div>
            </div>

            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#2563EB' }}></span>
                <span>Bus 42%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#16A34A' }}></span>
                <span>Train 28%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#F59E0B' }}></span>
                <span>Tuk-tuk 16%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#06B6D4' }}></span>
                <span>Taxi+Walk 14%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Disruptions */}
      <div className="disruptions-section-card">
        <div className="chart-header" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle className="text-amber-500" size={18} />
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#0F172A' }}>Active Disruptions</span>
            <span className="sidebar-badge" style={{ fontSize: '11px' }}>7</span>
          </div>
          <button style={{ background: 'transparent', color: '#2563EB', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="disruption-row">
          <div className="disruption-left">
            <span className="disruption-dot-amber"></span>
            <span className="disruption-name">Kandy Express</span>
            <span className="disruption-location">Peradeniya</span>
          </div>
          <span className="pill-delayed">Delayed</span>
        </div>

        <div className="disruption-row">
          <div className="disruption-left">
            <span className="disruption-dot-amber"></span>
            <span className="disruption-name">Route 654</span>
            <span className="disruption-location">Kandy Rd</span>
          </div>
          <span className="pill-diverted">Diverted</span>
        </div>

        <div className="disruption-row" style={{ marginBottom: 0 }}>
          <div className="disruption-left">
            <span className="disruption-dot-red"></span>
            <span className="disruption-name">Intercity 55</span>
            <span className="disruption-location">Colombo Fort</span>
          </div>
          <span className="pill-cancelled">Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
