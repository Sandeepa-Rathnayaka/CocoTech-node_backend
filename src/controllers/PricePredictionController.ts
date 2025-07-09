import { Request, Response } from 'express';
import PricePredictionService from '../services/PricePredictionService';

class PricePredictionController {
  public async createPricePrediction(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user._id; // Assuming user ID is available in req.user
      const locationId = req.body.locationId; // Assuming location ID is passed in the request body
      const pricePrediction = await PricePredictionService.createPricePrediction(data, userId, locationId);
      res.status(201).json(pricePrediction);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getAllPricePredictions(req: Request, res: Response): Promise<void> {
    try {
      const pricePredictions = await PricePredictionService.getAllPricePredictions();
      res.status(200).json(pricePredictions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getPricePredictionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pricePrediction = await PricePredictionService.getPricePredictionById(id);
      if (!pricePrediction) {
        res.status(404).json({ error: 'Price prediction not found' });
      } else {
        res.status(200).json(pricePrediction);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getPricePredictionsByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const pricePredictions = await PricePredictionService.getPricePredictionsByUser(userId);
      res.status(200).json(pricePredictions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async deletePricePrediction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await PricePredictionService.deletePricePrediction(id);
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Price prediction not found' });
      } else {
        res.status(200).json({ message: 'Price prediction deleted successfully' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}

export default new PricePredictionController();