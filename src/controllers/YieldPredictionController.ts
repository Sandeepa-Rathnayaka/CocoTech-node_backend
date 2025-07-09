import { Request, Response } from 'express';
import YieldPredictionService from '../services/YieldPredictionService';
import { log } from 'console';
import ActualYieldService from '../services/ActualYieldService';

class YieldPredictionController {
  public async createYieldPrediction(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user.id;
      const locationId = req.body.locationId;
      const yieldPrediction = await YieldPredictionService.createYieldPrediction(data, userId, locationId);
      res.status(201).json(yieldPrediction);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getAllYieldPredictions(req: Request, res: Response): Promise<void> {
    try {
      const yieldPredictions = await YieldPredictionService.getAllYieldPredictions();
      res.status(200).json(yieldPredictions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getYieldPredictionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const yieldPrediction = await YieldPredictionService.getYieldPredictionById(id);
      if (!yieldPrediction) {
        res.status(404).json({ error: 'Yield prediction not found' });
      } else {
        res.status(200).json(yieldPrediction);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getYieldPredictionsByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const yieldPredictions = await YieldPredictionService.getYieldPredictionsByUser(userId);
      res.status(200).json(yieldPredictions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async deleteYieldPrediction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await YieldPredictionService.deleteYieldPrediction(id);
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Yield prediction not found' });
      } else {
        res.status(200).json({ message: 'Yield prediction deleted successfully' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getLatestYieldPredictionByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const latestPrediction = await YieldPredictionService.getLatestYieldPredictionByUser(userId);
      if (!latestPrediction) {
        res.status(404).json({ error: 'No yield predictions found for this user' });
      } else {
        const formattedPrediction = latestPrediction.monthly_predictions.map((prediction: any) => ({
          long_term_prediction: prediction.long_term_prediction,
          month: prediction.month,
          month_name: prediction.month_name,
          seasonal_factor: prediction.seasonal_factor,
          seasonal_prediction: prediction.seasonal_prediction,
          ensemble_prediction: prediction.ensemble_prediction,
          year: prediction.year
        }));
        res.status(200).json(formattedPrediction);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async comparePredictionWithActual(req: Request, res: Response): Promise<void> {
    try {
      const { predictionId } = req.params;
      const userId = req.user._id;
      const prediction = await YieldPredictionService.getYieldPredictionById(predictionId);
      if (!prediction) {
        res.status(404).json({ error: 'Yield prediction not found' });
        return;
      }

      const locationId = prediction.location;
      const lastYear = prediction.year - 1;
      const actualYields = await ActualYieldService.getActualYieldsByYearAndLocation(userId, lastYear, locationId);

      const comparison = prediction.monthly_predictions.map((pred: any) => {
        const actualYield = actualYields.find((ay: { month: number }) => ay.month === pred.month);
        return {
          month: pred.month,
          month_name: pred.month_name,
          predicted_yield: pred.ensemble_prediction,
          actual_yield: actualYield ? actualYield.actual_yield : null,
          difference: actualYield ? pred.ensemble_prediction - actualYield.actual_yield : null,
          year: pred.year,
          location: prediction.location,
          user: prediction.user
        };
      });

      const response = {
        predictionId: prediction._id,
        year: prediction.year,
        location: prediction.location,
        user: prediction.user,
        comparison
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}

export default new YieldPredictionController();