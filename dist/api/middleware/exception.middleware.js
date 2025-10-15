"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionMiddleware = void 0;
const api_exception_1 = require("../../data/exception/api.exception");
const ExceptionMiddleware = (error, req, res, next) => {
    // console.log(error, req.body)
    if (error) {
        try {
            if (error instanceof api_exception_1.ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    statusCode: error.statusCode,
                    message: error.message,
                });
            }
            else {
                switch (error.status) {
                    case 400:
                        return res.status(400).json({
                            success: false,
                            statusCode: 400,
                            message: error.fields ? Object.keys(error.fields).map((key) => error.fields[key].message) : 'Données au mauvais format',
                        });
                    default:
                        return res.status(error.status).json({
                            success: false,
                            statusCode: error.status,
                            message: error.message,
                        });
                }
            }
        }
        catch (_) {
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: error.message,
            });
        }
    }
    next();
};
exports.ExceptionMiddleware = ExceptionMiddleware;
