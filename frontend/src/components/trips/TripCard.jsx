import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const statusToBadge = {
  Upcoming: 'badge-blue',
  'In Progress': 'badge-yellow',
  Completed: 'badge-green',
  Draft: 'badge-yellow',
  Planned: 'badge-blue',
};

const defaultImage = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600';

export default function TripCard({ trip, onEdit, onDelete }) {
  const navigate = useNavigate();
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
          style={{ height: '140px', objectFit: 'cover', width: '100%' }}
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700 }}>{trip.name}</div>
            <div className={`badge ${statusToBadge[trip.status] || 'badge-blue'}`}>
              {trip.status}
            </div>
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: '4px' }}>
            {trip.startDestination} &bull; {new Date(trip.startDate).toLocaleDateString()}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '16px' }}>
            <button 
              className="btn btn-ghost" 
              style={{ padding: '6px', fontSize: '11px' }}
              onClick={(e) => { e.stopPropagation(); navigate(`/itinerary/${trip.id}`); }}
            >
              Itinerary
            </button>
            <button 
              className="btn btn-ghost" 
              style={{ padding: '6px', fontSize: '11px' }}
              onClick={(e) => { e.stopPropagation(); navigate(`/packing/${trip.id}`); }}
            >
              Packing
            </button>
            <button 
              className="btn btn-ghost" 
              style={{ padding: '6px', fontSize: '11px' }}
              onClick={(e) => { e.stopPropagation(); navigate(`/budget`); }}
            >
              Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
