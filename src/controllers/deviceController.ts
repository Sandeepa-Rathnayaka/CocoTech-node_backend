import { Request, Response } from 'express';
import { DeviceService } from '../services/deviceService';
import { asyncHandler } from '../middleware/errorHandler';

export class DeviceController {
    private deviceService: DeviceService;

    constructor() {
        this.deviceService = new DeviceService();
    }

    registerDevice = asyncHandler(async (req: Request, res: Response) => {
        const device = await this.deviceService.registerDevice(
            req.user.id,
            req.body
        );

        res.status(201).json({
            status: 'success',
            data: { device }
        });
    });

    getDevices = asyncHandler(async (req: Request, res: Response) => {
        const devices = await this.deviceService.getDevices(req.user.id);

        res.status(200).json({
            status: 'success',
            data: { devices }
        });
    });

    getDeviceById = asyncHandler(async (req: Request, res: Response) => {
        const device = await this.deviceService.getDeviceById(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            status: 'success',
            data: { device }
        });
    });

    updateDevice = asyncHandler(async (req: Request, res: Response) => {
        const device = await this.deviceService.updateDevice(
            req.params.id,
            req.user.id,
            req.body
        );

        res.status(200).json({
            status: 'success',
            data: { device }
        });
    });

    deleteDevice = asyncHandler(async (req: Request, res: Response) => {
        await this.deviceService.deleteDevice(
            req.params.id,
            req.user.id
        );

        res.status(204).json({
            status: 'success',
            data: null
        });
    });

    updateDeviceReading = asyncHandler(async (req: Request, res: Response) => {
        const device = await this.deviceService.updateDeviceReading(
            req.params.id,
            req.body
        );

        res.status(200).json({
            status: 'success',
            data: { device }
        });
    });
}
