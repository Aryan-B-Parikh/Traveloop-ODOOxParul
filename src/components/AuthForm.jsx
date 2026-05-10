import React, { useState } from 'react'

export default function AuthForm({mode = 'login'}) {
  const [show, setShow] = useState(false)
  return (
    <form className="card" style={{padding: '20px', display: 'grid', gap: 12}}>
      <label className="muted">Email</label>
      <input className="input" type="email" placeholder="hello@traveloop.com" required />

      <label className="muted">Password</label>
      <div style={{display: 'flex', gap: 8}}>
        <input className="input" type={show ? 'text' : 'password'} placeholder="Create a secure password" required />
        <button type="button" className="btn btn-ghost" onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
        </button>
      </div>

      {mode === 'signup' && (
        <>
          <label className="muted">Confirm password</label>
          <input className="input" type={show ? 'text' : 'password'} placeholder="Confirm password" required />
        </>
      )}

      <label style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <input type="checkbox" />
        <span className="muted">Remember me</span>
      </label>

      <button className="btn btn-primary" type="submit">
        {mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>
    </form>
  )
}
