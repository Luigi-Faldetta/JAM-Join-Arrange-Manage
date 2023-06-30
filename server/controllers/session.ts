import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from "../models/associations";
import { __prod__ } from '../constants.js';

// Needs body with {"email", "password"} 
const logIn = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400)
      .json({
        success: false,
        error: "400",
        data: null,
        message: "Missing input data"
      })
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
      secure: __prod__,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30d
    })

    res.status(200)
      .json({
        success: true,
        error: null,
        // @ts-ignore
        data: user.userId,
        message: 'Logged in successfully'
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(401)
      .json({ message: err.message });
  }
}

const logOut = async (req: Request, res: Response) => {

  res.cookie('jwt', '', {
    httpOnly: false,
    expires: new Date(0)
  })

  res.status(200)
    .json({
      success: true,
      error: null,
      data: null,
      message: 'Logged out successfully'
    });

  // req.session.destroy((error) => {
  //   if (error) {
  //     res.status(500)
  //       .json({ error, message: 'Log out went wrong' });
  //   } else {
  //     res.clearCookie('sid')
  //       .status(200)
  //       .json({
  //         success: false,
  //         error: null,
  //         data: null,
  //         message: 'Logged out successfully'
  //       });
  //   }
  // });
}

export default { logIn, logOut }
