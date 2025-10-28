"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTree = void 0;
const buildTree = (flat) => {
    const map = new Map();
    flat.forEach(c => map.set(c.id, { ...c, replies: [] }));
    const tree = [];
    flat.forEach(c => {
        if (c.parentId)
            map.get(c.parentId)?.replies.push(map.get(c.id));
        else
            tree.push(map.get(c.id));
    });
    return tree;
};
exports.buildTree = buildTree;
