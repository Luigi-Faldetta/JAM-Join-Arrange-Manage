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
const associations_1 = require("../models/associations");
const utils_1 = require("../utils");
/**
 * Delete all users from the database (admin only)
 * DANGER: This will permanently delete all user data
 */
const deleteAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Safety check - only allow in development
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json((0, utils_1.resBody)(false, '403', null, 'Not allowed in production'));
        }
        // Delete all users
        const deletedCount = yield associations_1.User.destroy({
            where: {},
            truncate: true // This will reset auto-increment counters
        });
        console.log(`Deleted ${deletedCount} users from database`);
        res.status(200).json((0, utils_1.resBody)(true, null, { deletedCount }, `Deleted ${deletedCount} users`));
    }
    catch (err) {
        console.error('Error deleting users:', err);
        res.status(500).json((0, utils_1.resBody)(false, '500', null, err.message));
    }
});
exports.default = { deleteAllUsers };
