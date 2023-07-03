"use strict";
// export function BeResponse = (
//     success: boolean,
//     data: any,
//     message: string,
//     error: null | number,
// ) => {success, data, message, error}
Object.defineProperty(exports, "__esModule", { value: true });
exports.resBody = void 0;
//@ts-ignore
const resBody = (success, error, data, message) => { return { success, error, data, message }; };
exports.resBody = resBody;
