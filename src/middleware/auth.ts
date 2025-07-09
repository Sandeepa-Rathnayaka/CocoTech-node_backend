// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';
import { User } from '../models/user';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
            token?: string;
        }
    }
}

// Define JWT payload interface
interface JWTPayload {
    id: string;
    [key: string]: any;
}

export const authenticateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return next(new AppError(401, 'No token provided'));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwt.secret as Secret) as JWTPayload;
            
            // Get user from database
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return next(new AppError(401, 'User not found'));
            }

            if (!user.isActive) {
                return next(new AppError(401, 'User account is deactivated'));
            }

            // Add user and token to request object
            req.user = user;
            req.token = token;
            
            next();
        } catch (error) {
            return next(new AppError(401, 'Invalid token'));
        }
    } catch (error) {
        next(error);
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(403, 'You do not have permission to perform this action')
            );
        }
        next();
    };
};

// Generate JWT Token
export const generateAuthToken = (userId: string): string => {
    const payload: JWTPayload = { id: userId };
    const options: SignOptions = {
        expiresIn: '10h'
    };

    return jwt.sign(
        payload,
        config.jwt.secret as Secret,
        options
    );
};

// Generate Refresh Token
export const generateRefreshToken = (userId: string): string => {
    const payload: JWTPayload = { id: userId };
    const options: SignOptions = {
        expiresIn: '10h'
    };

    return jwt.sign(
        payload,
        config.jwt.secret as Secret,
        options
    );
};