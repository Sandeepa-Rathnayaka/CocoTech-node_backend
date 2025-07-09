"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ActualYieldController_1 = __importDefault(require("../controllers/ActualYieldController"));
const auth_1 = require("../middleware/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateJWT);
router.use(rateLimiter_1.rateLimiters.public);
router.post('/actual-yield', ActualYieldController_1.default.createActualYield);
router.get('/actual-yields', ActualYieldController_1.default.getActualYieldsByUser);
router.get('/actual-yield/:id', ActualYieldController_1.default.getActualYieldById);
router.get('/actual-yield-byPrediction/:id', ActualYieldController_1.default.getActualYieldByPrdiction);
router.delete('/actual-yield/:id', ActualYieldController_1.default.deleteActualYield);
exports.default = router;
//# sourceMappingURL=actualYieldRoutes.js.map