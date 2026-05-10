import React from 'react'
import { FiTrash2 } from 'react-icons/fi'

export default function ChecklistItem({item, onToggle, onRemove}) {
  return (
    <div className="card" style={{padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <label style={{display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flex: 1}}>
        <input type="checkbox" checked={item.packed} onChange={onToggle} />
        <div>
          <div style={{fontWeight: 600}}>{item.name || item.label}</div>
          <div className="muted" style={{fontSize: 12}}>{item.category}</div>
        </div>
      </label>
      {onRemove && (
        <button 
          onClick={onRemove} 
          style={{background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px'}}
          title="Remove item"
        >
          <FiTrash2 size={16} />
        </button>
      )}
    </div>
  )
}
