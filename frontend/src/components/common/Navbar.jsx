import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="container navbar">
      <div className="navbar-bar glass">
        <div className="brand">
          <div className="logo">Traveloop</div>
          <div className="brand-tag">Journey OS</div>
        </div>
        <nav className="nav-links">
          <Link to="/explore">Explore</Link>
          <Link to="/itinerary">Itinerary</Link>
          <Link to="/budget">Budget</Link>
          <Link to="/profile">Profile</Link>
          <button
            className="avatar"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src="https://i.pravatar.cc/150?img=32" alt="User avatar" />
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="card" style={{ position: 'absolute', top: '65px', right: '24px', width: '280px', padding: '16px', zIndex: 1000 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            Planner
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/dashboard" className="muted" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/create" className="muted" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }} onClick={() => setMenuOpen(false)}>Create Trip</Link>
            <Link to="/itinerary" className="muted" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }} onClick={() => setMenuOpen(false)}>Itinerary Builder</Link>
            <Link to="/explore" className="muted" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }} onClick={() => setMenuOpen(false)}>Destination Explorer</Link>
            <Link to="/budget" className="muted" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }} onClick={() => setMenuOpen(false)}>Budget Planner</Link>
            <Link to="/packing" className="muted" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }} onClick={() => setMenuOpen(false)}>Packing Checklist</Link>
            <Link to="/profile" className="muted" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px' }} onClick={() => setMenuOpen(false)}>Profile</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
