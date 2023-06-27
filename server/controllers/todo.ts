import { request } from "http";
import Todo from "../models/todo"
import { Response, Request, NextFunction } from "express";
import UserEvents from "../models/userEvent";
//needs req.body {title, isDone, creatorId, eventId}
const postToDo = async (req: Request, res: Response) => {
    try {
        const newtodo = await Todo.create({...req.body});
        res.status(201).json({
            success: true,
            data: newtodo,
            message: "newtodo created",
          });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

}
// Needs req.params.eventId*
const getToDos = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const todosIds = await UserEvents.findAll({
      where: { eventId: req.params.eventid },
    });
    if (todosIds) {
      const todosArray = [];
      for (const todo of todosIds) {
        todosArray.push(todo.dataValues.todoId);
      }
      const users = await Todo.findAll({ where: { userId: todosArray } });
      res.status(200).json(users);
    } else {
      throw "No users where found";
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
  };
// Needs req.params.todoId*
const deleteToDo = async function (req: Request, res: Response,) {
    try {
      const id = req.params.id;
      if (!id)
        res.status(400).json({
          success: false,
          data: id,
          message: "wrong id",
        });
      let todo = await Todo.destroy({ where: { id: id } });
      res.status(201).json({
        success: true,
        data: todo,
        message: "todo deleted",
      });
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
// Needs req.params.todoId*
//needs body with info
const updateToDo = async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const info = req.body;
      let todo = await Todo.findByPk(id);
      if (!todo) {
        res.status(404).json({
          success: false,
          data: null,
          message: 'ToDo item not found.',
        });
        return next();
      }
      let todoUpdated = {}
      todoUpdated = await todo.update(info);
  
      res.status(200).json({
        success: true,
        data: todoUpdated,
        message: 'ToDo item updated successfully.',
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  export default {postToDo, getToDos, deleteToDo, updateToDo}