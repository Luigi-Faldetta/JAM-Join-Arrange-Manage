import { useEffect, useState } from "react";
import { useGetExpensesQuery } from "../../services/ThesisDB";
import { ExpenseState } from "../../reduxFiles/slices/expenses";
import { useAddExpenseMutation } from "../../services/ThesisDB";
import { useParams } from "react-router-dom";

interface Expense {
    item: string;
    cost: string;
    eventId: string;
    id?: string;
}

export default function Expenses() {
    const { eventid } = useParams();
    const [expenses, setExpenses] = useState<ExpenseState[]>([]);
    const [newExpense, setNewExpense] = useState<ExpenseState>({ item: "", cost: "", eventId: "", id: "" });
    const [total, setTotal] = useState<number>(0);
    const purchaserId = localStorage.getItem('token');


    const { data, error, isLoading } = useGetExpensesQuery(eventid as string);

    useEffect(() => {
        if (data) setExpenses(data.data);
    }, [data]);



    useEffect(() => {
        const calculateTotal = () => {
            const totalPrice = expenses.reduce((accumulator, expense) => {
                return accumulator + Number(expense?.cost || 0);
            }, 0);
            setTotal(totalPrice);
        };
        calculateTotal();
    }, [expenses]);


    const handleAddClick = (e: any) => {
        e.preventDefault();

        console.log(newExpense);

        if (newExpense.item !== "") {
            console.log("HERE")
            const expenseToAdd = {
                item: newExpense.item,
                cost: Number(newExpense.cost),
                eventId: eventid,
                purchaserId: purchaserId,
            };
            console.log(expenseToAdd);
            fetch(`https://codeworks-thesis-4063bceaa74a.herokuapp.com/expense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expenseToAdd),
            })
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData)
                    const createdExpense = responseData.data; // Adjust the property name if needed
                    setExpenses((prevExpenses) => [...prevExpenses, createdExpense]);
                    setNewExpense({ item: "", cost: "", eventId: "", id: "" });
                })
                .catch((error) => {
                    console.error("Error creating expense:", error);
                });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'cost' && value === '0') {
            setNewExpense((prevExpense) => ({
                ...prevExpense,
                [name]: '',
            }));
        } else {
            setNewExpense((prevExpense) => ({
                ...prevExpense,
                [name]: value,
            }));
        }
    };



    const handleDeleteClick = (expenseId: string) => {
        fetch(`https://codeworks-thesis-4063bceaa74a.herokuapp.com/expense/${expenseId}`, {
            method: "DELETE"
        })
            .then((response) => {
                console.log(expenseId)
                console.log(response)
                if (response.ok) {
                    setExpenses((prevExpenses) => {
                        return prevExpenses.filter((expense) => String(expense.id) !== expenseId);
                    });
                } else {
                    console.error("Failed to delete expense:", response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error deleting expense:", error);
            });
    };





    return (
        <div className="flex justify-center gap-4">
            <div className="w-1/2 h-96 p-4 bg-indigo-950 rounded-xl flex flex-col">
                <h1 className="text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white">EXPENSES (Total: €{total})</h1>

                <div className="w-full">

                    {expenses.map((expense) => (
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
                        <form onSubmit={handleAddClick} className="flex p-1 pt-3 ">
                            <input
                                name="item"
                                value={newExpense.item}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Add expense"
                                className="ml-4 w-full h-10 border-0 border-b border-gray-400 bg-indigo-950"
                            />
                            <input
                                name="cost"
                                value={newExpense.cost}
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
                <h1 className="text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white">BALANCE</h1>

            </div>

        </div>
    )
}
