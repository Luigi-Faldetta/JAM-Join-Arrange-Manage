"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = void 0;
const associations_1 = require("../models/associations");
// import { customRequest } from '../middleware/auth';
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email)
        return res.status(409).send({ error: '409', message: 'Missing input email' });
    if (!req.body.password)
        return res.status(409).send({ error: '409', message: 'Missing input password' });
    const { password, email } = req.body;
    const user = yield associations_1.User.findOne({ where: { email: email } });
    if (user)
        return res.status(409).send({ error: '409', message: 'User already exists' });
    try {
        const user = yield associations_1.User.create(Object.assign({}, req.body));
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
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
const getUserInfo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield associations_1.User.findOne({ where: { id: req.params.id } });
            if (user) {
                let safeUser = {
                    id: user.id,
                    profilePic: user.profilePic,
                    name: user.name,
                    phone: user.phone,
                };
                res.status(200).json(safeUser);
            }
        }
        catch (err) {
            console.error(err);
            res.status(400).send({ error: '400', message: 'Bad user request' });
        }
    });
};
const getAllUsers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usersIds = req.body.ids;
            const users = yield associations_1.User.findAll({ where: { id: usersIds } });
            res.status(200).json(users);
        }
        catch (err) {
            console.error(err);
            res.status(400).send({ error: '400', message: 'Bad user request' });
        }
    });
};
const editUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, info } = req.body;
        try {
            const user = yield associations_1.User.findByPk(id);
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
                userUpdated = yield user.update(Object.assign({}, info));
            }
            else {
                userUpdated = yield user.update(info);
            }
            res.status(200).json(userUpdated);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    });
};
exports.editUser = editUser;
exports.default = { postUser, getUserInfo, editUser: exports.editUser, getAllUsers };
