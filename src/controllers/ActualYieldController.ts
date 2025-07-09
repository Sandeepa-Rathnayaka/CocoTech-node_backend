import { Request, Response } from 'express';
import ActualYieldService from '../services/ActualYieldService';

class ActualYieldController {
  public async createActualYield(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user._id; // Assuming user ID is available in req.user
      const locationId = req.body.locationId; // Assuming location ID is passed in the request body
      const actualYield = await ActualYieldService.createActualYield(data, userId, locationId);
      res.status(201).json(actualYield);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getActualYieldsByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user._id;
      const actualYields = await ActualYieldService.getActualYieldsByUser(userId);
      res.status(200).json(actualYields);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getActualYieldById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const actualYield = await ActualYieldService.getActualYieldById(id);
      if (!actualYield) {
        res.status(404).json({ error: 'Actual yield not found' });
      } else {
        res.status(200).json(actualYield);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getActualYieldByPrdiction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const actualYield = await ActualYieldService.getActualYieldByPrdiction(id);
      if (!actualYield) {
        res.status(404).json({ error: 'Actual yield not found' });
      } else {
        res.status(200).json(actualYield);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async deleteActualYield(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await ActualYieldService.deleteActualYield(id);
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Actual yield not found' });
      } else {
        res.status(200).json({ message: 'Actual yield deleted successfully' });
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

export default new ActualYieldController();