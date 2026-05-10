import express from 'express';
import { packingItemController } from '../controllers/packingItemController.js';
import { packingItemValidation } from '../validators/index.js';

const router = express.Router({ mergeParams: true });

router.post('/', packingItemValidation, packingItemController.createItem);
router.get('/', packingItemController.getItems);
router.get('/:itemId', packingItemController.getItemById);
router.put('/:itemId', packingItemValidation, packingItemController.updateItem);
router.delete('/:itemId', packingItemController.deleteItem);

export default router;
