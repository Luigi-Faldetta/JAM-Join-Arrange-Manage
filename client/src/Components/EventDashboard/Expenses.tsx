import { useEffect, useState } from "react";
import { ExpenseState} from "../../reduxFiles/slices/expenses";
import { fetchExpenseSheet, useAddExpenseMutation, useDeleteExpenseMutation } from "../../services/ThesisDB";
import { useParams } from "react-router-dom";
import { ApiResponse, ExpenseSheet } from "../../services/ApiResponseType";


/**
 * 
 * WE NEED TO ADD AN ID PARAMETER TO THE INDEXPENSES ARRAY HERE AND IN BACK END CALCULATIONS CONTROLLER
 * WITH THE USER ID SO WE CAN PROPERLY MAP IT IN THE TSX BELOW.  CURRENTLY USING THE NAME PARAMETER AS A
 * QUICKFIX
 * 
 */

export default function Expenses() {
    const { eventid } = useParams();
    const purchaserId = localStorage.getItem("token")
    const [deleteApiExpense] = useDeleteExpenseMutation()
    const [addApiExpense] = useAddExpenseMutation()
    const [expenseSheet, setExpenseSheet] = useState<ExpenseSheet>({
        expenses:[],
        attendees:[],
        total:0,
        perPerson:0,
        indExpenses:[]
    });

    //it might be easier if we can make the use state type ExpenseState, but for now I needed it to work.
    const [newExpenseForm, setNewExpenseForm] = useState<{item:string, cost:string, eventId:string, purchaserId:string}>({ item: "", cost: "", eventId: "", purchaserId: "" });


    useEffect(() => {
        fetchExpenseSheet(eventid as string).then(response => response.json()).then( (response: ApiResponse<ExpenseSheet>) => {
           setExpenseSheet(response.data)
        })
    }, []);

    const handleAddClick = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newExpenseForm.item !== "") {
            const expenseToAdd: ExpenseState = {
                item: newExpenseForm.item,
                cost: +newExpenseForm.cost,
                eventId: eventid as string,
                purchaserId: purchaserId as string,
            };
            await addApiExpense(expenseToAdd);
            fetchExpenseSheet(eventid as string).then(response => response.json()).then( (response: ApiResponse<ExpenseSheet>) => {
               setExpenseSheet(response.data)
            })
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
        await deleteApiExpense(expenseId);
        fetchExpenseSheet(eventid as string).then(response => response.json()).then( (response: ApiResponse<ExpenseSheet>) => {
           setExpenseSheet(response.data)
        })
    };





    return (
        <div className="flex justify-center gap-4">
            <div className="w-1/2 h-96 p-4 bg-indigo-950 rounded-xl flex flex-col">
                <h1 className="text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white">EXPENSES (Total: €{expenseSheet.total})</h1>

                <div className="w-full">

                    {expenseSheet.expenses.map((expense) => (
                        <div className="flex p-2 border-t border-gray-400 text-white text-xl" key={expense?.id}>
                            <button
                                className="w-10 text-gray-400"
                                onClick={() => handleDeleteClick(String(expense?.id))}
                            >X</button>

                            <h3 className="w-full">
                                {expense?.item} ( €{expense?.cost} )
                            </h3>
                        </div>
                    ))}

                    <div className="text-white text-xl">
                        <form onSubmit={(e) => handleAddClick(e)} className="flex p-1 pt-3 ">
                            <input
                                name="item"
                                value={newExpenseForm.item}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Add expense"
                                className="ml-4 w-full h-10 border-0 border-b border-gray-400 bg-indigo-950"
                            />
                            <input
                                name="cost"
                                value={newExpenseForm.cost}
                                onChange={handleInputChange}
                                type="number"
                                placeholder="€"
                                className="ml-4 w-1/6 h-10 border-0 border-b border-gray-400 bg-indigo-950"
                            />
                            <button type="submit" className="w-12  font-bold rounded-full border border-gray-400">+</button>
                        </form>
                    </div>

                </div>

            </div>
            <div className="w-1/2 h-96 p-4 bg-indigo-950 rounded-xl flex flex-col">
                <h1 className="text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white">PER PERSON SHARE (€{expenseSheet.perPerson})</h1>
                <div className="w-full">

                    {expenseSheet.indExpenses.map((indExpense) => (
                        <div className="flex p-2 border-t border-gray-400 text-white text-xl" key={indExpense?.name}>
                            <h3 className="w-full">
                                {indExpense?.name} {indExpense.owes<0? ` is owed €${indExpense.owes * -1}`: `needs to pay €${indExpense?.owes}`} 
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
