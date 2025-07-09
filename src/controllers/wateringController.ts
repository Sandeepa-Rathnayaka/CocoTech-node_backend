import { Request, Response } from 'express';
import { WateringService } from '../services/wateringService';
import { asyncHandler } from '../middleware/errorHandler';

export class WateringController {
    private wateringService: WateringService;

    constructor() {
        this.wateringService = new WateringService();
    }

    createSchedule = asyncHandler(async (req: Request, res: Response) => {
        const schedule = await this.wateringService.createSchedule(
            req.user.id,
            req.params.locationId,
            req.body
        );

        res.status(201).json({
            status: 'success',
            data: { schedule }
        });
    });

    getScheduleHistory = asyncHandler(async (req: Request, res: Response) => {
        const { locationId, startDate, endDate } = req.query;
        
        const dateRange = startDate && endDate ? {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        } : undefined;

        const schedules = await this.wateringService.getScheduleHistory(
            req.user.id,
            locationId as string,
            dateRange
        );

        res.status(200).json({
            status: 'success',
            data: { schedules }
        });
    });

    updateScheduleStatus = asyncHandler(async (req: Request, res: Response) => {
        const schedule = await this.wateringService.updateScheduleStatus(
            req.params.id,
            req.user.id,
            req.body.status,
            req.body.details
        );

        res.status(200).json({
            status: 'success',
            data: { schedule }
        });
    });

    deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
        await this.wateringService.deleteSchedule(
            req.params.id,
            req.user.id
        );

        res.status(204).json({
            status: 'success',
            data: null
        });
    });

    getTodaySchedules = asyncHandler(async (req: Request, res: Response) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const schedules = await this.wateringService.getScheduleHistory(
            req.user.id,
            undefined,
            { startDate: today, endDate: tomorrow }
        );

        console.log(today);
        console.log(tomorrow);

        res.status(200).json({
            status: 'success',
            data: { schedules }
        });
    });

    getScheduleById = asyncHandler(async (req: Request, res: Response) => {
        const schedule = await this.wateringService.getScheduleById(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            status: 'success',
            data: { schedule }
        });
    });

    getLocationSchedules = asyncHandler(async (req: Request, res: Response) => {
        const { startDate, endDate } = req.query;
        
        const dateRange = startDate && endDate ? {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        } : undefined;

        const schedules = await this.wateringService.getScheduleHistory(
            req.user.id,
            req.params.locationId,
            dateRange
        );

        res.status(200).json({
            status: 'success',
            data: { schedules }
        });
    });
}