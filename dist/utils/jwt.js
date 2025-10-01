"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccess = exports.signAccess = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '5m'; // 5 min par défaut
const signAccess = (user) => {
    return jsonwebtoken_1.default.sign({ user }, ACCESS_SECRET, { algorithm: 'HS256', expiresIn: ACCESS_TTL });
};
exports.signAccess = signAccess;
const verifyAccess = (token) => jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
exports.verifyAccess = verifyAccess;
