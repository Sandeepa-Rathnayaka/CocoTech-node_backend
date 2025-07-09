"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActualYieldService_1 = __importDefault(require("../services/ActualYieldService"));
class ActualYieldController {
    async createActualYield(req, res) {
        try {
            const data = req.body;
            const userId = req.user._id;
            const locationId = req.body.locationId;
            const actualYield = await ActualYieldService_1.default.createActualYield(data, userId, locationId);
            res.status(201).json(actualYield);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getActualYieldsByUser(req, res) {
        try {
            const userId = req.user._id;
            const actualYields = await ActualYieldService_1.default.getActualYieldsByUser(userId);
            res.status(200).json(actualYields);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getActualYieldById(req, res) {
        try {
            const { id } = req.params;
            const actualYield = await ActualYieldService_1.default.getActualYieldById(id);
            if (!actualYield) {
                res.status(404).json({ error: 'Actual yield not found' });
            }
            else {
                res.status(200).json(actualYield);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async getActualYieldByPrdiction(req, res) {
        try {
            const { id } = req.params;
            const actualYield = await ActualYieldService_1.default.getActualYieldByPrdiction(id);
            if (!actualYield) {
                res.status(404).json({ error: 'Actual yield not found' });
            }
            else {
                res.status(200).json(actualYield);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
    async deleteActualYield(req, res) {
        try {
            const { id } = req.params;
            const result = await ActualYieldService_1.default.deleteActualYield(id);
            if (result.deletedCount === 0) {
                res.status(404).json({ error: 'Actual yield not found' });
            }
            else {
                res.status(200).json({ message: 'Actual yield deleted successfully' });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
}
exports.default = new ActualYieldController();
//# sourceMappingURL=ActualYieldController.js.map