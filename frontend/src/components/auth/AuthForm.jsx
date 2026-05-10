import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await authService.login(formData.email, formData.password);
      } else {
        await authService.signup(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" style={{ padding: '20px', display: 'grid', gap: 12 }} onSubmit={handleSubmit}>
      {error && (
        <div style={{ padding: '10px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {mode === 'signup' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="muted" style={{ fontSize: '12px' }}>First Name</label>
              <input className="input" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Maya" required />
            </div>
            <div>
              <label className="muted" style={{ fontSize: '12px' }}>Last Name</label>
              <input className="input" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Arora" required />
            </div>
          </div>
          <label className="muted" style={{ fontSize: '12px' }}>Username</label>
          <input className="input" name="username" value={formData.username} onChange={handleChange} placeholder="maya_travels" required />
        </>
      )}

      <label className="muted" style={{ fontSize: '12px' }}>Email</label>
      <input className="input" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="hello@traveloop.com" required />

      <label className="muted" style={{ fontSize: '12px' }}>Password</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          name="password"
          type={show ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        <button type="button" className="btn btn-ghost" onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
        </button>
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: '12px' }}>
        {loading ? 'Processing...' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
}
