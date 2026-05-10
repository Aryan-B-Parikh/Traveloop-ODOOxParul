import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import ChecklistItem from '../components/checklist/ChecklistItem';
import { checklistItems } from '../data/sampleChecklist';
import { FiPlus } from 'react-icons/fi';

export default function PackingChecklist() {
  const { tripId } = useParams();
  const [items, setItems] = useState(checklistItems);
  const [newItem, setNewItem] = useState('');

  const toggleItem = (id) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const newItemObj = {
      id: `item-${Date.now()}`,
      label: newItem,
      category: 'Miscellaneous',
      packed: false,
    };
    setItems([newItemObj, ...items]);
    setNewItem('');
  };

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    const packedCount = items.filter((item) => item.packed).length;
    return Math.round((packedCount / items.length) * 100);
  }, [items]);

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      const { category } = item;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    <div>
      <Navbar />
      <div className="container section">
        <main style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader
            title="Packing Checklist: Summer in Europe"
            subtitle="Ensure you have everything you need for your trip. Items are saved per trip."
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
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="card" style={{ padding: '20px' }}>
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '10px' }}>
                  {category}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {categoryItems.map((item) => (
                    <ChecklistItem 
                      key={item.id} 
                      item={item} 
                      onToggle={() => toggleItem(item.id)} 
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
