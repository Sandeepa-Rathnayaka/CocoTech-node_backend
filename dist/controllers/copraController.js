"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copraController = exports.CopraController = void 0;
const copraService_1 = require("../services/copraService");
const errorHandler_1 = require("../middleware/errorHandler");
const copraService = new copraService_1.CopraService();
class CopraController {
    async createReading(req, res, next) {
        try {
            const userId = req.user.id;
            const reading = await copraService.createReading(userId, req.body);
            res.status(201).json(reading);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllBatches(req, res, next) {
        try {
            const userId = req.user.id;
            const batches = await copraService.getAllBatches(userId);
            res.status(200).json({
                status: "success",
                message: "Batches retrieved successfully",
                data: batches,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getBatchHistory(req, res, next) {
        try {
            const userId = req.user.id;
            const { batchId } = req.params;
            const result = await copraService.getBatchHistory(userId, batchId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async updateSingleNote(req, res, next) {
        try {
            const userId = req.user.id;
            const { batchId, id } = req.params;
            const { note } = req.body;
            if (!note) {
                throw new errorHandler_1.AppError(400, "Note is required");
            }
            const result = await copraService.updateSingleNote(userId, batchId, id, note);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteBatchReadings(req, res, next) {
        try {
            const userId = req.user.id;
            const { batchId } = req.params;
            const result = await copraService.deleteBatchReadings(userId, batchId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteSingleReading(req, res, next) {
        try {
            const userId = req.user.id;
            const { batchId, id } = req.params;
            const result = await copraService.deleteSingleReading(userId, batchId, id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getMoistureLevel(req, res, next) {
        try {
            const { deviceId } = req.params;
            const result = await copraService.getMoistureLevel(deviceId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CopraController = CopraController;
exports.copraController = new CopraController();
//# sourceMappingURL=copraController.js.map