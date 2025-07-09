"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDateRange = exports.validateWateringSchedule = void 0;
const errorHandler_1 = require("./errorHandler");
const validateWateringSchedule = (req, res, next) => {
    const errors = [];
    const { soilConditions, weatherConditions, plantAge, date } = req.body;
    if (!soilConditions || typeof soilConditions !== 'object') {
        errors.push({
            field: 'soilConditions',
            message: 'Soil conditions are required'
        });
    }
    else {
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
    if (weatherConditions) {
        if (typeof weatherConditions.temperature !== 'number' ||
            weatherConditions.temperature < -50 ||
            weatherConditions.temperature > 60) {
            errors.push({
                field: 'weatherConditions.temperature',
                message: 'Temperature must be between -50 and 60°C'
            });
        }
        if (typeof weatherConditions.humidity !== 'number' ||
            weatherConditions.humidity < 0 ||
            weatherConditions.humidity > 100) {
            errors.push({
                field: 'weatherConditions.humidity',
                message: 'Humidity must be between 0 and 100%'
            });
        }
        if (typeof weatherConditions.rainfall !== 'number' ||
            weatherConditions.rainfall < 0 ||
            weatherConditions.rainfall > 500) {
            errors.push({
                field: 'weatherConditions.rainfall',
                message: 'Rainfall must be between 0 and 500mm'
            });
        }
    }
    if (!plantAge || typeof plantAge !== 'number' || plantAge < 0) {
        errors.push({
            field: 'plantAge',
            message: 'Plant age must be a positive number'
        });
    }
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
        next(new errorHandler_1.AppError(400, 'Validation failed', errors));
        return;
    }
    next();
};
exports.validateWateringSchedule = validateWateringSchedule;
const validateDateRange = (req, res, next) => {
    const errors = [];
    const { startDate, endDate } = req.query;
    if (startDate) {
        const startDateObj = new Date(startDate);
        if (isNaN(startDateObj.getTime())) {
            errors.push({
                field: 'startDate',
                message: 'Invalid start date format'
            });
        }
    }
    if (endDate) {
        const endDateObj = new Date(endDate);
        if (isNaN(endDateObj.getTime())) {
            errors.push({
                field: 'endDate',
                message: 'Invalid end date format'
            });
        }
        if (startDate && new Date(startDate) > new Date(endDate)) {
            errors.push({
                field: 'dateRange',
                message: 'End date must be after start date'
            });
        }
    }
    if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const daysDifference = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24));
        if (daysDifference > 365) {
            errors.push({
                field: 'dateRange',
                message: 'Date range cannot exceed 1 year'
            });
        }
    }
    if (errors.length > 0) {
        next(new errorHandler_1.AppError(400, 'Validation failed', errors));
        return;
    }
    next();
};
exports.validateDateRange = validateDateRange;
//# sourceMappingURL=wateringValidation.js.map