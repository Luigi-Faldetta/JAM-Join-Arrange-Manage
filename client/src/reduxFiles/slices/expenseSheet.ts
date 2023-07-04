import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ExpenseState } from "./expenses";
import { UserState } from "./users";
import { useCalculateExpensesQuery } from "../../services/ThesisDB";

export interface ExpenseSheet {
    expenses: ExpenseState[],
    attendees: UserState[],
    total: number,
    perPerson:number,
    indExpenses:{name:string, owes:number}[],
}

const initialExpenseSheet: ExpenseSheet = {
    expenses:[],
    attendees:[],
    total:0,
    perPerson:0,
    indExpenses:[]
}

export const ExpenseSheetSlice = createSlice({
    name: "expense",
    initialState: initialExpenseSheet,
    reducers: {
        createExpenseSheet: (state, action: PayloadAction<string>) => {
            const {data, error, isLoading} = useCalculateExpensesQuery(action.payload);
            state = data?.data as ExpenseSheet;
            return state
         },
    }
})

export const { createExpenseSheet } = ExpenseSheetSlice.actions;
export const expenseSheetReducer = ExpenseSheetSlice.reducer;
