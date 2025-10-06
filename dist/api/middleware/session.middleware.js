"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const sessionMiddleware = async (req, res, next) => {
    if (!req.body.refreshToken) {
        return res.status(401).json({ message: 'Refresh token manquant' });
    }
    next();
};
exports.sessionMiddleware = sessionMiddleware;
