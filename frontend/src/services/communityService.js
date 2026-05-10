import { apiRequest } from './api';

export const communityService = {
  async getPosts() {
    const response = await apiRequest('/community');
    return response.data;
  },

  async createPost(tripId, postContent) {
    const response = await apiRequest('/community', {
      method: 'POST',
      body: JSON.stringify({ tripId: parseInt(tripId), postContent }),
    });
    return response.data;
  },

  async likePost(postId) {
    const response = await apiRequest(`/community/${postId}/like`, {
      method: 'POST',
    });
    return response.data;
  },

  async deletePost(postId) {
    const response = await apiRequest(`/community/${postId}`, {
      method: 'DELETE',
    });
    return response.data;
  }
};
