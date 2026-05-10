import prisma from '../lib/prisma.js';

export const activityService = {
    async createActivity(sectionId, tripId, userId, activityData) {
        const section = await prisma.itinerarySection.findFirst({
            where: { id: sectionId, trip: { id: tripId, userId } },
        });

        if (!section) {
            throw { status: 404, message: 'Itinerary section not found' };
        }

        const activity = await prisma.activity.create({
            data: {
                sectionId,
                name: activityData.name,
                city: activityData.city,
                description: activityData.description || null,
                cost: activityData.cost || 0,
                duration: activityData.duration || null,
                category: activityData.category || null,
            },
        });

        return activity;
    },

    async getActivities(sectionId, tripId, userId) {
        const section = await prisma.itinerarySection.findFirst({
            where: { id: sectionId, trip: { id: tripId, userId } },
        });

        if (!section) {
            throw { status: 404, message: 'Itinerary section not found' };
        }

        const activities = await prisma.activity.findMany({
            where: { sectionId },
            orderBy: { createdAt: 'desc' },
        });

        return activities;
    },

    async getActivityById(activityId, sectionId, tripId, userId) {
        const section = await prisma.itinerarySection.findFirst({
            where: { id: sectionId, trip: { id: tripId, userId } },
        });

        if (!section) {
            throw { status: 404, message: 'Itinerary section not found' };
        }

        const activity = await prisma.activity.findFirst({
            where: { id: activityId, sectionId },
        });

        if (!activity) {
            throw { status: 404, message: 'Activity not found' };
        }

        return activity;
    },

    async updateActivity(activityId, sectionId, tripId, userId, updateData) {
        const section = await prisma.itinerarySection.findFirst({
            where: { id: sectionId, trip: { id: tripId, userId } },
        });

        if (!section) {
            throw { status: 404, message: 'Itinerary section not found' };
        }

        const activity = await prisma.activity.findFirst({
            where: { id: activityId, sectionId },
        });

        if (!activity) {
            throw { status: 404, message: 'Activity not found' };
        }

        const updatedActivity = await prisma.activity.update({
            where: { id: activityId },
            data: {
                ...(updateData.name && { name: updateData.name }),
                ...(updateData.city && { city: updateData.city }),
                ...(updateData.description !== undefined && { description: updateData.description }),
                ...(updateData.cost !== undefined && { cost: updateData.cost }),
                ...(updateData.duration !== undefined && { duration: updateData.duration }),
                ...(updateData.category !== undefined && { category: updateData.category }),
            },
        });

        return updatedActivity;
    },

    async deleteActivity(activityId, sectionId, tripId, userId) {
        const section = await prisma.itinerarySection.findFirst({
            where: { id: sectionId, trip: { id: tripId, userId } },
        });

        if (!section) {
            throw { status: 404, message: 'Itinerary section not found' };
        }

        const activity = await prisma.activity.findFirst({
            where: { id: activityId, sectionId },
        });

        if (!activity) {
            throw { status: 404, message: 'Activity not found' };
        }

        await prisma.activity.delete({
            where: { id: activityId },
        });

        return { message: 'Activity deleted successfully' };
    },
};
