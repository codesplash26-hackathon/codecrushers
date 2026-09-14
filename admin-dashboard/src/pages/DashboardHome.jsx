import React from 'react';
import MetricsCard from '../components/MetricsCard';
import TransitMap from '../components/TransitMap';

export default function DashboardHome() {
  return (
    <div>
      <h2>Overview</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
        <MetricsCard title="Active Routes" value="42" change="+3 this week" />
        <MetricsCard title="Active Disruptions" value="2" />
        <MetricsCard title="Daily Passengers" value="1,420" change="+12%" />
      </div>
      <TransitMap />
    </div>
  );
}
