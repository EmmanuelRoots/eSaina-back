"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserDTO = void 0;
const date_utils_1 = require("../../../utils/date.utils");
const toUserDTO = (user) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    birthDate: (0, date_utils_1.toISO)(user.birthDate),
    createdAt: (0, date_utils_1.toISO)(user.createdAt),
    pdpUrl: user.pdpUrl ?? '',
    roleId: user.roleId,
    role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
            authorizations: user.role.authorizations,
            members: [], // avoid circularity here
        }
        : undefined,
});
exports.toUserDTO = toUserDTO;
