import { Request, Response } from 'express';
import Expense from '../models/expense'

// Needs a body with {"item": "item", "cost": "20",
// "purchaserId": id, "eventId": id }
const newExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.create(req.body)
    res.status(201).json({
      success: true,
      data: expense,
      message: 'Expense created',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Needs req.params.expenseid
const deleteExpense = async (req: Request, res: Response) => {
  try {
    const deletedExpense = await Expense.destroy({ where: { id: req.params.expenseid } })
    res.status(201).json({
      success: true,
      data: deletedExpense,
      message: 'Expense deleted',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Needs req.params.eventid
const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.findAll({
      where: { eventId: req.params.eventid }
    })
    res.status(201).json({
      success: true,
      data: expenses,
      message: 'Expenses fetched',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export default { newExpense, deleteExpense, getExpenses }