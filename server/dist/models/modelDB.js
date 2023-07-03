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
const { __HEROKU__, NODE_ENV } = process.env;
const sequelize = __HEROKU__
    ? new sequelize_1.Sequelize(process.env.DB)
    : NODE_ENV === 'test'
        ? new sequelize_1.Sequelize(process.env.TEST_DB, process.env.DB_USER, process.env.PW, {
            host: 'localhost',
            dialect: 'postgres',
            port: 5432,
            logging: false,
        })
        : new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.PW, {
            host: 'localhost',
            dialect: 'postgres',
            port: 5432,
            logging: false,
        });
NODE_ENV !== 'test' && (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await sequelize.sync();
        // await sequelize.sync({alter: true});
        yield sequelize.sync({ force: true });
        console.log(`Connected to database '${NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DB_NAME}'`);
    }
    catch (error) {
        console.error('Failed to connect with Database =(', error);
    }
}))();
exports.default = sequelize;
