import React from 'react';
import { Search, Moon, Bell } from 'lucide-react';

const Navbar = ({ activeTabTitle }) => {
  return (
    <div className="navbar">
      <div className="navbar-title-box">
        <div className="navbar-title">
          {activeTabTitle || 'Transportation Overview'}
        </div>
        <div className="navbar-subtitle">
          Monday, 15 September 2026 - Colombo, Sri Lanka
        </div>
      </div>

      <div className="navbar-actions">
        <div className="search-box">
          <Search size={16} className="text-slate-400" />
          <input type="text" className="search-input" placeholder="Search services..." />
        </div>

        <div className="icon-btn">
          <Moon size={18} />
        </div>

        <div className="icon-btn">
          <Bell size={18} />
          <span className="icon-btn-badge">2</span>
        </div>

        <div className="avatar-blue" style={{ width: '36px', height: '36px', fontSize: '13px', fontWeight: '800' }}>
          AD
        </div>
      </div>
    </div>
  );
};

export default Navbar;
