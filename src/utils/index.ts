import { IUser } from '../models/user';

// Email validation
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Remove sensitive data from user object
export const sanitizeUser = (user: any): Partial<IUser> => {
    const { password, __v, ...sanitizedUser } = user;
    return sanitizedUser;
};

// Generate random token
export const generateToken = (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};

// Format error messages
export const formatError = (error: any): string => {
    if (error.code === 11000) {
        return 'Duplicate field value entered';
    }
    return error.message;
};