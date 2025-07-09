import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import mongoose from 'mongoose';

// Interface for validation errors
interface ValidationError {
    field: string;
    message: string;
}

// Validation helper functions
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const isValidName = (name: string): boolean => {
    return name.length >= 2 && name.length <= 50;
};

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Registration validation
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
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

    // if (!password || !isValidPassword(password)) {
    //     errors.push({
    //         field: 'password',
    //         message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'
    //     });
    // }

    // if (password !== confirmPassword) {
    //     errors.push({
    //         field: 'confirmPassword',
    //         message: 'Passwords do not match'
    //     });
    // }

    if (errors.length > 0) {
        console.log(errors);
        return next(new AppError(400, 'Validation failed', errors));
    }

    next();
};

// Login validation
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
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
        return next(new AppError(400, 'Validation failed', errors));
    }

    next();
};

// Password reset validation
export const validatePasswordReset = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
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
        return next(new AppError(400, 'Validation failed', errors));
    }

    next();
};

// Forgot password validation
export const validateForgotPassword = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
        errors.push({
            field: 'email',
            message: 'Please provide a valid email address'
        });
    }

    if (errors.length > 0) {
        return next(new AppError(400, 'Validation failed', errors));
    }

    next();
};

// User update validation
export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
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

        // if (password !== confirmPassword) {
        //     errors.push({
        //         field: 'confirmPassword',
        //         message: 'Passwords do not match'
        //     });
        // }
    }

    if (role && !['user', 'admin'].includes(role)) {
        errors.push({
            field: 'role',
            message: 'Invalid role. Role must be either "user" or "admin"'
        });
    }

    if (errors.length > 0) {
        return next(new AppError(400, 'Validation failed', errors));
    }

    next();
};

// ID parameter validation
export const validateId = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return next(new AppError(400, 'Invalid ID format', [{
            field: 'id',
            message: 'Invalid ID format'
        }]));
    }

    next();
};

// Validate pagination
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
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
        return next(new AppError(400, 'Validation failed', errors));
    }

    next();
};

// Export helper functions for reuse
export const validationHelpers = {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidObjectId
};

// Export everything
export {
    ValidationError,
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidObjectId
};