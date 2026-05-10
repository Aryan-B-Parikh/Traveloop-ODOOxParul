import prisma from '../lib/prisma.js';

export const communityService = {
    async createPost(userId, postData) {
        const trip = await prisma.trip.findFirst({
            where: { id: postData.tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const post = await prisma.communityPost.create({
            data: {
                userId,
                tripId: postData.tripId,
                postContent: postData.postContent,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                trip: {
                    select: {
                        id: true,
                        startDestination: true,
                        returnPlace: true,
                    },
                },
            },
        });

        return post;
    },

    async getCommunityPosts(limit = 20, offset = 0) {
        const posts = await prisma.communityPost.findMany({
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                trip: {
                    select: {
                        id: true,
                        startDestination: true,
                        returnPlace: true,
                        startDate: true,
                        endDate: true,
                    },
                },
            },
        });

        const total = await prisma.communityPost.count();

        return {
            posts,
            total,
            limit,
            offset,
        };
    },

    async getUserPosts(userId, limit = 20, offset = 0) {
        const posts = await prisma.communityPost.findMany({
            where: { userId },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
            include: {
                trip: {
                    select: {
                        id: true,
                        startDestination: true,
                        returnPlace: true,
                    },
                },
            },
        });

        const total = await prisma.communityPost.count({
            where: { userId },
        });

        return {
            posts,
            total,
            limit,
            offset,
        };
    },

    async getPostById(postId) {
        const post = await prisma.communityPost.findUnique({
            where: { id: postId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                trip: {
                    select: {
                        id: true,
                        startDestination: true,
                        returnPlace: true,
                        startDate: true,
                        endDate: true,
                        description: true,
                    },
                },
            },
        });

        if (!post) {
            throw { status: 404, message: 'Post not found' };
        }

        return post;
    },

    async updatePost(postId, userId, updateData) {
        const post = await prisma.communityPost.findFirst({
            where: { id: postId, userId },
        });

        if (!post) {
            throw { status: 404, message: 'Post not found or unauthorized' };
        }

        const updatedPost = await prisma.communityPost.update({
            where: { id: postId },
            data: {
                ...(updateData.postContent && { postContent: updateData.postContent }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                trip: {
                    select: {
                        id: true,
                        startDestination: true,
                        returnPlace: true,
                    },
                },
            },
        });

        return updatedPost;
    },

    async deletePost(postId, userId) {
        const post = await prisma.communityPost.findFirst({
            where: { id: postId, userId },
        });

        if (!post) {
            throw { status: 404, message: 'Post not found or unauthorized' };
        }

        await prisma.communityPost.delete({
            where: { id: postId },
        });

        return { message: 'Post deleted successfully' };
    },

    async likePost(postId) {
        const post = await prisma.communityPost.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw { status: 404, message: 'Post not found' };
        }

        const updatedPost = await prisma.communityPost.update({
            where: { id: postId },
            data: {
                likes: post.likes + 1,
            },
        });

        return updatedPost;
    },
};
