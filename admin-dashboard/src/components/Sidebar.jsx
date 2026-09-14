import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside style={{ width: '250px', height: '100vh', background: '#0F172A', color: '#FFF', padding: '20px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '30px' }}>BestRoute Admin</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/services" style={{ color: '#94A3B8', textDecoration: 'none' }}>Transit Services</Link>
        <Link to="/routes-schedules" style={{ color: '#94A3B8', textDecoration: 'none' }}>Routes & Schedules</Link>
        <Link to="/disruptions" style={{ color: '#94A3B8', textDecoration: 'none' }}>Disruption Control</Link>
        <Link to="/data-monitoring" style={{ color: '#94A3B8', textDecoration: 'none' }}>Live Transit Monitoring</Link>
        <Link to="/analytics" style={{ color: '#94A3B8', textDecoration: 'none' }}>Usage Analytics</Link>
        <Link to="/users" style={{ color: '#94A3B8', textDecoration: 'none' }}>User Accounts</Link>
        <Link to="/settings" style={{ color: '#94A3B8', textDecoration: 'none' }}>System Settings</Link>
      </nav>
    </aside>
  );
}
