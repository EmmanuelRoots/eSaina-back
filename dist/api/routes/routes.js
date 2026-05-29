"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const user_controller_1 = require("./../controllers/user.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const team_controller_1 = require("./../controllers/team.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const sse_controller_1 = require("./../controllers/sse.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const sprint_controller_1 = require("./../controllers/sprint.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const salon_controller_1 = require("./../controllers/salon.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const role_controller_1 = require("./../controllers/role.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const project_controller_1 = require("./../controllers/project.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const project_statuses_controller_1 = require("./../controllers/project-statuses.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const post_controller_1 = require("./../controllers/post.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const label_controller_1 = require("./../controllers/label.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const issue_controller_1 = require("./../controllers/issue.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const group_controller_1 = require("./../controllers/group.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const conversation_controller_1 = require("./../controllers/conversation.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const admin_user_controller_1 = require("./../controllers/admin-user.controller");
const swagger_middleware_1 = require("./../middleware/swagger.middleware");
const expressAuthenticationRecasted = swagger_middleware_1.expressAuthentication;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "SubscribeDTO": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "phoneNumber": { "dataType": "string", "required": true },
            "birthDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "deviceInfo": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginDTO": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "deviceInfo": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GoogleLoginDTO": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "family_name": { "dataType": "string", "required": true },
            "given_name": { "dataType": "string", "required": true },
            "deviceInfo": { "dataType": "string" },
            "picture": { "dataType": "string" },
            "roleId": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConversationType": {
        "dataType": "refEnum",
        "enums": ["AI_CHAT", "DIRECT", "GROUP"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageType": {
        "dataType": "refEnum",
        "enums": ["TEXT", "IMAGE", "FILE"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SenderType": {
        "dataType": "refEnum",
        "enums": ["SYSTEM", "AI", "USER"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConversationDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "title": { "dataType": "string" },
            "type": { "ref": "ConversationType", "required": true },
            "userId": { "dataType": "string", "required": true },
            "ownerId": { "dataType": "string", "required": true },
            "messages": { "dataType": "array", "array": { "dataType": "refObject", "ref": "MessageDTO" }, "required": true },
            "members": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ConversationMember" }, "required": true },
            "read": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string" },
            "lastName": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "createdAt": { "dataType": "string" },
            "phoneNumber": { "dataType": "string", "required": true },
            "birthDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "active": { "dataType": "boolean" },
            "conversations": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ConversationDTO" } },
            "messaages": { "dataType": "array", "array": { "dataType": "refObject", "ref": "MessageDTO" } },
            "pdpUrl": { "dataType": "string" },
            "roleId": { "dataType": "string", "required": true },
            "role": { "ref": "RoleDTO" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageDTO": {
        "dataType": "refObject",
        "properties": {
            "content": { "dataType": "string", "required": true },
            "type": { "ref": "MessageType", "required": true },
            "sender": { "ref": "SenderType", "required": true },
            "conversation": { "ref": "ConversationDTO", "required": true },
            "user": { "ref": "UserDTO", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemberRole": {
        "dataType": "refEnum",
        "enums": ["ADMIN", "MEMBER"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConversationMember": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "conversationId": { "dataType": "string", "required": true },
            "userId": { "dataType": "string", "required": true },
            "role": { "ref": "MemberRole", "required": true },
            "joinedAt": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthorizationDto": {
        "dataType": "refObject",
        "properties": {
            "tableName": { "dataType": "string", "required": true },
            "create": { "dataType": "boolean", "required": true },
            "read": { "dataType": "boolean", "required": true },
            "update": { "dataType": "boolean", "required": true },
            "delete": { "dataType": "boolean", "required": true },
            "visibleFields": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
            "authorizations": { "dataType": "array", "array": { "dataType": "refObject", "ref": "AuthorizationDto" }, "required": true },
            "members": { "dataType": "array", "array": { "dataType": "refObject", "ref": "UserDTO" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamSummaryDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "createdAt": { "dataType": "string", "required": true },
            "updatedAt": { "dataType": "string", "required": true },
            "createdById": { "dataType": "string", "required": true },
            "memberCount": { "dataType": "double", "required": true },
            "projectCount": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamListResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "enum", "enums": [true], "required": true },
            "data": { "dataType": "array", "array": { "dataType": "refObject", "ref": "TeamSummaryDTO" }, "required": true },
            "pagination": { "dataType": "nestedObjectLiteral", "nestedProperties": { "hasPreviousPage": { "dataType": "boolean", "required": true }, "hasNextPage": { "dataType": "boolean", "required": true }, "totalPages": { "dataType": "double", "required": true }, "totalCount": { "dataType": "double", "required": true }, "pageSize": { "dataType": "double", "required": true }, "currentPage": { "dataType": "double", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamMemberRoleDTO": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LEAD"] }, { "dataType": "enum", "enums": ["MEMBER"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamMemberDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "userId": { "dataType": "string", "required": true },
            "role": { "ref": "TeamMemberRoleDTO", "required": true },
            "joinedAt": { "dataType": "string", "required": true },
            "user": { "dataType": "nestedObjectLiteral", "nestedProperties": { "pdpUrl": { "dataType": "string" }, "lastName": { "dataType": "string", "required": true }, "firstName": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamProjectDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "projectId": { "dataType": "string", "required": true },
            "addedAt": { "dataType": "string", "required": true },
            "project": { "dataType": "nestedObjectLiteral", "nestedProperties": { "name": { "dataType": "string", "required": true }, "key": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamDetailDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "createdAt": { "dataType": "string", "required": true },
            "updatedAt": { "dataType": "string", "required": true },
            "createdById": { "dataType": "string", "required": true },
            "memberCount": { "dataType": "double", "required": true },
            "projectCount": { "dataType": "double", "required": true },
            "members": { "dataType": "array", "array": { "dataType": "refObject", "ref": "TeamMemberDTO" }, "required": true },
            "projects": { "dataType": "array", "array": { "dataType": "refObject", "ref": "TeamProjectDTO" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamCreateDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "memberIds": { "dataType": "array", "array": { "dataType": "string" } },
            "projectIds": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamAddMembersDTO": {
        "dataType": "refObject",
        "properties": {
            "userIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamUpdateMemberRoleDTO": {
        "dataType": "refObject",
        "properties": {
            "role": { "ref": "TeamMemberRoleDTO", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TeamAddProjectsDTO": {
        "dataType": "refObject",
        "properties": {
            "projectIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NotificationType": {
        "dataType": "refEnum",
        "enums": ["NEW_MESSAGE", "NEW_CONVERSATION", "BROADCAST", "NOTIFICATION", "CONNECTED", "NEW_POST"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NotificationDTO": {
        "dataType": "refObject",
        "properties": {
            "userId": { "dataType": "string", "required": true },
            "type": { "ref": "NotificationType", "required": true },
            "title": { "dataType": "string", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "any", "required": true },
            "read": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintStatus": {
        "dataType": "refEnum",
        "enums": ["PLANNED", "ACTIVE", "CLOSED"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SprintDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "projectId": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "goal": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "startDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "endDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "status": { "ref": "SprintStatus", "required": true },
            "createdAt": { "dataType": "string" },
            "updatedAt": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateSprintRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "projectId": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "goal": { "dataType": "string" },
            "startDate": { "dataType": "string" },
            "endDate": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateSprintRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "goal": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "startDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "endDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "status": { "ref": "SprintStatus" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_UserDTO_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id": { "dataType": "string" }, "email": { "dataType": "string" }, "password": { "dataType": "string" }, "lastName": { "dataType": "string" }, "firstName": { "dataType": "string" }, "createdAt": { "dataType": "string" }, "phoneNumber": { "dataType": "string" }, "birthDate": { "dataType": "string" }, "active": { "dataType": "boolean" }, "conversations": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ConversationDTO" } }, "messaages": { "dataType": "array", "array": { "dataType": "refObject", "ref": "MessageDTO" } }, "pdpUrl": { "dataType": "string" }, "roleId": { "dataType": "string" }, "role": { "ref": "RoleDTO" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProjectMemberRole": {
        "dataType": "refEnum",
        "enums": ["ADMIN", "MEMBER", "VIEWER"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProjectMemberDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "projectId": { "dataType": "string", "required": true },
            "userId": { "dataType": "string", "required": true },
            "user": { "ref": "Partial_UserDTO_" },
            "role": { "ref": "ProjectMemberRole", "required": true },
            "joinedAt": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProjectLabelDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "color": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.StatusCategory": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["TODO"] }, { "dataType": "enum", "enums": ["IN_PROGRESS"] }, { "dataType": "enum", "enums": ["DONE"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatusCategory": {
        "dataType": "refAlias",
        "type": { "ref": "_36_Enums.StatusCategory", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProjectStatusDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "projectId": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "color": { "dataType": "string", "required": true },
            "position": { "dataType": "double", "required": true },
            "category": { "ref": "StatusCategory", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProjectDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "key": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "ownerId": { "dataType": "string", "required": true },
            "owner": { "ref": "Partial_UserDTO_" },
            "salonId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "issueCounter": { "dataType": "double" },
            "members": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ProjectMemberDTO" } },
            "sprints": { "dataType": "array", "array": { "dataType": "refObject", "ref": "SprintDTO" } },
            "labels": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ProjectLabelDTO" } },
            "statuses": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ProjectStatusDTO" } },
            "createdAt": { "dataType": "string" },
            "updatedAt": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateProjectRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "key": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "string" },
            "salonId": { "dataType": "string" },
            "memberIds": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateProjectRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "description": { "dataType": "string" },
            "salonId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": {}, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IssueType": {
        "dataType": "refEnum",
        "enums": ["STORY", "TASK", "BUG", "EPIC"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IssueStatus": {
        "dataType": "refEnum",
        "enums": ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "CANCELLED"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IssuePriority": {
        "dataType": "refEnum",
        "enums": ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IssueLabelDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "color": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IssueDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "projectId": { "dataType": "string", "required": true },
            "number": { "dataType": "double" },
            "key": { "dataType": "string" },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "type": { "ref": "IssueType", "required": true },
            "status": { "ref": "IssueStatus", "required": true },
            "statusId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "projectStatus": { "ref": "ProjectStatusDTO" },
            "priority": { "ref": "IssuePriority", "required": true },
            "storyPoints": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }] },
            "startDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "dueDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "position": { "dataType": "double" },
            "sprintId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "assigneeId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "assignee": { "ref": "Partial_UserDTO_" },
            "reporterId": { "dataType": "string", "required": true },
            "reporter": { "ref": "Partial_UserDTO_" },
            "parentIssueId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "labels": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IssueLabelDTO" } },
            "createdAt": { "dataType": "string" },
            "updatedAt": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddProjectMemberRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "userId": { "dataType": "string", "required": true },
            "role": { "ref": "ProjectMemberRole" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateProjectStatusRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "color": { "dataType": "string" },
            "position": { "dataType": "double" },
            "category": { "ref": "StatusCategory" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateProjectStatusRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "color": { "dataType": "string" },
            "position": { "dataType": "double" },
            "category": { "ref": "StatusCategory" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.ReactionType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["LIKE"] }, { "dataType": "enum", "enums": ["LOVE"] }, { "dataType": "enum", "enums": ["HAHA"] }, { "dataType": "enum", "enums": ["WOW"] }, { "dataType": "enum", "enums": ["SAD"] }, { "dataType": "enum", "enums": ["ANGRY"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.PostType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["TEXT"] }, { "dataType": "enum", "enums": ["IMAGE"] }, { "dataType": "enum", "enums": ["VIDEO"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateLabelRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "projectId": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "color": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateIssueRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "projectId": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "description": { "dataType": "string" },
            "type": { "ref": "IssueType" },
            "status": { "ref": "IssueStatus" },
            "statusId": { "dataType": "string" },
            "priority": { "ref": "IssuePriority" },
            "storyPoints": { "dataType": "double" },
            "startDate": { "dataType": "string" },
            "dueDate": { "dataType": "string" },
            "sprintId": { "dataType": "string" },
            "assigneeId": { "dataType": "string" },
            "parentIssueId": { "dataType": "string" },
            "labelIds": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateIssueRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string" },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "type": { "ref": "IssueType" },
            "status": { "ref": "IssueStatus" },
            "statusId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "priority": { "ref": "IssuePriority" },
            "storyPoints": { "dataType": "union", "subSchemas": [{ "dataType": "double" }, { "dataType": "enum", "enums": [null] }] },
            "startDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "dueDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "position": { "dataType": "double" },
            "sprintId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "assigneeId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "parentIssueId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IssueCommentDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string" },
            "content": { "dataType": "string", "required": true },
            "issueId": { "dataType": "string", "required": true },
            "authorId": { "dataType": "string", "required": true },
            "author": { "ref": "Partial_UserDTO_" },
            "parentId": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "createdAt": { "dataType": "string" },
            "updatedAt": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateIssueCommentRequestDTO": {
        "dataType": "refObject",
        "properties": {
            "issueId": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
            "parentId": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupSummaryDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "createdAt": { "dataType": "string", "required": true },
            "updatedAt": { "dataType": "string", "required": true },
            "createdById": { "dataType": "string", "required": true },
            "memberCount": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupListResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "enum", "enums": [true], "required": true },
            "data": { "dataType": "array", "array": { "dataType": "refObject", "ref": "GroupSummaryDTO" }, "required": true },
            "pagination": { "dataType": "nestedObjectLiteral", "nestedProperties": { "hasPreviousPage": { "dataType": "boolean", "required": true }, "hasNextPage": { "dataType": "boolean", "required": true }, "totalPages": { "dataType": "double", "required": true }, "totalCount": { "dataType": "double", "required": true }, "pageSize": { "dataType": "double", "required": true }, "currentPage": { "dataType": "double", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupMemberRoleDTO": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["OWNER"] }, { "dataType": "enum", "enums": ["MEMBER"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupMemberDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "userId": { "dataType": "string", "required": true },
            "role": { "ref": "GroupMemberRoleDTO", "required": true },
            "joinedAt": { "dataType": "string", "required": true },
            "user": { "dataType": "nestedObjectLiteral", "nestedProperties": { "pdpUrl": { "dataType": "string" }, "lastName": { "dataType": "string", "required": true }, "firstName": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupDetailDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "createdAt": { "dataType": "string", "required": true },
            "updatedAt": { "dataType": "string", "required": true },
            "createdById": { "dataType": "string", "required": true },
            "memberCount": { "dataType": "double", "required": true },
            "members": { "dataType": "array", "array": { "dataType": "refObject", "ref": "GroupMemberDTO" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupCreateDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "memberIds": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "description": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupAddMembersDTO": {
        "dataType": "refObject",
        "properties": {
            "userIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GroupUpdateMemberRoleDTO": {
        "dataType": "refObject",
        "properties": {
            "role": { "ref": "GroupMemberRoleDTO", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.ConversationType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["AI_CHAT"] }, { "dataType": "enum", "enums": ["DIRECT"] }, { "dataType": "enum", "enums": ["GROUP"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.MessageType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["TEXT"] }, { "dataType": "enum", "enums": ["IMAGE"] }, { "dataType": "enum", "enums": ["FILE"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "_36_Enums.SenderType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["USER"] }, { "dataType": "enum", "enums": ["AI"] }, { "dataType": "enum", "enums": ["SYSTEM"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminUserListItemDTO": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "phoneNumber": { "dataType": "string", "required": true },
            "birthDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "pdpUrl": { "dataType": "string" },
            "active": { "dataType": "boolean", "required": true },
            "createdAt": { "dataType": "string", "required": true },
            "roleId": { "dataType": "string", "required": true },
            "role": { "ref": "RoleDTO" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminUserListResponseDTO": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "enum", "enums": [true], "required": true },
            "data": { "dataType": "array", "array": { "dataType": "refObject", "ref": "AdminUserListItemDTO" }, "required": true },
            "pagination": { "dataType": "nestedObjectLiteral", "nestedProperties": { "hasPreviousPage": { "dataType": "boolean", "required": true }, "hasNextPage": { "dataType": "boolean", "required": true }, "totalPages": { "dataType": "double", "required": true }, "totalCount": { "dataType": "double", "required": true }, "pageSize": { "dataType": "double", "required": true }, "currentPage": { "dataType": "double", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminUserUpdateDTO": {
        "dataType": "refObject",
        "properties": {
            "firstName": { "dataType": "string" },
            "lastName": { "dataType": "string" },
            "phoneNumber": { "dataType": "string" },
            "birthDate": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "roleId": { "dataType": "string" },
            "active": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminUserResetPasswordDTO": {
        "dataType": "refObject",
        "properties": {
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const argsUserController_subscribe = {
        body: { "in": "body", "name": "body", "required": true, "ref": "SubscribeDTO" },
    };
    app.post('/user/subscribe', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.subscribe)), async function UserController_subscribe(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_subscribe, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'subscribe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_login = {
        body: { "in": "body", "name": "body", "required": true, "ref": "LoginDTO" },
    };
    app.post('/user/login', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.login)), async function UserController_login(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_login, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_googleLogin = {
        body: { "in": "body", "name": "body", "required": true, "ref": "GoogleLoginDTO" },
    };
    app.post('/user/googleLogin', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.googleLogin)), async function UserController_googleLogin(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_googleLogin, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'googleLogin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_refresh = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "refreshToken": { "dataType": "string", "required": true } } },
    };
    app.post('/user/refresh', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.refresh)), async function UserController_refresh(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_refresh, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'refresh',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getUserFromProfile = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.get('/user/me', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUserFromProfile)), async function UserController_getUserFromProfile(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserFromProfile, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'getUserFromProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_logOut = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "refreshToken": { "dataType": "string", "required": true } } },
    };
    app.post('/user/logout', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.logOut)), async function UserController_logOut(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_logOut, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'logOut',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_searChUser = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        limit: { "default": 20, "in": "query", "name": "limit", "dataType": "double" },
        searchTerm: { "default": "", "in": "query", "name": "searchTerm", "dataType": "string" },
    };
    app.get('/user/search-user', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.searChUser)), async function UserController_searChUser(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_searChUser, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'searChUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getUsersByName = {
        keys: { "in": "query", "name": "keys", "required": true, "dataType": "array", "array": { "dataType": "string" } },
    };
    app.get('/user/get-users-by-name', ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUsersByName)), async function UserController_getUsersByName(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByName, request, response });
            const controller = new user_controller_1.UserController();
            await templateService.apiHandler({
                methodName: 'getUsersByName',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_listTeams = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        limit: { "default": 20, "in": "query", "name": "limit", "dataType": "double" },
        search: { "in": "query", "name": "search", "dataType": "string" },
    };
    app.get('/admin/teams', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.listTeams)), async function AdminTeamController_listTeams(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_listTeams, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'listTeams',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_searchProjects = {
        search: { "in": "query", "name": "search", "dataType": "string" },
        limit: { "default": 20, "in": "query", "name": "limit", "dataType": "double" },
    };
    app.get('/admin/teams/available-projects', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.searchProjects)), async function AdminTeamController_searchProjects(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_searchProjects, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'searchProjects',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_getTeam = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.get('/admin/teams/:id', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.getTeam)), async function AdminTeamController_getTeam(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_getTeam, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'getTeam',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_createTeam = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        body: { "in": "body", "name": "body", "required": true, "ref": "TeamCreateDTO" },
    };
    app.post('/admin/teams', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.createTeam)), async function AdminTeamController_createTeam(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_createTeam, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'createTeam',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_updateTeam = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "TeamUpdateDTO" },
    };
    app.patch('/admin/teams/:id', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.updateTeam)), async function AdminTeamController_updateTeam(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_updateTeam, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'updateTeam',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_deleteTeam = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.delete('/admin/teams/:id', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.deleteTeam)), async function AdminTeamController_deleteTeam(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_deleteTeam, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'deleteTeam',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_addMembers = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "TeamAddMembersDTO" },
    };
    app.post('/admin/teams/:id/members', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.addMembers)), async function AdminTeamController_addMembers(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_addMembers, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'addMembers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_removeMember = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
    };
    app.delete('/admin/teams/:id/members/:userId', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.removeMember)), async function AdminTeamController_removeMember(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_removeMember, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'removeMember',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_updateMemberRole = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "TeamUpdateMemberRoleDTO" },
    };
    app.patch('/admin/teams/:id/members/:userId', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.updateMemberRole)), async function AdminTeamController_updateMemberRole(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_updateMemberRole, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'updateMemberRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_addProjects = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "TeamAddProjectsDTO" },
    };
    app.post('/admin/teams/:id/projects', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.addProjects)), async function AdminTeamController_addProjects(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_addProjects, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'addProjects',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminTeamController_removeProject = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
    };
    app.delete('/admin/teams/:id/projects/:projectId', ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController)), ...((0, runtime_1.fetchMiddlewares)(team_controller_1.AdminTeamController.prototype.removeProject)), async function AdminTeamController_removeProject(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminTeamController_removeProject, request, response });
            const controller = new team_controller_1.AdminTeamController();
            await templateService.apiHandler({
                methodName: 'removeProject',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSSEController_sendNotification = {
        body: { "in": "body", "name": "body", "required": true, "ref": "NotificationDTO" },
    };
    app.post('/notification/send', ...((0, runtime_1.fetchMiddlewares)(sse_controller_1.SSEController)), ...((0, runtime_1.fetchMiddlewares)(sse_controller_1.SSEController.prototype.sendNotification)), async function SSEController_sendNotification(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSSEController_sendNotification, request, response });
            const controller = new sse_controller_1.SSEController();
            await templateService.apiHandler({
                methodName: 'sendNotification',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSprintController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateSprintRequestDTO" },
    };
    app.post('/sprint/create', ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController)), ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController.prototype.create)), async function SprintController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSprintController_create, request, response });
            const controller = new sprint_controller_1.SprintController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSprintController_list = {
        projectId: { "in": "query", "name": "projectId", "required": true, "dataType": "string" },
    };
    app.get('/sprint/list', ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController)), ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController.prototype.list)), async function SprintController_list(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSprintController_list, request, response });
            const controller = new sprint_controller_1.SprintController();
            await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSprintController_update = {
        sprintId: { "in": "path", "name": "sprintId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateSprintRequestDTO" },
    };
    app.patch('/sprint/:sprintId', ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController)), ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController.prototype.update)), async function SprintController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSprintController_update, request, response });
            const controller = new sprint_controller_1.SprintController();
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSprintController_start = {
        sprintId: { "in": "path", "name": "sprintId", "required": true, "dataType": "string" },
    };
    app.post('/sprint/:sprintId/start', ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController)), ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController.prototype.start)), async function SprintController_start(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSprintController_start, request, response });
            const controller = new sprint_controller_1.SprintController();
            await templateService.apiHandler({
                methodName: 'start',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSprintController_close = {
        sprintId: { "in": "path", "name": "sprintId", "required": true, "dataType": "string" },
    };
    app.post('/sprint/:sprintId/close', ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController)), ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController.prototype.close)), async function SprintController_close(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSprintController_close, request, response });
            const controller = new sprint_controller_1.SprintController();
            await templateService.apiHandler({
                methodName: 'close',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSprintController_remove = {
        sprintId: { "in": "path", "name": "sprintId", "required": true, "dataType": "string" },
    };
    app.delete('/sprint/:sprintId', ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController)), ...((0, runtime_1.fetchMiddlewares)(sprint_controller_1.SprintController.prototype.remove)), async function SprintController_remove(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSprintController_remove, request, response });
            const controller = new sprint_controller_1.SprintController();
            await templateService.apiHandler({
                methodName: 'remove',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSalonController_getUserSalon = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.get('/salon/get-user-salon', ...((0, runtime_1.fetchMiddlewares)(salon_controller_1.SalonController)), ...((0, runtime_1.fetchMiddlewares)(salon_controller_1.SalonController.prototype.getUserSalon)), async function SalonController_getUserSalon(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsSalonController_getUserSalon, request, response });
            const controller = new salon_controller_1.SalonController();
            await templateService.apiHandler({
                methodName: 'getUserSalon',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_getAllRoles = {};
    app.get('/roles', ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController)), ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController.prototype.getAllRoles)), async function RoleController_getAllRoles(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_getAllRoles, request, response });
            const controller = new role_controller_1.RoleController();
            await templateService.apiHandler({
                methodName: 'getAllRoles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_getTables = {};
    app.get('/roles/tables', ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController)), ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController.prototype.getTables)), async function RoleController_getTables(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_getTables, request, response });
            const controller = new role_controller_1.RoleController();
            await templateService.apiHandler({
                methodName: 'getTables',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_createRole = {
        body: { "in": "body", "name": "body", "required": true, "ref": "RoleDTO" },
    };
    app.post('/roles', ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController)), ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController.prototype.createRole)), async function RoleController_createRole(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_createRole, request, response });
            const controller = new role_controller_1.RoleController();
            await templateService.apiHandler({
                methodName: 'createRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_updateRole = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "RoleDTO" },
    };
    app.put('/roles/:id', ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController)), ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController.prototype.updateRole)), async function RoleController_updateRole(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_updateRole, request, response });
            const controller = new role_controller_1.RoleController();
            await templateService.apiHandler({
                methodName: 'updateRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRoleController_deleteRole = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.delete('/roles/:id', ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController)), ...((0, runtime_1.fetchMiddlewares)(role_controller_1.RoleController.prototype.deleteRole)), async function RoleController_deleteRole(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsRoleController_deleteRole, request, response });
            const controller = new role_controller_1.RoleController();
            await templateService.apiHandler({
                methodName: 'deleteRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateProjectRequestDTO" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/project/create', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.create)), async function ProjectController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_create, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_listMine = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.get('/project/mine', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.listMine)), async function ProjectController_listMine(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_listMine, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'listMine',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_getById = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
    };
    app.get('/project/:projectId', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.getById)), async function ProjectController_getById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_getById, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'getById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_update = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateProjectRequestDTO" },
    };
    app.patch('/project/:projectId', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.update)), async function ProjectController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_update, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_remove = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
    };
    app.delete('/project/:projectId', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.remove)), async function ProjectController_remove(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_remove, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'remove',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_getBoard = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
    };
    app.get('/project/:projectId/board', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.getBoard)), async function ProjectController_getBoard(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_getBoard, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'getBoard',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_getBacklog = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
    };
    app.get('/project/:projectId/backlog', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.getBacklog)), async function ProjectController_getBacklog(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_getBacklog, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'getBacklog',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_addMember = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "AddProjectMemberRequestDTO" },
    };
    app.post('/project/:projectId/members', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.addMember)), async function ProjectController_addMember(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_addMember, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'addMember',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectController_removeMember = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
        userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
    };
    app.delete('/project/:projectId/members/:userId', ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController)), ...((0, runtime_1.fetchMiddlewares)(project_controller_1.ProjectController.prototype.removeMember)), async function ProjectController_removeMember(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectController_removeMember, request, response });
            const controller = new project_controller_1.ProjectController();
            await templateService.apiHandler({
                methodName: 'removeMember',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectStatusesController_createStatus = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateProjectStatusRequestDTO" },
    };
    app.post('/project/:projectId/statuses', ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController)), ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController.prototype.createStatus)), async function ProjectStatusesController_createStatus(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectStatusesController_createStatus, request, response });
            const controller = new project_statuses_controller_1.ProjectStatusesController();
            await templateService.apiHandler({
                methodName: 'createStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectStatusesController_listStatuses = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
    };
    app.get('/project/:projectId/statuses', ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController)), ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController.prototype.listStatuses)), async function ProjectStatusesController_listStatuses(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectStatusesController_listStatuses, request, response });
            const controller = new project_statuses_controller_1.ProjectStatusesController();
            await templateService.apiHandler({
                methodName: 'listStatuses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectStatusesController_updateStatus = {
        statusId: { "in": "path", "name": "statusId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateProjectStatusRequestDTO" },
    };
    app.put('/project/statuses/:statusId', ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController)), ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController.prototype.updateStatus)), async function ProjectStatusesController_updateStatus(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectStatusesController_updateStatus, request, response });
            const controller = new project_statuses_controller_1.ProjectStatusesController();
            await templateService.apiHandler({
                methodName: 'updateStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectStatusesController_deleteStatus = {
        statusId: { "in": "path", "name": "statusId", "required": true, "dataType": "string" },
    };
    app.delete('/project/statuses/:statusId', ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController)), ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController.prototype.deleteStatus)), async function ProjectStatusesController_deleteStatus(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectStatusesController_deleteStatus, request, response });
            const controller = new project_statuses_controller_1.ProjectStatusesController();
            await templateService.apiHandler({
                methodName: 'deleteStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsProjectStatusesController_reorderStatuses = {
        projectId: { "in": "path", "name": "projectId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "statusIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
    };
    app.put('/project/:projectId/statuses/reorder', ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController)), ...((0, runtime_1.fetchMiddlewares)(project_statuses_controller_1.ProjectStatusesController.prototype.reorderStatuses)), async function ProjectStatusesController_reorderStatuses(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsProjectStatusesController_reorderStatuses, request, response });
            const controller = new project_statuses_controller_1.ProjectStatusesController();
            await templateService.apiHandler({
                methodName: 'reorderStatuses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPostController_getSalonPost = {
        salonId: { "in": "query", "name": "salonId", "required": true, "dataType": "string" },
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        limit: { "default": 20, "in": "query", "name": "limit", "dataType": "double" },
    };
    app.get('/post/get-salon-post', ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController)), ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController.prototype.getSalonPost)), async function PostController_getSalonPost(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPostController_getSalonPost, request, response });
            const controller = new post_controller_1.PostController();
            await templateService.apiHandler({
                methodName: 'getSalonPost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPostController_createPost = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "any" },
    };
    app.post('/post/create-post', ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController)), ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController.prototype.createPost)), async function PostController_createPost(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPostController_createPost, request, response });
            const controller = new post_controller_1.PostController();
            await templateService.apiHandler({
                methodName: 'createPost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPostController_addReaction = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/post/add-reaction', ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController)), ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController.prototype.addReaction)), async function PostController_addReaction(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPostController_addReaction, request, response });
            const controller = new post_controller_1.PostController();
            await templateService.apiHandler({
                methodName: 'addReaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPostController_deleteReaction = {
        reactionId: { "in": "query", "name": "reactionId", "required": true, "dataType": "string" },
    };
    app.delete('/post/delete-reaction', ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController)), ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController.prototype.deleteReaction)), async function PostController_deleteReaction(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPostController_deleteReaction, request, response });
            const controller = new post_controller_1.PostController();
            await templateService.apiHandler({
                methodName: 'deleteReaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPostController_createComment = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/post/create-comment', ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController)), ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController.prototype.createComment)), async function PostController_createComment(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPostController_createComment, request, response });
            const controller = new post_controller_1.PostController();
            await templateService.apiHandler({
                methodName: 'createComment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPostController_getComments = {
        postId: { "in": "query", "name": "postId", "required": true, "dataType": "string" },
    };
    app.get('/post/get-comments', ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController)), ...((0, runtime_1.fetchMiddlewares)(post_controller_1.PostController.prototype.getComments)), async function PostController_getComments(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsPostController_getComments, request, response });
            const controller = new post_controller_1.PostController();
            await templateService.apiHandler({
                methodName: 'getComments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLabelController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateLabelRequestDTO" },
    };
    app.post('/label/create', ...((0, runtime_1.fetchMiddlewares)(label_controller_1.LabelController)), ...((0, runtime_1.fetchMiddlewares)(label_controller_1.LabelController.prototype.create)), async function LabelController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsLabelController_create, request, response });
            const controller = new label_controller_1.LabelController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLabelController_list = {
        projectId: { "in": "query", "name": "projectId", "required": true, "dataType": "string" },
    };
    app.get('/label/list', ...((0, runtime_1.fetchMiddlewares)(label_controller_1.LabelController)), ...((0, runtime_1.fetchMiddlewares)(label_controller_1.LabelController.prototype.list)), async function LabelController_list(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsLabelController_list, request, response });
            const controller = new label_controller_1.LabelController();
            await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLabelController_remove = {
        labelId: { "in": "path", "name": "labelId", "required": true, "dataType": "string" },
    };
    app.delete('/label/:labelId', ...((0, runtime_1.fetchMiddlewares)(label_controller_1.LabelController)), ...((0, runtime_1.fetchMiddlewares)(label_controller_1.LabelController.prototype.remove)), async function LabelController_remove(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsLabelController_remove, request, response });
            const controller = new label_controller_1.LabelController();
            await templateService.apiHandler({
                methodName: 'remove',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsIssueController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateIssueRequestDTO" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/issue/create', ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController)), ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController.prototype.create)), async function IssueController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsIssueController_create, request, response });
            const controller = new issue_controller_1.IssueController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsIssueController_list = {
        projectId: { "in": "query", "name": "projectId", "required": true, "dataType": "string" },
        sprintId: { "in": "query", "name": "sprintId", "dataType": "string" },
        assigneeId: { "in": "query", "name": "assigneeId", "dataType": "string" },
        status: { "in": "query", "name": "status", "ref": "IssueStatus" },
        statusId: { "in": "query", "name": "statusId", "dataType": "string" },
        type: { "in": "query", "name": "type", "ref": "IssueType" },
    };
    app.get('/issue/list', ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController)), ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController.prototype.list)), async function IssueController_list(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsIssueController_list, request, response });
            const controller = new issue_controller_1.IssueController();
            await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsIssueController_getById = {
        issueId: { "in": "path", "name": "issueId", "required": true, "dataType": "string" },
    };
    app.get('/issue/:issueId', ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController)), ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController.prototype.getById)), async function IssueController_getById(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsIssueController_getById, request, response });
            const controller = new issue_controller_1.IssueController();
            await templateService.apiHandler({
                methodName: 'getById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsIssueController_update = {
        issueId: { "in": "path", "name": "issueId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateIssueRequestDTO" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.patch('/issue/:issueId', ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController)), ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController.prototype.update)), async function IssueController_update(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsIssueController_update, request, response });
            const controller = new issue_controller_1.IssueController();
            await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsIssueController_remove = {
        issueId: { "in": "path", "name": "issueId", "required": true, "dataType": "string" },
    };
    app.delete('/issue/:issueId', ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController)), ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController.prototype.remove)), async function IssueController_remove(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsIssueController_remove, request, response });
            const controller = new issue_controller_1.IssueController();
            await templateService.apiHandler({
                methodName: 'remove',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsIssueController_addComment = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateIssueCommentRequestDTO" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/issue/comment', ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController)), ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController.prototype.addComment)), async function IssueController_addComment(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsIssueController_addComment, request, response });
            const controller = new issue_controller_1.IssueController();
            await templateService.apiHandler({
                methodName: 'addComment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsIssueController_listComments = {
        issueId: { "in": "path", "name": "issueId", "required": true, "dataType": "string" },
    };
    app.get('/issue/:issueId/comments', ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController)), ...((0, runtime_1.fetchMiddlewares)(issue_controller_1.IssueController.prototype.listComments)), async function IssueController_listComments(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsIssueController_listComments, request, response });
            const controller = new issue_controller_1.IssueController();
            await templateService.apiHandler({
                methodName: 'listComments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminGroupController_listGroups = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        limit: { "default": 20, "in": "query", "name": "limit", "dataType": "double" },
        search: { "in": "query", "name": "search", "dataType": "string" },
    };
    app.get('/admin/groups', ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController)), ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController.prototype.listGroups)), async function AdminGroupController_listGroups(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminGroupController_listGroups, request, response });
            const controller = new group_controller_1.AdminGroupController();
            await templateService.apiHandler({
                methodName: 'listGroups',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminGroupController_getGroup = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.get('/admin/groups/:id', ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController)), ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController.prototype.getGroup)), async function AdminGroupController_getGroup(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminGroupController_getGroup, request, response });
            const controller = new group_controller_1.AdminGroupController();
            await templateService.apiHandler({
                methodName: 'getGroup',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminGroupController_createGroup = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        body: { "in": "body", "name": "body", "required": true, "ref": "GroupCreateDTO" },
    };
    app.post('/admin/groups', ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController)), ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController.prototype.createGroup)), async function AdminGroupController_createGroup(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminGroupController_createGroup, request, response });
            const controller = new group_controller_1.AdminGroupController();
            await templateService.apiHandler({
                methodName: 'createGroup',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminGroupController_updateGroup = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "GroupUpdateDTO" },
    };
    app.patch('/admin/groups/:id', ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController)), ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController.prototype.updateGroup)), async function AdminGroupController_updateGroup(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminGroupController_updateGroup, request, response });
            const controller = new group_controller_1.AdminGroupController();
            await templateService.apiHandler({
                methodName: 'updateGroup',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminGroupController_deleteGroup = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.delete('/admin/groups/:id', ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController)), ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController.prototype.deleteGroup)), async function AdminGroupController_deleteGroup(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminGroupController_deleteGroup, request, response });
            const controller = new group_controller_1.AdminGroupController();
            await templateService.apiHandler({
                methodName: 'deleteGroup',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminGroupController_addMembers = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "GroupAddMembersDTO" },
    };
    app.post('/admin/groups/:id/members', ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController)), ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController.prototype.addMembers)), async function AdminGroupController_addMembers(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminGroupController_addMembers, request, response });
            const controller = new group_controller_1.AdminGroupController();
            await templateService.apiHandler({
                methodName: 'addMembers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminGroupController_removeMember = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
    };
    app.delete('/admin/groups/:id/members/:userId', ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController)), ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController.prototype.removeMember)), async function AdminGroupController_removeMember(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminGroupController_removeMember, request, response });
            const controller = new group_controller_1.AdminGroupController();
            await templateService.apiHandler({
                methodName: 'removeMember',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminGroupController_updateMemberRole = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "GroupUpdateMemberRoleDTO" },
    };
    app.patch('/admin/groups/:id/members/:userId', ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController)), ...((0, runtime_1.fetchMiddlewares)(group_controller_1.AdminGroupController.prototype.updateMemberRole)), async function AdminGroupController_updateMemberRole(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminGroupController_updateMemberRole, request, response });
            const controller = new group_controller_1.AdminGroupController();
            await templateService.apiHandler({
                methodName: 'updateMemberRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsConversationController_getAllConversationByUser = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        limit: { "default": 20, "in": "query", "name": "limit", "dataType": "double" },
    };
    app.get('/conversation/all-conversation', authenticateMiddleware([{ "bearer": [] }]), ...((0, runtime_1.fetchMiddlewares)(conversation_controller_1.ConversationController)), ...((0, runtime_1.fetchMiddlewares)(conversation_controller_1.ConversationController.prototype.getAllConversationByUser)), async function ConversationController_getAllConversationByUser(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsConversationController_getAllConversationByUser, request, response });
            const controller = new conversation_controller_1.ConversationController();
            await templateService.apiHandler({
                methodName: 'getAllConversationByUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsConversationController_createConversation = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/conversation/create', authenticateMiddleware([{ "bearer": [] }]), ...((0, runtime_1.fetchMiddlewares)(conversation_controller_1.ConversationController)), ...((0, runtime_1.fetchMiddlewares)(conversation_controller_1.ConversationController.prototype.createConversation)), async function ConversationController_createConversation(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsConversationController_createConversation, request, response });
            const controller = new conversation_controller_1.ConversationController();
            await templateService.apiHandler({
                methodName: 'createConversation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsConversationController_sendMessage = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/conversation/send-message', ...((0, runtime_1.fetchMiddlewares)(conversation_controller_1.ConversationController)), ...((0, runtime_1.fetchMiddlewares)(conversation_controller_1.ConversationController.prototype.sendMessage)), async function ConversationController_sendMessage(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsConversationController_sendMessage, request, response });
            const controller = new conversation_controller_1.ConversationController();
            await templateService.apiHandler({
                methodName: 'sendMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsConversationController_getAllMessagesByConversation = {
        conversationId: { "in": "query", "name": "conversationId", "required": true, "dataType": "string" },
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        limit: { "default": 20, "in": "query", "name": "limit", "dataType": "double" },
    };
    app.get('/conversation/get-all-messages', ...((0, runtime_1.fetchMiddlewares)(conversation_controller_1.ConversationController)), ...((0, runtime_1.fetchMiddlewares)(conversation_controller_1.ConversationController.prototype.getAllMessagesByConversation)), async function ConversationController_getAllMessagesByConversation(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsConversationController_getAllMessagesByConversation, request, response });
            const controller = new conversation_controller_1.ConversationController();
            await templateService.apiHandler({
                methodName: 'getAllMessagesByConversation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminUserController_listUsers = {
        page: { "default": 1, "in": "query", "name": "page", "dataType": "double" },
        limit: { "default": 20, "in": "query", "name": "limit", "dataType": "double" },
        search: { "in": "query", "name": "search", "dataType": "string" },
        roleId: { "in": "query", "name": "roleId", "dataType": "string" },
        active: { "in": "query", "name": "active", "dataType": "boolean" },
    };
    app.get('/admin/users', ...((0, runtime_1.fetchMiddlewares)(admin_user_controller_1.AdminUserController)), ...((0, runtime_1.fetchMiddlewares)(admin_user_controller_1.AdminUserController.prototype.listUsers)), async function AdminUserController_listUsers(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminUserController_listUsers, request, response });
            const controller = new admin_user_controller_1.AdminUserController();
            await templateService.apiHandler({
                methodName: 'listUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminUserController_updateUser = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "AdminUserUpdateDTO" },
    };
    app.patch('/admin/users/:id', ...((0, runtime_1.fetchMiddlewares)(admin_user_controller_1.AdminUserController)), ...((0, runtime_1.fetchMiddlewares)(admin_user_controller_1.AdminUserController.prototype.updateUser)), async function AdminUserController_updateUser(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminUserController_updateUser, request, response });
            const controller = new admin_user_controller_1.AdminUserController();
            await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminUserController_resetPassword = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "AdminUserResetPasswordDTO" },
    };
    app.post('/admin/users/:id/reset-password', ...((0, runtime_1.fetchMiddlewares)(admin_user_controller_1.AdminUserController)), ...((0, runtime_1.fetchMiddlewares)(admin_user_controller_1.AdminUserController.prototype.resetPassword)), async function AdminUserController_resetPassword(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminUserController_resetPassword, request, response });
            const controller = new admin_user_controller_1.AdminUserController();
            await templateService.apiHandler({
                methodName: 'resetPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminUserController_deactivateUser = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
    };
    app.delete('/admin/users/:id', ...((0, runtime_1.fetchMiddlewares)(admin_user_controller_1.AdminUserController)), ...((0, runtime_1.fetchMiddlewares)(admin_user_controller_1.AdminUserController.prototype.deactivateUser)), async function AdminUserController_deactivateUser(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminUserController_deactivateUser, request, response });
            const controller = new admin_user_controller_1.AdminUserController();
            await templateService.apiHandler({
                methodName: 'deactivateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return async function runAuthenticationMiddleware(request, response, next) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts = [];
            const pushAndRethrow = (error) => {
                failedAttempts.push(error);
                throw error;
            };
            const secMethodOrPromises = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises = [];
                    for (const name in secMethod) {
                        secMethodAndPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                }
                else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                            .catch(pushAndRethrow));
                    }
                }
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            try {
                request['user'] = await Promise.any(secMethodOrPromises);
                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next();
            }
            catch (err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
