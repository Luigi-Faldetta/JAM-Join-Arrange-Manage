import ToDo from "../models/associations"
import { Response, Request, NextFunction } from "express";

export const postTodo = async (req: Request, res: Response) => {
    try {
        const { title, isDone, creatorId, eventId } =
        req.body;
        const newtodo = await ToDo.create(title, isDone, creatorId, eventId);
        res.status(201).json({
            success: true,
            data: newtodo,
            message: "newtodo created",
          });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }

}
export const getToDO = async function (req: Request, res: Response, next: NextFunction) {
    try {
      let todos = await ToDo.findAll({ where: { id: req.params.id } });
      if (!todos) {
        res.status(404).json({
          success: false,
          data: null,
          message: "Activities not found.",
        });
        return next();
      } 
  
      res.status(200).json(todos);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };

  export const deleteToDO = async function (req: Request, res: Response,) {
    try {
      const id = req.params.id;
      if (!id)
        res.status(400).json({
          success: false,
          data: id,
          message: "wrong id",
        });
      let todo = await ToDo.destroy({ where: { id: id } });
      res.status(201).json({
        success: true,
        data: todo,
        message: "todo deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  export const updateToDo = async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, isDone, creatorId, eventId } = req.body;
      let todo = await ToDo.findByPk(id);
      if (!todo) {
        res.status(404).json({
          success: false,
          data: null,
          message: 'ToDo item not found.',
        });
        return next();
      }
  
      todo.title = title || todo.title;
      todo.creatorId = creatorId || todo.creatorId;
      todo.eventId = eventId || todo.eventId
      todo.isDone = isDone ?? todo.isDone;
      await todo.save();
  
      res.status(200).json({
        success: true,
        data: todo,
        message: 'ToDo item updated successfully.',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };