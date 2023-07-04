import { useEffect, useState } from "react";
import { ExpenseState, addExpense, deleteExpense } from "../../reduxFiles/slices/expenses";
import { useAddExpenseMutation, useCalculateExpensesQuery, useDeleteExpenseMutation } from "../../services/ThesisDB";
import { useParams } from "react-router-dom";
import { ExpenseSheet } from "../../reduxFiles/slices/expenseSheet";
import { useAppDispatch } from "../../reduxFiles/store";




export default function Expenses() {
    const { eventid } = useParams();
    const appDispatch = useAppDispatch()
    const purchaserId = localStorage.getItem("token")
    // const [deleteExpense] = useDeleteExpenseMutation()
    // const [addExpense] = useAddExpenseMutation()

    const [expenseSheet, setExpenseSheet] = useState<ExpenseSheet>({
        expenses:[],
        attendees:[],
        total:0,
        perPerson:0,
        indExpenses:[]
    });

    //it might be easier if we can make the use state type ExpenseState, but for now I needed it to work.
    const [newExpenseForm, setNewExpenseForm] = useState<{item:string, cost:string, eventId:string, purchaserId:string}>({ item: "", cost: "", eventId: "", purchaserId: "" });


    
    const { data, error, isLoading } = useCalculateExpensesQuery(eventid as string);

    console.log("data: ",data);
    // useEffect(() => {
    //     if (data) {
    //         setExpenseSheet(data.data);
    //         console.log("data.data: ", data.data)
    //     }
    // }, [expenseSheet.expenses, expenseSheet.attendees]);



    const handleAddClick = async () => {
        if (newExpenseForm.item !== "") {
            const expenseToAdd: ExpenseState = {
                item: newExpenseForm.item,
                cost: +newExpenseForm.cost,
                eventId: eventid as string,
                purchaserId: purchaserId as string,
            };
            appDispatch(addExpense(expenseToAdd))
        }
        setNewExpenseForm({ item: "", cost: "", eventId: "", purchaserId: "" })
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'cost' && value === '0') {
            setNewExpenseForm((prevExpense) => ({
                ...prevExpense,
                [name]: '',
            }));
        } else {
            setNewExpenseForm((prevExpense) => ({
                ...prevExpense,
                [name]: value,
            }));
        }
    };



    const handleDeleteClick = async (expenseId: string) => {
        appDispatch(deleteExpense(expenseId));
    };





    return (
        <div className="flex justify-center">
            <div className="w-4/5 mx-20 relative bg-blue-500 rounded-lg flex flex-col items-center mt-36 h-[460px]">
                <h1 className="p-6 text-2xl text-white">Expenses</h1>
                <div className="absolute top-6 right-6 text-2xl text-red-600">Total:  {`$${data?.data.total}`}</div>
                <div className="flex items-center" key={newExpenseForm.purchaserId}>
                    <input
                        name="item"
                        value={newExpenseForm.item}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Expense item"
                        className="w-40 h-10"
                    />
                    <input
                        name="cost"
                        value={newExpenseForm.cost}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                        className="w-20 h-10 ml-3"
                    />
                    <button onClick={handleAddClick} className="ml-3 p-1 w-8 text-lg rounded-md border border-slate-50">&#10133;</button>
                </div>
                {expenseSheet.expenses.map((expense) => (
                    <div className="flex items-center" key={expense?.purchaserId}>
                        <button
                            className="text-white rounded-md text-xl"
                            onClick={() => handleDeleteClick(String(expense?.purchaserId))}
                        >
                            ❌
                        </button>
                        <h3 className="text-white border border-slate-50 m-4 rounded-md text-center w-60 h-8">
                            {expense?.item} (${expense?.cost})
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    )
}
