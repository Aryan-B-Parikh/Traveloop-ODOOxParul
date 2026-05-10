import express from 'express';
import { tripNoteController } from '../controllers/tripNoteController.js';
import { tripNoteValidation } from '../validators/index.js';

const router = express.Router({ mergeParams: true });

router.post('/', tripNoteValidation, tripNoteController.createNote);
router.get('/', tripNoteController.getNotes);
router.get('/:noteId', tripNoteController.getNoteById);
router.put('/:noteId', tripNoteValidation, tripNoteController.updateNote);
router.delete('/:noteId', tripNoteController.deleteNote);

export default router;
