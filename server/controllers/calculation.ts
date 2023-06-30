import { Request, Response } from 'express';
import Expense from '../models/expense';
import User from '../models/user';
import UserEvent from '../models/userEvent';
import { BeExpense, BeUser, IndExpense } from '../utils';
// const expenseList:{item:string, cost:number, purchaser:string}[] =[{item:"thing", cost:1234, purchaser:"al"}, {item:"pickle", cost: 234, purchaser:"bob"}, {item:"drinks", cost:23, purchaser: "al"}]
// const userList: string[] = ['al', 'bob', 'jenny from the block']

// Comment
const splitEqual = async (req: Request, res: Response) => {
try {
    /**
     * gets a list of expenses associated with the event.
     */
    const expenseList = await Expense.findAll(
        { where: { eventId: req.params.eventid } })

    
    /**
     * gets an array of user id's
     */
    const userIds = await UserEvent.findAll({
        where: { eventId: req.params.eventid }
        }); 
    
    /**
     * takes the array of user Id's to find the users themselves, we need these for their names.
     */
    const userList = await User.findAll({
            where: {userId: userIds}
        })


    const totalExpenses:number = expenseList.reduce((total:number, expense) => total += expense.cost,0)
   
    //this will be changed with a future update to be calculated based on whether the person is included in the 
    //future "splitBetween" property that will be on individual expenses.
    const perPerson:number = totalExpenses/userList.length;
   
    //gets a list of the total expenses paid for by each individual
    let indExpenses:IndExpense[] = []
    userList.forEach(user =>{
        const myExpenses = expenseList.filter(expense => expense.purchaserId == user.userId)
        const myTotalSpent = myExpenses.reduce((total, expense) => total += expense.cost,0)
        indExpenses.push({name:user, owes: perPerson - myTotalSpent})
    })

    //calculate the best way 

    res.status(200).json({
        expenses: expenseList,
        attendees: userList,
        total: totalExpenses,
        perPerson,
        indExpenses,
    })

} catch (error) {
    console.log(error)
}

}

export default { splitEqual }