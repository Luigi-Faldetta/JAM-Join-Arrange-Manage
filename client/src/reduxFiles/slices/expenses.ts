import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ExpenseState {
    //update interface once types are declared
    value: string
}

const initialExpenseState:ExpenseState = {
    value: ""
}

export const expenseSlice = createSlice({
    name: "expense",
    initialState: initialExpenseState,
    reducers: {
        //state type will be Expense when the type is created.
        createExpense: (state) => { state.value = ""},
        deleteExpense: (state) => { state.value = ""},
    }
})

export const expenseListSlice = createSlice({
    name: "expenseList",
    initialState: [] as ExpenseState[],
    reducers: {
        //state type will be Expense when the type is created.
        createExpenseList: (state) => { state = []},
        deleteExpenseList: (state) => { state = []},
        updateExpenseList: (state) => { state = []},
    }
})

export const { createExpense, deleteExpense } = expenseSlice.actions
export const { createExpenseList, updateExpenseList, deleteExpenseList } = expenseListSlice.actions

const expenseReducer = expenseSlice.reducer
const expenseListReducer = expenseListSlice.reducer

export default {expenseListReducer, expenseReducer}