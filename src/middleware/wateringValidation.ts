import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

interface ValidationError {
    field: string;
    message: string;
}

export const validateWateringSchedule = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
    const { soilConditions, weatherConditions, plantAge, date } = req.body;

    // Validate soil conditions
    if (!soilConditions || typeof soilConditions !== 'object') {
        errors.push({
            field: 'soilConditions',
            message: 'Soil conditions are required'
        });
    } else {
        // Validate moisture levels
        ['moisture10cm', 'moisture20cm', 'moisture30cm'].forEach(field => {
            const value = soilConditions[field];
            if (typeof value !== 'number' || value < 0 || value > 100) {
                errors.push({
                    field: `soilConditions.${field}`,
                    message: `${field} must be between 0 and 100`
                });
            }
        });
    }

    // Validate weather conditions if provided manually
    if (weatherConditions) {
        // Validate temperature
        if (typeof weatherConditions.temperature !== 'number' || 
            weatherConditions.temperature < -50 || 
            weatherConditions.temperature > 60) {
            errors.push({
                field: 'weatherConditions.temperature',
                message: 'Temperature must be between -50 and 60°C'
            });
        }

        // Validate humidity
        if (typeof weatherConditions.humidity !== 'number' || 
            weatherConditions.humidity < 0 || 
            weatherConditions.humidity > 100) {
            errors.push({
                field: 'weatherConditions.humidity',
                message: 'Humidity must be between 0 and 100%'
            });
        }

        // Validate rainfall
        if (typeof weatherConditions.rainfall !== 'number' || 
            weatherConditions.rainfall < 0 || 
            weatherConditions.rainfall > 500) {
            errors.push({
                field: 'weatherConditions.rainfall',
                message: 'Rainfall must be between 0 and 500mm'
            });
        }
    }

    // Validate plant age
    if (!plantAge || typeof plantAge !== 'number' || plantAge < 0) {
        errors.push({
            field: 'plantAge',
            message: 'Plant age must be a positive number'
        });
    }

    // Validate date if provided
    if (date) {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            errors.push({
                field: 'date',
                message: 'Invalid date format'
            });
        }
    }

    if (errors.length > 0) {
        next(new AppError(400, 'Validation failed', errors));
        return;
    }

    next();
};

export const validateDateRange = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
    const { startDate, endDate } = req.query;

    // Validate start date if provided
    if (startDate) {
        const startDateObj = new Date(startDate as string);
        if (isNaN(startDateObj.getTime())) {
            errors.push({
                field: 'startDate',
                message: 'Invalid start date format'
            });
        }
    }

    // Validate end date if provided
    if (endDate) {
        const endDateObj = new Date(endDate as string);
        if (isNaN(endDateObj.getTime())) {
            errors.push({
                field: 'endDate',
                message: 'Invalid end date format'
            });
        }

        // Check if end date is after start date
        if (startDate && new Date(startDate as string) > new Date(endDate as string)) {
            errors.push({
                field: 'dateRange',
                message: 'End date must be after start date'
            });
        }
    }

    // Validate date range span (e.g., maximum 1 year)
    if (startDate && endDate) {
        const startDateObj = new Date(startDate as string);
        const endDateObj = new Date(endDate as string);
        const daysDifference = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24));
        
        if (daysDifference > 365) {
            errors.push({
                field: 'dateRange',
                message: 'Date range cannot exceed 1 year'
            });
        }
    }

    if (errors.length > 0) {
        next(new AppError(400, 'Validation failed', errors));
        return;
    }

    next();
};