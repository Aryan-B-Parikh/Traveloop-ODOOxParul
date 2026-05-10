import React from 'react'

export default function Footer() {
  return (
    <footer className="section">
      <div className="container" style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
        <div>
          <div className="logo">Traveloop</div>
          <div className="muted">Plan smarter trips with your crew.</div>
        </div>
        <div className="muted">Privacy · Terms · Support</div>
      </div>
    </footer>
  )
}
