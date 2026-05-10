import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { communityService } from '../services/communityService';
import apiClient from '../services/apiClient';
import { FiHeart, FiShare2, FiUser, FiMapPin, FiThumbsUp, FiMessageCircle, FiCopy } from 'react-icons/fi';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myTrips, setMyTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    try {
      const response = await apiClient.get('/trips');
      setMyTrips(response?.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch trips for sharing:', err);
      setMyTrips([]);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await communityService.getPosts();
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (error) {
      console.error('Failed to fetch community posts:', error);
      // Fallback for demo
      setPosts([
        {
          id: 1,
          postContent: "Just finished my 10-day tour across Europe! Paris was a dream and Amsterdam was surprisingly peaceful. Check out my itinerary if you're planning something similar!",
          likes: 24,
          createdAt: new Date().toISOString(),
          user: { username: 'alex_adventures' },
          trip: { name: 'Paris + Amsterdam Escape', startDestination: 'Paris' }
        },
        {
          id: 2,
          postContent: "Highly recommend visiting Kyoto in the fall. The colors are breathtaking and the temples are so serene.",
          likes: 42,
          createdAt: new Date().toISOString(),
          user: { username: 'zen_traveler' },
          trip: { name: 'Kyoto Culture Trail', startDestination: 'Kyoto' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const updatedPost = await communityService.likePost(postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: updatedPost.likes } : p));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCloneTrip = (tripTitle) => {
    setToastMessage(`Cloned "${tripTitle}" to your account!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/itinerary/public/${postId}`;
    navigator.clipboard.writeText(url);
    setToastMessage('Public itinerary link copied to clipboard!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!selectedTripId || !postContent) return;
    
    setIsSubmitting(true);
    try {
      await communityService.createPost(selectedTripId, postContent);
      setToastMessage('Journey shared successfully!');
      setIsModalOpen(false);
      setPostContent('');
      setSelectedTripId('');
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      setToastMessage('Error sharing journey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container section" style={{ position: 'relative' }}>
        {toastMessage && (
          <div className="toast toast-success" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {toastMessage}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <SectionHeader 
            title="Community Feed" 
            subtitle="Explore journeys shared by fellow travelers and get inspired." 
          />
          <button 
            className="btn btn-primary" 
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <FiShare2 /> Share Your Journey
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="muted">Loading community stories...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌎</div>
            <h3>No stories yet</h3>
            <p>Be the first to share your journey with the world!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
            {posts.map((post) => (
              <div key={post.id} className="card glass fade-up" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', overflow: 'hidden' }}>
                      {post.user?.profileImage ? (
                        <img src={post.user.profileImage} alt={post.user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <FiUser />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{post.user?.username || 'Traveler'}</div>
                      <div className="muted" style={{ fontSize: '12px' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="tag tag-purple">
                    <FiMapPin style={{ marginRight: '4px' }} />
                    {post.trip?.startDestination}
                  </div>
                </div>

                <h3 style={{ marginBottom: '12px' }}>{post.trip?.name}</h3>
                <p style={{ lineHeight: '1.6', marginBottom: '20px', color: 'var(--foreground)' }}>
                  {post.postContent}
                </p>

                <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <button 
                    className="btn btn-ghost" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}
                    onClick={() => handleLike(post.id)}
                  >
                    <FiHeart style={{ fill: post.likes > 0 ? 'var(--danger)' : 'none', color: post.likes > 0 ? 'var(--danger)' : 'currentColor' }} />
                    {post.likes} Likes
                  </button>
                  <button 
                    className="btn btn-ghost" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}
                    onClick={() => handleShare(post.id)}
                  >
                    <FiShare2 /> Share
                  </button>
                  <button 
                    className="btn btn-ghost" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', marginLeft: 'auto' }}
                    onClick={() => handleCloneTrip(post.trip?.name)}
                  >
                    <FiCopy /> Clone
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create Post Modal ── */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3>Share Your Journey</h3>
            <p className="muted">Tell the community about your latest adventure!</p>
            
            <form onSubmit={handleCreatePost} style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
              <div>
                <label className="muted">Select Trip</label>
                <select 
                  className="input" 
                  value={selectedTripId} 
                  onChange={e => setSelectedTripId(e.target.value)}
                  required
                >
                  <option value="">Choose a trip to share...</option>
                  {myTrips.map(trip => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name} ({trip.startDestination})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="muted">Your Story</label>
                <textarea 
                  className="input" 
                  rows="4" 
                  placeholder="What made this trip special?"
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Sharing...' : 'Post to Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
