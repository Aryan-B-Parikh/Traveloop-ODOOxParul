import apiClient from './apiClient';
import { budgetSummary } from '../data/sampleBudget';

const demoExpenseSummary = (tripId) => ({ total: 0, byCategory: {}, count: 0 });

export const getExpenses = async (tripId) => {
  const token = localStorage.getItem('token');
  if (!token || token.startsWith('demo-')) {
    return [];
  }

  const response = await apiClient.get(`/trips/${tripId}/expenses`);
  return response.data.data;
};

export const getExpenseSummary = async (tripId) => {
  const token = localStorage.getItem('token');
  if (!token || token.startsWith('demo-')) {
    return demoExpenseSummary(tripId);
  }

  const response = await apiClient.get(`/trips/${tripId}/expenses/summary/total`);
  return response.data.data;
};

export const createExpense = async (tripId, expenseData) => {
  const response = await apiClient.post(`/trips/${tripId}/expenses`, expenseData);
  return response.data.data;
};

export const updateExpense = async (tripId, expenseId, expenseData) => {
  const response = await apiClient.put(`/trips/${tripId}/expenses/${expenseId}`, expenseData);
  return response.data.data;
};

export const deleteExpense = async (tripId, expenseId) => {
  await apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`);
};
