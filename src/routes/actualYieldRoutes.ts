import { Router } from 'express';
import ActualYieldController from '../controllers/ActualYieldController';
import { authenticateJWT } from "../middleware/auth";
import { rateLimiters } from "../middleware/rateLimiter";

const router = Router();

router.use(authenticateJWT);
router.use(rateLimiters.public);

router.post('/actual-yield', ActualYieldController.createActualYield);
router.get('/actual-yields', ActualYieldController.getActualYieldsByUser);
router.get('/actual-yield/:id', ActualYieldController.getActualYieldById);
router.get('/actual-yield-byPrediction/:id', ActualYieldController.getActualYieldByPrdiction);
router.delete('/actual-yield/:id', ActualYieldController.deleteActualYield);

export default router;