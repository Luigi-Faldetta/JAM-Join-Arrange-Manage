import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../reduxFiles/store';
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} from '../../services/JamDB';
import { setExpenseList } from '../../reduxFiles/slices/expenses';
import {
  FiPlus,
  FiTrash2,
  FiDollarSign,
  FiLoader,
  FiTrendingUp,
  FiCalendar,
} from 'react-icons/fi';

interface Expense {
  expenseId: string;
  description: string;
  amount: number;
  eventId: string;
  paidBy: string;
  createdAt: string;
  User?: {
    name: string;
    profilePic?: string;
  };
}

export default function Expenses() {
  const { eventid } = useParams();
  const dispatch = useAppDispatch();
  const expenses = useSelector((state: RootState) => state.expenseReducer);

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
  });
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  // API hooks
  const { data: expensesData, isLoading } = useGetExpensesQuery(
    eventid as string
  );
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  useEffect(() => {
    if (expensesData?.data) {
      dispatch(setExpenseList(expensesData.data));
    }
  }, [expensesData, dispatch]);

  // Filter and cast expenses to only those with a valid expenseId
  const validExpenses = Array.isArray(expenses)
    ? expenses.filter((e): e is Expense => typeof e.expenseId === 'string')
    : [];

  // Calculate totals and statistics
  const totalAmount = validExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const averageExpense =
    validExpenses.length > 0 ? totalAmount / validExpenses.length : 0;
  const expensesByUser = validExpenses.reduce((acc, expense) => {
    const userId = expense.paidBy;
    if (!acc[userId]) {
      acc[userId] = {
        name: expense.User?.name || '',
        profilePic: expense.User?.profilePic,
        total: 0,
        count: 0,
      };
    }
    acc[userId].total += expense.amount;
    acc[userId].count += 1;
    return acc;
  }, {} as Record<string, { name: string; profilePic?: string; total: number; count: number }>);

  const handleAddExpense = async () => {
    if (!newExpense.description.trim() || !newExpense.amount || isCreating)
      return;

    try {
      const result = await createExpense({
        eventId: eventid as string,
        description: newExpense.description.trim(),
        amount: parseFloat(newExpense.amount),
      });

      if ('data' in result && result.data.success) {
        setNewExpense({ description: '', amount: '' });
        setIsAddingExpense(false);
      }
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex items-center space-x-2 text-gray-600">
          <FiLoader className="w-5 h-5 animate-spin" />
          <span>Loading expenses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Expenses</h2>
          <p className="text-gray-600 mt-1">Track and manage event costs</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            ${totalAmount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total spent</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-green-900">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">
                Average Expense
              </p>
              <p className="text-2xl font-bold text-blue-900">
                ${averageExpense.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">
                Total Items
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {validExpenses.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Add New Expense */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        {!isAddingExpense ? (
          <button
            onClick={() => setIsAddingExpense(true)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add new expense</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                placeholder="Expense description..."
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                placeholder="Amount ($)"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddExpense}
                disabled={
                  !newExpense.description.trim() ||
                  !newExpense.amount ||
                  isCreating
                }
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                {isCreating ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiPlus className="w-4 h-4" />
                )}
                <span>Add Expense</span>
              </button>

              <button
                onClick={() => {
                  setIsAddingExpense(false);
                  setNewExpense({ description: '', amount: '' });
                }}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Expense History
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {validExpenses.map((expense, index) => (
              <motion.div
                key={expense.expenseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        expense.User?.profilePic ||
                        '/no-profile-picture-icon.png'
                      }
                      alt={expense.User?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {expense.description}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Paid by {expense.User?.name} •{' '}
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteExpense(expense.expenseId)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {validExpenses.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FiDollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No expenses recorded yet</p>
                <p className="text-sm">Add your first expense to get started</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Expense Breakdown by User */}
      {Object.keys(expensesByUser).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Expense Breakdown by Person
            </h3>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(expensesByUser).map(([userId, userData]) => (
                <div
                  key={userId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        userData.profilePic || '/no-profile-picture-icon.png'
                      }
                      alt={userData.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {userData.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {userData.count} expenses
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ${userData.total.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {((userData.total / totalAmount) * 100).toFixed(1)}% of
                      total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
