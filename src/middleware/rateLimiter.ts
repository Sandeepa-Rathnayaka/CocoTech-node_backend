import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { AppError } from './errorHandler';

// Types for rate limiter options
interface RateLimitOptions {
    windowMs: number;
    max: number;
    message?: string;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
}

// Create custom error handler
const errorHandler = (req: Request, res: Response) => {
    throw new AppError(429, 'Too many requests, please try again later');
};

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: errorHandler
});

// More strict limiter for auth routes
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login attempts per hour
    message: 'Too many login attempts, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
    handler: errorHandler
});

// Very strict limiter for sensitive routes (password reset, etc.)
export const sensitiveRouteLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 requests per hour
    message: 'Too many requests, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
    handler: errorHandler
});

// Create limiter for specific routes or IPs
export const createCustomLimiter = (options: RateLimitOptions) => {
    return rateLimit({
        ...options,
        standardHeaders: true,
        legacyHeaders: false,
        handler: errorHandler
    });
};

// Default configuration for different route types
export const rateLimiters = {
    // Public API endpoints
    public: apiLimiter,

    // Authentication routes
    auth: authLimiter,

    // Sensitive operations
    sensitive: sensitiveRouteLimiter,

    // Custom limits for specific routes
    custom: {
        // Example: Very limited access (e.g., for beta features)
        restricted: createCustomLimiter({
            windowMs: 24 * 60 * 60 * 1000, // 24 hours
            max: 10, // 10 requests per day
            message: 'Daily limit exceeded, please try again tomorrow'
        }),

        // Example: Higher limits for trusted clients
        trusted: createCustomLimiter({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 500, // 500 requests per 15 minutes
            message: 'Rate limit exceeded'
        })
    }
};

// Helper function to check if IP is whitelisted
export const isWhitelisted = (ip: string): boolean => {
    const whitelistedIPs = process.env.WHITELISTED_IPS?.split(',') || [];
    return whitelistedIPs.includes(ip);
};

// Create whitelist middleware
// export const skipIfWhitelisted = (req: Request): boolean => {
//     return isWhitelisted(req.ip);
// };

// Example of how to use with whitelist
// export const conditionalRateLimit = (limiter: any) => {
//     return (req: Request, res: Response, next: Function) => {
//         if (skipIfWhitelisted(req)) {
//             return next();
//         }
//         return limiter(req, res, next);
//     };
// };