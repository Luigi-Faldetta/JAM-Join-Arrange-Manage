import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import { calculateExpenseSheet } from './expenseSheet';
import store from '../store';

export interface ExpenseState {
    id?:string,
    item: string;
    cost: number;
    eventId: string;
    purchaserId: string;
}

const initialExpenseState: ExpenseState = {
    id:"",
    item: "",
    cost: 0,
    eventId: "",
    purchaserId: "",
}

export const expenseSlice = createSlice({
    name: "expense",
    initialState: initialExpenseState,
    reducers: {
        addExpense: (state, action: PayloadAction<Partial<ExpenseState> & Pick<ExpenseState, "cost" | "eventId" | "purchaserId" | "item">>) => { 
            console.log("in add expense: ", action.payload);
            state= action.payload 
        },
    }
})

export const { addExpense } = expenseSlice.actions

const expenseReducer = expenseSlice.reducer

export default { expenseReducer }