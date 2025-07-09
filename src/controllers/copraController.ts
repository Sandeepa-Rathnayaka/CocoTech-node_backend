import { Request, Response, NextFunction } from "express";
import { CopraService } from "../services/copraService";
import { AppError } from "../middleware/errorHandler";

const copraService = new CopraService();

export class CopraController {
  //batch readings

  //create batch
  async createReading(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id; // Assuming you have user info in request
      const reading = await copraService.createReading(userId, req.body);
      res.status(201).json(reading);
    } catch (error) {
      next(error);
    }
  }

  //get all batches
  async getAllBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const batches = await copraService.getAllBatches(userId);
      res.status(200).json({
        status: "success",
        message: "Batches retrieved successfully",
        data: batches,
      });
    } catch (error) {
      next(error);
    }
  }

  //get relevent batch history
  async getBatchHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { batchId } = req.params;
      const result = await copraService.getBatchHistory(userId, batchId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  //update batch notes
  async updateSingleNote(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { batchId, id } = req.params;
      const { note } = req.body;

      if (!note) {
        throw new AppError(400, "Note is required");
      }

      const result = await copraService.updateSingleNote(
        userId,
        batchId,
        id,
        note
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  //delete whole batch readings
  async deleteBatchReadings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { batchId } = req.params;

      const result = await copraService.deleteBatchReadings(userId, batchId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  //delete single read in each batch
  async deleteSingleReading(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { batchId, id } = req.params;

      const result = await copraService.deleteSingleReading(
        userId,
        batchId,
        id
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMoistureLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId } = req.params;

      const result = await copraService.getMoistureLevel(deviceId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const copraController = new CopraController();
