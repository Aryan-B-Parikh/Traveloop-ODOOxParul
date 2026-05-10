import express from 'express';
import { itinerarySectionController } from '../controllers/itinerarySectionController.js';
import { itinerarySectionValidation } from '../validators/index.js';
import activityRoutes from './activityRoutes.js';

const router = express.Router({ mergeParams: true });

router.post('/', itinerarySectionValidation, itinerarySectionController.createSection);
router.get('/', itinerarySectionController.getSections);
router.get('/:sectionId', itinerarySectionController.getSectionById);
router.put('/:sectionId', itinerarySectionValidation, itinerarySectionController.updateSection);
router.delete('/:sectionId', itinerarySectionController.deleteSection);

router.use('/:sectionId/activities', activityRoutes);

export default router;
