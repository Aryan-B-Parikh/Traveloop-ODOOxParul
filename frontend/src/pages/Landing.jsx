import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DestinationCard from '../components/destinations/DestinationCard';
import SectionHeader from '../components/common/SectionHeader';
import { sampleDestinations } from '../data/sampleDestinations';
import { FiCompass, FiDollarSign, FiUsers, FiCheckSquare } from 'react-icons/fi';

const features = [
  {
    icon: <FiCompass size={24} />,
    title: 'Smart Itineraries',
    text: 'Build day-by-day plans with drag-and-drop ease. Automatically organize flights, hotels, and activities.',
  },
  {
    icon: <FiDollarSign size={24} />,
    title: 'Budget Mastery',
    text: 'Track every expense in real-time. Get insights on spending and share cost breakdowns with your group.',
  },
  {
    icon: <FiUsers size={24} />,
    title: 'Group Collaboration',
    text: 'Invite friends, vote on activities, and sync notes. Keep everyone on the same page, effortlessly.',
  },
  {
    icon: <FiCheckSquare size={24} />,
    title: 'Packing Lists',
    text: 'Generate smart packing lists based on your destination and activities. Never forget a thing.',
  },
];

export default function Landing() {
  return (
    <div>
      <Navbar />
      <main className="container">
        {/* Hero Section */}
        <section className="section" style={{ paddingTop: '60px', paddingBottom: '60px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="pill">An Entire Trip, In One Place</div>
            <h1 style={{ fontSize: '52px', marginTop: '14px', letterSpacing: '-1.5px' }}>
              Your Journey, Organized.
            </h1>
            <p className="muted" style={{ maxWidth: '580px', margin: '16px auto', fontSize: '18px' }}>
              Traveloop is the ultimate workspace for planning multi-city trips. Build itineraries, manage budgets, and collaborate with your crew—all in one place.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link to="/create" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
                Start Planning for Free
              </Link>
              <Link to="/explore" className="btn btn-ghost" style={{ padding: '14px 28px', fontSize: '16px' }}>
                Explore Destinations
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="section">
          <SectionHeader
            title="Everything You Need to Plan"
            subtitle="From initial ideas to the final checklist, we've got you covered."
          />
          <div className="grid-4" style={{ gap: '24px' }}>
            {features.map((item) => (
              <motion.div
                key={item.title}
                className="card subtle-glass"
                style={{ padding: '24px' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                <div className="pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {item.icon}
                </div>
                <h3 style={{ marginTop: '16px' }}>{item.title}</h3>
                <p className="muted" style={{ fontSize: '14px' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Destinations Section */}
        <section className="section">
          <SectionHeader title="Popular Destinations" subtitle="Get inspired by these curated journeys." />
          <div className="grid-4">
            {sampleDestinations.map((item) => (
              <motion.div key={item.id} whileHover={{ y: -6 }}>
                <DestinationCard item={item} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="card" style={{ padding: '40px', textAlign: 'center', background: 'linear-gradient(120deg, var(--primary), var(--purple))', color: 'white' }}>
            <h2 style={{ fontSize: '32px' }}>Ready to Plan Your Next Adventure?</h2>
            <p style={{ maxWidth: '500px', margin: '12px auto 24px auto', opacity: 0.9 }}>
              Sign up today and see how effortless travel planning can be. Your dream trip is just a few clicks away.
            </p>
            <Link to="/auth" className="btn btn-ghost" style={{ background: 'white', color: 'var(--primary)', padding: '14px 28px', fontSize: '16px' }}>
              Create Your Free Account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
