import routes from 'express';
const router = routes.Router();

import './models/modelDB.js';
import {
  user,
  event,
  todo,
  expense,
  userEvent,
  session,
  calculation,
  eventChat,
  email,
  clerkAuth,
  settlement,
} from './controllers/index.js';

// Health check - keeping your original format
router.get('/health', (_req, res) => {
  res.send({ health: 'Server runnning!! =)' });
});

// ============================================================================
// USER ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/register', user.newUser);
router.get('/user/:userid', user.getUser);
router.patch('/user/:userid', user.updateUser);
router.delete('/user/:userid', user.deleteUser);
router.get('/users/:eventid', user.getAllUsers);

// ============================================================================
// EVENT ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/newevent/:userid', event.newEvent); // RESTORED ORIGINAL
router.get('/event/:eventid', event.getEvent);
router.patch('/event/:eventid', event.updateEvent);
router.delete('/event/:eventid', event.deleteEvent);
router.get('/events/:userid', event.getUserEvents); // RESTORED ORIGINAL

// ============================================================================
// TODO ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/todo', todo.newToDo);
router.patch('/todo/:todoid', todo.updateToDo);
router.delete('/todo/:todoid', todo.deleteToDo);
router.get('/todos/:eventid', todo.getToDos);

// ============================================================================
// EXPENSE ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/expense', expense.newExpense);
router.delete('/expense/:expenseid', expense.deleteExpense);
router.get('/expenses/:eventid', expense.getExpenses);

// ============================================================================
// USER EVENT ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/useractivity', userEvent.joinEvent);
router.patch('/useractivity', userEvent.updateEvent);
router.delete('/useractivity', userEvent.leaveEvent);

// ============================================================================
// SESSION ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.post('/userlogin', session.logIn);
router.get('/userlogout', session.logOut);
router.get('/me', session.authorize, session.getUserInfo);
router.post('/auth/clerk-sync', clerkAuth.syncClerkUser);

// ============================================================================
// CALCULATION ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.get('/calculate/:eventid', calculation.expenseSheet);

// ============================================================================
// CHAT ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.get('/chat/:eventid', eventChat.getChat);
router.post('/chat/', eventChat.newMessage);

// ============================================================================
// EMAIL ROUTES - EXACTLY AS ORIGINAL
// ============================================================================
router.get('/passwordreset/:email', email.resetPassword);

// ============================================================================
// SETTLEMENT ROUTES
// ============================================================================
router.post('/settlements/confirm-payment', session.authorize, settlement.confirmPayment);
router.post('/settlements/confirm-receipt', session.authorize, settlement.confirmReceipt);
router.get('/settlements/:eventid', session.authorize, settlement.getEventSettlements);
router.get('/user-settlements/:userid', session.authorize, settlement.getUserSettlements);

export default router;
