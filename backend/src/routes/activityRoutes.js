import express from 'express';
import { activityController } from '../controllers/activityController.js';
import { activityValidation } from '../validators/index.js';

const router = express.Router({ mergeParams: true });

router.post('/', activityValidation, activityController.createActivity);
router.get('/', activityController.getActivities);
router.get('/:activityId', activityController.getActivityById);
router.put('/:activityId', activityValidation, activityController.updateActivity);
router.delete('/:activityId', activityController.deleteActivity);

export default router;
