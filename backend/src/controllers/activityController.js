import { activityService } from '../services/activityService.js';
import { asyncHandler } from '../utils/helpers.js';

export const activityController = {
    createActivity: asyncHandler(async (req, res) => {
        const { tripId, sectionId } = req.params;
        const activity = await activityService.createActivity(parseInt(sectionId), parseInt(tripId), req.userId, req.body);

        res.status(201).json({
            status: 201,
            message: 'Activity created successfully',
            data: activity,
        });
    }),

    getActivities: asyncHandler(async (req, res) => {
        const { tripId, sectionId } = req.params;
        const activities = await activityService.getActivities(parseInt(sectionId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Activities retrieved successfully',
            data: activities,
        });
    }),

    getActivityById: asyncHandler(async (req, res) => {
        const { tripId, sectionId, activityId } = req.params;
        const activity = await activityService.getActivityById(
            parseInt(activityId),
            parseInt(sectionId),
            parseInt(tripId),
            req.userId,
        );

        res.status(200).json({
            status: 200,
            message: 'Activity retrieved successfully',
            data: activity,
        });
    }),

    updateActivity: asyncHandler(async (req, res) => {
        const { tripId, sectionId, activityId } = req.params;
        const activity = await activityService.updateActivity(
            parseInt(activityId),
            parseInt(sectionId),
            parseInt(tripId),
            req.userId,
            req.body,
        );

        res.status(200).json({
            status: 200,
            message: 'Activity updated successfully',
            data: activity,
        });
    }),

    deleteActivity: asyncHandler(async (req, res) => {
        const { tripId, sectionId, activityId } = req.params;
        const result = await activityService.deleteActivity(
            parseInt(activityId),
            parseInt(sectionId),
            parseInt(tripId),
            req.userId,
        );

        res.status(200).json({
            status: 200,
            message: result.message,
        });
    }),
};
