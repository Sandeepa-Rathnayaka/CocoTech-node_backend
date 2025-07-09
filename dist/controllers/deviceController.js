"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceController = void 0;
const deviceService_1 = require("../services/deviceService");
const errorHandler_1 = require("../middleware/errorHandler");
class DeviceController {
    constructor() {
        this.registerDevice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const device = await this.deviceService.registerDevice(req.user.id, req.body);
            res.status(201).json({
                status: 'success',
                data: { device }
            });
        });
        this.getDevices = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const devices = await this.deviceService.getDevices(req.user.id);
            res.status(200).json({
                status: 'success',
                data: { devices }
            });
        });
        this.getDeviceById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const device = await this.deviceService.getDeviceById(req.params.id, req.user.id);
            res.status(200).json({
                status: 'success',
                data: { device }
            });
        });
        this.updateDevice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const device = await this.deviceService.updateDevice(req.params.id, req.user.id, req.body);
            res.status(200).json({
                status: 'success',
                data: { device }
            });
        });
        this.deleteDevice = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            await this.deviceService.deleteDevice(req.params.id, req.user.id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        });
        this.updateDeviceReading = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const device = await this.deviceService.updateDeviceReading(req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                data: { device }
            });
        });
        this.deviceService = new deviceService_1.DeviceService();
    }
}
exports.DeviceController = DeviceController;
//# sourceMappingURL=deviceController.js.map