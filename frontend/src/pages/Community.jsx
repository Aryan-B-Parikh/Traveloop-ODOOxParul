import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import SectionHeader from '../components/common/SectionHeader';
import { communityService } from '../services/communityService';
import { FiHeart, FiShare2, FiUser, FiMapPin, FiThumbsUp, FiMessageCircle, FiCopy } from 'react-icons/fi';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await communityService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch community posts:', error);
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

  return (
    <div>
      <Navbar />
      <div className="container section" style={{ position: 'relative' }}>
        {toastMessage && (
          <div className="toast toast-success" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {toastMessage}
          </div>
        )}

        <SectionHeader 
          title="Community Feed" 
          subtitle="Explore journeys shared by fellow travelers and get inspired." 
        />

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
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <FiUser />
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
                  <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
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
    </div>
  );
}
