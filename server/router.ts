import routes from 'express';
import './models/modelDB'
const router = routes.Router();

import { user, event, todo, expense } from './controllers/index'

// User
router.post('/register', user.postUser)
router.get('/user/:id', user.getUserInfo)
router.patch('/user/:id', user.editUser)
router.delete('/user/:id', user.deleteUser)
router.get('/users/:eventid', user.getAllUsers)

// Event
router.post('/newevent', event.newEvent)
router.get('/event/:eventid', event.getEvent)
router.patch('/event/:eventid', event.updateEvent)
router.delete('/event/:eventid', event.deleteEvent)
router.get('/events/:userid', event.getUserEvents)

// Todo
router.post('/todo', todo.postToDo)
router.patch('/todo/:id', todo.getToDo)
router.delete('/todo/:id', todo.deleteToDo)
router.get('/todos/:eventid', todo.updateToDo)

// Expense
router.post('/expense', expense.newExpense)
router.delete('/expense/:id', expense.deleteExpense)
router.get('/expenses/:eventid', expense.getExpenses)

export default router;