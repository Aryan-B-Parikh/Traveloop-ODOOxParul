import { adminService } from '../services/adminService.js';
import { asyncHandler } from '../utils/helpers.js';

export const adminController = {
    getDashboard: asyncHandler(async (req, res) => {
        const stats = await adminService.getDashboardStats();

        res.status(200).json({
            status: 200,
            message: 'Dashboard stats retrieved successfully',
            data: stats,
        });
    }),

    getAllUsers: asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await adminService.getAllUsers(limit, offset);

        res.status(200).json({
            status: 200,
            message: 'Users retrieved successfully',
            data: result,
        });
    }),

    getUserById: asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const user = await adminService.getUserById(parseInt(userId));

        res.status(200).json({
            status: 200,
            message: 'User retrieved successfully',
            data: user,
        });
    }),

    getTripAnalytics: asyncHandler(async (req, res) => {
        const analytics = await adminService.getTripAnalytics();

        res.status(200).json({
            status: 200,
            message: 'Trip analytics retrieved successfully',
            data: analytics,
        });
    }),

    getExpenseAnalytics: asyncHandler(async (req, res) => {
        const analytics = await adminService.getExpenseAnalytics();

        res.status(200).json({
            status: 200,
            message: 'Expense analytics retrieved successfully',
            data: analytics,
        });
    }),

    getCommunityAnalytics: asyncHandler(async (req, res) => {
        const analytics = await adminService.getCommunityAnalytics();

        res.status(200).json({
            status: 200,
            message: 'Community analytics retrieved successfully',
            data: analytics,
        });
    }),
};
