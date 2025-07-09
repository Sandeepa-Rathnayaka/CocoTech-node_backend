import { Router } from 'express';
import PricePredictionController from '../controllers/PricePredictionController';
import { authenticateJWT } from "../middleware/auth";
import { rateLimiters } from "../middleware/rateLimiter";

const router = Router();

router.use(authenticateJWT);
router.use(rateLimiters.public);

router.post('/price-prediction', PricePredictionController.createPricePrediction);
router.get('/price-predictions', PricePredictionController.getAllPricePredictions);
router.get('/price-prediction/:id', PricePredictionController.getPricePredictionById);
router.get('/user/price-predictions', PricePredictionController.getPricePredictionsByUser);
router.delete('/price-prediction/:id', PricePredictionController.deletePricePrediction);

export default router;