import React from 'react'

export default function DestinationCard({item}) {
  return (
    <div className="card" style={{overflow: 'hidden'}}>
      <img alt={item.name} src={item.image} style={{height: 160, width: '100%', objectFit: 'cover'}} />
      <div style={{padding: '14px'}}>
        <div style={{fontWeight: 700}}>{item.name}</div>
        <div className="muted" style={{fontSize: 13}}>{item.country}</div>
        <div style={{marginTop: 8}} className="muted">{item.summary}</div>
        <div className="inline-list" style={{marginTop: 12}}>
          {['Best time: Spring', 'Popular'].map((chip) => (
            <span className="chip" key={chip}>{chip}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
