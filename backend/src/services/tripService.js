import prisma from '../lib/prisma.js';

export const tripService = {
    async createTrip(userId, tripData) {
        const trip = await prisma.trip.create({
            data: {
                userId,
                startDestination: tripData.startDestination,
                returnPlace: tripData.returnPlace,
                startDate: new Date(tripData.startDate),
                endDate: new Date(tripData.endDate),
                description: tripData.description || null,
            },
        });

        return trip;
    },

    async getTrips(userId) {
        const trips = await prisma.trip.findMany({
            where: { userId },
            include: {
                itinerarySections: true,
                expenses: true,
                packingItems: true,
                tripNotes: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return trips;
    },

    async getTripById(tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
            include: {
                itinerarySections: {
                    include: {
                        activities: true,
                    },
                },
                expenses: true,
                packingItems: true,
                tripNotes: true,
                communityPosts: true,
            },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        return trip;
    },

    async updateTrip(tripId, userId, updateData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const updatedTrip = await prisma.trip.update({
            where: { id: tripId },
            data: {
                ...(updateData.startDestination && { startDestination: updateData.startDestination }),
                ...(updateData.returnPlace && { returnPlace: updateData.returnPlace }),
                ...(updateData.startDate && { startDate: new Date(updateData.startDate) }),
                ...(updateData.endDate && { endDate: new Date(updateData.endDate) }),
                ...(updateData.description !== undefined && { description: updateData.description }),
                ...(updateData.status && { status: updateData.status }),
            },
            include: {
                itinerarySections: true,
            },
        });

        return updatedTrip;
    },

    async deleteTrip(tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        await prisma.trip.delete({
            where: { id: tripId },
        });

        return { message: 'Trip deleted successfully' };
    },
};
