"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const YieldPrediction_1 = __importDefault(require("../models/YieldPrediction"));
class YieldPredictionService {
    constructor() {
        this.predictionApiUrl = 'https://flask-be-7m0b.onrender.com/predict';
    }
    async predictYield(data) {
        try {
            const response = await axios_1.default.post(this.predictionApiUrl, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error('Error predicting yield: ' + error.message);
            }
            else {
                throw new Error('Error predicting yield');
            }
        }
    }
    async createYieldPrediction(data, userId, locationId) {
        const predictionResponse = await this.predictYield(data);
        const yieldPrediction = new YieldPrediction_1.default({
            ...predictionResponse,
            user: userId,
            location: locationId,
        });
        await yieldPrediction.save();
        return yieldPrediction;
    }
    async getAllYieldPredictions() {
        return YieldPrediction_1.default.find();
    }
    async getYieldPredictionById(id) {
        return YieldPrediction_1.default.findById(id);
    }
    async getYieldPredictionsByUser(userId) {
        return YieldPrediction_1.default.find({ user: userId });
    }
    async deleteYieldPrediction(id) {
        return YieldPrediction_1.default.deleteOne({ _id: id });
    }
    async getLatestYieldPredictionByUser(userId) {
        return YieldPrediction_1.default.findOne({ user: userId }).sort({ createdAt: -1 });
    }
}
exports.default = new YieldPredictionService();
//# sourceMappingURL=YieldPredictionService.js.map