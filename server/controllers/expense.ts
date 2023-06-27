import { Request, Response } from 'express';
import Expense from '../models/expense'

// It works
// {"item": "item", "cost": "20",
// "purchaserId": id, "eventId": id }
const newExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.create(req.body)
    res.status(201).json(expense);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// It works
// /req.params.id*
const deleteExpense = async (req: Request, res: Response) => {
  try {
    const deletedExpense = await Expense.destroy({ where: { id: req.params.id } })
    res.status(201).json(deletedExpense);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// It works
// /req.params.eventId*
const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.findAll({
      where: { eventId: req.params.eventid }
    })
    res.status(201).json(expenses);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export default { newExpense, deleteExpense, getExpenses }