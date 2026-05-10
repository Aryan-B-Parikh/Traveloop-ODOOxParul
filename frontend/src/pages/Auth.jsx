import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthForm from '../components/auth/AuthForm';

export default function Auth() {
  const [mode, setMode] = useState('login');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main
        className="container section"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '2rem',
          paddingBottom: '2rem',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div className="card glass" style={{ padding: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="pill">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</div>
              <h2 style={{ marginTop: 16, fontSize: '28px' }}>
                {mode === 'login' ? 'Sign in to Traveloop' : 'Join Traveloop Today'}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <button
                className={`btn btn-block ${mode === 'login' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                className={`btn btn-block ${mode === 'signup' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </div>

            <AuthForm mode={mode} />

            <div style={{ textAlign: 'center', color: 'var(--muted)', margin: '16px 0', fontSize: '14px' }}>
              or continue with
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              <button className="btn btn-ghost btn-block">Continue with Google</button>
              <button className="btn btn-ghost btn-block">Continue with Apple</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
