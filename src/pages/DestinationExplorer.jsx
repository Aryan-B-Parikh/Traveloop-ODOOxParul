import React from 'react'
import Navbar from '../components/Navbar'
import SectionHeader from '../components/SectionHeader'
import DestinationCard from '../components/DestinationCard'
import ActivityCard from '../components/ActivityCard'
import { sampleDestinations } from '../data/sampleDestinations'
import { sampleActivities } from '../data/sampleActivities'

export default function DestinationExplorer() {
  return (
    <>
      <Navbar />
      <div className="container section">
        <SectionHeader title="Destination Explorer" subtitle="Search cities, save activities, and curate your list." />
        <div className="card glass" style={{padding: '16px', marginBottom: 18}}>
          <div className="split">
            <input className="input" placeholder="Search cities" />
            <input className="input" placeholder="Filter by category" />
          </div>
          <div className="inline-list" style={{marginTop: 12}}>
            {['Beach', 'Culture', 'Nightlife', 'Adventure'].map((tag) => (
              <span className="chip" key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="grid-4">
          {sampleDestinations.map((item) => (
            <DestinationCard key={item.id} item={item} />
          ))}
        </div>

        <section className="section">
          <SectionHeader title="Popular activities" subtitle="Save experiences to your itinerary." />
          <div style={{display: 'grid', gap: 12}}>
            {sampleActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
