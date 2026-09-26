import React, { useState, useEffect } from 'react';
import { Bus, Map, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import adminService from '../services/adminService';

const DashboardHome = ({ setActiveTab }) => {
  const [timeFilter, setTimeFilter] = useState('7D');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    servicesCount: 124,
    servicesTrend: '+3 from yesterday',
    routesCount: 58,
    routesTrend: '+1 from yesterday',
    disruptionsCount: 7,
    disruptionsTrend: '+2 from yesterday',
    journeysToday: '2,438',
    journeysTrend: '+12% from yesterday',
    modeSplit: {
      bus: 42,
      train: 28,
      tuktuk: 16,
      taxiWalk: 14,
    },
    journeysPerDay: {
      '7D': [
        { label: '7d ago', count: 1840, height: '40%' },
        { label: '6d ago', count: 2150, height: '55%' },
        { label: '5d ago', count: 1980, height: '50%' },
        { label: '4d ago', count: 1820, height: '45%' },
        { label: '3d ago', count: 2680, height: '75%' },
        { label: 'Yesterday', count: 2320, height: '65%' },
        { label: 'Today', count: 2438, height: '100%', isCurrent: true },
      ],
      '30D': [
        { label: '30d ago', count: 1620, height: '35%' },
        { label: '25d ago', count: 1890, height: '45%' },
        { label: '20d ago', count: 2100, height: '55%' },
        { label: '15d ago', count: 2350, height: '65%' },
        { label: '10d ago', count: 2200, height: '60%' },
        { label: '5d ago', count: 2510, height: '80%' },
        { label: 'Today', count: 2438, height: '100%', isCurrent: true },
      ],
      'All': [
        { label: 'Jan', count: 32000, height: '50%' },
        { label: 'Mar', count: 41000, height: '65%' },
        { label: 'May', count: 39000, height: '60%' },
        { label: 'Jul', count: 48000, height: '80%' },
        { label: 'Sep (Current)', count: 52000, height: '100%', isCurrent: true },
      ],
    },
    activeDisruptions: [],
  });

  const fetchRealData = async () => {
    try {
      setLoading(true);
      // Try dedicated dashboard-stats API first
      const statsRes = await adminService.getDashboardStats().catch(() => null);

      if (statsRes && statsRes.success && statsRes.data) {
        const d = statsRes.data;
        setStats({
          servicesCount: d.activeServices || 124,
          servicesTrend: d.servicesTrend || '+3 from yesterday',
          routesCount: d.activeRoutes || 58,
          routesTrend: d.routesTrend || '+1 from yesterday',
          disruptionsCount: d.disruptionsCount ?? 7,
          disruptionsTrend: d.disruptionsTrend || '+2 from yesterday',
          journeysToday: d.journeysTodayFormatted || (d.journeysToday ? d.journeysToday.toLocaleString() : '2,438'),
          journeysTrend: d.journeysTrend || '+12% from yesterday',
          modeSplit: d.modeSplit || { bus: 42, train: 28, tuktuk: 16, taxiWalk: 14 },
          journeysPerDay: d.journeysPerDay || stats.journeysPerDay,
          activeDisruptions: d.activeDisruptions || [],
        });
      } else {
        // Fallback: Query individual endpoints directly from DB
        const [servicesRes, routesRes, disruptionsRes] = await Promise.all([
          adminService.getServices().catch(() => null),
          adminService.getRoutes().catch(() => null),
          adminService.getActiveDisruptions().catch(() => null),
        ]);

        const rawDisruptions = disruptionsRes?.data || [];
        const formattedDisruptions = rawDisruptions.map((item) => {
          let statusLabel = 'Delayed';
          let pillClass = 'pill-delayed';
          let dotColor = 'amber';

          if (item.disruptionType === 'CANCELLATION') {
            statusLabel = 'Cancelled';
            pillClass = 'pill-cancelled';
            dotColor = 'red';
          } else if (item.disruptionType === 'ROUTE_INTERRUPTION' || item.disruptionType === 'ROAD_CLOSURE') {
            statusLabel = 'Diverted';
            pillClass = 'pill-diverted';
            dotColor = 'amber';
          }

          return {
            _id: item._id,
            title: item.title,
            description: item.description || 'Active Section',
            statusLabel,
            pillClass,
            dotColor,
          };
        });

        setStats((prev) => ({
          ...prev,
          servicesCount: servicesRes?.count ?? servicesRes?.services?.length ?? prev.servicesCount,
          routesCount: routesRes?.count ?? routesRes?.routes?.length ?? prev.routesCount,
          disruptionsCount: disruptionsRes?.count ?? rawDisruptions.length ?? prev.disruptionsCount,
          activeDisruptions: formattedDisruptions,
        }));
      }
    } catch (err) {
      console.error('Error fetching dashboard real data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  // Mode Split donut ring angles
  const busPct = stats.modeSplit?.bus ?? 42;
  const trainPct = stats.modeSplit?.train ?? 28;
  const tukPct = stats.modeSplit?.tuktuk ?? 16;
  const taxiPct = stats.modeSplit?.taxiWalk ?? 14;

  const trainEnd = busPct + trainPct;
  const tukEnd = trainEnd + tukPct;

  const donutConicGradient = `conic-gradient(
    #2563EB 0% ${busPct}%,
    #16A34A ${busPct}% ${trainEnd}%,
    #F59E0B ${trainEnd}% ${tukEnd}%,
    #06B6D4 ${tukEnd}% 100%
  )`;

  // Current bar chart data based on active filter
  const currentBars = stats.journeysPerDay[timeFilter] || stats.journeysPerDay['7D'];

  return (
    <div className="page-container fade-in">
      {/* 4 Top KPI Metric Cards */}
      <div className="stats-cards-grid">
        {/* Active Services */}
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Active Services</div>
            <div className="kpi-value" style={{ color: '#2563EB' }}>
              {stats.servicesCount}
            </div>
            <div className="kpi-trend">{stats.servicesTrend}</div>
          </div>
          <div className="kpi-icon-box bg-light-blue">
            <Bus size={22} color="#2563EB" />
          </div>
        </div>

        {/* Active Routes */}
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Active Routes</div>
            <div className="kpi-value" style={{ color: '#16A34A' }}>
              {stats.routesCount}
            </div>
            <div className="kpi-trend">{stats.routesTrend}</div>
          </div>
          <div className="kpi-icon-box bg-light-green">
            <Map size={22} color="#16A34A" />
          </div>
        </div>

        {/* Disruptions */}
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Disruptions</div>
            <div className="kpi-value" style={{ color: '#DC2626' }}>
              {stats.disruptionsCount}
            </div>
            <div className="kpi-trend">{stats.disruptionsTrend}</div>
          </div>
          <div className="kpi-icon-box bg-light-amber">
            <AlertTriangle size={22} color="#D97706" />
          </div>
        </div>

        {/* Journeys Today */}
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Journeys Today</div>
            <div className="kpi-value" style={{ color: '#0EA5E9' }}>
              {stats.journeysToday}
            </div>
            <div className="kpi-trend">{stats.journeysTrend}</div>
          </div>
          <div className="kpi-icon-box bg-light-purple">
            <Users size={22} color="#9333EA" />
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
              <button
                className={`filter-btn ${timeFilter === '7D' ? 'active' : ''}`}
                onClick={() => setTimeFilter('7D')}
              >
                7D
              </button>
              <button
                className={`filter-btn ${timeFilter === '30D' ? 'active' : ''}`}
                onClick={() => setTimeFilter('30D')}
              >
                30D
              </button>
              <button
                className={`filter-btn ${timeFilter === 'All' ? 'active' : ''}`}
                onClick={() => setTimeFilter('All')}
              >
                All
              </button>
            </div>
          </div>

          <div className="bar-chart-container">
            {currentBars.map((bar, idx) => (
              <div
                key={idx}
                className={`bar-col ${bar.isCurrent ? 'current' : ''}`}
                style={{ height: bar.height }}
                title={`${bar.label}: ${bar.count.toLocaleString()} journeys`}
              />
            ))}
          </div>

          <div className="bar-labels">
            <span>{currentBars[0]?.label || '7d ago'}</span>
            <span>{currentBars[currentBars.length - 1]?.label || 'Today'}</span>
          </div>
        </div>

        {/* Mode Split Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Mode Split</div>
          </div>

          <div className="donut-chart-box">
            <div className="donut-ring" style={{ background: donutConicGradient }}>
              <div className="donut-hole"></div>
            </div>

            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#2563EB' }}></span>
                <span>Bus {busPct}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#16A34A' }}></span>
                <span>Train {trainPct}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#F59E0B' }}></span>
                <span>Tuk-tuk {tukPct}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#06B6D4' }}></span>
                <span>Taxi+Walk {taxiPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Disruptions Section */}
      <div className="disruptions-section-card">
        <div className="disruptions-header">
          <div className="disruptions-header-left">
            <AlertTriangle color="#DC2626" size={18} />
            <span className="disruptions-header-title">Active Disruptions</span>
            <span className="disruptions-count-badge">{stats.disruptionsCount}</span>
          </div>
          <button
            className="disruptions-view-all-btn"
            onClick={() => setActiveTab && setActiveTab('disruptions')}
          >
            <span>View all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="disruptions-list">
          {stats.activeDisruptions.length > 0 ? (
            stats.activeDisruptions.map((disruption) => (
              <div key={disruption._id || disruption.id} className="disruption-row">
                <div className="disruption-left">
                  <span className={`disruption-dot-${disruption.dotColor || 'amber'}`}></span>
                  <span className="disruption-name">{disruption.title}</span>
                  <span className="disruption-location">{disruption.description}</span>
                </div>
                <span className={disruption.pillClass || 'pill-delayed'}>
                  {disruption.statusLabel || 'Delayed'}
                </span>
              </div>
            ))
          ) : (
            <>
              {/* Fallback if database is connecting */}
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

              <div className="disruption-row">
                <div className="disruption-left">
                  <span className="disruption-dot-red"></span>
                  <span className="disruption-name">Intercity 55</span>
                  <span className="disruption-location">Colombo Fort</span>
                </div>
                <span className="pill-cancelled">Cancelled</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
