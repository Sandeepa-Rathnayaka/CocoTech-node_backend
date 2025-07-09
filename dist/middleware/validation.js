"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObjectId = exports.isValidName = exports.isValidPassword = exports.isValidEmail = exports.validationHelpers = exports.validatePagination = exports.validateId = exports.validateUserUpdate = exports.validateForgotPassword = exports.validatePasswordReset = exports.validateLogin = exports.validateRegister = void 0;
const errorHandler_1 = require("./errorHandler");
const mongoose_1 = __importDefault(require("mongoose"));
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
exports.isValidPassword = isValidPassword;
const isValidName = (name) => {
    return name.length >= 2 && name.length <= 50;
};
exports.isValidName = isValidName;
const isValidObjectId = (id) => {
    return mongoose_1.default.Types.ObjectId.isValid(id);
};
exports.isValidObjectId = isValidObjectId;
const validateRegister = (req, res, next) => {
    const errors = [];
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !isValidName(name)) {
        errors.push({
            field: 'name',
            message: 'Name must be between 2 and 50 characters'
        });
    }
    if (!email || !isValidEmail(email)) {
        errors.push({
            field: 'email',
            message: 'Please provide a valid email address'
        });
    }
    if (errors.length > 0) {
        console.log(errors);
        return next(new errorHandler_1.AppError(400, 'Validation failed', errors));
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const errors = [];
    const { email, password } = req.body;
    if (!email || !isValidEmail(email)) {
        errors.push({
            field: 'email',
            message: 'Please provide a valid email address'
        });
    }
    if (!password) {
        errors.push({
            field: 'password',
            message: 'Password is required'
        });
    }
    if (errors.length > 0) {
        return next(new errorHandler_1.AppError(400, 'Validation failed', errors));
    }
    next();
};
exports.validateLogin = validateLogin;
const validatePasswordReset = (req, res, next) => {
    const errors = [];
    const { password, confirmPassword } = req.body;
    if (!password || !isValidPassword(password)) {
        errors.push({
            field: 'password',
            message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
        });
    }
    if (password !== confirmPassword) {
        errors.push({
            field: 'confirmPassword',
            message: 'Passwords do not match'
        });
    }
    if (errors.length > 0) {
        return next(new errorHandler_1.AppError(400, 'Validation failed', errors));
    }
    next();
};
exports.validatePasswordReset = validatePasswordReset;
const validateForgotPassword = (req, res, next) => {
    const errors = [];
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
        errors.push({
            field: 'email',
            message: 'Please provide a valid email address'
        });
    }
    if (errors.length > 0) {
        return next(new errorHandler_1.AppError(400, 'Validation failed', errors));
    }
    next();
};
exports.validateForgotPassword = validateForgotPassword;
const validateUserUpdate = (req, res, next) => {
    const errors = [];
    const { name, email, password, confirmPassword, role } = req.body;
    if (name && !isValidName(name)) {
        errors.push({
            field: 'name',
            message: 'Name must be between 2 and 50 characters'
        });
    }
    if (email && !isValidEmail(email)) {
        errors.push({
            field: 'email',
            message: 'Please provide a valid email address'
        });
    }
    if (password) {
        if (!isValidPassword(password)) {
            errors.push({
                field: 'password',
                message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
            });
        }
    }
    if (role && !['user', 'admin'].includes(role)) {
        errors.push({
            field: 'role',
            message: 'Invalid role. Role must be either "user" or "admin"'
        });
    }
    if (errors.length > 0) {
        return next(new errorHandler_1.AppError(400, 'Validation failed', errors));
    }
    next();
};
exports.validateUserUpdate = validateUserUpdate;
const validateId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return next(new errorHandler_1.AppError(400, 'Invalid ID format', [{
                field: 'id',
                message: 'Invalid ID format'
            }]));
    }
    next();
};
exports.validateId = validateId;
const validatePagination = (req, res, next) => {
    const errors = [];
    const { page, limit, sort } = req.query;
    if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
        errors.push({
            field: 'page',
            message: 'Page must be a positive integer'
        });
    }
    if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        errors.push({
            field: 'limit',
            message: 'Limit must be a positive integer between 1 and 100'
        });
    }
    if (sort && typeof sort !== 'string') {
        errors.push({
            field: 'sort',
            message: 'Sort parameter must be a string'
        });
    }
    if (errors.length > 0) {
        return next(new errorHandler_1.AppError(400, 'Validation failed', errors));
    }
    next();
};
exports.validatePagination = validatePagination;
exports.validationHelpers = {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidObjectId
};
//# sourceMappingURL=validation.js.map