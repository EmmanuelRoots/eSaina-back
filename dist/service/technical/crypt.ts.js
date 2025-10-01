"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashText = void 0;
const crypto_1 = require("crypto");
const hashText = async (text) => ((0, crypto_1.createHash)('sha256').update(Buffer.from(text, 'utf-8')).digest('hex'));
exports.hashText = hashText;
