// src/types/index.ts

import { Document } from 'mongoose';

// Common Types
export type SoilType = 'Lateritic' | 'Sandy Loam' | 'Cinnamon Sand' | 'Red Yellow Podzolic' | 'Alluvial';
export type DeviceType = 'soil_sensor' | 'moisture_sensor' ;
export type DeviceStatus = 'active' | 'inactive' | 'maintenance';
export type ScheduleStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'cancelled';

// Location Types
export interface ICoordinates {
    latitude: number;
    longitude: number;
}

export interface ILocation extends Document {
    name: string;
    userId: string;
    coordinates: ICoordinates;
    area: number;
    soilType: SoilType;
    totalTrees: number;
    deviceId?: string;
    status: 'active' | 'inactive';
    plantationDate: Date;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Device Types
export interface IDeviceSettings {
    readingInterval: number;
    reportingInterval: number;
    thresholds: {
        moisture?: number;
        temperature?: number;
        humidity?: number;
    };
}

export interface IDeviceReading {
    moisture10cm: number;
    moisture20cm: number;
    moisture30cm: number;
    timestamp: Date;
}

export interface IDevice extends Document {
    deviceId: string;
    locationId?: string;
    userId: string;
    type: DeviceType;
    status: DeviceStatus;
    lastReading?: IDeviceReading;
    lastMaintenance?: Date;
    batteryLevel?: number;
    firmware: string;
    settings: IDeviceSettings;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Watering Schedule Types
export interface ISoilConditions {
    moisture10cm: number;
    moisture20cm: number;
    moisture30cm: number;
    soilType: SoilType;
}

export interface IWeatherConditions {
    temperature: number;
    humidity: number;
    rainfall: number;
}

export interface IExecutionDetails {
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    executedBy?: 'automatic' | 'manual';
    deviceStatus?: string;
    errors?: string[];
}

export interface IWateringSchedule extends Document {
    userId: string;
    locationId: string;
    deviceId?: string;
    date: Date;
    status: ScheduleStatus;
    recommendedAmount: number;
    actualAmount?: number;
    soilConditions: ISoilConditions;
    weatherConditions: IWeatherConditions;
    plantAge: number;
    predictionConfidence: number;
    executionDetails?: IExecutionDetails;
    notes?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Request Types
export interface ICreateLocationRequest {
    name: string;
    coordinates: ICoordinates;
    area: number;
    soilType: SoilType;
    totalTrees: number;
    deviceId?: string;
    plantationDate: Date;
    description?: string;
}

export interface ICreateDeviceRequest {
    deviceId: string;
    type: DeviceType;
    firmware: string;
    settings: IDeviceSettings;
}

export interface ICreateScheduleRequest {
    soilConditions?: Partial<ISoilConditions>;
    weatherConditions?: Partial<IWeatherConditions>;
    plantAge: number;
    date?: Date;
}

// Response Types
export interface IApiResponse<T> {
    status: 'success' | 'fail' | 'error';
    data?: T;
    message?: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}

// Weather API Types
export interface IWeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    description: string;
}

export interface IWeatherForecast extends IWeatherData {
    date: Date;
}

// Firebase Types
export interface IDeviceReadingRecord {
    moisture10cm: number;
    moisture20cm: number;
    moisture30cm: number;
    timestamp: Date;
    deviceId: string;
    metadata?: {
        batteryLevel?: number;
        signalStrength?: number;
        errors?: string[];
    };
}

// Utility Types
export interface IDateRange {
    startDate: Date;
    endDate: Date;
}

export interface IPaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
}

export interface IPaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
}

// Error Types
export interface IValidationError {
    field: string;
    message: string;
}

export interface IAppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    errors?: IValidationError[];
}