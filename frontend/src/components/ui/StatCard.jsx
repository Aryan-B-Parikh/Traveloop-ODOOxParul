import React from 'react'

export default function StatCard({label, value, hint}) {
  return (
    <div className="card" style={{padding: '18px'}}>
      <div className="muted" style={{fontSize: 13}}>{label}</div>
      <div style={{fontSize: 22, fontWeight: 700}}>{value}</div>
      {hint && <div className="muted" style={{marginTop: 6}}>{hint}</div>}
    </div>
  )
}
