import { User, UserEvents } from "../models/associations";
import { Request, Response } from "express";

// Needs body like {"name": "email", "password"}
const postUser = async (req: Request, res: Response) => {
  if (!req.body.email)
    return res
      .status(409)
      .send({ error: "409", message: "Missing input email" });

  if (!req.body.password)
    return res
      .status(409)
      .send({ error: "409", message: "Missing input password" });

  const { password, email } = req.body;

  const user = await User.findOne({ where: { email: email } });
  if (user)
    return res
      .status(409)
      .send({ error: "409", message: "User already exists" });

  try {
    const user = await User.create({ ...req.body });
    //TODO:we need to send back "safe user" instead of sending the user object

    res.status(201).json({
      success: true,
      data: user,
      message: "User created",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Needs req.params.userId*
const getUserInfo = async (req: Request, res: Response) => {
  console.log(req.params);
  try {
    let user = await User.findOne({ where: { userId: req.params.id } });
    if (user) {
      //TODO:we need to send back "safe user" instead of sending the user object
      res.status(200).json(user);
    }
  } catch (err: any) {
    console.error(err);
    res.status(400).send({ error: "400", message: "Bad user request" });
  }
};
// Needs req.params.eventId*
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userIds = await UserEvents.findAll({
      where: { eventId: req.params.eventid },
    });
    // console.log(userIds)
    if (userIds) {
      const usersArray = [];
      for (const user of userIds) {
        usersArray.push(user.dataValues.userId);
      }

      const users = await User.findAll({ where: { userId: usersArray } });
      res.status(200).json(users);
    } else {
      throw "No users where found";
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Needs req.params.userId*
//needs body with info
export const editUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const info = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({
        success: false,
        data: null,
        message: "User not found.",
      });
      return;
    }

    let userUpdated = {};

    if (info.password) {
      userUpdated = await user.update({ ...info });
    } else {
      userUpdated = await user.update(info);
    }

    res.status(200).json(userUpdated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Needs req.params.userId*
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id)
      res.status(400).json({
        success: false,
        data: id,
        message: "wrong id",
      });
    let user = await User.destroy({ where: { id: id } });
    res.json(user);
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
export default { postUser, getUserInfo, editUser, getAllUsers, deleteUser };
