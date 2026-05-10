import React from 'react'

export default function ActivityCard({activity}) {
  return (
    <div className="card" style={{padding: '14px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontWeight: 700}}>{activity.name}</div>
          <div className="muted" style={{fontSize: 13}}>{activity.city}</div>
        </div>
        <div className="tag">{activity.cost}</div>
      </div>
      <div className="muted" style={{marginTop: 10}}>{activity.description}</div>
      <div className="inline-list" style={{marginTop: 12}}>
        {['2 hrs', 'Small group', 'Instant confirm'].map((chip) => (
          <span className="chip" key={chip}>{chip}</span>
        ))}
      </div>
    </div>
  )
}
