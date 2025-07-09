"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../models/user");
const errorHandler_1 = require("../middleware/errorHandler");
const utils_1 = require("../utils");
class UserService {
    async getAllUsers() {
        try {
            const users = await user_1.User.find().select('-password');
            return users.map(user => (0, utils_1.sanitizeUser)(user.toObject()));
        }
        catch (error) {
            throw new errorHandler_1.AppError(500, 'Error fetching users');
        }
    }
    async getUserById(id) {
        try {
            const user = await user_1.User.findById(id).select('-password');
            if (!user) {
                throw new errorHandler_1.AppError(404, 'User not found');
            }
            return (0, utils_1.sanitizeUser)(user.toObject());
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(500, 'Error fetching user');
        }
    }
    async createUser(userData) {
        try {
            const newUser = await user_1.User.create(userData);
            return (0, utils_1.sanitizeUser)(newUser.toObject());
        }
        catch (error) {
            if (error.code === 11000) {
                throw new errorHandler_1.AppError(400, 'Email already exists');
            }
            throw new errorHandler_1.AppError(400, 'Error creating user');
        }
    }
    async updateUser(id, userData) {
        try {
            const updatedUser = await user_1.User.findByIdAndUpdate(id, userData, { new: true, runValidators: true }).select('-password');
            if (!updatedUser) {
                throw new errorHandler_1.AppError(404, 'User not found');
            }
            return (0, utils_1.sanitizeUser)(updatedUser.toObject());
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(400, 'Error updating user');
        }
    }
    async deleteUser(id) {
        try {
            const user = await user_1.User.findByIdAndDelete(id);
            if (!user) {
                throw new errorHandler_1.AppError(404, 'User not found');
            }
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(500, 'Error deleting user');
        }
    }
    async findByEmail(email) {
        return user_1.User.findOne({ email }).select('+password');
    }
    async findByResetToken(resetToken) {
        return user_1.User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+password +resetPasswordToken +resetPasswordExpire');
    }
    async updateLastLogin(id) {
        await user_1.User.findByIdAndUpdate(id, { lastLogin: new Date() });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map