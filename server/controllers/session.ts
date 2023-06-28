import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from "../models/associations";

// TO FINISH
const logIn = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) throw new Error('Incorrect email/password');
    
    // @ts-ignore
    const validatedPass = await bcrypt.compare(req.body.password, user.password);
    if (!validatedPass) throw new Error('Incorrect email/password');

    // req.session.uid = user.id;
    // res.status(200).json({ success: true, data: user.id, message: 'Logged in successfully' });

  } catch (err: any) {
    console.log(err);
    res.status(401).send({ message: err.message });
  }
}

// TO DO
const logOut = async (req: Request, res: Response) => {
  // req.session.destroy((error) => {
  //   if (error) {
  //     res.status(500).send({ error, message: 'Log out went wrong' });
  //   } else {
  //     res.clearCookie('sid').status(200).send({ message: 'Logged out successfully' });
  //   }
  // });
}

export default { logIn, logOut }
