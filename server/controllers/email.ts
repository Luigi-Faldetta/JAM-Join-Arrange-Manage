import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/associations';
import { resBody } from '../utils'
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.JAM_EMAIL,
    pass: process.env.JAM_PW,
  },
});

async function sendEmail(user: any, pw: string) {
  // Check if email credentials are configured
  if (!process.env.JAM_EMAIL || !process.env.JAM_PW) {
    throw new Error('Email credentials not configured. Please set JAM_EMAIL and JAM_PW environment variables.');
  }

  const mailOptions = {
    from: `"JAM - IT Department" <${process.env.JAM_EMAIL}>`,
    to: user.email,
    subject: `Password reset requested`,
    html: `<p>Hi ${user.name}, here you can find your new temporary password:</p><code style="border:1px solid lightgrey; padding: 5px">${pw}</code><p>Please <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">log in now</a> and update it</p><p>JAM</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
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
    process.env.NODE_ENV !== 'test' && console.error('Password reset error:', err);
    
    // Return appropriate error message
    if (err.message && err.message.includes('Email credentials not configured')) {
      res.status(500)
        .json(resBody(false, "500", null, "Email service not configured. Please contact support."));
    } else {
      res.status(500)
        .json(resBody(false, "500", null, "Failed to send password reset email. Please try again later."));
    }
  }
}

export default { resetPassword };
