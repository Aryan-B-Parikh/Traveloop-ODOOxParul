import React from 'react';

const statusToBadge = {
  'Upcoming': 'badge-blue',
  'In Progress': 'badge-yellow',
  'Completed': 'badge-green',
};

export default function TripCard({ trip }) {
  return (
    <div className="card">
      <img
        src={trip.image}
        alt={trip.name}
        style={{ height: '160px', objectFit: 'cover', width: '100%' }}
      />
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700 }}>{trip.name}</div>
          <div className={`badge ${statusToBadge[trip.status] || 'badge-blue'}`}>{trip.status}</div>
        </div>
        <div className="muted" style={{ fontSize: 13, marginTop: '4px' }}>
          {trip.destination} &bull; {trip.dates}
        </div>
        <div style={{ marginTop: 8, fontSize: 14 }} className="muted">
          {trip.desc}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '-10px', marginTop: '16px' }}>
          {trip.participants.map((p, i) => (
            <div key={i} className="avatar" style={{ width: '32px', height: '32px' }}>
              <img src={p.avatar} alt={p.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
