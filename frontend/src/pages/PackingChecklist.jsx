import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import ChecklistItem from '../components/checklist/ChecklistItem';
import { packingService } from '../services/packingService';
import { tripService } from '../services/tripService';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';

export default function PackingChecklist() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(!!tripId);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Miscellaneous');

  useEffect(() => {
    if (tripId) {
      fetchData();
    }
  }, [tripId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripData, itemsData] = await Promise.all([
        tripService.getTripById(tripId),
        packingService.getItems(tripId)
      ]);
      setTrip(tripData);
      setItems(itemsData);
    } catch (error) {
      console.error('Failed to fetch packing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (id, currentStatus) => {
    try {
      const updated = await packingService.updateItem(tripId, id, { isChecked: !currentStatus });
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isChecked: updated.isChecked } : item)));
    } catch (error) {
      console.error('Failed to toggle item:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await packingService.deleteItem(tripId, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    try {
      const newItemObj = await packingService.addItem(tripId, {
        itemName: newItem.trim(),
        category: category,
        isChecked: false,
      });
      setItems([newItemObj, ...items]);
      setNewItem('');
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    const packedCount = items.filter((item) => item.isChecked).length;
    return Math.round((packedCount / items.length) * 100);
  }, [items]);

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      const cat = item.category || 'Miscellaneous';
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main style={{ maxWidth: '800px', margin: '0 auto' }}>
          {!tripId ? (
            <div className="empty-state fade-up">
              <div className="empty-state-icon"><FiAlertCircle /></div>
              <h3>No trip selected</h3>
              <p>Please select a trip from your dashboard to view its packing checklist.</p>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="muted">Loading checklist...</div>
            </div>
          ) : (
            <>
              <SectionHeader
                title={`Packing Checklist: ${trip?.name || 'Untitled Trip'}`}
                subtitle="Ensure you have everything you need for your trip. Items are saved to your account."
              />

              <div className="card glass" style={{ padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0 }}>Packing Progress</h3>
                  <span className="tag tag-purple">{progress}% Complete</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: 'var(--primary)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              <form onSubmit={addItem} className="card" style={{ padding: '18px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select 
                    className="input" 
                    style={{ width: '150px' }} 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Miscellaneous">Misc</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Toiletries">Toiletries</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                  </select>
                  <input
                    className="input"
                    placeholder="Add a new item (e.g., Sunscreen)"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <FiPlus /> Add
                  </button>
                </div>
              </form>

              <div style={{ display: 'grid', gap: '24px' }}>
                {Object.keys(groupedItems).length === 0 && (
                  <div className="muted" style={{ textAlign: 'center', padding: '40px 0' }}>
                    Your packing list is empty. Add some items above!
                  </div>
                )}
                {Object.entries(groupedItems).map(([cat, categoryItems]) => (
                  <div key={cat} className="card" style={{ padding: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '10px' }}>
                      {cat}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {categoryItems.map((item) => (
                        <ChecklistItem 
                          key={item.id} 
                          item={{ ...item, label: item.itemName, packed: item.isChecked }} 
                          onToggle={() => toggleItem(item.id, item.isChecked)} 
                          onRemove={() => removeItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
