import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export const calculateExpenseSheet = createAsyncThunk(
    'expensesheet/calculateExpenses',
    async (eventId:string, {dispatch}) => {
        try{
            const response = await useCalculateExpensesQuery(eventId)

            dispatch(updateExpenseSheet(response.data?.data as ExpenseSheet))
        } catch (error) {
            console.log("could not calculate expenses.", error);
        }
    }
)

export const ExpenseSheetSlice = createSlice({
    name: "expenseSheet",
    initialState: initialExpenseSheet,
    reducers: {
        updateExpenseSheet: (state, action: PayloadAction<ExpenseSheet>) => {
            state = action.payload
            return state
        }
    }
})

export const {updateExpenseSheet} = ExpenseSheetSlice.actions;
export const expenseSheetReducer = ExpenseSheetSlice.reducer;