import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { 
    validateRegister, 
    validateLogin, 
    validatePasswordReset,
    validateForgotPassword 
} from '../middleware/validation';
import { rateLimiters } from '../middleware/rateLimiter';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', rateLimiters.auth, validateRegister, authController.register);
router.post('/login', rateLimiters.auth, validateLogin, authController.login);
router.post('/forgot-password', rateLimiters.sensitive, validateForgotPassword, authController.forgotPassword);
router.post('/reset-password/:token', rateLimiters.sensitive, validatePasswordReset, authController.resetPassword);
router.post('/refresh-token', rateLimiters.auth, authController.refreshToken);

// Protected routes
router.use(authenticateJWT);
// router.post('/logout', authController.logout);
// router.post('/verify-email', rateLimiters.auth, authController.verifyEmail);

export default router;