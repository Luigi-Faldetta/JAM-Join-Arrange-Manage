import { Request, Response } from 'express';
import { User } from '../models/associations';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { resBody } from '../utils'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.JAM_EMAIL,
    pass: process.env.JAM_PW,
  },
});

async function sendEmail(user: any, pw: string) {
  const mailOptions = {
    from: `"JAM - IT Department" <${process.env.JAM_EMAIL}>`,
    to: user.email,
    subject: `Password reset requested`,
    html: `<p>Hi ${user.name}, here is your new temporary password</p><code>${pw}</code><p>Please log in and change it now</p>`,
  };

  try {
    await transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log('Email sent: ' + info.response);
      } else {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const resetPassword = async (req: Request, res: Response) => {

  try {

    if (!req.params.email) {
      return res.status(400)
        .json(resBody(false, "400", null, "Missing input email"))
    }

    const user = await User.findOne({
      where: { email: req.params.email }
    })

    if (!user) {
      return res.status(400)
        .json(resBody(false, "400", null, "Something went wrong..."))
    }

    const newPassword = uuidv4().slice(0, 8);

    const hash = await bcrypt.hash(newPassword, 10)
    await User.update({ ...user, password: hash },
      { where: { email: req.params.email } })

    await sendEmail(user, newPassword)
    res.status(201)
      .json({
        success: true,
        error: null,
        data: null,
        message: 'Email with temporary password sent',
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json({ message: err.message });
  }
}

export default { resetPassword };
