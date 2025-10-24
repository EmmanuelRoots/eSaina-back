"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const user_controller_1 = require("./../controllers/user.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const sse_controller_1 = require("./../controllers/sse.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const salon_controller_1 = require("./../controllers/salon.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const post_controller_1 = require("./../controllers/post.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const conversation_controller_1 = require("./../controllers/conversation.controller");
const swagger_middleware_1 = require("./../middleware/swagger.middleware");
const expressAuthenticationRecasted = swagger_middleware_1.expressAuthentication;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
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
        body: { "in": "body", "name": "body", "required": true, "ref": "UserDTO" },
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
