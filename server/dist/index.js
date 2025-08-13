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
const app_1 = require("./app");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const port = process.env.PORT || 3200;
        // Check for email configuration
        if (!process.env.JAM_EMAIL || !process.env.JAM_PW) {
            console.warn('⚠️  WARNING: Email credentials not configured!');
            console.warn('   Password reset functionality will not work.');
            console.warn('   Please set JAM_EMAIL and JAM_PW environment variables.');
            console.warn('   See .env.example for instructions on setting up Gmail App Password.');
        }
        app_1.server.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
    catch (error) {
        console.error('Not connected to server:', error);
    }
}))();
