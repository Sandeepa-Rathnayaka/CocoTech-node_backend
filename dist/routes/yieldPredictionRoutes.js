"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const YieldPredictionController_1 = __importDefault(require("../controllers/YieldPredictionController"));
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT);
router.use(rateLimiter_1.rateLimiters.public);
router.post('/yield-prediction', YieldPredictionController_1.default.createYieldPrediction);
router.get('/yield-predictions', YieldPredictionController_1.default.getAllYieldPredictions);
router.get('/yield-prediction/:id', YieldPredictionController_1.default.getYieldPredictionById);
router.get('/user/yield-predictions', YieldPredictionController_1.default.getYieldPredictionsByUser);
router.get('/user/latest-yield-prediction', YieldPredictionController_1.default.getLatestYieldPredictionByUser);
router.delete('/yield-prediction/:id', YieldPredictionController_1.default.deleteYieldPrediction);
router.get('/compare-prediction/:predictionId', YieldPredictionController_1.default.comparePredictionWithActual);
exports.default = router;
//# sourceMappingURL=yieldPredictionRoutes.js.map