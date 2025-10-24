"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEController = void 0;
const tsoa_1 = require("tsoa");
const auth_middleware_1 = require("../middleware/auth.middleware");
const sse_sa_1 = __importDefault(require("../../service/applicative/sse.sa"));
let SSEController = class SSEController extends tsoa_1.Controller {
    async sendNotification(body) {
        return sse_sa_1.default.sendEventToUser({ ...body });
    }
};
exports.SSEController = SSEController;
__decorate([
    (0, tsoa_1.Post)('send'),
    (0, tsoa_1.Middlewares)([auth_middleware_1.authMiddleware]),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SSEController.prototype, "sendNotification", null);
exports.SSEController = SSEController = __decorate([
    (0, tsoa_1.Route)('notification'),
    (0, tsoa_1.Tags)('notification')
], SSEController);
