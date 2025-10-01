"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, name = 'Erreur interne') {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
