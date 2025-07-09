"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const userService_1 = require("./userService");
const auth_1 = require("../middleware/auth");
const utils_1 = require("../utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    constructor() {
        this.userService = new userService_1.UserService();
    }
    async register(userData) {
        const user = await this.userService.createUser(userData);
        const token = (0, auth_1.generateAuthToken)(user._id.toString());
        const refreshToken = (0, auth_1.generateRefreshToken)(user._id.toString());
        return { user, token, refreshToken };
    }
    async login(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new errorHandler_1.AppError(401, 'Invalid credentials');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new errorHandler_1.AppError(401, 'Invalid credentials');
        }
        await this.userService.updateLastLogin(user._id);
        const token = (0, auth_1.generateAuthToken)(user._id);
        const refreshToken = (0, auth_1.generateRefreshToken)(user._id);
        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token,
            refreshToken
        };
    }
    async createPasswordResetToken(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new errorHandler_1.AppError(404, 'User not found');
        }
        const resetToken = (0, utils_1.generateToken)(32);
        const resetTokenHash = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        await this.userService.updateUser(user._id, {
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: new Date(Date.now() + 30 * 60 * 1000)
        });
        return resetToken;
    }
    async resetPassword(token, password) {
        const resetTokenHash = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = await this.userService.findByResetToken(resetTokenHash);
        if (!user) {
            throw new errorHandler_1.AppError(400, 'Invalid or expired reset token');
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map