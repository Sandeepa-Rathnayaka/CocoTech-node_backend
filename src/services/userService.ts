import { IUser, User } from '../models/user';
import { AppError } from '../middleware/errorHandler';
import { sanitizeUser } from '../utils';

export class UserService {
    /**
     * Get all users
     */
    async getAllUsers(): Promise<Partial<IUser>[]> {
        try {
            const users = await User.find().select('-password');
            return users.map(user => sanitizeUser(user.toObject()));
        } catch (error) {
            throw new AppError(500, 'Error fetching users');
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<Partial<IUser>> {
        try {
            const user = await User.findById(id).select('-password');
            if (!user) {
                throw new AppError(404, 'User not found');
            }
            return sanitizeUser(user.toObject());
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Error fetching user');
        }
    }

    /**
     * Create new user
     */
    async createUser(userData: Partial<IUser>): Promise<Partial<IUser>> {
        try {
            const newUser = await User.create(userData);
            return sanitizeUser(newUser.toObject());
        } catch (error: any) {
            if (error.code === 11000) {
                throw new AppError(400, 'Email already exists');
            }
            throw new AppError(400, 'Error creating user');
        }
    }

    /**
     * Update user
     */
    async updateUser(id: string, userData: Partial<IUser>): Promise<Partial<IUser>> {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                userData,
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                throw new AppError(404, 'User not found');
            }

            return sanitizeUser(updatedUser.toObject());
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(400, 'Error updating user');
        }
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<void> {
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                throw new AppError(404, 'User not found');
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Error deleting user');
        }
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email }).select('+password');
    }

    /**
     * Find user by reset password token
     */
    async findByResetToken(resetToken: string): Promise<IUser | null> {
        return User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+password +resetPasswordToken +resetPasswordExpire');
    }

    /**
     * Update last login
     */
    async updateLastLogin(id: string): Promise<void> {
        await User.findByIdAndUpdate(id, { lastLogin: new Date() });
    }
}