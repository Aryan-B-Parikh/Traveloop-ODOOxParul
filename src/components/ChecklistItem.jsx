import React from 'react'

export default function ChecklistItem({item, onToggle}) {
  return (
    <label className="card" style={{padding: '12px', display: 'flex', alignItems: 'center', gap: 12}}>
      <input type="checkbox" checked={item.packed} onChange={onToggle} />
      <div>
        <div style={{fontWeight: 600}}>{item.name}</div>
        <div className="muted" style={{fontSize: 12}}>{item.category}</div>
      </div>
    </label>
  )
}
