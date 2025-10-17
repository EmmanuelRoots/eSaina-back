"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalonMemberRole = exports.ReactionType = exports.PostType = void 0;
var PostType;
(function (PostType) {
    PostType["TEXT"] = "TEXT";
    PostType["IMAGE"] = "IMAGE";
    PostType["VIDEO"] = "VIDEO";
})(PostType || (exports.PostType = PostType = {}));
var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "LIKE";
    ReactionType["LOVE"] = "LOVE";
    ReactionType["HAHA"] = "HAHA";
    ReactionType["WOW"] = "WOW";
    ReactionType["SAD"] = "SAD";
    ReactionType["ANGRY"] = "ANGRY";
})(ReactionType || (exports.ReactionType = ReactionType = {}));
var SalonMemberRole;
(function (SalonMemberRole) {
    SalonMemberRole["ADMIN"] = "ADMIN";
    SalonMemberRole["MEMBER"] = "MEMBER";
})(SalonMemberRole || (exports.SalonMemberRole = SalonMemberRole = {}));
