import { authService } from '../services/authService.js';
import { asyncHandler } from '../utils/helpers.js';

export const authController = {
    signup: asyncHandler(async (req, res) => {
        const { email, username, password, firstName, lastName } = req.body;
        const { user, token } = await authService.signup(email, username, password, firstName, lastName);

        res.status(201).json({
            status: 201,
            message: 'User registered successfully',
            data: { user, token },
        });
    }),

    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);

        res.status(200).json({
            status: 200,
            message: 'Login successful',
            data: { user, token },
        });
    }),

    getProfile: asyncHandler(async (req, res) => {
        const user = await authService.getUserProfile(req.userId);

        res.status(200).json({
            status: 200,
            message: 'Profile retrieved successfully',
            data: user,
        });
    }),

    updateProfile: asyncHandler(async (req, res) => {
        const user = await authService.updateProfile(req.userId, req.body);

        res.status(200).json({
            status: 200,
            message: 'Profile updated successfully',
            data: user,
        });
    }),
};
