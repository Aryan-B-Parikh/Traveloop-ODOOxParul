import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const statusToBadge = {
  Upcoming: 'badge-blue',
  'In Progress': 'badge-yellow',
  Completed: 'badge-green',
  Draft: 'badge-yellow',
  Planned: 'badge-blue',
};

const defaultImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600';

export default function TripCard({ trip, onEdit, onDelete }) {
  const handleCardClick = () => {
    if (onEdit) onEdit(trip.id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // prevent card click-through
    if (onDelete) onDelete(trip.id);
  };

  return (
    <div className="trip-card-wrapper" onClick={handleCardClick}>
      {/* Edit overlay on hover */}
      <div className="trip-card-overlay">
        <span>✏️ Edit Trip</span>
      </div>

      {/* Delete button on hover */}
      {onDelete && (
        <button
          className="trip-card-delete"
          onClick={handleDeleteClick}
          title="Delete trip"
        >
          <FiTrash2 size={14} />
        </button>
      )}

      <div className="card">
        <img
          src={trip.image || defaultImage}
          alt={trip.name}
          style={{ height: '160px', objectFit: 'cover', width: '100%' }}
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700 }}>{trip.startDestination || trip.name}</div>
            <div className={`badge ${statusToBadge[trip.status] || 'badge-blue'}`}>
              {trip.status}
            </div>
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: '4px' }}>
            {trip.returnPlace || trip.destination} &bull; {trip.dates}
          </div>
          <div style={{ marginTop: 8, fontSize: 14 }} className="muted">
            {trip.description || trip.desc}
          </div>

          {/* Action Links */}
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
             <a href={`/itinerary/${trip.id}`} onClick={(e) => { e.stopPropagation(); }} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px' }}>🗺️ Itinerary</a>
             <a href={`/budget/${trip.id}`} onClick={(e) => { e.stopPropagation(); }} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px' }}>💰 Budget</a>
             <a href={`/notes/${trip.id}`} onClick={(e) => { e.stopPropagation(); }} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px' }}>📝 Notes</a>
             <a href={`/packing/${trip.id}`} onClick={(e) => { e.stopPropagation(); }} className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '11px' }}>🎒 Packing</a>
          </div>

          {trip.participants && trip.participants.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0px', marginTop: '16px' }}>
              {trip.participants.map((p, i) => (
                <div
                  key={i}
                  className="avatar"
                  style={{
                    width: '32px',
                    height: '32px',
                    marginLeft: i > 0 ? '-8px' : '0',
                    zIndex: trip.participants.length - i,
                  }}
                >
                  <img src={p.avatar} alt={p.name} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
