import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ExpenseState {
    //update interface once types are declared
    value: string
}

export interface ExpenseListState {
    //update interface once types are declared
    value:ExpenseState[]
}

const initialExpenseState:ExpenseState = {
    value: ""
}

const initialExpenseListState: ExpenseListState = {
    value: [],
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
    initialState: initialExpenseListState,
    reducers: {
        //state type will be Expense when the type is created.
        createExpenseList: (state) => { state.value = []},
        deleteExpenseList: (state) => { state.value = []},
        updateExpenseList: (state) => { state.value = []},
    }
})

export const { createExpense, deleteExpense } = expenseSlice.actions
export const { createExpenseList, updateExpenseList, deleteExpenseList } = expenseListSlice.actions

const expenseReducer = expenseSlice.reducer
const expenseListReducer = expenseListSlice.reducer

export default {expenseListReducer, expenseReducer}