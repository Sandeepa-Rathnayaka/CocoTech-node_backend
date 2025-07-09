"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAuthToken = exports.authorizeRoles = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const errorHandler_1 = require("./errorHandler");
const user_1 = require("../models/user");
const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return next(new errorHandler_1.AppError(401, 'No token provided'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
            const user = await user_1.User.findById(decoded.id).select('-password');
            if (!user) {
                return next(new errorHandler_1.AppError(401, 'User not found'));
            }
            if (!user.isActive) {
                return next(new errorHandler_1.AppError(401, 'User account is deactivated'));
            }
            req.user = user;
            req.token = token;
            next();
        }
        catch (error) {
            return next(new errorHandler_1.AppError(401, 'Invalid token'));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authenticateJWT = authenticateJWT;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError(403, 'You do not have permission to perform this action'));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
const generateAuthToken = (userId) => {
    const payload = { id: userId };
    const options = {
        expiresIn: '10h'
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, options);
};
exports.generateAuthToken = generateAuthToken;
const generateRefreshToken = (userId) => {
    const payload = { id: userId };
    const options = {
        expiresIn: '10h'
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, options);
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=auth.js.map