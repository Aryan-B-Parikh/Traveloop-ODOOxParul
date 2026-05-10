import express from 'express';
import { tripController } from '../controllers/tripController.js';
import { authenticate } from '../middleware/auth.js';
import { tripValidation } from '../validators/index.js';
import itinerarySectionRoutes from './itinerarySectionRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import packingItemRoutes from './packingItemRoutes.js';
import tripNoteRoutes from './tripNoteRoutes.js';

const router = express.Router();

router.use(authenticate);

router.post('/', tripValidation, tripController.createTrip);
router.get('/', tripController.getTrips);
router.get('/:tripId', tripController.getTripById);
router.put('/:tripId', tripValidation, tripController.updateTrip);
router.delete('/:tripId', tripController.deleteTrip);

router.use('/:tripId/sections', itinerarySectionRoutes);
router.use('/:tripId/expenses', expenseRoutes);
router.use('/:tripId/packing-items', packingItemRoutes);
router.use('/:tripId/notes', tripNoteRoutes);

export default router;
