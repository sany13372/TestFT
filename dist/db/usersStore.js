"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.getUser = exports.addUser = void 0;
const users = new Map();
const addUser = (userId, days) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    users.set(userId, { isActive: true, expiryDate });
};
exports.addUser = addUser;
const getUser = (userId) => {
    return users.get(userId);
};
exports.getUser = getUser;
const removeUser = (userId) => {
    users.delete(userId);
};
exports.removeUser = removeUser;
