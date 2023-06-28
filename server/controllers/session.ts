import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from "../models/associations";

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
    req.session.uid = user.userId;
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
  req.session.destroy((error) => {
    if (error) {
      res.status(500)
        .json({ error, message: 'Log out went wrong' });
    } else {
      res.clearCookie('sid')
        .status(200)
        .json({
          success: false,
          error: null,
          data: null,
          message: 'Logged out successfully'
        });
    }
  });
}

export default { logIn, logOut }
