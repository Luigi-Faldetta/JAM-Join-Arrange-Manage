import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from "../models/associations";
import { __prod__ } from '../constants.js';

//@ts-ignore
const resBody = (success, error, data, message) => { return { success, error, data, message } }

// Needs body with {"email", "password"} 
const logIn = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400)
      .json(resBody(false, "400", null, "Missing input data"))
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) throw new Error('Incorrect email/password');

    // @ts-ignore
    const validatedPass = await bcrypt.compare(req.body.password, user.password);
    if (!validatedPass) throw new Error('Incorrect email/password');

    // @ts-ignore
    const token = jwt.sign({ userId: user.userId }, process.env.TOKEN_SECRET, { expiresIn: '30d' });

    res.cookie('jwt', token, {
      httpOnly: false,
      secure: false,
      // secure: __prod__,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30d
    })

    res.status(200)
      // @ts-ignore
      .json(resBody(true, null, user.userId, 'Logged in successfully'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(401)
      .json(resBody(false, null, null, err.message));
  }
}

const logOut = async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: false,
      expires: new Date(0)
    })

    res.status(200)
      .json(resBody(true, null, null, 'Logged out successfully'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
}

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401)
      .json(resBody(false, "401", null, 'Token is not present'));
  }

  // @ts-ignore
  jwt.verify(token, process.env.TOKEN_SECRET as string, async (err, payload) => {

    if (err) {
      console.log(err)
      return res.status(403)
        .json(resBody(false, "403", null, 'Some error happenedd during the token verification 1'));
    }

    // @ts-ignore
    const user = await User.findByPk(payload.userId as string)

    if (!user) {
      return res.status(403)
        .json(resBody(false, "403", null, 'Some error happenedd during the token verification 2'));
    }

    console.log('Success, user verified')

    // @ts-ignore
    req.userId = user.userId
    return next()
  })
}

export default { logIn, logOut, authorize }
