import { Request, Response } from 'express';
import Expense from '../models/expense';
import User from '../models/user';
import UserEvent from '../models/userEvent';
import { IndExpense } from '../utils';

//***START OF MOCK DATA */
const eventId= "461bedac-a875-4ea0-b556-98a14338813b";
const expenseSheet = async (req: Request, res: Response) => {

const mockExpenses = [
    {item: "pickle", cost:23, purchaserId:"2", eventId:"461bedac-a875-4ea0-b556-98a14338813b"},
    {item: "art", cost:12, purchaserId:"2", eventId:"461bedac-a875-4ea0-b556-98a14338813b"},
    {item: "b", cost:67, purchaserId:"2", eventId:"461bedac-a875-4ea0-b556-98a14338813b"},
    {item: "tree", cost:24, purchaserId:"3", eventId:"461bedac-a875-4ea0-b556-98a14338813b"},
    {item: "harp", cost:16, purchaserId:"1", eventId:"461bedac-a875-4ea0-b556-98a14338813b"},
    {item: "pickle", cost:23, purchaserId:"2", eventId:"389"},
    {item: "art", cost:12, purchaserId:"5", eventId:"389"},
    {item: "b", cost:67, purchaserId:"4", eventId:"389"},
    {item: "tree", cost:24, purchaserId:"3", eventId:"389"},
    {item: "harp", cost:16, purchaserId:"1", eventId:"389"},
]

const mockAssociationList = [
    {userId: "1", eventId: "461bedac-a875-4ea0-b556-98a14338813b", host:false},
    {userId: "2", eventId: "461bedac-a875-4ea0-b556-98a14338813b", host:true},
    {userId: "3", eventId: "461bedac-a875-4ea0-b556-98a14338813b", host:false},
    {userId: "4", eventId: "461bedac-a875-4ea0-b556-98a14338813b", host:false},
    {userId: "5", eventId: "461bedac-a875-4ea0-b556-98a14338813b", host:false},
    {userId: "5", eventId: "389", host:false},
    {userId: "6", eventId: "389", host:false},
    {userId: "7", eventId: "389", host:true},
    {userId: "8", eventId: "389", host:false},
]

const mockUsersList = [
    {name: "billy", userId: "1"},
    {name: "bob", userId: "2"},
    {name: "jay", userId: "3"},
    {name: "Annie", userId: "4"},
    {name: "Jill", userId: "5"},
    {name: "Hicucp", userId: "6"},
    {name: "why", userId: "7"},
    {name: "lost", userId: "8"},
]
//***END OF MOCK DATA */


try {
    /**
     * gets a list of expenses associated with the event.
     */
    // const expenseList = await Expense.findAll(
    //     { where: { eventId: req.params.eventid } })
    console.log("llama")
    const expenseList = mockExpenses.filter(expense => expense.eventId === req.params.eventId)
    console.log("expenseList: ", expenseList)
    console.log("mockExpenses: ", mockExpenses)

    
    /**
     * gets an array of user id's
     */
    // const userEventAssociations = await UserEvent.findAll({
    //     where: { eventId: req.params.eventid }
    //     }); 
    const userEventAssociations = mockAssociationList.filter(association => association.eventId === req.params.eventId)
    const userIds:string[] = userEventAssociations.map(association => association.userId);
    
    /**
     * takes the array of user Id's to find the users themselves, we need these for their names.
     */
    // const userList = await User.findAll({
    //         where: {userId: userIds}
    //     })
    const userList = mockUsersList.filter(user => userIds.includes(user.userId))

    
    /**
     * calculate total of all expenses
     */
    const totalExpenses:number = expenseList.reduce((total:number, expense) => total += expense.cost,0)
   
    /**
     * calculate how much each individual owes of the total
     * this will be changed with a future update to be calculated based on whether the person is included in the 
     * future "splitBetween" property that will be on individual expenses.
     */
    const perPerson:number = totalExpenses/userList.length;
   
    //gets a list of the total expenses paid for by each individual
    let indExpenses:IndExpense[] = []
    await userList.forEach(user =>{
        const myExpenses = expenseList.filter(expense => expense.purchaserId == user.userId)
        const myTotalSpent = myExpenses.reduce((total, expense) => total += expense.cost,0)
        indExpenses.push({name:user.name, owes: perPerson - myTotalSpent})
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