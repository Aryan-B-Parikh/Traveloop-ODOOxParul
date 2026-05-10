import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { login, register } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Controlled fields
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const set = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Client-side validation ──────────────────────────────────────────────────
  function validate() {
    if (!fields.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return 'Enter a valid email address.';
    if (!fields.password) return 'Password is required.';
    if (fields.password.length < 8) return 'Password must be at least 8 characters.';
    if (mode === 'signup') {
      if (!fields.firstName.trim()) return 'First name is required.';
      if (!fields.lastName.trim()) return 'Last name is required.';
      if (fields.password !== fields.confirmPassword) return 'Passwords do not match.';
    }
    return null;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      let session;
      if (mode === 'login') {
        session = await login({ email: fields.email, password: fields.password });
      } else {
        session = await register({
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          password: fields.password,
        });
      }
      handleAuthSuccess(session);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }} noValidate>
      {/* Error banner */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 8,
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <FiAlertCircle size={16} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Name fields — signup only */}
      {mode === 'signup' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label className="muted" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>First Name</label>
            <input
              className="input"
              placeholder="First name"
              value={fields.firstName}
              onChange={set('firstName')}
              required
            />
          </div>
          <div>
            <label className="muted" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Last Name</label>
            <input
              className="input"
              placeholder="Last name"
              value={fields.lastName}
              onChange={set('lastName')}
              required
            />
          </div>
        </div>
      )}

      {/* Email */}
      <div>
        <label className="muted" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Email</label>
        <input
          className="input"
          type="email"
          placeholder="hello@traveloop.com"
          value={fields.email}
          onChange={set('email')}
          autoComplete="email"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="muted" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Password</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            type={show ? 'text' : 'password'}
            placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Your password'}
            value={fields.password}
            onChange={set('password')}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShow(!show)}
            style={{ flexShrink: 0 }}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Confirm password — signup only */}
      {mode === 'signup' && (
        <div>
          <label className="muted" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Confirm Password</label>
          <input
            className="input"
            type={show ? 'text' : 'password'}
            placeholder="Repeat password"
            value={fields.confirmPassword}
            onChange={set('confirmPassword')}
            autoComplete="new-password"
            required
          />
        </div>
      )}

      {/* Demo hint for login */}
      {mode === 'login' && (
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
          Demo: <strong>maya@example.com</strong> / <strong>password123</strong>
        </p>
      )}

      {/* Submit */}
      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading}
        style={{ marginTop: 4, position: 'relative' }}
      >
        {loading ? (mode === 'signup' ? 'Creating account…' : 'Signing in…') : (mode === 'signup' ? 'Create Account' : 'Sign In')}
      </button>
    </form>
  );
}
