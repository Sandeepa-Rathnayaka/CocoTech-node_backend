"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InputDataSchema = new mongoose_1.Schema({
    humidity: { type: Number, required: true },
    plant_age: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    soil_moisture_10cm: { type: Number, required: true },
    soil_moisture_20cm: { type: Number, required: true },
    soil_moisture_30cm: { type: Number, required: true },
    soil_type: { type: Number, required: true },
    temperature: { type: Number, required: true },
    weather_description: { type: String, required: true },
});
const MonthlyPredictionSchema = new mongoose_1.Schema({
    confidence_score: { type: Number, required: true },
    ensemble_prediction: { type: Number, required: true },
    input_data: { type: InputDataSchema, required: true },
    long_term_prediction: { type: Number, required: true },
    month: { type: Number, required: true },
    month_name: { type: String, required: true },
    seasonal_factor: { type: Number, required: true },
    seasonal_prediction: { type: Number, required: true },
    weights: { type: [Number], required: true },
    year: { type: Number, required: true },
});
const YieldPredictionSchema = new mongoose_1.Schema({
    year: { type: Number, required: true },
    average_prediction: { type: Number, required: true },
    monthly_predictions: { type: [MonthlyPredictionSchema], required: true },
    status: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Location' },
}, { timestamps: true });
const YieldPrediction = (0, mongoose_1.model)('YieldPrediction', YieldPredictionSchema);
exports.default = YieldPrediction;
//# sourceMappingURL=YieldPrediction.js.map