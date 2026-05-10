import prisma from '../lib/prisma.js';

export const packingItemService = {
    async createItem(tripId, userId, itemData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const item = await prisma.packingItem.create({
            data: {
                tripId,
                userId,
                category: itemData.category,
                itemName: itemData.itemName,
                isChecked: false,
            },
        });

        return item;
    },

    async getItems(tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const items = await prisma.packingItem.findMany({
            where: { tripId },
            orderBy: { category: 'asc' },
        });

        return items;
    },

    async getItemById(itemId, tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const item = await prisma.packingItem.findFirst({
            where: { id: itemId, tripId },
        });

        if (!item) {
            throw { status: 404, message: 'Packing item not found' };
        }

        return item;
    },

    async updateItem(itemId, tripId, userId, updateData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const item = await prisma.packingItem.findFirst({
            where: { id: itemId, tripId },
        });

        if (!item) {
            throw { status: 404, message: 'Packing item not found' };
        }

        const updatedItem = await prisma.packingItem.update({
            where: { id: itemId },
            data: {
                ...(updateData.category && { category: updateData.category }),
                ...(updateData.itemName && { itemName: updateData.itemName }),
                ...(updateData.isChecked !== undefined && { isChecked: updateData.isChecked }),
            },
        });

        return updatedItem;
    },

    async deleteItem(itemId, tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const item = await prisma.packingItem.findFirst({
            where: { id: itemId, tripId },
        });

        if (!item) {
            throw { status: 404, message: 'Packing item not found' };
        }

        await prisma.packingItem.delete({
            where: { id: itemId },
        });

        return { message: 'Packing item deleted successfully' };
    },
};
