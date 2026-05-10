import React, { useState } from 'react'
import Navbar from '../components/common/Navbar'
import SectionHeader from '../components/common/SectionHeader'
import DestinationCard from '../components/destinations/DestinationCard'
import ActivityCard from '../components/itinerary/ActivityCard'
import { sampleDestinations } from '../data/sampleDestinations'
import { sampleActivities } from '../data/sampleActivities'

export default function DestinationExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const handleAddActivity = (activity) => {
    setToastMessage(`Added "${activity.name}" to your itinerary!`)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const filteredDestinations = sampleDestinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredActivities = sampleActivities.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? a.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  const categories = ['Beach', 'Culture', 'Nightlife', 'Adventure']

  return (
    <>
      <Navbar />
      <div className="container section" style={{ position: 'relative' }}>
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--primary)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            transition: 'opacity 0.3s'
          }}>
            {toastMessage}
          </div>
        )}
        <SectionHeader title="Destination Explorer" subtitle="Search cities, save activities, and curate your list." />
        <div className="card glass" style={{padding: '16px', marginBottom: 18}}>
          <div className="split">
            <input 
              className="input" 
              placeholder="Search cities or activities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Keeping the second input as a visual element, but filtering is mostly driven by the chips below */}
          </div>
          <div className="inline-list" style={{marginTop: 12}}>
            <span 
              className={`chip ${selectedCategory === '' ? 'active' : ''}`} 
              onClick={() => setSelectedCategory('')}
              style={{ cursor: 'pointer', background: selectedCategory === '' ? 'var(--primary)' : undefined, color: selectedCategory === '' ? 'white' : undefined }}
            >
              All
            </span>
            {categories.map((tag) => (
              <span 
                className={`chip ${selectedCategory === tag ? 'active' : ''}`} 
                key={tag}
                onClick={() => setSelectedCategory(tag)}
                style={{ cursor: 'pointer', background: selectedCategory === tag ? 'var(--primary)' : undefined, color: selectedCategory === tag ? 'white' : undefined }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid-4">
          {filteredDestinations.map((item) => (
            <DestinationCard key={item.id} item={item} />
          ))}
          {filteredDestinations.length === 0 && (
             <div className="muted" style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center' }}>No destinations found.</div>
          )}
        </div>

        <section className="section">
          <SectionHeader title="Popular activities" subtitle="Save experiences to your itinerary." />
          <div style={{display: 'grid', gap: 12}}>
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} onAdd={handleAddActivity} />
            ))}
            {filteredActivities.length === 0 && (
              <div className="muted" style={{ padding: '20px', textAlign: 'center' }}>No activities found.</div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
