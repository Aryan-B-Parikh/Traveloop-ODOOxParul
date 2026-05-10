import { tripNoteService } from '../services/tripNoteService.js';
import { asyncHandler } from '../utils/helpers.js';

export const tripNoteController = {
    createNote: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const note = await tripNoteService.createNote(parseInt(tripId), req.userId, req.body);

        res.status(201).json({
            status: 201,
            message: 'Trip note created successfully',
            data: note,
        });
    }),

    getNotes: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const notes = await tripNoteService.getNotes(parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Trip notes retrieved successfully',
            data: notes,
        });
    }),

    getNoteById: asyncHandler(async (req, res) => {
        const { tripId, noteId } = req.params;
        const note = await tripNoteService.getNoteById(parseInt(noteId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Trip note retrieved successfully',
            data: note,
        });
    }),

    updateNote: asyncHandler(async (req, res) => {
        const { tripId, noteId } = req.params;
        const note = await tripNoteService.updateNote(parseInt(noteId), parseInt(tripId), req.userId, req.body);

        res.status(200).json({
            status: 200,
            message: 'Trip note updated successfully',
            data: note,
        });
    }),

    deleteNote: asyncHandler(async (req, res) => {
        const { tripId, noteId } = req.params;
        const result = await tripNoteService.deleteNote(parseInt(noteId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: result.message,
        });
    }),
};
