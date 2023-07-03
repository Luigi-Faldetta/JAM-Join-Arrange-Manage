import { Response, Request } from "express";
import { resBody } from '../utils'
import Todo from "../models/todo"

/**
 * @param req needs body with at least {"title", "isDone", "creatorId", "eventId"} 
 */
const newToDo = async (req: Request, res: Response) => {

  try {
    const newTodo = await Todo.create(req.body);
    res.status(201)
      .json(resBody(true, null, newTodo, "Todo created"));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
}

/**
 * @param req needs req.params.todoid and body with updated info {"title", "isDone"} 
 */
const updateToDo = async function (req: Request, res: Response) {

  try {
    const updatedTodo = await Todo.update(req.body,
      {
        where: { id: req.params.todoid },
        returning: true
      })
    res.status(200)
      .json(resBody(true, null, updatedTodo[1][0], 'Todo updated'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
};

/**
 * @param req needs req.params.todoid
 */
const deleteToDo = async function (req: Request, res: Response,) {

  try {
    const todoExists = await Todo.findOne({ where: { id: req.params.todoid } })
    if (!todoExists) {
      return res.status(400)
        .json(resBody(false, '400', null, "Wrong todo id"));
    }

    let todo = await Todo.destroy(
      { where: { id: req.params.todoid } });

    res.status(201)
      .json(resBody(true, null, todo, "Todo deleted"));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(400)
      .json(resBody(false, null, null, err.message));
  }
};

/**
 * @param req needs req.params.eventid
 */
const getToDos = async function (req: Request, res: Response) {

  try {
    const todos = await Todo.findAll(
      { where: { eventId: req.params.eventid } });

    if (todos.length) {
      res.status(200)
        .json(resBody(true, null, todos, 'Expenses fetched'));

    } else {
      throw new Error("No todos were found");
    }

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
};

export default { newToDo, updateToDo, deleteToDo, getToDos }