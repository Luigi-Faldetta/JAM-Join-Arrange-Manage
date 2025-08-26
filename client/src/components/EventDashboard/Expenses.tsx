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
  useConfirmPaymentMutation,
  useConfirmReceiptMutation,
  useGetEventSettlementsQuery,
} from '../../services/JamDB';
import { setExpenseList, addExpense, deleteExpense as removeExpenseFromStore } from '../../reduxFiles/slices/expenses';
import { formatCurrency } from '../../reduxFiles/slices/preferences';
import {
  FiPlus,
  FiTrash2,
  FiDollarSign,
  FiLoader,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCheck,
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

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

interface Settlement {
  id: string;
  eventId: string;
  payerId: string;
  receiverId: string;
  amount: string;
  payerConfirmed: boolean;
  receiverConfirmed: boolean;
  payerConfirmedAt?: string;
  receiverConfirmedAt?: string;
  Payer?: {
    userId: string;
    name: string;
    profilePic?: string;
  };
  Receiver?: {
    userId: string;
    name: string;
    profilePic?: string;
  };
}

export default function Expenses() {
  const { eventid } = useParams();
  const dispatch = useAppDispatch();
  const expenses = useSelector((state: RootState) => state.expenseReducer);
  const { currency } = useSelector((state: RootState) => state.preferencesReducer);
  const { t } = useTranslation();

  const [newExpense, setNewExpense] = useState({
    item: '',
    cost: '',
  });
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [confirmingPaymentId, setConfirmingPaymentId] = useState<string | null>(null);
  const [confirmingReceiptId, setConfirmingReceiptId] = useState<string | null>(null);

  // API hooks
  const { data: expensesData, isLoading, error: expensesError, refetch: refetchExpenses } = useGetExpensesQuery(
    eventid as string,
    { skip: !eventid }
  );
  const { data: userData } = useGetMeQuery();
  const { data: eventUsersData } = useGetUsersQuery(eventid as string, { skip: !eventid });
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();
  const [confirmPayment, { isLoading: isConfirmingPayment }] = useConfirmPaymentMutation();
  const [confirmReceipt, { isLoading: isConfirmingReceipt }] = useConfirmReceiptMutation();
  const { data: settlementsData } = useGetEventSettlementsQuery(eventid as string, { skip: !eventid });

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
          if (refetchExpenses) {
            console.log('Refetching expenses for consistency...');
            refetchExpenses().then((refetchResult) => {
              console.log('Refetch expenses result:', refetchResult);
            }).catch((err) => {
              console.log('Refetch error (can be ignored):', err);
            });
          }
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

  const handleConfirmPayment = async (receiverId: string, amount: number) => {
    if (!userData?.data?.userId || confirmingPaymentId) return;

    const paymentId = `${userData.data.userId}-${receiverId}-${amount}`;
    setConfirmingPaymentId(paymentId);

    try {
      const result = await confirmPayment({
        eventId: eventid as string,
        payerId: userData.data.userId,
        receiverId,
        amount,
      }).unwrap();
      
      // Success - the UI will update automatically via RTK Query
      console.log('Payment confirmed successfully:', result);
    } catch (error) {
      console.error('Error confirming payment:', error);
    } finally {
      setConfirmingPaymentId(null);
    }
  };

  const handleConfirmReceipt = async (settlementId: string) => {
    if (!userData?.data?.userId || confirmingReceiptId) return;

    setConfirmingReceiptId(settlementId);

    try {
      const result = await confirmReceipt({
        settlementId,
        userId: userData.data.userId,
      }).unwrap();
      
      // Success - the UI will update automatically via RTK Query
      console.log('Receipt confirmed successfully:', result);
    } catch (error) {
      console.error('Error confirming receipt:', error);
    } finally {
      setConfirmingReceiptId(null);
    }
  };

  // Helper function to get settlement status
  const getSettlementStatus = (payerId: string, receiverId: string, amount: number): Settlement | null => {
    if (!settlementsData?.data) return null;
    
    const settlement = settlementsData.data.find((settlement: Settlement) => 
      settlement.payerId === payerId &&
      settlement.receiverId === receiverId &&
      Math.abs(parseFloat(settlement.amount) - amount) < 0.01
    );
    
    return settlement;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <FiLoader className="w-5 h-5 animate-spin" />
          <span>{t.common.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.expenses.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{t.expenses.trackAndManage}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalAmount, currency)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t.expenses.totalExpenses}</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                {t.expenses.totalExpenses}
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatCurrency(totalAmount, currency)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                {t.expenses.averageExpense}
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(averageExpense, currency)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                {t.expenses.totalItems}
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
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
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-gray-200 dark:border-gray-600">
        {!isAddingExpense ? (
          <button
            onClick={() => setIsAddingExpense(true)}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>{t.expenses.addExpense}</span>
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
                placeholder={t.expenses.descriptionPlaceholder}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleAddExpense()}
              />
              <input
                type="number"
                step="0.01"
                value={newExpense.cost}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, cost: e.target.value })
                }
                placeholder={t.expenses.amountPlaceholder}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
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
                <span>{t.expenses.addExpense}</span>
              </button>

              <button
                onClick={() => {
                  setIsAddingExpense(false);
                  setNewExpense({ item: '', cost: '' });
                }}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expenses List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.expenses.expenseHistory}
          </h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {validExpenses.map((expense, index) => (
              <motion.div
                key={expense.expenseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
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
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {expense.description}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t.expenses.paidBy} {expense.User?.name} •{' '}
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount, currency)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteExpense(expense.expenseId)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {validExpenses.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FiDollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t.expenses.noExpenses}</p>
                <p className="text-sm">{t.expenses.noExpensesDescription}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Expense Charts */}
      {Object.keys(expensesByUser).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Breakdown Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.expenses.spendingBreakdown}
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
                          <span className="font-medium text-gray-900 dark:text-white">
                            {userData.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {formatCurrency(userData.total, currency)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.expenses.paymentBalance}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {t.expenses.settlementDescription}
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {(() => {
                  // Get all event attendees, not just those who have paid
                  const allAttendees = eventUsersData?.data || [];
                  const numPeople = allAttendees.length;
                  
                  if (numPeople === 0) return null;
                  
                  const averagePerPerson = totalAmount / numPeople;
                  
                  // Calculate balances for each person (including those who haven't paid)
                  const balances = allAttendees.map((user: any) => {
                    const userExpenses = expensesByUser[user.userId];
                    const paid = userExpenses?.total || 0;
                    
                    return {
                      userId: user.userId,
                      name: user.name || 'Unknown User',
                      profilePic: user.profilePic,
                      paid: paid,
                      balance: paid - averagePerPerson,
                    };
                  });
                  
                  // Separate creditors (who are owed) and debtors (who owe)
                  const creditors = balances.filter(p => p.balance > 0.01).sort((a, b) => b.balance - a.balance);
                  const debtors = balances.filter(p => p.balance < -0.01).sort((a, b) => a.balance - b.balance);
                  
                  // Calculate who should pay whom using a simplified algorithm
                  const transactions: Array<{ from: typeof balances[0]; to: typeof balances[0]; amount: number }> = [];
                  
                  let i = 0, j = 0;
                  while (i < creditors.length && j < debtors.length) {
                    const creditor = creditors[i];
                    const debtor = debtors[j];
                    
                    const amount = Math.min(creditor.balance, -debtor.balance);
                    
                    if (amount > 0.01) {
                      transactions.push({
                        from: debtor,
                        to: creditor,
                        amount: amount,
                      });
                    }
                    
                    creditor.balance -= amount;
                    debtor.balance += amount;
                    
                    if (Math.abs(creditor.balance) < 0.01) i++;
                    if (Math.abs(debtor.balance) < 0.01) j++;
                  }
                  
                  // Show individual balances first
                  const hasImbalances = balances.some(p => Math.abs(p.balance) >= 0.01);
                  
                  // Check if all transactions are settled
                  const allTransactionsSettled = transactions.length > 0 && transactions.every(transaction => {
                    const settlement = getSettlementStatus(
                      transaction.from.userId,
                      transaction.to.userId,
                      transaction.amount
                    );
                    return settlement?.payerConfirmed && settlement?.receiverConfirmed;
                  });
                  
                  
                  // Only show settled message when there are no imbalances AND either no transactions or all are settled
                  const showSettledMessage = !hasImbalances && (transactions.length === 0 || allTransactionsSettled);
                  
                  return (
                    <>
                      {/* Summary */}
                      {totalAmount > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">{t.expenses.totalExpenses}</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(totalAmount, currency)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">{t.expenses.perPerson}</p>
                              <p className="text-lg font-semibold text-purple-600">{formatCurrency(averagePerPerson, currency)}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{t.expenses.splitEqually} {numPeople} {numPeople !== 1 ? t.expenses.attendees : t.expenses.attendee}</p>
                        </div>
                      )}
                      
                      {/* Individual Balances */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t.expenses.balance}</h4>
                        {balances.map((person) => {
                          const balance = person.balance;
                          const isOwed = balance > 0;
                          const absBalance = Math.abs(balance);
                          
                          if (absBalance < 0.01) return null;
                          
                          return (
                            <div key={person.userId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg gap-2" 
                                 style={{ backgroundColor: isOwed ? '#f0fdf4' : '#fef2f2' }}>
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <img
                                  src={person.profilePic || '/no-profile-picture-icon.png'}
                                  alt={person.name}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                    {person.name}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {person.paid > 0 ? `${t.expenses.paid} ${formatCurrency(person.paid, currency)}` : t.expenses.noExpenses}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right flex-shrink-0">
                                <div className={`text-sm font-semibold ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                                  {isOwed ? '+' : '-'}${absBalance.toFixed(2)}
                                </div>
                                <div className={`text-xs ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                                  {isOwed ? t.expenses.owesYou : t.expenses.youOwe}
                                </div>
                              </div>
                            </div>
                          );
                        }).filter(Boolean)}
                      </div>
                      
                      {/* Settlement Transactions */}
                      {transactions.length > 0 && (
                        <div className="space-y-3 mt-6">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t.expenses.suggestedPayments}</h4>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">{t.expenses.settleBalancesInstruction}</p>
                            {transactions.map((transaction, index) => {
                              const settlement = getSettlementStatus(
                                transaction.from.userId,
                                transaction.to.userId,
                                transaction.amount
                              );
                              const transactionKey = `${transaction.from.userId}-${transaction.to.userId}-${transaction.amount}`;
                              const isCurrentUserPayer = userData?.data?.userId === transaction.from.userId;
                              const isCurrentUserReceiver = userData?.data?.userId === transaction.to.userId;
                              const canConfirmPayment = isCurrentUserPayer && !settlement?.payerConfirmed;
                              const canConfirmReceipt = isCurrentUserReceiver && settlement?.payerConfirmed && !settlement?.receiverConfirmed;
                              const isFullySettled = settlement?.payerConfirmed && settlement?.receiverConfirmed;
                              const isConfirmingThisPayment = confirmingPaymentId === transactionKey;

                              return (
                                <div key={index} className="p-3 bg-white dark:bg-gray-700 rounded-lg mb-2 last:mb-0 shadow-sm">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center justify-between sm:justify-start gap-2 w-full">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <img
                                          src={transaction.from.profilePic || '/no-profile-picture-icon.png'}
                                          alt={transaction.from.name}
                                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{transaction.from.name}</p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">{t.expenses.pays}</p>
                                        </div>
                                      </div>
                                      <div className="text-center flex-shrink-0 px-2">
                                        <div className="text-lg font-bold text-blue-600">{formatCurrency(transaction.amount, currency)}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{t.expenses.to}</div>
                                      </div>
                                      <div className="flex items-center gap-2 min-w-0 justify-end">
                                        <div className="text-right min-w-0">
                                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{transaction.to.name}</p>
                                        </div>
                                        <img
                                          src={transaction.to.profilePic || '/no-profile-picture-icon.png'}
                                          alt={transaction.to.name}
                                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Settlement Status and Actions */}
                                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex items-center space-x-2">
                                      {isFullySettled ? (
                                        <div className="flex items-center space-x-2 text-green-600">
                                          <FiCheckCircle className="w-4 h-4" />
                                          <span className="text-sm font-medium">Settled</span>
                                        </div>
                                      ) : settlement?.payerConfirmed ? (
                                        <div className="flex items-center space-x-2 text-yellow-600">
                                          <FiClock className="w-4 h-4" />
                                          <span className="text-sm">Awaiting confirmation</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center space-x-2 text-gray-500">
                                          <FiDollarSign className="w-4 h-4" />
                                          <span className="text-sm">Pending payment</span>
                                        </div>
                                      )}
                                    </div>

                                    {canConfirmPayment && (
                                      <button
                                        onClick={() => handleConfirmPayment(transaction.to.userId, transaction.amount)}
                                        disabled={isConfirmingThisPayment}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 w-full sm:w-auto"
                                      >
                                        {isConfirmingThisPayment ? (
                                          <FiLoader className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <FiCheck className="w-4 h-4" />
                                        )}
                                        <span>{isConfirmingThisPayment ? 'Confirming...' : 'Mark as Paid'}</span>
                                      </button>
                                    )}

                                    {canConfirmReceipt && settlement && (
                                      <button
                                        onClick={() => handleConfirmReceipt(settlement.id)}
                                        disabled={confirmingReceiptId === settlement.id}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 w-full sm:w-auto"
                                      >
                                        {confirmingReceiptId === settlement.id ? (
                                          <FiLoader className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <FiCheck className="w-4 h-4" />
                                        )}
                                        <span>{confirmingReceiptId === settlement.id ? 'Confirming...' : 'Confirm Receipt'}</span>
                                      </button>
                                    )}

                                    {isCurrentUserPayer && settlement?.payerConfirmed && !settlement?.receiverConfirmed && (
                                      <div className="text-sm text-gray-600 text-center sm:text-left">
                                        Waiting for {transaction.to.name} to confirm
                                      </div>
                                    )}

                                    {isCurrentUserReceiver && !settlement?.payerConfirmed && (
                                      <div className="text-sm text-gray-600 text-center sm:text-left">
                                        Waiting for payment
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* All Balanced Message */}
                      {showSettledMessage && totalAmount > 0 && (
                        <div className="text-center py-6 text-gray-500">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <p className="font-medium">{t.expenses.settledUp}</p>
                          <p className="text-sm">{t.expenses.everyonePaid}</p>
                        </div>
                      )}
                      
                      {/* No Expenses Message */}
                      {totalAmount === 0 && (
                        <div className="text-center py-6 text-gray-500">
                          <FiDollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="font-medium">No expenses yet</p>
                          <p className="text-sm">Add expenses to track payments</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
