import { packingItemService } from '../services/packingItemService.js';
import { asyncHandler } from '../utils/helpers.js';

export const packingItemController = {
    createItem: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const item = await packingItemService.createItem(parseInt(tripId), req.userId, req.body);

        res.status(201).json({
            status: 201,
            message: 'Packing item created successfully',
            data: item,
        });
    }),

    getItems: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const items = await packingItemService.getItems(parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Packing items retrieved successfully',
            data: items,
        });
    }),

    getItemById: asyncHandler(async (req, res) => {
        const { tripId, itemId } = req.params;
        const item = await packingItemService.getItemById(parseInt(itemId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Packing item retrieved successfully',
            data: item,
        });
    }),

    updateItem: asyncHandler(async (req, res) => {
        const { tripId, itemId } = req.params;
        const item = await packingItemService.updateItem(parseInt(itemId), parseInt(tripId), req.userId, req.body);

        res.status(200).json({
            status: 200,
            message: 'Packing item updated successfully',
            data: item,
        });
    }),

    deleteItem: asyncHandler(async (req, res) => {
        const { tripId, itemId } = req.params;
        const result = await packingItemService.deleteItem(parseInt(itemId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: result.message,
        });
    }),
};
