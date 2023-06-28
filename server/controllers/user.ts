import { Request, Response } from "express";
import { User, UserEvents } from "../models/associations";

// Needs body with at least {"name", "email", "password"}
const newUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(409)
      .send({ error: "409", message: "Missing input data" })
  }

  const user = await User.findOne({ where: { email } });

  if (user)
    return res.status(409)
      .send({ error: "409", message: "User already exists" });

  try {
    const user = await User.create(req.body);

    // @ts-ignore
    const { password, ...safeUser } = { ...user.dataValues }

    res.status(201).json({
      success: true,
      data: safeUser,
      message: "User created",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Needs req.params.userid
const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: { userId: req.params.userid } 
    });

    // if (!user) {
    //   return res.status(409).send({ error: "409", message: "No user found" })
    // }

    // @ts-ignore
    const { password, ...safeUser } = { ...user.dataValues }

    res.status(200).json({
      success: true,
      data: safeUser,
      message: "User fetched",
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).send({ error: "400", message: "Bad user request" });
  }
};


// Needs req.params.userid
// Needs body with info
export const editUser = async (req: Request, res: Response) => {
  const id = req.params.userid;
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

    res.status(200).json({
      success: true,
      data: userUpdated,
      message: "User updated",
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Needs req.params.userid
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.destroy({ where: { userId: req.params.userid } })
    res.status(200).json({
      success: true,
      data: deletedUser,
      message: 'User deleted',
    });

  } catch (err: any) {
    console.log(err);
    res.status(400).send({ error: "400", message: "Bad user request" });
  }
};

// Needs req.params.eventid
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

export default { newUser, getUser, editUser, deleteUser, getAllUsers };
