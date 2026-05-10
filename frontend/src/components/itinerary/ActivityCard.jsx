import React from 'react'
import { FiPlus } from 'react-icons/fi'

export default function ActivityCard({activity, onAdd}) {
  const tags = activity.tags || ['Popular'];
  
  return (
    <div className="card" style={{padding: '14px', display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div style={{fontWeight: 700}}>{activity.name}</div>
          <div className="muted" style={{fontSize: 13, marginTop: '2px'}}>{activity.city}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="tag tag-purple">{activity.cost}</div>
          {onAdd && (
            <button 
              className="btn btn-primary" 
              style={{ padding: '6px 10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '8px' }}
              onClick={() => onAdd(activity)}
              title="Add to Itinerary"
            >
              <FiPlus size={14} /> Add
            </button>
          )}
        </div>
      </div>
      <div className="muted" style={{marginTop: 10, fontSize: 14}}>{activity.description}</div>
      <div className="inline-list" style={{marginTop: 12}}>
        {tags.map((chip) => (
          <span className="chip" key={chip}>{chip}</span>
        ))}
      </div>
    </div>
  )
}
