import { Router } from 'express';
import { DeviceController } from '../controllers/deviceController';
import { authenticateJWT } from '../middleware/auth';
import { validateDevice } from '../middleware/locationDeviceValidation';
import { rateLimiters } from '../middleware/rateLimiter';

const router = Router();
const deviceController = new DeviceController();

// Apply authentication to all routes
router.use(authenticateJWT);

// Apply rate limiting
router.use(rateLimiters.public);

// Device registration and management
router.post(
    '/register',
    validateDevice,
    deviceController.registerDevice
);

router.get(
    '/',
    deviceController.getDevices
);

router.get(
    '/:id',
    deviceController.getDeviceById
);

router.put(
    '/:id',
    // validateDevice,
    deviceController.updateDevice
);

router.delete(
    '/:id',
    deviceController.deleteDevice
);

// Device readings
router.post(
    '/:id/readings',
    deviceController.updateDeviceReading
);

export default router;