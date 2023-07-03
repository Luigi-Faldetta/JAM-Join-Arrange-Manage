import { useEffect, useState } from "react";
import { useGetExpensesQuery } from "../../services/ThesisDB";
import { ExpenseState } from "../../reduxFiles/slices/expenses";
import { useAddExpenseMutation } from "../../services/ThesisDB";

interface Expense {
    item: string;
    cost: string;
    eventId: string;
    id?: string;
}


const eventId = "d2913de4-1ef3-4f3a-b885-9e2a8120611b";
const purchaserId = "ddad6a7d-d18c-4fd4-96b3-e6814cd3a3e7";



export default function Expenses() {
    const [expenses, setExpenses] = useState<ExpenseState[]>([]);
    const [newExpense, setNewExpense] = useState<ExpenseState>({ item: "", cost: "", eventId: "", id: "" });
    const [total, setTotal] = useState<number>(0);


    const { data, error, isLoading } = useGetExpensesQuery(eventId);
    console.log(data);

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


    const handleAddClick = () => {
        console.log(newExpense);

        if (newExpense.item !== "") {
            console.log("HERE")
            const expenseToAdd = {
                item: newExpense.item,
                cost: Number(newExpense.cost),
                eventId: eventId,
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
        <div className="flex justify-center">
            <div className="w-4/5 mx-20 relative bg-blue-500 rounded-lg flex flex-col items-center mt-36 h-[460px]">
                <h1 className="p-6 text-2xl text-white">Expenses</h1>
                <div className="absolute top-6 right-6 text-2xl text-red-600">Total: ${total}</div>
                <div className="flex items-center" key={newExpense.id}>
                    <input
                        name="item"
                        value={newExpense.item}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Expense item"
                        className="w-40 h-10"
                    />
                    <input
                        name="cost"
                        value={newExpense.cost}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="0"
                        className="w-20 h-10 ml-3"
                    />
                    <button onClick={handleAddClick} className="ml-3 p-1 w-8 text-lg rounded-md border border-slate-50">&#10133;</button>
                </div>
                {expenses.map((expense) => (
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
