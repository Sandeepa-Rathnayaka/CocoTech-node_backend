import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import waterRoutes from './wateringRoutes';
import locationRoutes from './locationRoutes';
import deviceRoutes from './deviceRoutes';
import yieldPredictionRoutes from './yieldPredictionRoutes';
import actualYieldRoutes from './actualYieldRoutes';
import pricePredictionRoutes from './pricePredictionRoutes';
import copraRoutes from './copraRoutes';
import { rateLimiters } from '../middleware/rateLimiter';

const router = Router();

router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

router.use(rateLimiters.public);

router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/watering', waterRoutes);
router.use('/v1/locations', locationRoutes);
router.use('/v1/devices', deviceRoutes);
router.use('/v1/yield', yieldPredictionRoutes);
router.use('/v1/actual-yield', actualYieldRoutes);
router.use('/v1/price', pricePredictionRoutes);
router.use('/v1/copra', copraRoutes);

export default router;