import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../reduxFiles/store';
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useGetMeQuery,
  useGetUsersQuery,
} from '../../services/JamDB';
import { setExpenseList, addExpense, deleteExpense as removeExpenseFromStore } from '../../reduxFiles/slices/expenses';
import {
  FiPlus,
  FiTrash2,
  FiDollarSign,
  FiLoader,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
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
    item: '',
    cost: '',
  });
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  // API hooks
  const { data: expensesData, isLoading, error: expensesError, refetch: refetchExpenses } = useGetExpensesQuery(
    eventid as string
  );
  const { data: userData } = useGetMeQuery();
  const { data: eventUsersData } = useGetUsersQuery(eventid as string);
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  useEffect(() => {
    console.log('Expenses useEffect triggered with:', { expensesData, expensesError });
    if (expensesData?.data && Array.isArray(expensesData.data) && expensesData.data.length > 0) {
      console.log('Setting expenses data:', expensesData.data);
      console.log('Sample expense item structure:', expensesData.data[0]);
      
      // Create user lookup map
      const userMap = new Map();
      if (eventUsersData?.data) {
        eventUsersData.data.forEach((user: any) => {
          userMap.set(user.userId, user);
        });
      }
      
      // Add current user to map if available
      if (userData?.data) {
        userMap.set(userData.data.userId, userData.data);
      }
      
      // Transform backend data to match UI expectations
      const transformedExpenses = expensesData.data.map((expense: any) => {
        const userId = expense.paidBy || expense.purchaserId;
        const user = userMap.get(userId) || { name: 'Unknown User' };
        
        return {
          expenseId: expense.expenseId || expense.id?.toString() || 'unknown',
          description: expense.description || expense.item || '',
          amount: expense.amount || expense.cost || 0,
          eventId: expense.eventId,
          paidBy: userId || '',
          createdAt: expense.createdAt || expense.updatedAt || new Date().toISOString(),
          User: {
            name: user.name || 'Unknown User',
            profilePic: user.profilePic,
          },
        };
      });
      
      console.log('Transformed expenses:', transformedExpenses);
      dispatch(setExpenseList(transformedExpenses));
    } else if (expensesData?.data && Array.isArray(expensesData.data) && expensesData.data.length === 0) {
      // Handle empty array response
      console.log('Setting empty expenses - received empty array');
      dispatch(setExpenseList([]));
    } else if (expensesError && 'status' in expensesError && expensesError.status === 500) {
      // Handle "No expenses were found" error by setting empty array
      const errorMessage = (expensesError.data as any)?.message;
      if (errorMessage === 'No expenses were found') {
        console.log('No expenses found for this event (expected when event has no expenses)');
      } else {
        console.error('Unexpected 500 error:', errorMessage);
      }
      dispatch(setExpenseList([]));
    }
  }, [expensesData, expensesError, dispatch, eventUsersData, userData]);

  // Filter and cast expenses to only those with a valid expenseId
  console.log('Current expenses from Redux:', expenses);
  const validExpenses = Array.isArray(expenses)
    ? expenses.filter((e): e is Expense => typeof e.expenseId === 'string' || typeof e.expenseId === 'number')
    : [];
  console.log('Valid expenses after filtering:', validExpenses);

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
    if (!newExpense.item.trim() || !newExpense.cost || isCreating || !userData?.data?.userId)
      return;

    console.log('Creating expense with data:', {
      eventId: eventid as string,
      item: newExpense.item.trim(),
      cost: parseFloat(newExpense.cost),
      purchaserId: userData.data.userId,
    });

    try {
      const result = await createExpense({
        eventId: eventid as string,
        item: newExpense.item.trim(),
        cost: parseFloat(newExpense.cost),
        purchaserId: userData.data.userId,
      });

      console.log('Expense creation result:', result);
      console.log('Expense creation result type:', typeof result);
      console.log('Expense creation result keys:', Object.keys(result));

      if ('data' in result) {
        console.log('Result has data:', result.data);
        if (result.data && result.data.success) {
          console.log('Expense created successfully');
          
          // Add the new expense to Redux store immediately
          console.log('Backend returned expense data:', result.data.data);
          
          const backendData = result.data.data as any;
          const newExpenseForStore = {
            expenseId: backendData?.expenseId || backendData?.id?.toString() || Date.now().toString(),
            description: newExpense.item.trim(),
            amount: parseFloat(newExpense.cost),
            eventId: eventid as string,
            paidBy: userData.data.userId,
            createdAt: new Date().toISOString(),
            User: {
              name: userData.data.name || 'Unknown',
              profilePic: userData.data.profilePic,
            },
          };
          
          console.log('Adding new expense to store:', newExpenseForStore);
          dispatch(addExpense(newExpenseForStore));
          
          console.log('Current Redux expenses state after dispatch:', expenses);
          
          setNewExpense({ item: '', cost: '' });
          setIsAddingExpense(false);
          
          // Also refetch to ensure backend consistency
          console.log('Refetching expenses for consistency...');
          refetchExpenses().then((refetchResult) => {
            console.log('Refetch expenses result:', refetchResult);
          });
        } else {
          console.log('Expense creation data exists but not successful:', result.data);
        }
      } else if ('error' in result) {
        console.error('Expense creation failed with error:', result.error);
        console.error('Error details:', JSON.stringify(result.error, null, 2));
      } else {
        console.log('Unexpected result format:', result);
      }
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      console.log('Deleting expense with ID:', expenseId);
      
      // Optimistically remove from Redux store first
      dispatch(removeExpenseFromStore(expenseId));
      
      // Delete the expense
      const result = await deleteExpense(expenseId);
      console.log('Delete expense result:', result);
      
      // Success - the optimistic deletion already removed it from Redux
      console.log('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      // If delete failed, we should revert the optimistic update
      // But for simplicity, we'll let the next refetch restore the state
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
                value={newExpense.item}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, item: e.target.value })
                }
                placeholder="What did you buy?"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddExpense()}
              />
              <input
                type="number"
                step="0.01"
                value={newExpense.cost}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, cost: e.target.value })
                }
                placeholder="Cost ($)"
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddExpense()}
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddExpense}
                disabled={
                  !newExpense.item.trim() ||
                  !newExpense.cost ||
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
                  setNewExpense({ item: '', cost: '' });
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

      {/* Expense Charts */}
      {Object.keys(expensesByUser).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Breakdown Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Spending Breakdown
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(expensesByUser).map(([userId, userData]) => {
                  const percentage = (userData.total / totalAmount) * 100;
                  return (
                    <div key={userId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={userData.profilePic || '/no-profile-picture-icon.png'}
                            alt={userData.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-900">
                            {userData.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          ${userData.total.toFixed(2)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment Balance Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Balance
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Who owes money and who is owed
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {(() => {
                  const numPeople = Object.keys(expensesByUser).length;
                  const averagePerPerson = totalAmount / numPeople;
                  
                  return Object.entries(expensesByUser).map(([userId, userData]) => {
                    const balance = userData.total - averagePerPerson;
                    const isOwed = balance > 0;
                    const absBalance = Math.abs(balance);
                    
                    if (absBalance < 0.01) return null; // Skip if balance is essentially zero
                    
                    return (
                      <div key={userId} className="flex items-center justify-between p-4 rounded-xl" 
                           style={{ backgroundColor: isOwed ? '#f0fdf4' : '#fef2f2' }}>
                        <div className="flex items-center space-x-3">
                          <img
                            src={userData.profilePic || '/no-profile-picture-icon.png'}
                            alt={userData.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {userData.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Paid ${userData.total.toFixed(2)} • Fair share: ${averagePerPerson.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`text-lg font-semibold ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                            {isOwed ? '+' : '-'}${absBalance.toFixed(2)}
                          </div>
                          <div className={`text-sm ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                            {isOwed ? 'Is owed' : 'Owes'}
                          </div>
                        </div>
                      </div>
                    );
                  }).filter(Boolean);
                })()}
                
                {(() => {
                  const numPeople = Object.keys(expensesByUser).length;
                  const averagePerPerson = totalAmount / numPeople;
                  const hasImbalances = Object.values(expensesByUser).some(
                    userData => Math.abs(userData.total - averagePerPerson) >= 0.01
                  );
                  
                  if (!hasImbalances) {
                    return (
                      <div className="text-center py-6 text-gray-500">
                        <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <FiCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="font-medium">All balanced!</p>
                        <p className="text-sm">Everyone has paid their fair share</p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
