import prisma from '../lib/prisma.js';

export const itinerarySectionService = {
    async createSection(tripId, userId, sectionData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const section = await prisma.itinerarySection.create({
            data: {
                tripId,
                location: sectionData.location,
                sectionDateStart: new Date(sectionData.sectionDateStart),
                sectionDateEnd: new Date(sectionData.sectionDateEnd),
                sectionBudget: sectionData.sectionBudget || 0,
                description: sectionData.description || null,
            },
        });

        return section;
    },

    async getSections(tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const sections = await prisma.itinerarySection.findMany({
            where: { tripId },
            include: {
                activities: true,
            },
            orderBy: { sectionDateStart: 'asc' },
        });

        return sections;
    },

    async getSectionById(sectionId, tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const section = await prisma.itinerarySection.findFirst({
            where: { id: sectionId, tripId },
            include: {
                activities: true,
            },
        });

        if (!section) {
            throw { status: 404, message: 'Itinerary section not found' };
        }

        return section;
    },

    async updateSection(sectionId, tripId, userId, updateData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const section = await prisma.itinerarySection.findFirst({
            where: { id: sectionId, tripId },
        });

        if (!section) {
            throw { status: 404, message: 'Itinerary section not found' };
        }

        const updatedSection = await prisma.itinerarySection.update({
            where: { id: sectionId },
            data: {
                ...(updateData.location && { location: updateData.location }),
                ...(updateData.sectionDateStart && { sectionDateStart: new Date(updateData.sectionDateStart) }),
                ...(updateData.sectionDateEnd && { sectionDateEnd: new Date(updateData.sectionDateEnd) }),
                ...(updateData.sectionBudget !== undefined && { sectionBudget: updateData.sectionBudget }),
                ...(updateData.description !== undefined && { description: updateData.description }),
            },
            include: {
                activities: true,
            },
        });

        return updatedSection;
    },

    async deleteSection(sectionId, tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const section = await prisma.itinerarySection.findFirst({
            where: { id: sectionId, tripId },
        });

        if (!section) {
            throw { status: 404, message: 'Itinerary section not found' };
        }

        await prisma.itinerarySection.delete({
            where: { id: sectionId },
        });

        return { message: 'Itinerary section deleted successfully' };
    },
};
