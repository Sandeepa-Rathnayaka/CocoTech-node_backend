import { Request, Response } from "express";
import { LocationService } from "../services/locationService";
import { AppError, asyncHandler } from "../middleware/errorHandler";
import { Device } from "../models/device";

export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  createLocation = asyncHandler(async (req: Request, res: Response) => {
    const location = await this.locationService.createLocation(
      req.user.id,
      req.body
    );

    res.status(201).json({
      status: "success",
      data: { location },
    });
  });

  getLocations = asyncHandler(async (req: Request, res: Response) => {
    const locations = await this.locationService.getLocations(req.user.id);

    res.status(200).json({
      status: "success",
      data: { locations },
    });
  });

  getLocationById = asyncHandler(async (req: Request, res: Response) => {
    const location = await this.locationService.getLocationById(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      status: "success",
      data: { location },
    });
  });

  updateLocation = asyncHandler(async (req: Request, res: Response) => {
    const location = await this.locationService.updateLocation(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      status: "success",
      data: { location },
    });
  });

  deleteLocation = asyncHandler(async (req: Request, res: Response) => {
    await this.locationService.deleteLocation(req.params.id, req.user.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
  
  assignDeviceToLocation = asyncHandler(async (req: Request, res: Response) => {
    const { deviceId } = req.body;

    if (!deviceId) {
      throw new AppError(400, "Device ID is required");
    }

    const location = await this.locationService.assignDeviceToLocation(
      req.params.id,
      req.user.id,
      deviceId
    );

    res.status(200).json({
      status: "success",
      data: { location },
    });
  });

  removeDeviceFromLocation = asyncHandler(
    async (req: Request, res: Response) => {
      const location = await this.locationService.removeDeviceFromLocation(
        req.params.id,
        req.user.id
      );

      res.status(200).json({
        status: "success",
        data: { location },
      });
    }
  );

  getLocationByDeviceId = asyncHandler(async (req: Request, res: Response) => {
    try {
      const location = await this.locationService.getLocationByDeviceId(
        req.params.deviceId
      );

      return res.status(200).json({
        status: "success",
        data: { location },
      });
    } catch (error) {
      console.error("Error finding location by device ID:", error);
      return res.status(500).json({
        status: "error",
        message: "Error finding location for device",
      });
    }
  });
}
