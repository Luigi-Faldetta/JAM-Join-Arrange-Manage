import routes from 'express';
const router = routes.Router();

// User
router.post('/register', () => { })
router.get('/user/:id', () => { })
router.patch('/user/:id', () => { })
router.delete('/user/:id', () => { })
router.get('/users/:eventid', () => { })

// Event
router.post('/newevent', () => { })
router.get('/event/:id', () => { })
router.patch('/event/:id', () => { })
router.delete('/event/:id', () => { })
router.get('/events/:userid', () => { })

// Todo
router.post('/todo', () => { })
router.patch('/todo/:id', () => { })
router.delete('/todo/:id', () => { })
router.get('/todos/:eventid', () => { })

// Expense
router.post('/expense', () => { })
router.delete('/expense/:id', () => { })
router.get('/expenses/:eventid', () => { })

// Else
router.get('/*', () => { console.log('Not found')})

export default router;