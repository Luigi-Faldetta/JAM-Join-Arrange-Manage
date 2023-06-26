import { User } from '../models/associations';
import { UserModel } from '../models/user';
import { Request, Response } from 'express';
// import { customRequest } from '../middleware/auth';

const postUser = async (req: Request, res: Response) => {
  if (!req.body.email)
    return res.status(409).send({ error: '409', message: 'Missing input email' });

  if (!req.body.password)
    return res.status(409).send({ error: '409', message: 'Missing input password' });

  const { password, email } = req.body;

  const user = await User.findOne({ where: { email: email } });
  if (user) return res.status(409).send({ error: '409', message: 'User already exists' });

  try {
    const user = await User.create({ ...req.body });
    let safeUser = {
      id: user.id,
      profilePic: user.profilePic,
      name: user.name,
      phone: user.phone,
    };

    res.status(201).json({
      success: true,
      data: safeUser,
      message: 'User created',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user: UserModel | null = await User.findOne({ where: { email: email } });
//     if (!user) throw new Error();

//     if (!password) throw new Error();
//     req.session.uid = user.id;

//     res.status(200).send({ success: true, data: user.id, message: 'OK' });
//   } catch (err: any) {
//     console.log(err);
//     res.status(401).send({ error: '401', message: 'Username or password is incorrect' });
//   }
// };

// const logout = (req: Request, res: Response) => {
//   req.session.destroy((error: any) => {
//     if (error) {
//       res.status(500).send({ error, message: 'Could not log out, please try again' });
//     } else {
//       res.clearCookie('sid').status(200).send({ message: 'Logout successful' });
//     }
//   });
// };

const getUserInfo = async function (req: Request, res: Response) {
  try {
    let user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      let safeUser = {
        id: user.id,
        profilePic: user.profilePic,
        name: user.name,
        phone: user.phone,
      };
      res.status(200).json(safeUser);
    }
  } catch (err: any) {
    console.error(err);
    res.status(400).send({ error: '400', message: 'Bad user request' });
  }
};
const getAllUsers = async function (req: Request, res: Response) {
  try {
    const usersIds = req.body.ids;
    const users = await User.findAll({ where: { id: usersIds } });
    res.status(200).json(users);
  } catch (err: any) {
    console.error(err);
    res.status(400).send({ error: '400', message: 'Bad user request' });
  }
};

export const editUser = async function (req: Request, res: Response) {
    const { id, info } = req.body;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({
          success: false,
          data: null,
          message: 'User not found.',
        });
        return;
      }
  
      let userUpdated = {};
  
      if (info.password) {
        userUpdated = await user.update({ ...info});
      } else {
        userUpdated = await user.update(info);
      }
  
      res.status(200).json(userUpdated);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

export default { postUser, getUserInfo, editUser, getAllUsers};