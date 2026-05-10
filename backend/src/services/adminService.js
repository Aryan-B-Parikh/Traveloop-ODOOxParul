import prisma from '../lib/prisma.js';

export const adminService = {
    async getDashboardStats() {
        const totalUsers = await prisma.user.count();
        const totalTrips = await prisma.trip.count();
        const totalExpenses = await prisma.expense.count();
        const totalPosts = await prisma.communityPost.count();

        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        const tripStats = await prisma.trip.groupBy({
            by: ['status'],
            _count: true,
        });

        const expensesByCategory = await prisma.expense.groupBy({
            by: ['category'],
            _sum: {
                totalAmount: true,
            },
            _count: true,
        });

        return {
            summary: {
                totalUsers,
                totalTrips,
                totalExpenses,
                totalPosts,
            },
            recentUsers,
            tripStats,
            expensesByCategory,
        };
    },

    async getAllUsers(limit = 20, offset = 0) {
        const users = await prisma.user.findMany({
            take: limit,
            skip: offset,
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.user.count();

        return { users, total, limit, offset };
    },

    async getUserById(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                city: true,
                country: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        const userStats = await prisma.trip.count({
            where: { userId },
        });

        return {
            ...user,
            totalTrips: userStats,
        };
    },

    async getTripAnalytics() {
        const totalTrips = await prisma.trip.count();

        const tripsByStatus = await prisma.trip.groupBy({
            by: ['status'],
            _count: true,
        });

        const avgTripDuration = await prisma.trip.findMany({
            select: {
                startDate: true,
                endDate: true,
            },
        });

        const durations = avgTripDuration.map((trip) => {
            const duration = Math.ceil((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24));
            return duration;
        });

        const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

        const topDestinations = await prisma.trip.groupBy({
            by: ['startDestination'],
            _count: true,
            orderBy: {
                _count: {
                    startDestination: 'desc',
                },
            },
            take: 10,
        });

        return {
            totalTrips,
            byStatus: tripsByStatus,
            avgDurationDays: avgDuration,
            topDestinations,
        };
    },

    async getExpenseAnalytics() {
        const totalExpenses = await prisma.expense.count();

        const expensesByCategory = await prisma.expense.groupBy({
            by: ['category'],
            _sum: {
                totalAmount: true,
            },
            _count: true,
        });

        const totalSpent = await prisma.expense.aggregate({
            _sum: {
                totalAmount: true,
            },
        });

        return {
            totalExpenses,
            totalSpent: totalSpent._sum.totalAmount || 0,
            byCategory: expensesByCategory,
        };
    },

    async getCommunityAnalytics() {
        const totalPosts = await prisma.communityPost.count();
        const totalLikes = await prisma.communityPost.aggregate({
            _sum: {
                likes: true,
            },
        });

        const topPosts = await prisma.communityPost.findMany({
            take: 10,
            orderBy: { likes: 'desc' },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        return {
            totalPosts,
            totalLikes: totalLikes._sum.likes || 0,
            topPosts,
        };
    },
};
