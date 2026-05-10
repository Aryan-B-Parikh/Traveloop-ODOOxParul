import { expenseService } from '../services/expenseService.js';
import { asyncHandler } from '../utils/helpers.js';

export const expenseController = {
    createExpense: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const expense = await expenseService.createExpense(parseInt(tripId), req.userId, req.body);

        res.status(201).json({
            status: 201,
            message: 'Expense created successfully',
            data: expense,
        });
    }),

    getExpenses: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const expenses = await expenseService.getExpenses(parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Expenses retrieved successfully',
            data: expenses,
        });
    }),

    getExpenseById: asyncHandler(async (req, res) => {
        const { tripId, expenseId } = req.params;
        const expense = await expenseService.getExpenseById(parseInt(expenseId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Expense retrieved successfully',
            data: expense,
        });
    }),

    updateExpense: asyncHandler(async (req, res) => {
        const { tripId, expenseId } = req.params;
        const expense = await expenseService.updateExpense(parseInt(expenseId), parseInt(tripId), req.userId, req.body);

        res.status(200).json({
            status: 200,
            message: 'Expense updated successfully',
            data: expense,
        });
    }),

    deleteExpense: asyncHandler(async (req, res) => {
        const { tripId, expenseId } = req.params;
        const result = await expenseService.deleteExpense(parseInt(expenseId), parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: result.message,
        });
    }),

    getTotalExpenses: asyncHandler(async (req, res) => {
        const { tripId } = req.params;
        const summary = await expenseService.getTotalExpenses(parseInt(tripId), req.userId);

        res.status(200).json({
            status: 200,
            message: 'Expense summary retrieved successfully',
            data: summary,
        });
    }),
};
