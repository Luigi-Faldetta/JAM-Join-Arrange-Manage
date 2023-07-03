import { Request, Response } from 'express';
import { resBody } from '../utils'
import Expense from '../models/expense'

// Needs body with {"item", "cost", "purchaserId", "eventId" }
const newExpense = async (req: Request, res: Response) => {

  try {
    const expense = await Expense.create(req.body)
    res.status(201)
      .json(resBody(true, null, expense, 'Expense created'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
}

// Needs req.params.expenseid
const deleteExpense = async (req: Request, res: Response) => {

  try {
    const deletedExpense = await Expense.destroy(
      { where: { id: req.params.expenseid } })

    res.status(201)
      .json(resBody(true, null, deletedExpense, 'Expense deleted'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
}

// Needs req.params.eventid
const getExpenses = async (req: Request, res: Response) => {

  try {
    const expenses = await Expense.findAll(
      { where: { eventId: req.params.eventid } })

    if (expenses.length) {
      res.status(200)
        .json(resBody(true, null, expenses, 'Expenses fetched'));

    } else {
      throw new Error("No expenses were found");
    }

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
}

export default { newExpense, deleteExpense, getExpenses }