"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const user_controller_1 = require("./../controllers/user.controller");
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
const post_controller_1 = require("./../controllers/post.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const label_controller_1 = require("./../controllers/label.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const issue_controller_1 = require("./../controllers/issue.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const conversation_controller_1 = require("./../controllers/conversation.controller");
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
            "members": { "dataType": "array", "array": { "dataType": "refObject", "ref": "UserDTO" }, "required": true },
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
