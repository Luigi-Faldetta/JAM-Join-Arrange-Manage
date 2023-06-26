import routes from 'express';
import './models/modelDB'
const router = routes.Router();

import { user, event, todo, expense } from './controllers/index'

// User
router.post('/register', () => { })
router.get('/user/:id', () => { })
router.patch('/user/:id', () => { })
router.delete('/user/:id', () => { })
router.get('/users/:eventid', () => { })

// Event
router.post('/newevent', event.newEvent)
router.get('/event/:id', event.getEvent)
router.patch('/event/:id', event.updateEvent)
router.delete('/event/:id', event.deleteEvent)
router.get('/events/:userid', event.getUserEvents)

// Todo
router.post('/todo', () => { })
router.patch('/todo/:id', () => { })
router.delete('/todo/:id', () => { })
router.get('/todos/:eventid', () => { })

// Expense
router.post('/expense', expense.newExpense)
router.delete('/expense/:id', expense.deleteExpense)
router.get('/expenses/:eventid', expense.getExpenses)

// Else
router.get('/*', () => { console.log('URL not found') })

export default router;