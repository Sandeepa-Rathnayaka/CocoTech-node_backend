import { Router } from 'express';
import YieldPredictionController from '../controllers/YieldPredictionController';
import { authenticateJWT } from "../middleware/auth";
import { rateLimiters } from "../middleware/rateLimiter";



const router = Router();

router.use(authenticateJWT);
router.use(rateLimiters.public);


router.post('/yield-prediction', YieldPredictionController.createYieldPrediction);
router.get('/yield-predictions', YieldPredictionController.getAllYieldPredictions);
router.get('/yield-prediction/:id', YieldPredictionController.getYieldPredictionById);
router.get('/user/yield-predictions', YieldPredictionController.getYieldPredictionsByUser);
router.get('/user/latest-yield-prediction', YieldPredictionController.getLatestYieldPredictionByUser);
router.delete('/yield-prediction/:id', YieldPredictionController.deleteYieldPrediction);

router.get('/compare-prediction/:predictionId', YieldPredictionController.comparePredictionWithActual);


export default router;