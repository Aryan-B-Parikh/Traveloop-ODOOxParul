import prisma from '../lib/prisma.js';

export const tripNoteService = {
    async createNote(tripId, userId, noteData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const note = await prisma.tripNote.create({
            data: {
                tripId,
                userId,
                content: noteData.content,
                tagType: noteData.tagType || null,
            },
        });

        return note;
    },

    async getNotes(tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const notes = await prisma.tripNote.findMany({
            where: { tripId },
            orderBy: { createdAt: 'desc' },
        });

        return notes;
    },

    async getNoteById(noteId, tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const note = await prisma.tripNote.findFirst({
            where: { id: noteId, tripId },
        });

        if (!note) {
            throw { status: 404, message: 'Trip note not found' };
        }

        return note;
    },

    async updateNote(noteId, tripId, userId, updateData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const note = await prisma.tripNote.findFirst({
            where: { id: noteId, tripId },
        });

        if (!note) {
            throw { status: 404, message: 'Trip note not found' };
        }

        const updatedNote = await prisma.tripNote.update({
            where: { id: noteId },
            data: {
                ...(updateData.content && { content: updateData.content }),
                ...(updateData.tagType !== undefined && { tagType: updateData.tagType }),
            },
        });

        return updatedNote;
    },

    async deleteNote(noteId, tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const note = await prisma.tripNote.findFirst({
            where: { id: noteId, tripId },
        });

        if (!note) {
            throw { status: 404, message: 'Trip note not found' };
        }

        await prisma.tripNote.delete({
            where: { id: noteId },
        });

        return { message: 'Trip note deleted successfully' };
    },
};
