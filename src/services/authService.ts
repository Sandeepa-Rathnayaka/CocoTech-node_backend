import { IUser } from '../models/user';
import { AppError } from '../middleware/errorHandler';
import { UserService } from './userService';
import { generateAuthToken, generateRefreshToken } from '../middleware/auth';
import { generateToken } from '../utils';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export class AuthService {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * Register new user
     */
    async register(userData: Partial<IUser>): Promise<{
        user: Partial<IUser>;
        token: string;
        refreshToken: string;
    }> {
        const user = await this.userService.createUser(userData);
        const token = generateAuthToken(user._id!.toString());
        const refreshToken = generateRefreshToken(user._id!.toString());

        return { user, token, refreshToken };
    }

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<{
        user: Partial<IUser>;
        token: string;
        refreshToken: string;
    }> {
        // Find user
        const user:any = await this.userService.findByEmail(email);
        if (!user) {
            throw new AppError(401, 'Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError(401, 'Invalid credentials');
        }

        // Update last login
        await this.userService.updateLastLogin(user._id);

        const token = generateAuthToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

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

    /**
     * Generate password reset token
     */
    async createPasswordResetToken(email: string): Promise<string> {
        const user:any = await this.userService.findByEmail(email);
        if (!user) {
            throw new AppError(404, 'User not found');
        }

        const resetToken = generateToken(32);
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        await this.userService.updateUser(user._id, {
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        } as Partial<IUser>);

        return resetToken;
    }

    /**
     * Reset password
     */
    async resetPassword(token: string, password: string): Promise<void> {
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user:any = await this.userService.findByResetToken(resetTokenHash);
        if (!user) {
            throw new AppError(400, 'Invalid or expired reset token');
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
    }
}