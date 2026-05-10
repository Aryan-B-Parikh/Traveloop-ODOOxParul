import prisma from '../lib/prisma.js';

export const expenseService = {
    async createExpense(tripId, userId, expenseData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const totalAmount = expenseData.quantity * parseFloat(expenseData.unitCost);

        const expense = await prisma.expense.create({
            data: {
                tripId,
                userId,
                category: expenseData.category,
                description: expenseData.description,
                quantity: expenseData.quantity,
                unitCost: parseFloat(expenseData.unitCost),
                totalAmount: parseFloat(totalAmount.toFixed(2)),
            },
        });

        return expense;
    },

    async getExpenses(tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const expenses = await prisma.expense.findMany({
            where: { tripId },
            orderBy: { createdAt: 'desc' },
        });

        return expenses;
    },

    async getExpenseById(expenseId, tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const expense = await prisma.expense.findFirst({
            where: { id: expenseId, tripId },
        });

        if (!expense) {
            throw { status: 404, message: 'Expense not found' };
        }

        return expense;
    },

    async updateExpense(expenseId, tripId, userId, updateData) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const expense = await prisma.expense.findFirst({
            where: { id: expenseId, tripId },
        });

        if (!expense) {
            throw { status: 404, message: 'Expense not found' };
        }

        const quantity = updateData.quantity || expense.quantity;
        const unitCost = updateData.unitCost ? parseFloat(updateData.unitCost) : parseFloat(expense.unitCost);
        const totalAmount = quantity * unitCost;

        const updatedExpense = await prisma.expense.update({
            where: { id: expenseId },
            data: {
                ...(updateData.category && { category: updateData.category }),
                ...(updateData.description && { description: updateData.description }),
                ...(updateData.quantity && { quantity: updateData.quantity }),
                ...(updateData.unitCost && { unitCost: parseFloat(updateData.unitCost) }),
                totalAmount: parseFloat(totalAmount.toFixed(2)),
            },
        });

        return updatedExpense;
    },

    async deleteExpense(expenseId, tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const expense = await prisma.expense.findFirst({
            where: { id: expenseId, tripId },
        });

        if (!expense) {
            throw { status: 404, message: 'Expense not found' };
        }

        await prisma.expense.delete({
            where: { id: expenseId },
        });

        return { message: 'Expense deleted successfully' };
    },

    async getTotalExpenses(tripId, userId) {
        const trip = await prisma.trip.findFirst({
            where: { id: tripId, userId },
        });

        if (!trip) {
            throw { status: 404, message: 'Trip not found' };
        }

        const expenses = await prisma.expense.findMany({
            where: { tripId },
        });

        const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.totalAmount), 0);

        const byCategory = {};
        expenses.forEach((expense) => {
            if (!byCategory[expense.category]) {
                byCategory[expense.category] = 0;
            }
            byCategory[expense.category] += parseFloat(expense.totalAmount);
        });

        return {
            total: parseFloat(total.toFixed(2)),
            byCategory,
            count: expenses.length,
        };
    },
};
