"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRefresh = void 0;
const crypto_1 = __importDefault(require("crypto"));
const genRefresh = () => crypto_1.default.randomBytes(40).toString('hex');
exports.genRefresh = genRefresh;
