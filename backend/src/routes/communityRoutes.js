import express from 'express';
import { communityController } from '../controllers/communityController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { communityPostValidation } from '../validators/index.js';

const router = express.Router();

router.post('/', authenticate, communityPostValidation, communityController.createPost);
router.get('/', optionalAuth, communityController.getCommunityPosts);
router.get('/user/my-posts', authenticate, communityController.getUserPosts);
router.get('/:postId', optionalAuth, communityController.getPostById);
router.put('/:postId', authenticate, communityPostValidation, communityController.updatePost);
router.delete('/:postId', authenticate, communityController.deletePost);
router.post('/:postId/like', authenticate, communityController.likePost);

export default router;
