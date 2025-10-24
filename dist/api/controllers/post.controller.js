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
exports.PostController = void 0;
const tsoa_1 = require("tsoa");
const auth_middleware_1 = require("../middleware/auth.middleware");
const post_sa_1 = __importDefault(require("../../service/applicative/post.sa"));
let PostController = class PostController extends tsoa_1.Controller {
    async getSalonPost(salonId, page = 1, limit = 20) {
        return post_sa_1.default.getPostSalon(salonId, page, limit);
    }
    async createPost(body) {
        return post_sa_1.default.createPost(body);
    }
    async addReaction(req) {
        return post_sa_1.default.createReaction(req.body, req.user.id);
    }
    async deleteReaction(reactionId) {
        return post_sa_1.default.deleteReaction(reactionId);
    }
    async createComment(req) {
        return post_sa_1.default.createComment(req.body, req.user.id);
    }
    async getComments(postId) {
        return post_sa_1.default.getComments(postId);
    }
};
exports.PostController = PostController;
__decorate([
    (0, tsoa_1.Get)('get-salon-post'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getSalonPost", null);
__decorate([
    (0, tsoa_1.Post)('create-post'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
__decorate([
    (0, tsoa_1.Post)('add-reaction'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "addReaction", null);
__decorate([
    (0, tsoa_1.Delete)('delete-reaction'),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deleteReaction", null);
__decorate([
    (0, tsoa_1.Post)('create-comment'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createComment", null);
__decorate([
    (0, tsoa_1.Get)('get-comments'),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getComments", null);
exports.PostController = PostController = __decorate([
    (0, tsoa_1.Route)('post'),
    (0, tsoa_1.Tags)('post'),
    (0, tsoa_1.Middlewares)([auth_middleware_1.authMiddleware])
], PostController);
