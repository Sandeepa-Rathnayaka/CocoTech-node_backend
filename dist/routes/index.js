"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const wateringRoutes_1 = __importDefault(require("./wateringRoutes"));
const locationRoutes_1 = __importDefault(require("./locationRoutes"));
const deviceRoutes_1 = __importDefault(require("./deviceRoutes"));
const yieldPredictionRoutes_1 = __importDefault(require("./yieldPredictionRoutes"));
const actualYieldRoutes_1 = __importDefault(require("./actualYieldRoutes"));
const pricePredictionRoutes_1 = __importDefault(require("./pricePredictionRoutes"));
const copraRoutes_1 = __importDefault(require("./copraRoutes"));
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});
router.use(rateLimiter_1.rateLimiters.public);
router.use('/v1/auth', authRoutes_1.default);
router.use('/v1/users', userRoutes_1.default);
router.use('/v1/watering', wateringRoutes_1.default);
router.use('/v1/locations', locationRoutes_1.default);
router.use('/v1/devices', deviceRoutes_1.default);
router.use('/v1/yield', yieldPredictionRoutes_1.default);
router.use('/v1/actual-yield', actualYieldRoutes_1.default);
router.use('/v1/price', pricePredictionRoutes_1.default);
router.use('/v1/copra', copraRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map