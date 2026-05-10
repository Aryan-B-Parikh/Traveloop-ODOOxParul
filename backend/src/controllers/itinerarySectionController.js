import { itinerarySectionService } from '../services/itinerarySectionService.js';
import { asyncHandler } from '../utils/helpers.js';

export const itinerarySectionController = {
    createSection: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const section = await itinerarySectionService.createSection(parseInt(tripId), req.userId, req.body);

        res.status(201).json({
            status: 201,
            message: 'Itinerary section created successfully',
            data: section,
        });
    }),

    getSections: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const sections = await itinerarySectionService.getSections(parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Itinerary sections retrieved successfully',
            data: sections,
        });
    }),

    getSectionById: asyncHandler(async (req, res) => {
        const { tripId, sectionId } = req.params;
        const section = await itinerarySectionService.getSectionById(parseInt(sectionId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Itinerary section retrieved successfully',
            data: section,
        });
    }),

    updateSection: asyncHandler(async (req, res) => {
        const { tripId, sectionId } = req.params;
        const section = await itinerarySectionService.updateSection(parseInt(sectionId), parseInt(tripId), req.userId, req.body);

        res.status(200).json({
            status: 200,
            message: 'Itinerary section updated successfully',
            data: section,
        });
    }),

    deleteSection: asyncHandler(async (req, res) => {
        const { tripId, sectionId } = req.params;
        const result = await itinerarySectionService.deleteSection(parseInt(sectionId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: result.message,
        });
    }),
};
