import { Response, Request } from "express";
import Todo from "../models/todo"

// Needs body with {"title", "isDone", "creatorId", "eventId"} 
const newToDo = async (req: Request, res: Response) => {

  try {
    const newTodo = await Todo.create(req.body);
    res.status(201)
      .json({
        success: true,
        error: null,
        data: newTodo,
        message: "Todo created",
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json({ message: err.message });
  }
}

// Needs req.params.todoid
// Needs body with info
const updateToDo = async function (req: Request, res: Response) {

  try {
    const updatedTodo = await Todo.update(req.body,
      {
        where: { id: req.params.todoid },
        returning: true
      })
    res.status(200)
      .json({
        success: true,
        error: null,
        data: updatedTodo[1][0],
        message: 'Todo updated',
      });

  } catch (error: any) {
    process.env.NODE_ENV !== 'test' && console.error(error);
    res.status(500)
      .json({ message: error.message });
  }
};

// Needs req.params.todoid
const deleteToDo = async function (req: Request, res: Response,) {

  try {
    const todoExists = await Todo.findOne({ where: { id: req.params.todoid } })
    if (!todoExists) {
      return res.status(400)
        .json({
          success: false,
          error: 400,
          data: null,
          message: "Wrong todo id",
        });
    }

    let todo = await Todo.destroy(
      { where: { id: req.params.todoid } });

    res.status(201)
      .json({
        success: true,
        error: null,
        data: todo,
        message: "Todo deleted",
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(400)
      .json(err.message);
  }
};

// Needs req.params.eventid
const getToDos = async function (req: Request, res: Response) {

  try {
    const todos = await Todo.findAll(
      { where: { eventId: req.params.eventid } });

    if (todos.length) {
      res.status(200)
        .json({
          success: true,
          error: null,
          data: todos,
          message: 'Expenses fetched',
        });

    } else {
      throw new Error("No todos were found");
    }

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json({ message: err.message });
  }
};

export default { newToDo, updateToDo, deleteToDo, getToDos }