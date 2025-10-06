"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = expressAuthentication;
const jwt_1 = require("../../utils/jwt");
async function expressAuthentication(req, securityName, scopes) {
    if (securityName !== 'bearer')
        throw new Error('Unknown security');
    const hdr = req.headers.authorization;
    if (!hdr)
        throw new Error('Missing token');
    const token = hdr.split(' ')[1];
    const payload = (0, jwt_1.verifyAccess)(token);
    return payload.user;
}
