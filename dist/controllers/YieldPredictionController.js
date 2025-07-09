"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const YieldPredictionService_1 = __importDefault(require("../services/YieldPredictionService"));
const ActualYieldService_1 = __importDefault(require("../services/ActualYieldService"));
class YieldPredictionController {
    async createYieldPrediction(req, res) {
        try {
            const data = req.body;
            const userId = req.user.id;
            const locationId = req.body.locationId;
            const yieldPrediction = await YieldPredictionService_1.default.createYieldPrediction(data, userId, locationId);
            res.status(201).json(yieldPrediction);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getAllYieldPredictions(req, res) {
        try {
            const yieldPredictions = await YieldPredictionService_1.default.getAllYieldPredictions();
            res.status(200).json(yieldPredictions);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getYieldPredictionById(req, res) {
        try {
            const { id } = req.params;
            const yieldPrediction = await YieldPredictionService_1.default.getYieldPredictionById(id);
            if (!yieldPrediction) {
                res.status(404).json({ error: 'Yield prediction not found' });
            }
            else {
                res.status(200).json(yieldPrediction);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getYieldPredictionsByUser(req, res) {
        try {
            const userId = req.user._id;
            const yieldPredictions = await YieldPredictionService_1.default.getYieldPredictionsByUser(userId);
            res.status(200).json(yieldPredictions);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async deleteYieldPrediction(req, res) {
        try {
            const { id } = req.params;
            const result = await YieldPredictionService_1.default.deleteYieldPrediction(id);
            if (result.deletedCount === 0) {
                res.status(404).json({ error: 'Yield prediction not found' });
            }
            else {
                res.status(200).json({ message: 'Yield prediction deleted successfully' });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getLatestYieldPredictionByUser(req, res) {
        try {
            const userId = req.user._id;
            const latestPrediction = await YieldPredictionService_1.default.getLatestYieldPredictionByUser(userId);
            if (!latestPrediction) {
                res.status(404).json({ error: 'No yield predictions found for this user' });
            }
            else {
                const formattedPrediction = latestPrediction.monthly_predictions.map((prediction) => ({
                    long_term_prediction: prediction.long_term_prediction,
                    month: prediction.month,
                    month_name: prediction.month_name,
                    seasonal_factor: prediction.seasonal_factor,
                    seasonal_prediction: prediction.seasonal_prediction,
                    ensemble_prediction: prediction.ensemble_prediction,
                    year: prediction.year
                }));
                res.status(200).json(formattedPrediction);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async comparePredictionWithActual(req, res) {
        try {
            const { predictionId } = req.params;
            const userId = req.user._id;
            const prediction = await YieldPredictionService_1.default.getYieldPredictionById(predictionId);
            if (!prediction) {
                res.status(404).json({ error: 'Yield prediction not found' });
                return;
            }
            const locationId = prediction.location;
            const lastYear = prediction.year - 1;
            const actualYields = await ActualYieldService_1.default.getActualYieldsByYearAndLocation(userId, lastYear, locationId);
            const comparison = prediction.monthly_predictions.map((pred) => {
                const actualYield = actualYields.find((ay) => ay.month === pred.month);
                return {
                    month: pred.month,
                    month_name: pred.month_name,
                    predicted_yield: pred.ensemble_prediction,
                    actual_yield: actualYield ? actualYield.actual_yield : null,
                    difference: actualYield ? pred.ensemble_prediction - actualYield.actual_yield : null,
                    year: pred.year,
                    location: prediction.location,
                    user: prediction.user
                };
            });
            const response = {
                predictionId: prediction._id,
                year: prediction.year,
                location: prediction.location,
                user: prediction.user,
                comparison
            };
            res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
}
exports.default = new YieldPredictionController();
//# sourceMappingURL=YieldPredictionController.js.map