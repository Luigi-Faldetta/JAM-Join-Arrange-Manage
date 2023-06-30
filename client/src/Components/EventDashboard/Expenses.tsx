import { useEffect, useState } from "react";

interface Expense {
    item: string;
    cost: number;
    eventId: string;
    id: string;
}

const eventId = "0db2d486-6f41-4833-9856-8ea7c94fae6c";
const purchaserId = "57cb0816-b2f3-43f2-86d4-71cfa16ad6ad";



export default function Expenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [newExpense, setNewExpense] = useState<Expense>({ item: "", cost: 0, eventId: "", id: "" });
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        fetch(`https://codeworks-thesis-4063bceaa74a.herokuapp.com/expenses/${eventId}`)
            .then((response) => {
                console.log(response)
                return response.json()
            })
            .then((fetchedExpenses) => {
                console.log(fetchedExpenses);
                setExpenses(fetchedExpenses.data);
            })
            .catch((error) => {
                console.error('Error fetching expenses:', error);
            });
    }, []);

    useEffect(() => {
        const calculateTotal = () => {
            const totalPrice = expenses.reduce((accumulator, expense) => {
                return accumulator + expense.cost;
            }, 0);
            setTotal(totalPrice);
        };
        calculateTotal();
    }, [expenses]);


    const handleAddClick = () => {
        if (newExpense.item.trim() !== "") {
            const expenseToAdd = {
                item: newExpense.item,
                cost: newExpense.cost,
                purchaserId: purchaserId,
                eventId: eventId,
                // id: newExpense.id
            };

            console.log(newExpense);

            fetch(`https://codeworks-thesis-4063bceaa74a.herokuapp.com/expense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expenseToAdd),
            })
                .then((response) => response.json())
                .then((createdExpense) => {
                    setExpenses((prevExpenses) => [...prevExpenses, createdExpense]);
                    setNewExpense({ item: "", cost: 0, eventId: "", id: "" });
                })
                .catch((error) => {
                    console.error("Error creating expense:", error);
                });
        }
    };



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewExpense((prevExpense) => ({
            ...prevExpense,
            [name]: value
        }));
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
                        return prevExpenses.filter((expense) => expense.id !== expenseId);
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
                        placeholder="cost"
                        className="w-20 h-10 ml-3"
                    />
                    <button onClick={handleAddClick} className="ml-3 p-1 w-8 text-lg rounded-md border border-slate-50">&#10133;</button>
                </div>
                {expenses.map((expense) => (
                    <div className="flex items-center" key={expense.id}>
                        <button
                            className="text-white rounded-md text-xl"
                            onClick={() => handleDeleteClick(expense.id)}
                        >
                            ❌
                        </button>
                        <h3 className="text-white border border-slate-50 m-4 rounded-md text-center w-60 h-8">
                            {expense.item} (${expense.cost})
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    )
}