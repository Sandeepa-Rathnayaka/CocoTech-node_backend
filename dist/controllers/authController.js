"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthController {
    constructor() {
        this.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { user, token, refreshToken } = await this.authService.register(req.body);
            this.setTokenCookies(res, token, refreshToken);
            res.status(201).json({
                status: 'success',
                data: { user, token, refreshToken }
            });
        });
        this.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { email, password } = req.body;
            const { user, token, refreshToken } = await this.authService.login(email, password);
            this.setTokenCookies(res, token, refreshToken);
            res.status(200).json({
                status: 'success',
                data: { user, token, refreshToken }
            });
        });
        this.forgotPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const resetToken = await this.authService.createPasswordResetToken(req.body.email);
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email',
                ...(process.env.NODE_ENV === 'development' && { resetToken })
            });
        });
        this.resetPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            await this.authService.resetPassword(req.params.token, req.body.password);
            res.status(200).json({
                status: 'success',
                message: 'Password has been reset'
            });
        });
        this.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            res.status(501).json({
                status: 'error',
                message: 'Not implemented'
            });
        });
        this.authService = new authService_1.AuthService();
    }
    setTokenCookies(res, token, refreshToken) {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };
        res.cookie('token', token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map