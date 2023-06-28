import bcrypt from 'bcrypt';
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

  const inputPassword = password;

  try {
    const hash = await bcrypt.hash(inputPassword, 10)
    const user = await User.create({ ...req.body, password: hash });

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

    if (!user) {
      return res.status(409)
        .send({ error: "409", message: "No user found" })
    }

    // @ts-ignore
    const { password, ...safeUser } = { ...user.dataValues }

    res.status(200).json({
      success: true,
      data: safeUser,
      message: "User fetched",
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Needs req.params.userid
// Needs body with the changes 
export const editUser = async (req: Request, res: Response) => {
  try {
    let updatedUser = {}

    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10)
      updatedUser = await User.update({ ...req.body, password: hash }, { where: { userId: req.params.userid }, returning: true })
    } else {
      updatedUser = await User.update(req.body, { where: { userId: req.params.userid }, returning: true })
    }

    // @ts-ignore
    const { password, ...safeUpdatedUser } = { ...updatedUser[1][0].dataValues }
    res.status(200).json({
      success: true,
      data: safeUpdatedUser,
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
    console.error(err);
    res.status(400).send({ message: err.message });
  }
};

// Needs req.params.eventid
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userIds = await UserEvents.findAll({
      where: { eventId: req.params.eventid }
    });
    if (userIds.length) {
      const usersArray = [];
      for (const user of userIds) {
        usersArray.push(user.dataValues.userId);
      }

      const users = await User.findAll({ where: { userId: usersArray } });
      res.status(200).json({
        success: true,
        data: users,
        message: 'Event users fetched',
      });
    } else {
      throw new Error("No users where found");
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export default { newUser, getUser, editUser, deleteUser, getAllUsers };
