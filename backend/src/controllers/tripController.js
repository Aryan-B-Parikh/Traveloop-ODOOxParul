import { tripService } from '../services/tripService.js';
import { asyncHandler } from '../utils/helpers.js';

export const tripController = {
    createTrip: asyncHandler(async (req, res) => {
        const trip = await tripService.createTrip(req.userId, req.body);

        res.status(201).json({
            status: 201,
            message: 'Trip created successfully',
            data: trip,
        });
    }),

    getTrips: asyncHandler(async (req, res) => {
        const trips = await tripService.getTrips(req.userId);

        res.status(200).json({
            status: 200,
            message: 'Trips retrieved successfully',
            data: trips,
        });
    }),

    getTripById: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const trip = await tripService.getTripById(parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Trip retrieved successfully',
            data: trip,
        });
    }),

    updateTrip: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const trip = await tripService.updateTrip(parseInt(tripId), req.userId, req.body);

        res.status(200).json({
            status: 200,
            message: 'Trip updated successfully',
            data: trip,
        });
    }),

    deleteTrip: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const result = await tripService.deleteTrip(parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: result.message,
        });
    }),
};
