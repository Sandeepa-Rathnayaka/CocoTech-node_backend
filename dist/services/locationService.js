"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const mongoose_1 = require("mongoose");
const location_1 = require("../models/location");
const device_1 = require("../models/device");
const errorHandler_1 = require("../middleware/errorHandler");
class LocationService {
    async createLocation(userId, data) {
        try {
            if (data.deviceId) {
                const device = await device_1.Device.findOne({
                    deviceId: data.deviceId,
                    userId: new mongoose_1.Types.ObjectId(userId),
                    isActive: true,
                });
                if (!device) {
                    throw new errorHandler_1.AppError(404, "Device not found");
                }
                const isDeviceAssigned = await location_1.Location.findOne({
                    deviceId: data.deviceId,
                    isActive: true,
                });
                if (isDeviceAssigned) {
                    throw new errorHandler_1.AppError(400, "Device is already assigned to another location");
                }
            }
            const location = await location_1.Location.create({
                ...data,
                userId: new mongoose_1.Types.ObjectId(userId),
            });
            if (data.deviceId) {
                await device_1.Device.findOneAndUpdate({ deviceId: data.deviceId }, { locationId: location._id });
            }
            return location;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(400, "Error creating location");
        }
    }
    async getLocations(userId) {
        try {
            const locations = await location_1.Location.find({
                userId: new mongoose_1.Types.ObjectId(userId),
                isActive: true,
            }).lean();
            const deviceIds = locations
                .filter((location) => typeof location.deviceId === "string")
                .map((location) => location.deviceId);
            const devices = deviceIds.length
                ? await device_1.Device.find({ deviceId: { $in: deviceIds } })
                    .select("_id deviceId type status")
                    .lean()
                : [];
            return locations.map((location) => {
                const device = devices.find((d) => d.deviceId === location.deviceId);
                return {
                    ...location,
                    device: device || undefined,
                };
            });
        }
        catch (error) {
            console.error("Error in getLocations:", error);
            throw new errorHandler_1.AppError(500, "Error fetching locations");
        }
    }
    async getLocationById(locationId, userId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(locationId) ||
                !mongoose_1.Types.ObjectId.isValid(userId)) {
                throw new errorHandler_1.AppError(400, "Invalid locationId or userId");
            }
            let location = await location_1.Location.findOne({
                _id: new mongoose_1.Types.ObjectId(locationId),
                userId: new mongoose_1.Types.ObjectId(userId),
                isActive: true,
            }).lean();
            if (!location) {
                throw new errorHandler_1.AppError(404, "Location not found or is inactive");
            }
            let device = null;
            if (location.deviceId && typeof location.deviceId === "string") {
                device = await device_1.Device.findOne({ deviceId: location.deviceId })
                    .select("_id deviceId type status")
                    .lean();
            }
            return {
                ...location,
                device: device || undefined,
            };
        }
        catch (error) {
            console.error("Error in getLocationById:", error);
            if (error instanceof errorHandler_1.AppError) {
                throw error;
            }
            if (error.name === "CastError") {
                throw new errorHandler_1.AppError(400, "Invalid ID format");
            }
            throw new errorHandler_1.AppError(500, "Error fetching location");
        }
    }
    async updateLocation(locationId, userId, data) {
        try {
            const location = await location_1.Location.findOneAndUpdate({
                _id: locationId,
                userId: new mongoose_1.Types.ObjectId(userId),
                isActive: true,
            }, data, { new: true, runValidators: true });
            if (!location) {
                throw new errorHandler_1.AppError(404, "Location not found");
            }
            return location;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(400, "Error updating location");
        }
    }
    async deleteLocation(locationId, userId) {
        try {
            const location = await location_1.Location.findOneAndUpdate({
                _id: locationId,
                userId: new mongoose_1.Types.ObjectId(userId),
                isActive: true,
            }, { isActive: false }, { new: true });
            if (!location) {
                throw new errorHandler_1.AppError(404, "Location not found");
            }
            if (location.deviceId) {
                await device_1.Device.findOneAndUpdate({ deviceId: location.deviceId }, { $unset: { locationId: 1 } });
            }
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(500, "Error deleting location");
        }
    }
    async assignDeviceToLocation(locationId, userId, deviceId) {
        try {
            const device = await device_1.Device.findOne({
                deviceId: deviceId,
                userId: new mongoose_1.Types.ObjectId(userId),
                isActive: true,
            });
            if (!device) {
                throw new errorHandler_1.AppError(404, "Device not found");
            }
            const isDeviceAssigned = await location_1.Location.findOne({
                deviceId: deviceId,
                _id: { $ne: locationId },
                isActive: true,
            });
            if (isDeviceAssigned) {
                throw new errorHandler_1.AppError(400, "Device is already assigned to another location");
            }
            const location = await location_1.Location.findOneAndUpdate({
                _id: locationId,
                userId: new mongoose_1.Types.ObjectId(userId),
                isActive: true,
            }, { deviceId: deviceId }, { new: true });
            if (!location) {
                throw new errorHandler_1.AppError(404, "Location not found");
            }
            await device_1.Device.findOneAndUpdate({ deviceId: deviceId }, { locationId: location._id });
            return location;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(400, "Error assigning device to location");
        }
    }
    async removeDeviceFromLocation(locationId, userId) {
        try {
            const location = await location_1.Location.findOne({
                _id: locationId,
                userId: new mongoose_1.Types.ObjectId(userId),
                isActive: true,
            });
            if (!location) {
                throw new errorHandler_1.AppError(404, "Location not found");
            }
            const deviceId = location.deviceId;
            const updatedLocation = await location_1.Location.findByIdAndUpdate(locationId, { $unset: { deviceId: "" } }, { new: true });
            if (deviceId) {
                await device_1.Device.findOneAndUpdate({ deviceId: deviceId }, { $unset: { locationId: "" } });
            }
            return updatedLocation;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError)
                throw error;
            throw new errorHandler_1.AppError(400, "Error removing device from location");
        }
    }
    async getLocationByDeviceId(deviceId) {
        try {
            const location = await location_1.Location.findOne({
                deviceId: deviceId,
                isActive: true,
            });
            return location;
        }
        catch (error) {
            console.error("Error finding location by device ID:", error);
            throw new errorHandler_1.AppError(500, "Error finding location for device");
        }
    }
}
exports.LocationService = LocationService;
//# sourceMappingURL=locationService.js.map