import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ExpenseState {
  expenseId?: string;
  description: string;
  amount: number;
  eventId: string;
  paidBy: string;
  createdAt?: string;
  User?: {
    name: string;
    profilePic?: string;
  };
}

const initialExpenseState: ExpenseState[] = [];

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState: initialExpenseState,
  reducers: {
    setExpenseList: (state, action: PayloadAction<ExpenseState[]>) => {
      return action.payload;
    },
    addExpense: (state, action: PayloadAction<ExpenseState>) => {
      state.push(action.payload);
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      return state.filter((expense) => expense.expenseId !== action.payload);
    },
  },
});

export const { setExpenseList, addExpense, deleteExpense } =
  expenseSlice.actions;

export default expenseSlice.reducer;
