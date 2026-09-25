import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = login(username, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="login-page fade-in">
      {/* Left Blue Gradient Hero Panel */}
      <div className="login-hero">
        <div className="login-hero-header">
          <img 
            src={logoImg} 
            alt="BestRoute Logo" 
            style={{ height: '84px', width: 'auto', objectFit: 'contain' }} 
          />
        </div>

        <div className="login-hero-content">
          <h1 className="login-hero-title">
            Transportation<br />Operations Centre
          </h1>
          <p className="login-hero-subtitle">
            Monitor services in real time, manage disruptions, and keep Sri Lanka's multimodal network running smoothly.
          </p>

          <div className="login-stats-grid">
            <div className="login-stat-card">
              <div className="login-stat-icon">🚌</div>
              <div className="login-stat-value">124</div>
              <div className="login-stat-label">Active Services</div>
            </div>

            <div className="login-stat-card">
              <div className="login-stat-icon">🗺️</div>
              <div className="login-stat-value">58</div>
              <div className="login-stat-label">Routes Managed</div>
            </div>

            <div className="login-stat-card">
              <div className="login-stat-icon">👥</div>
              <div className="login-stat-value">2,438</div>
              <div className="login-stat-label">Journeys Today</div>
            </div>

            <div className="login-stat-card">
              <div className="login-stat-icon">✅</div>
              <div className="login-stat-value">92%</div>
              <div className="login-stat-label">On-time Rate</div>
            </div>
          </div>
        </div>

        <div className="login-hero-footer">
          © 2026 BestRoute · Admin Console · Secure Access
        </div>
      </div>

      {/* Right Form Container */}
      <div className="login-form-container">
        <div className="login-card">
          <div className="login-badge">
            <span className="dot-green"></span>
            SECURE ADMIN ACCESS
          </div>

          <h2 className="login-title">Sign in to Console</h2>
          <p className="login-subtext">Enter your administrator credentials to continue.</p>

          {error && (
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">USERNAME</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="btn-login">
              Sign In to Admin Console
            </button>
          </form>

          <p className="login-disclaimer">
            This console is for authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
