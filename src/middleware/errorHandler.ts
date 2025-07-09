import { Request, Response, NextFunction } from 'express';

interface ValidationError {
    field: string;
    message: string;
}

export class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
    public errors?: ValidationError[];

    constructor(statusCode: number, message: string, errors?: ValidationError[]) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: AppError | Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errors: err.errors,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
        return;
    }

    // Handle unexpected errors
    console.error('Unexpected error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Not Found error handler
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const err = new AppError(404, `Cannot find ${req.originalUrl} on this server!`);
    next(err);
};

// Async handler wrapper to avoid try-catch blocks
export const asyncHandler = (fn: Function) => (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};