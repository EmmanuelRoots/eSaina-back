"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../../utils/jwt");
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
const authMiddleware = (req, res, next) => {
    const hdr = req.headers.authorization;
    if (!hdr)
        return res.status(401).json({ message: 'Missing token' });
    try {
        const token = hdr.split(' ')[1];
        const payload = (0, jwt_1.verifyAccess)(token); //jeton expiré ? jwt jette une erreur
        req.body = payload.user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};
exports.authMiddleware = authMiddleware;
