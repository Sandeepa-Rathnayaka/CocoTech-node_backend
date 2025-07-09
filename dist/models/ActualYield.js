"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ActualYieldSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Location', required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    actual_yield: { type: Number, required: true },
    yieldPrediction: { type: mongoose_1.Schema.Types.ObjectId, ref: 'YieldPrediction' },
}, { timestamps: true });
const ActualYield = (0, mongoose_1.model)('ActualYield', ActualYieldSchema);
exports.default = ActualYield;
//# sourceMappingURL=ActualYield.js.map