import { useEffect, useState } from 'react';
import { ExpenseState } from '../../reduxFiles/slices/expenses';
import {
  fetchExpenseSheet,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
} from '../../services/JamDB';
import { useParams } from 'react-router-dom';
import { ApiResponse, ExpenseSheet } from '../../services/ApiResponseType';

/**
 *
 * WE NEED TO ADD AN ID PARAMETER TO THE INDEXPENSES ARRAY HERE AND IN BACK END CALCULATIONS CONTROLLER
 * WITH THE USER ID SO WE CAN PROPERLY MAP IT IN THE TSX BELOW.  CURRENTLY USING THE NAME PARAMETER AS A
 * QUICKFIX
 *
 */

export default function Expenses() {
  const { eventid } = useParams();
  const purchaserId = localStorage.getItem('token');
  const [deleteApiExpense] = useDeleteExpenseMutation();
  const [addApiExpense] = useAddExpenseMutation();
  const [expenseSheet, setExpenseSheet] = useState<ExpenseSheet>({
    expenses: [],
    attendees: [],
    total: 0,
    perPerson: 0,
    indExpenses: [],
  });

  //it might be easier if we can make the use state type ExpenseState, but for now I needed it to work.
  const [newExpenseForm, setNewExpenseForm] = useState<{
    item: string;
    cost: string;
    eventId: string;
    purchaserId: string;
  }>({ item: '', cost: '', eventId: '', purchaserId: '' });

  useEffect(() => {
    fetchExpenseSheet(eventid as string)
      .then((response) => response.json())
      .then((response: ApiResponse<ExpenseSheet>) => {
        setExpenseSheet(response.data);
      });
  }, []);

  const handleAddClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newExpenseForm.item !== '') {
      const expenseToAdd: ExpenseState = {
        item: newExpenseForm.item,
        cost: +newExpenseForm.cost,
        eventId: eventid as string,
        purchaserId: purchaserId as string,
      };
      await addApiExpense(expenseToAdd);
      fetchExpenseSheet(eventid as string)
        .then((response) => response.json())
        .then((response: ApiResponse<ExpenseSheet>) => {
          setExpenseSheet(response.data);
        });
    }
    setNewExpenseForm({ item: '', cost: '', eventId: '', purchaserId: '' });
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
    fetchExpenseSheet(eventid as string)
      .then((response) => response.json())
      .then((response: ApiResponse<ExpenseSheet>) => {
        setExpenseSheet(response.data);
      });
  };

  return (
    <div className='flex flex-col lg:flex-row justify-center gap-4'>
      <div className='lg:w-1/2 h-96 p-4 bg-gradient-to-r from-indigo-950 to-indigo-900 border-2 border-indigo-950 rounded-xl flex flex-col'>
        <h1 className='text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white'>
          EXPENSES (Total: €{expenseSheet.total})
        </h1>

        <div className='w-full flex-grow flex flex-col overflow-y-auto'>
          <div className='w-full flex-grow  flex flex-col overflow-y-auto'>
            {expenseSheet.expenses.map((expense) => (
              <div
                className='flex p-2 border-t border-gray-400 text-white text-xl'
                key={expense?.id}
              >
                <button
                  className='w-10 text-gray-400'
                  onClick={() => handleDeleteClick(String(expense?.id))}
                >
                  X
                </button>
                <h3 className='w-full'>
                  {expense?.item} ( €{expense?.cost} )
                </h3>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => handleAddClick(e)}
            className='text-white flex p-1 pt-3 sticky bottom-0'
          >
            <input
              name='item'
              value={newExpenseForm.item}
              onChange={handleInputChange}
              type='text'
              placeholder='Add expense'
              className='ml-4 w-4/5 h-10 border-0 border-b border-gray-400 bg-indigo-950'
            />
            <input
              name='cost'
              value={newExpenseForm.cost}
              onChange={handleInputChange}
              type='number'
              placeholder='€'
              className='money ml-2 w-1/6 h-10 border-0 border-b border-gray-400 bg-indigo-950'
            />
            <button
              id='add-expense'
              type='submit'
              className='w-10 ml-2 font-bold rounded-full border border-gray-400 flex items-center justify-center'
            >
              +
            </button>
          </form>
        </div>
      </div>

      <div className='lg:w-1/2 h-96 p-4 bg-gradient-to-r from-indigo-900 to-indigo-950 border-2 border-indigo-950 rounded-xl flex flex-col'>
        <h1 className='text-2xl pb-3 text-pink-500 font-bold text-center border-b-4 border-white'>
          PER PERSON SHARE (€{(expenseSheet.perPerson).toFixed(2)})
        </h1>
        <div className='w-full flex-grow  flex flex-col overflow-y-auto'>
          {expenseSheet.indExpenses.map((indExpense) => (
            <div
              className='flex p-2 border-t border-gray-400 text-white text-xl'
              key={indExpense?.name}
            >
              <h3 className='w-full'>
                {indExpense?.name}{' '}
                {indExpense.owes < 0 ? (
                  <span>
                    is owed{' '}
                    <span className='text-green-500'>
                      €{(indExpense.owes * -1).toFixed(2)}
                    </span>
                  </span>
                ) : (
                  <span>
                    should pay{' '}
                    <span className='text-red-600'>€{(indExpense?.owes).toFixed(2)}</span>
                  </span>
                )}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
