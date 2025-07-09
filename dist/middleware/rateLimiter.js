"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWhitelisted = exports.rateLimiters = exports.createCustomLimiter = exports.sensitiveRouteLimiter = exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorHandler_1 = require("./errorHandler");
const errorHandler = (req, res) => {
    throw new errorHandler_1.AppError(429, 'Too many requests, please try again later');
};
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: errorHandler
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
    handler: errorHandler
});
exports.sensitiveRouteLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Too many requests, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
    handler: errorHandler
});
const createCustomLimiter = (options) => {
    return (0, express_rate_limit_1.default)({
        ...options,
        standardHeaders: true,
        legacyHeaders: false,
        handler: errorHandler
    });
};
exports.createCustomLimiter = createCustomLimiter;
exports.rateLimiters = {
    public: exports.apiLimiter,
    auth: exports.authLimiter,
    sensitive: exports.sensitiveRouteLimiter,
    custom: {
        restricted: (0, exports.createCustomLimiter)({
            windowMs: 24 * 60 * 60 * 1000,
            max: 10,
            message: 'Daily limit exceeded, please try again tomorrow'
        }),
        trusted: (0, exports.createCustomLimiter)({
            windowMs: 15 * 60 * 1000,
            max: 500,
            message: 'Rate limit exceeded'
        })
    }
};
const isWhitelisted = (ip) => {
    const whitelistedIPs = process.env.WHITELISTED_IPS?.split(',') || [];
    return whitelistedIPs.includes(ip);
};
exports.isWhitelisted = isWhitelisted;
//# sourceMappingURL=rateLimiter.js.map