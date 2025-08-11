import { NextFunction, Request, Response } from 'express';
import { User } from '../models/associations';
import { UserModel } from '../models/user';
import { __prod__ } from '../constants.js';
import { resBody } from '../utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * @param req needs body with at least {"email", "password"}
 */
const logIn = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json(resBody(false, '400', null, 'Missing input data'));
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) throw new Error('Incorrect email/password');

    const validatedPass = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatedPass) throw new Error('Incorrect email/password');

    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET || process.env.TOKEN_SECRET as string,
      { expiresIn: '2h' }
    );

    res.cookie('jwt', token, {
      httpOnly: false,
      secure: __prod__,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 2, // 2h
    });

    res
      .status(200)
      .json(resBody(true, null, token, 'Logged in successfully'));
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(401).json(resBody(false, null, null, err.message));
  }
};

/**
 * Needs nothing, it destroys the cookie
 */
const logOut = async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: false,
      expires: new Date(0),
    });

    res.status(200).json(resBody(true, null, null, 'Logged out successfully'));
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(500).json(resBody(false, null, null, err.message));
  }
};

interface customRequest extends Request {
  user: UserModel;
}

/**
 * Needs nothing, it checks the cookie
 */
const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res
      .status(401)
      .json(resBody(false, '401', null, 'Token is not present'));
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || process.env.TOKEN_SECRET as string,
    async (err, payload) => {
      if (err) {
        console.log(err);
        if (err.name === 'TokenExpiredError') {
          return res
            .status(401)
            .json(
              resBody(
                false,
                '401',
                null,
                'Session expired, please log in again.'
              )
            );
        }
        return res
          .status(403)
          .json(
            resBody(
              false,
              '403',
              null,
              'Some error happened during the token verification'
            )
          );
      }

      // @ts-ignore
      const user = await User.findByPk(payload?.userId as string);

      if (!user) {
        return res
          .status(403)
          .json(
            resBody(
              false,
              '403',
              null,
              'Some error happened during the user verification'
            )
          );
      }

      const { password, ...safeUser } = { ...user.dataValues };
      // @ts-ignore
      req.user = safeUser;

      return next();
    }
  );
};

/**
 * @param req body (user) is passed automatically from authorize()
 */
const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = (req as customRequest).user;
    res
      .status(200)
      .json(resBody(true, null, user, 'User is logged'));
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(500).json(resBody(false, null, null, err.message));
  }
};

export default { logIn, logOut, authorize, getUserInfo };
