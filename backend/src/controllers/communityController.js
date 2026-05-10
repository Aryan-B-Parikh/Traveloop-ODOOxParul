import { communityService } from '../services/communityService.js';
import { asyncHandler } from '../utils/helpers.js';

export const communityController = {
    createPost: asyncHandler(async (req, res) => {
        const post = await communityService.createPost(req.userId, req.body);

        res.status(201).json({
            status: 201,
            message: 'Post created successfully',
            data: post,
        });
    }),

    getCommunityPosts: asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await communityService.getCommunityPosts(limit, offset);

        res.status(200).json({
            status: 200,
            message: 'Community posts retrieved successfully',
            data: result,
        });
    }),

    getUserPosts: asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await communityService.getUserPosts(req.userId, limit, offset);

        res.status(200).json({
            status: 200,
            message: 'User posts retrieved successfully',
            data: result,
        });
    }),

    getPostById: asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const post = await communityService.getPostById(parseInt(postId));

        res.status(200).json({
            status: 200,
            message: 'Post retrieved successfully',
            data: post,
        });
    }),

    updatePost: asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const post = await communityService.updatePost(parseInt(postId), req.userId, req.body);

        res.status(200).json({
            status: 200,
            message: 'Post updated successfully',
            data: post,
        });
    }),

    deletePost: asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const result = await communityService.deletePost(parseInt(postId), req.userId);

        res.status(200).json({
            status: 200,
            message: result.message,
        });
    }),

    likePost: asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const post = await communityService.likePost(parseInt(postId));

        res.status(200).json({
            status: 200,
            message: 'Post liked successfully',
            data: post,
        });
    }),
};
