"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = exports.generateToken = exports.sanitizeUser = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
exports.validatePassword = validatePassword;
const sanitizeUser = (user) => {
    const { password, __v, ...sanitizedUser } = user;
    return sanitizedUser;
};
exports.sanitizeUser = sanitizeUser;
const generateToken = (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};
exports.generateToken = generateToken;
const formatError = (error) => {
    if (error.code === 11000) {
        return 'Duplicate field value entered';
    }
    return error.message;
};
exports.formatError = formatError;
//# sourceMappingURL=index.js.map