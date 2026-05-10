import React from 'react'

export default function BudgetCard({label, value, note}) {
  return (
    <div className="card" style={{padding: '16px'}}>
      <div className="muted" style={{fontSize: 13}}>{label}</div>
      <div style={{fontWeight: 700, fontSize: 20}}>{value}</div>
      {note && <div className="muted" style={{marginTop: 8}}>{note}</div>}
    </div>
  )
}
