import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../middleware/errorHandler';
import { config } from '../config';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = asyncHandler(async (req: Request, res: Response) => {
        const { user, token, refreshToken } = await this.authService.register(req.body);
        this.setTokenCookies(res, token, refreshToken);

        res.status(201).json({
            status: 'success',
            data: { user, token,refreshToken }
        });
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const { user, token, refreshToken } = await this.authService.login(email, password);

        // Set cookies
        this.setTokenCookies(res, token, refreshToken);

        res.status(200).json({
            status: 'success',
            data: { user, token, refreshToken }
        });
    });

    forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        const resetToken = await this.authService.createPasswordResetToken(req.body.email);

        // In production, send this token via email
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
            ...(process.env.NODE_ENV === 'development' && { resetToken })
        });
    });

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        await this.authService.resetPassword(req.params.token, req.body.password);

        res.status(200).json({
            status: 'success',
            message: 'Password has been reset'
        });
    });

    /**
     * Refresh token
     */
    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        // Implementation depends on your refresh token strategy
        res.status(501).json({
            status: 'error',
            message: 'Not implemented'
        });
    });

    /**
     * Helper method to set authentication cookies
     */
    private setTokenCookies(res: Response, token: string, refreshToken: string): void {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const
        };

        res.cookie('token', token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
}