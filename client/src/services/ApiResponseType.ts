import { ExpenseState } from "../reduxFiles/slices/expenses"
import { UserState } from "../reduxFiles/slices/users"

export interface ApiResponse<T> {
    data: T
    success: boolean
    message: string
    error?: string | null
}
export const uid = localStorage.getItem('token')

export interface ExpenseSheet {
    expenses: ExpenseState[],
    attendees: UserState[],
    total: number,
    perPerson:number,
    indExpenses:{name:string, owes:number}[],
}