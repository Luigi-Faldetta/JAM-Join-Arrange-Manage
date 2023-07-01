import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { User, UserEvent } from "../models/associations";

//@ts-ignore
const resBody = (success, error, data, message) => { return { success, error, data, message } }

/**
 * @param req needs body with at least {"name", "email", "password"}
 */
const newUser = async (req: Request, res: Response) => {

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(409)
      .json(resBody(false, "409", null, "Missing input data"))
  }

  const user = await User.findOne({ where: { email } });
  if (user)
    return res.status(409)
      .json(resBody(false, "409", null, "User already exists"));

  const inputPassword = password;

  try {
    const hash = await bcrypt.hash(inputPassword, 10)
    const user = await User.create({ ...req.body, password: hash });
    // @ts-ignore
    const { password, ...safeUser } = { ...user.dataValues }
    res.status(201)
      .json(resBody(true, null, safeUser, "User created"));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, "500", null, err.message));
  }
};


/**
 * @param req needs req.params.userid
 */
const getUser = async (req: Request, res: Response) => {

  try {
    const user = await User.findOne({
      where: { userId: req.params.userid }
    });

    if (!user) {
      return res.status(404)
        .json(resBody(false, "404", null, "No user found"))
    }

    // @ts-ignore
    const { password, ...safeUser } = { ...user.dataValues }
    res.status(200)
      .json(resBody(true, null, safeUser, "User fetched"));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(400)
      .json(resBody(false, "400", null, err.message));
  }
};

/**
 * @param req needs req.params.userid and a body with any change
 */
export const updateUser = async (req: Request, res: Response) => {

  try {
    const userExists = await User.findOne({ where: { userId: req.params.userid } })
    if (!userExists) {
      return res.status(400)
        .json(resBody(false, "400", null, "Wrong user id"))

    }
    if (req.body.email) {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        return res.status(409)
          .json(resBody(false, "409", null, "Email already exists"))
      }
    }

    let updatedUser = {}
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10)
      updatedUser = await User.update({ ...req.body, password: hash },
        {
          where: { userId: req.params.userid },
          returning: true
        })

    } else {
      updatedUser = await User.update(req.body, {
        where: { userId: req.params.userid },
        returning: true
      })
    }

    // @ts-ignore
    const { password, ...safeUpdatedUser } = { ...updatedUser[1][0].dataValues }
    res.status(200)
      .json(resBody(true, null, safeUpdatedUser, "User updated"));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, "500", null, err.message));
  }
};

/**
 * @param req needs req.params.userid
 */
export const deleteUser = async (req: Request, res: Response) => {

  try {
    const userExists = await User.findOne(
      { where: { userId: req.params.userid } })

    if (!userExists) {
      return res.status(400)
        .json(resBody(false, '400', null, "Wrong user id"));
    }

    const deletedUser = await User.destroy({
      where: { userId: req.params.userid }
    })

    res.status(200)
      .json(resBody(true, null, deletedUser, 'User deleted'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(400)
      .json(resBody(false, "400", null, err.message));
  }
};

/**
 * @param req needs req.params.eventid
 */
const getAllUsers = async (req: Request, res: Response) => {

  try {
    const userIds = await UserEvent.findAll({
      where: { eventId: req.params.eventid }
    });

    if (userIds.length) {
      const usersArray = [];
      for (const user of userIds) {
        usersArray.push(user.dataValues.userId);
      }

      const users = await User.findAll({
        where: { userId: usersArray }
      });

      res.status(200)
        .json(resBody(true, null, users, 'Event users fetched'));

    } else {
      throw new Error("No users were found");
    }

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, "500", null, err.message));
  }
};

export default { newUser, getUser, updateUser, deleteUser, getAllUsers };