import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';

export default function Profile() {
  const { user, isAuthenticated, updateUser } = useAuth();

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // ── Account details form state ──────────────────────────────────────────────
  const [accountFields, setAccountFields] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    city: user?.city ?? '',
    country: user?.country ?? '',
  });

  // ── Preferences form state ──────────────────────────────────────────────────
  const [prefFields, setPrefFields] = useState({
    travelStyle: user?.travelStyle ?? 'Adventure',
    budgetStyle: user?.budgetStyle ?? 'Mid-range',
    additionalInfo: user?.additionalInfo ?? '',
  });

  const [accountStatus, setAccountStatus] = useState(null); // 'saving' | 'saved' | 'error'
  const [prefStatus, setPrefStatus] = useState(null);

  const setAcc = (key) => (e) => setAccountFields((p) => ({ ...p, [key]: e.target.value }));
  const setPref = (key) => (e) => setPrefFields((p) => ({ ...p, [key]: e.target.value }));

  // ── Save account details ────────────────────────────────────────────────────
  async function saveAccount(e) {
    e.preventDefault();
    setAccountStatus('saving');
    try {
      const { user: updated } = await updateProfile(accountFields);
      updateUser(updated);
      setAccountStatus('saved');
      setTimeout(() => setAccountStatus(null), 3000);
    } catch {
      setAccountStatus('error');
    }
  }

  // ── Save preferences ────────────────────────────────────────────────────────
  async function savePreferences(e) {
    e.preventDefault();
    setPrefStatus('saving');
    try {
      const { user: updated } = await updateProfile(prefFields);
      updateUser(updated);
      setPrefStatus('saved');
      setTimeout(() => setPrefStatus(null), 3000);
    } catch {
      setPrefStatus('error');
    }
  }

  function StatusBadge({ status }) {
    if (!status) return null;
    if (status === 'saving') return <span style={{ fontSize: 13, color: 'var(--muted)' }}>Saving…</span>;
    if (status === 'saved')
      return (
        <span style={{ fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FiCheck size={14} /> Saved
        </span>
      );
    return (
      <span style={{ fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
        <FiAlertCircle size={14} /> Failed
      </span>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader title="My Profile" subtitle="Manage your account details and travel preferences." />

          {/* Avatar card */}
          <div className="card glass" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
            <div className="avatar" style={{ width: '80px', height: '80px' }}>
              <img src={user?.avatar ?? 'https://i.pravatar.cc/150?img=32'} alt={user?.firstName} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{user?.firstName} {user?.lastName}</h2>
              <p className="muted" style={{ margin: '4px 0 0 0' }}>
                {user?.email} {user?.city && <span>• From {user.city}{user.country ? `, ${user.country}` : ''}</span>}
              </p>
              <button className="btn btn-ghost" style={{ marginTop: '12px' }}>
                Change Avatar
              </button>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '24px' }}>
            {/* Account details */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Account Details</h3>
                <StatusBadge status={accountStatus} />
              </div>
              <form onSubmit={saveAccount} style={{ display: 'grid', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>First Name</label>
                    <input className="input" value={accountFields.firstName} onChange={setAcc('firstName')} placeholder="First name" />
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Last Name</label>
                    <input className="input" value={accountFields.lastName} onChange={setAcc('lastName')} placeholder="Last name" />
                  </div>
                </div>
                <div>
                  <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Email</label>
                  <input className="input" type="email" value={accountFields.email} onChange={setAcc('email')} placeholder="Email address" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>City</label>
                    <input className="input" value={accountFields.city} onChange={setAcc('city')} placeholder="Home city" />
                  </div>
                  <div>
                    <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Country</label>
                    <input className="input" value={accountFields.country} onChange={setAcc('country')} placeholder="Country" />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={accountStatus === 'saving'}>
                  Save Changes
                </button>
              </form>
            </div>

            {/* Travel preferences */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Travel Preferences</h3>
                <StatusBadge status={prefStatus} />
              </div>
              <form onSubmit={savePreferences} style={{ display: 'grid', gap: '14px' }}>
                <div>
                  <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Travel Style</label>
                  <select className="input" value={prefFields.travelStyle} onChange={setPref('travelStyle')}>
                    <option>Adventure</option>
                    <option>Relaxation</option>
                    <option>Culture</option>
                    <option>Food &amp; Wine</option>
                  </select>
                </div>
                <div>
                  <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Budget Range</label>
                  <select className="input" value={prefFields.budgetStyle} onChange={setPref('budgetStyle')}>
                    <option>Budget-friendly</option>
                    <option>Mid-range</option>
                    <option>Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Additional Notes</label>
                  <textarea
                    rows="4"
                    className="input"
                    value={prefFields.additionalInfo}
                    onChange={setPref('additionalInfo')}
                    placeholder="Notes on your travel style…"
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={prefStatus === 'saving'}>
                  Update Preferences
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
