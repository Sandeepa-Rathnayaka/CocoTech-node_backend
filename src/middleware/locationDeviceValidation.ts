import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { isValidObjectId } from 'mongoose';

interface ValidationError {
    field: string;
    message: string;
}

export const validateLocation = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
    const {
        name,
        coordinates,
        area,
        soilType,
        totalTrees,
        plantationDate,
        deviceId
    } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.length < 2) {
        errors.push({
            field: 'name',
            message: 'Name must be at least 2 characters long'
        });
    }

    // Validate coordinates
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        errors.push({
            field: 'coordinates',
            message: 'Valid coordinates (latitude and longitude) are required'
        });
    } else {
        if (coordinates.latitude < -90 || coordinates.latitude > 90) {
            errors.push({
                field: 'coordinates.latitude',
                message: 'Latitude must be between -90 and 90'
            });
        }
        if (coordinates.longitude < -180 || coordinates.longitude > 180) {
            errors.push({
                field: 'coordinates.longitude',
                message: 'Longitude must be between -180 and 180'
            });
        }
    }

    // Validate area
    if (!area || isNaN(area) || area <= 0) {
        errors.push({
            field: 'area',
            message: 'Area must be a positive number'
        });
    }

    // Validate soil type
    const validSoilTypes = ['Lateritic', 'Sandy Loam', 'Cinnamon Sand', 'Red Yellow Podzolic', 'Alluvial'];
    if (!soilType || !validSoilTypes.includes(soilType)) {
        errors.push({
            field: 'soilType',
            message: `Soil type must be one of: ${validSoilTypes.join(', ')}`
        });
    }

    // Validate total trees
    if (!totalTrees || isNaN(totalTrees) || totalTrees < 1) {
        errors.push({
            field: 'totalTrees',
            message: 'Total trees must be at least 1'
        });
    }

    // Validate plantation date
    if (!plantationDate || isNaN(new Date(plantationDate).getTime())) {
        errors.push({
            field: 'plantationDate',
            message: 'Valid plantation date is required'
        });
    }

    // Validate deviceId if provided
    if (deviceId && typeof deviceId !== 'string') {
        errors.push({
            field: 'deviceId',
            message: 'Device ID must be a valid string'
        });
    }

    if (errors.length > 0) {
        next(new AppError(400, 'Validation failed', errors));
        return;
    }

    next();
};

export const validateDevice = (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
    const {
        deviceId,
        type,
        firmware,
        settings
    } = req.body;

    // Validate device ID
    if (!deviceId || typeof deviceId !== 'string' || deviceId.length < 3) {
        errors.push({
            field: 'deviceId',
            message: 'Device ID must be at least 3 characters long'
        });
    }

    // Validate device type
    const validTypes = ['soil_sensor', 'moisture_sensor'];
    if (!type || !validTypes.includes(type)) {
        errors.push({
            field: 'type',
            message: `Device type must be one of: ${validTypes.join(', ')}`
        });
    }

    // Validate firmware
    if (!firmware || typeof firmware !== 'string') {
        errors.push({
            field: 'firmware',
            message: 'Firmware version is required'
        });
    }

    // Validate settings if provided
    if (settings) {
        // Validate reading interval
        if (settings.readingInterval && (
            isNaN(settings.readingInterval) || 
            settings.readingInterval < 1 || 
            settings.readingInterval > 1440
        )) {
            errors.push({
                field: 'settings.readingInterval',
                message: 'Reading interval must be between 1 and 1440 minutes'
            });
        }

        // Validate reporting interval
        if (settings.reportingInterval && (
            isNaN(settings.reportingInterval) || 
            settings.reportingInterval < 1 || 
            settings.reportingInterval > 1440
        )) {
            errors.push({
                field: 'settings.reportingInterval',
                message: 'Reporting interval must be between 1 and 1440 minutes'
            });
        }

        // Validate thresholds
        if (settings.thresholds) {
            const { moisture, temperature, humidity } = settings.thresholds;

            if (moisture !== undefined && (isNaN(moisture) || moisture < 0 || moisture > 100)) {
                errors.push({
                    field: 'settings.thresholds.moisture',
                    message: 'Moisture threshold must be between 0 and 100'
                });
            }

            if (temperature !== undefined && (isNaN(temperature) || temperature < -50 || temperature > 100)) {
                errors.push({
                    field: 'settings.thresholds.temperature',
                    message: 'Temperature threshold must be between -50 and 100'
                });
            }

            if (humidity !== undefined && (isNaN(humidity) || humidity < 0 || humidity > 100)) {
                errors.push({
                    field: 'settings.thresholds.humidity',
                    message: 'Humidity threshold must be between 0 and 100'
                });
            }
        }
    }

    if (errors.length > 0) {
        next(new AppError(400, 'Validation failed', errors));
        return;
    }

    next();
};
