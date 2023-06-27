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
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'Main', process.env.DB_USER || 'postgres', process.env.PW || '2603', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.sync();
        console.log('Database connected with Sequelize');
    }
    catch (error) {
        console.error('Failed to connect with DB 😒 ', error);
    }
}))();
exports.default = sequelize;
