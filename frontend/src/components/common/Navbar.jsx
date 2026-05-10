import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/auth');
  };

  const close = () => setMenuOpen(false);

  return (
    <header className="container navbar" style={{ position: 'relative' }}>
      <div className="navbar-bar glass">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <div className="logo">Traveloop</div>
          <div className="brand-tag">Journey OS</div>
        </Link>

        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/destination-explorer">Explore</Link>
          <Link to="/community">Community</Link>
          <Link to="/admin">Admin Panel</Link>

          {isAuthenticated ? (
            <button
              className="avatar"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
              title={user?.firstName ?? 'Account'}
            >
              <img
                src={user?.profileImage ?? 'https://i.pravatar.cc/150?img=32'}
                alt={user?.firstName ?? 'User'}
              />
              <FiChevronDown size={14} style={{ color: 'var(--muted)' }} />
            </button>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ padding: '8px 16px' }}>
              Sign In
            </Link>
          )}
        </nav>
      </div>

      {/* Dropdown menu — only when authenticated + open */}
      {isAuthenticated && menuOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={close}
          />
          <div
            className="card"
            style={{
              position: 'absolute',
              top: '65px',
              right: '24px',
              width: '280px',
              padding: '16px',
              zIndex: 1000,
            }}
          >
            {/* User info header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                paddingBottom: 14,
                marginBottom: 14,
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div className="avatar" style={{ width: 40, height: 40, flexShrink: 0 }}>
                <img
                  src={user?.avatar ?? 'https://i.pravatar.cc/150?img=32'}
                  alt={user?.firstName}
                />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  {user?.firstName} {user?.lastName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{user?.email}</div>
              </div>
            </div>

            {/* Nav links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { to: '/dashboard', label: '📊 Dashboard Hub' },
                { to: '/create', label: '➕ Plan New Trip' },
                { to: '/destination-explorer', label: '🔍 Explore Cities' },
                { to: '/community', label: '🌎 Travel Community' },
                { to: '/profile', label: '👤 My Profile' },
                { to: '/admin', label: '⚙️ Admin Dashboard' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="muted"
                  style={{ padding: '8px 12px', borderRadius: 8, fontSize: 14 }}
                  onClick={close}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12, display: 'grid', gap: 4 }}>
              <Link
                to="/profile"
                className="muted"
                style={{ padding: '8px 12px', borderRadius: 8, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={close}
              >
                <FiUser size={14} /> My Profile
              </Link>
              <Link
                to="/admin"
                className="muted"
                style={{ padding: '8px 12px', borderRadius: 8, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={close}
              >
                Admin Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  textAlign: 'left',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                }}
              >
                <FiLogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
