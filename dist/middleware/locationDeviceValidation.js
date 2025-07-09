"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDevice = exports.validateLocation = void 0;
const errorHandler_1 = require("./errorHandler");
const validateLocation = (req, res, next) => {
    const errors = [];
    const { name, coordinates, area, soilType, totalTrees, plantationDate, deviceId } = req.body;
    if (!name || typeof name !== 'string' || name.length < 2) {
        errors.push({
            field: 'name',
            message: 'Name must be at least 2 characters long'
        });
    }
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        errors.push({
            field: 'coordinates',
            message: 'Valid coordinates (latitude and longitude) are required'
        });
    }
    else {
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
    if (!area || isNaN(area) || area <= 0) {
        errors.push({
            field: 'area',
            message: 'Area must be a positive number'
        });
    }
    const validSoilTypes = ['Lateritic', 'Sandy Loam', 'Cinnamon Sand', 'Red Yellow Podzolic', 'Alluvial'];
    if (!soilType || !validSoilTypes.includes(soilType)) {
        errors.push({
            field: 'soilType',
            message: `Soil type must be one of: ${validSoilTypes.join(', ')}`
        });
    }
    if (!totalTrees || isNaN(totalTrees) || totalTrees < 1) {
        errors.push({
            field: 'totalTrees',
            message: 'Total trees must be at least 1'
        });
    }
    if (!plantationDate || isNaN(new Date(plantationDate).getTime())) {
        errors.push({
            field: 'plantationDate',
            message: 'Valid plantation date is required'
        });
    }
    if (deviceId && typeof deviceId !== 'string') {
        errors.push({
            field: 'deviceId',
            message: 'Device ID must be a valid string'
        });
    }
    if (errors.length > 0) {
        next(new errorHandler_1.AppError(400, 'Validation failed', errors));
        return;
    }
    next();
};
exports.validateLocation = validateLocation;
const validateDevice = (req, res, next) => {
    const errors = [];
    const { deviceId, type, firmware, settings } = req.body;
    if (!deviceId || typeof deviceId !== 'string' || deviceId.length < 3) {
        errors.push({
            field: 'deviceId',
            message: 'Device ID must be at least 3 characters long'
        });
    }
    const validTypes = ['soil_sensor', 'moisture_sensor'];
    if (!type || !validTypes.includes(type)) {
        errors.push({
            field: 'type',
            message: `Device type must be one of: ${validTypes.join(', ')}`
        });
    }
    if (!firmware || typeof firmware !== 'string') {
        errors.push({
            field: 'firmware',
            message: 'Firmware version is required'
        });
    }
    if (settings) {
        if (settings.readingInterval && (isNaN(settings.readingInterval) ||
            settings.readingInterval < 1 ||
            settings.readingInterval > 1440)) {
            errors.push({
                field: 'settings.readingInterval',
                message: 'Reading interval must be between 1 and 1440 minutes'
            });
        }
        if (settings.reportingInterval && (isNaN(settings.reportingInterval) ||
            settings.reportingInterval < 1 ||
            settings.reportingInterval > 1440)) {
            errors.push({
                field: 'settings.reportingInterval',
                message: 'Reporting interval must be between 1 and 1440 minutes'
            });
        }
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
        next(new errorHandler_1.AppError(400, 'Validation failed', errors));
        return;
    }
    next();
};
exports.validateDevice = validateDevice;
//# sourceMappingURL=locationDeviceValidation.js.map