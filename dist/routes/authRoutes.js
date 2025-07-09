"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const rateLimiter_1 = require("../middleware/rateLimiter");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
router.post('/register', rateLimiter_1.rateLimiters.auth, validation_1.validateRegister, authController.register);
router.post('/login', rateLimiter_1.rateLimiters.auth, validation_1.validateLogin, authController.login);
router.post('/forgot-password', rateLimiter_1.rateLimiters.sensitive, validation_1.validateForgotPassword, authController.forgotPassword);
router.post('/reset-password/:token', rateLimiter_1.rateLimiters.sensitive, validation_1.validatePasswordReset, authController.resetPassword);
router.post('/refresh-token', rateLimiter_1.rateLimiters.auth, authController.refreshToken);
router.use(auth_1.authenticateJWT);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map