"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopraService = void 0;
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = require("mongoose");
const copraReading_1 = require("../models/copraReading");
const errorHandler_1 = require("../middleware/errorHandler");
const firebase_1 = require("../config/firebase");
class CopraService {
    constructor() {
        this.mlServiceUrl = "https://ml-backend-1-coly.onrender.com";
        this.weatherApiKey =
            process.env.WEATHER_API_KEY || "5dd16e6569f3cdae6509d32002b9dc67";
    }
    async getWeatherData(coordinates) {
        try {
            const response = await axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.weatherApiKey}&units=metric`);
            return {
                temperature: response.data.main.temp,
                humidity: response.data.main.humidity,
            };
        }
        catch (error) {
            throw new errorHandler_1.AppError(500, "Error fetching weather data");
        }
    }
    async createReading(userId, data) {
        try {
            const weatherData = await this.getWeatherData(data.coordinates);
            const predictionResult = await this.predictDryingTime({
                moistureLevel: data.moistureLevel,
                temperature: weatherData.temperature,
                humidity: weatherData.humidity,
            });
            const reading = await copraReading_1.CopraReading.create({
                ...data,
                userId: new mongoose_1.Types.ObjectId(userId),
                dryingTime: predictionResult.dryingTime,
                weatherConditions: {
                    temperature: weatherData.temperature,
                    humidity: weatherData.humidity,
                },
            });
            return {
                status: "success",
                message: "Copra reading created successfully",
                data: reading,
            };
        }
        catch (error) {
            throw new errorHandler_1.AppError(400, `Error creating copra reading: ${error.message}`);
        }
    }
    async getBatchHistory(userId, batchId) {
        try {
            const readings = await copraReading_1.CopraReading.find({
                userId: new mongoose_1.Types.ObjectId(userId),
                batchId: batchId,
                deletedAt: null,
            }).sort({ createdAt: -1 });
            if (!readings.length) {
                throw new errorHandler_1.AppError(404, "No readings found for this batch");
            }
            return {
                status: "success",
                message: "Batch history retrieved successfully",
                data: readings,
            };
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(500, "Error fetching batch history");
        }
    }
    async updateSingleNote(userId, batchId, id, note) {
        try {
            const updatedReading = await copraReading_1.CopraReading.findOneAndUpdate({
                _id: new mongoose_1.Types.ObjectId(id),
                userId: new mongoose_1.Types.ObjectId(userId),
                batchId: batchId,
            }, { notes: note }, { new: true });
            if (!updatedReading) {
                throw new errorHandler_1.AppError(404, "Reading not found");
            }
            return {
                status: "success",
                message: "Note updated successfully",
                data: updatedReading,
            };
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(500, "Error updating note");
        }
    }
    async deleteBatchReadings(userId, batchId) {
        try {
            const result = await copraReading_1.CopraReading.deleteMany({
                userId: new mongoose_1.Types.ObjectId(userId),
                batchId: batchId,
            });
            if (!result.deletedCount) {
                throw new errorHandler_1.AppError(404, "No readings found for this batch");
            }
            return {
                status: "success",
                message: "Batch readings deleted successfully",
            };
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(500, "Error deleting batch readings");
        }
    }
    async deleteSingleReading(userId, batchId, id) {
        try {
            const result = await copraReading_1.CopraReading.findOneAndDelete({
                _id: new mongoose_1.Types.ObjectId(id),
                userId: new mongoose_1.Types.ObjectId(userId),
                batchId: batchId,
            });
            if (!result) {
                throw new errorHandler_1.AppError(404, "Reading not found");
            }
            return {
                status: "success",
                message: "Reading deleted successfully",
            };
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(500, "Error deleting reading");
        }
    }
    async getAllBatches(userId) {
        try {
            const batches = await copraReading_1.CopraReading.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.Types.ObjectId(userId),
                        deletedAt: null,
                        batchId: { $exists: true, $ne: null },
                    },
                },
                {
                    $group: {
                        _id: "$batchId",
                        readingsCount: { $sum: 1 },
                        lastUpdated: { $max: "$createdAt" },
                    },
                },
                {
                    $project: {
                        batchId: "$_id",
                        readingsCount: 1,
                        lastUpdated: 1,
                        _id: 0,
                    },
                },
                {
                    $sort: { lastUpdated: -1 },
                },
            ]);
            return batches;
        }
        catch (error) {
            throw new errorHandler_1.AppError(500, "Error fetching batches");
        }
    }
    async getMoistureLevel(deviceId) {
        try {
            const foodMoistureData = await firebase_1.firebaseService.getFoodMoistureReadings(deviceId);
            if (!foodMoistureData) {
                console.log(`No moisture data found for food device ${deviceId}, using default value`);
                return 20;
            }
            console.log(foodMoistureData);
            return foodMoistureData.moistureLevel;
        }
        catch (error) {
            console.error(`Error getting moisture level for device ${deviceId}:`, error);
            return 20;
        }
    }
    async predictDryingTime(data) {
        try {
            const response = await axios_1.default.post(`${this.mlServiceUrl}/api/copra/predict-drying-time`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("ML Service Error:", error.response?.data || error.message);
            throw new errorHandler_1.AppError(500, "Error getting drying time prediction from ML service");
        }
    }
}
exports.CopraService = CopraService;
//# sourceMappingURL=copraService.js.map