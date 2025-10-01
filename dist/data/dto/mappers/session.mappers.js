"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSessionDTO = void 0;
const date_utils_1 = require("../../../utils/date.utils");
const user_mappers_1 = require("./user.mappers");
const toSessionDTO = (session) => ({
    id: session.id,
    refreshToken: session.refreshToken,
    expiresAt: (0, date_utils_1.toISO)(session.expiresAt),
    userId: session.userId,
    user: (0, user_mappers_1.toUserDTO)(session.user),
    createdAt: (0, date_utils_1.toISO)(session.createdAt)
});
exports.toSessionDTO = toSessionDTO;
