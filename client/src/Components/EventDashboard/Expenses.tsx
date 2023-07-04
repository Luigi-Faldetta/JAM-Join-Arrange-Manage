import { useEffect, useState } from "react";
import { ExpenseState } from "../../reduxFiles/slices/expenses";
import { useAddExpenseMutation, useCalculateExpensesQuery, useDeleteExpenseMutation } from "../../services/ThesisDB";
import { useParams } from "react-router-dom";
import { ExpenseSheet } from "../../reduxFiles/slices/expenseSheet";
import store, { useAppDispatch } from "../../reduxFiles/store";
import { createExpenseSheet, expenseSheetReducer } from "../../reduxFiles/slices/expenseSheet";




export default function Expenses() {
    const { eventid } = useParams();
    const purchaserId = localStorage.getItem("token")
    const [deleteExpense] = useDeleteExpenseMutation()
    const [addExpense] = useAddExpenseMutation()

    const [expenseSheet, setExpenseSheet] = useState<ExpenseSheet>({
        expenses:[],
        attendees:[],
        total:0,
        perPerson:0,
        indExpenses:[]
    });

    //it might be easier if we can make the use state type ExpenseState, but for now I needed it to work.
    const [newExpenseForm, setNewExpenseForm] = useState<{item:string, cost:string, eventId:string, id:string}>({ item: "", cost: "", eventId: "", id: "" });
    //is below necessary? cant it just be sent to the BE and we append the response to the array above?
    // const [total, setTotal] = useState<number>(0);


    
    const { data, error, isLoading } = useCalculateExpensesQuery(eventid as string);
    useEffect(() => {
        if (data) {
            setExpenseSheet(data.data);
        }
    }, [expenseSheet.expenses, expenseSheet.attendees]);



    // useEffect(() => {
    //     const calculateTotal = () => {
    //         const totalPrice = expenses.reduce((accumulator, expense) => {
    //             return accumulator + Number(expense?.cost || 0);
    //         }, 0);
    //         setTotal(totalPrice);
    //     };
    //     calculateTotal();
    // }, [expenses]);


    const handleAddClick = async () => {
        console.log(newExpenseForm);

        if (newExpenseForm.item !== "") {
            const expenseToAdd = {
                item: newExpenseForm.item,
                cost: +newExpenseForm.cost,
                eventId: eventid as string,
                purchaserId: purchaserId,
            };
            await addExpense(expenseToAdd as ExpenseState)
            const {data, error, isLoading} = useCalculateExpensesQuery(eventid as string);
            if(error) console.log(error)
            if(isLoading) {
                while(isLoading){}
            }
            if(data) setExpenseSheet(data.data);
            // fetch(`https://codeworks-thesis-4063bceaa74a.herokuapp.com/expense`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(expenseToAdd),
            // })
            //     .then((response) => response.json())
            //     .then((responseData) => {
            //         console.log(responseData)
            //         const createdExpense = responseData.data; // Adjust the property name if needed
            //         setExpenses((prevExpenses) => [...prevExpenses, createdExpense]);
            //         setNewExpense({ item: "", cost: "", eventId: "", id: "" });
            //     })
            //     .catch((error) => {
            //         console.error("Error creating expense:", error);
            //     });
        }
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
        await deleteExpense(expenseId);
        const {data, error, isLoading} = useCalculateExpensesQuery(eventid as string);
        if(error) return error;
        while(isLoading){

        };
        if (data) setExpenseSheet(data.data)
        // fetch(`https://codeworks-thesis-4063bceaa74a.herokuapp.com/expense/${expenseId}`, {
        //     method: "DELETE"
        // })
        //     .then((response) => {
        //         console.log(expenseId)
        //         console.log(response)
        //         if (response.ok) {
        //             setExpenses((prevExpenses) => {
        //                 return prevExpenses.filter((expense) => String(expense.id) !== expenseId);
        //             });
        //         } else {
        //             console.error("Failed to delete expense:", response.statusText);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error("Error deleting expense:", error);
        //     });
    };





    return (
        <div className="flex justify-center">
            <div className="w-4/5 mx-20 relative bg-blue-500 rounded-lg flex flex-col items-center mt-36 h-[460px]">
                <h1 className="p-6 text-2xl text-white">Expenses</h1>
                <div className="absolute top-6 right-6 text-2xl text-red-600">Total: ${data?.data.total}</div>
                <div className="flex items-center" key={newExpenseForm.id}>
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
                    <div className="flex items-center" key={expense?.id}>
                        <button
                            className="text-white rounded-md text-xl"
                            onClick={() => handleDeleteClick(String(expense?.id))}
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
