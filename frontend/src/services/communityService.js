import apiClient from './apiClient';

export const communityService = {
  async getPosts() {
    const response = await apiClient.get('/community');
    return response.data.data;
  },

  async createPost(tripId, postContent) {
    const response = await apiClient.post('/community', { tripId: parseInt(tripId), postContent });
    return response.data.data;
  },

  async likePost(postId) {
    const response = await apiClient.post(`/community/${postId}/like`);
    return response.data.data;
  },

  async deletePost(postId) {
    const response = await apiClient.delete(`/community/${postId}`);
    return response.data.data;
  }
};
