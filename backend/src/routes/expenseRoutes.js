import express from 'express';
import { expenseController } from '../controllers/expenseController.js';
import { expenseValidation } from '../validators/index.js';

const router = express.Router({ mergeParams: true });

router.post('/', expenseValidation, expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.get('/summary/total', expenseController.getTotalExpenses);
router.get('/:expenseId', expenseController.getExpenseById);
router.put('/:expenseId', expenseValidation, expenseController.updateExpense);
router.delete('/:expenseId', expenseController.deleteExpense);

export default router;
