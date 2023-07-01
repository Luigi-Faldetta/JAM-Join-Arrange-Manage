import { Request, Response } from 'express';
import Expense from '../models/expense';
import User from '../models/user';
import UserEvent from '../models/userEvent';
import { BeUser, IndExpense } from '../utils';

const expenseSheet = async (req: Request, res: Response) => {

try {
    /**
     * gets a list of expenses associated with the event.
     */
    const expenseList = await Expense.findAll(
        { where: { eventId: req.params.eventid } })
    
    /**
     * gets an array of user id's
     */
    const userEventAssociations = await UserEvent.findAll({
        where: { eventId: req.params.eventid }
        }); 
    const userIds:string[] = userEventAssociations.map(association => association.userId);
    
    /**
     * takes the array of user Id's to find the users themselves, we need these for their names.
     */
    const userList = await User.findAll({
            where: {userId: userIds}
        })
    
    /**
     * calculate total of all expenses
     */
    const totalExpenses:number = expenseList.reduce((total:number, expense) => total += expense.cost,0)
   
    /**
     * calculate how much each individual owes of the total
     * this will be changed with a future update to be calculated based on whether the person is included in the 
     * future "splitBetween" property that will be on individual expenses.
     */
    const perPerson:number = Math.round((totalExpenses/userList.length)*100)/100;
   
    //gets a list of the total expenses paid for by each individual
    let indExpenses:IndExpense[] = []
    userList.forEach(user =>{
        const myExpenses = expenseList.filter(expense => expense.purchaserId == user.userId)
        const myTotalSpent = myExpenses.reduce((total, expense) => total += expense.cost,0)
        //cleaner way to do this for sure.
        indExpenses.push({name:user.name, owes: Math.round((perPerson-myTotalSpent)*100)/100})
    })


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

export default { expenseSheet }