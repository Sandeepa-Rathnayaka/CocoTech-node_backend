"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WateringController = void 0;
const wateringService_1 = require("../services/wateringService");
const errorHandler_1 = require("../middleware/errorHandler");
class WateringController {
    constructor() {
        this.createSchedule = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const schedule = await this.wateringService.createSchedule(req.user.id, req.params.locationId, req.body);
            res.status(201).json({
                status: 'success',
                data: { schedule }
            });
        });
        this.getScheduleHistory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { locationId, startDate, endDate } = req.query;
            const dateRange = startDate && endDate ? {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            } : undefined;
            const schedules = await this.wateringService.getScheduleHistory(req.user.id, locationId, dateRange);
            res.status(200).json({
                status: 'success',
                data: { schedules }
            });
        });
        this.updateScheduleStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const schedule = await this.wateringService.updateScheduleStatus(req.params.id, req.user.id, req.body.status, req.body.details);
            res.status(200).json({
                status: 'success',
                data: { schedule }
            });
        });
        this.deleteSchedule = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            await this.wateringService.deleteSchedule(req.params.id, req.user.id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        });
        this.getTodaySchedules = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const schedules = await this.wateringService.getScheduleHistory(req.user.id, undefined, { startDate: today, endDate: tomorrow });
            console.log(today);
            console.log(tomorrow);
            res.status(200).json({
                status: 'success',
                data: { schedules }
            });
        });
        this.getScheduleById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const schedule = await this.wateringService.getScheduleById(req.params.id, req.user.id);
            res.status(200).json({
                status: 'success',
                data: { schedule }
            });
        });
        this.getLocationSchedules = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { startDate, endDate } = req.query;
            const dateRange = startDate && endDate ? {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            } : undefined;
            const schedules = await this.wateringService.getScheduleHistory(req.user.id, req.params.locationId, dateRange);
            res.status(200).json({
                status: 'success',
                data: { schedules }
            });
        });
        this.wateringService = new wateringService_1.WateringService();
    }
}
exports.WateringController = WateringController;
//# sourceMappingURL=wateringController.js.map