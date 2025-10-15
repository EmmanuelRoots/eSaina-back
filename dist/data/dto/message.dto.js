"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenderType = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "TEXT";
    MessageType["IMAGE"] = "IMAGE";
    MessageType["FILE"] = "FILE";
})(MessageType || (exports.MessageType = MessageType = {}));
var SenderType;
(function (SenderType) {
    SenderType["SYSTEM"] = "SYSTEM";
    SenderType["AI"] = "AI";
    SenderType["USER"] = "USER";
})(SenderType || (exports.SenderType = SenderType = {}));
