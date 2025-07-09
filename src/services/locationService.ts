// locationService.ts
import { Types } from "mongoose";
import { Location, ILocation } from "../models/location";
import { Device, IDevice } from "../models/device";
import { AppError } from "../middleware/errorHandler";

export class LocationService {
  async createLocation(
    userId: string,
    data: Partial<ILocation> & { deviceId?: string }
  ): Promise<ILocation> {
    try {
      // Check if device exists and is available
      if (data.deviceId) {
        const device = await Device.findOne({
          deviceId: data.deviceId,
          userId: new Types.ObjectId(userId),
          isActive: true,
        });

        if (!device) {
          throw new AppError(404, "Device not found");
        }

        const isDeviceAssigned = await Location.findOne({
          deviceId: data.deviceId,
          isActive: true,
        });
        if (isDeviceAssigned) {
          throw new AppError(
            400,
            "Device is already assigned to another location"
          );
        }
      }

      const location = await Location.create({
        ...data,
        userId: new Types.ObjectId(userId),
      });

      if (data.deviceId) {
        await Device.findOneAndUpdate(
          { deviceId: data.deviceId },
          { locationId: location._id }
        );
      }

      return location;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(400, "Error creating location");
    }
  }

  async getLocations(userId: string): Promise<ILocation[]> {
    try {
      // Fetch locations
      const locations = await Location.find({
        userId: new Types.ObjectId(userId),
        isActive: true,
      }).lean(); // Convert to plain objects

      // Fetch devices for all locations where deviceId is a string
      const deviceIds = locations
        .filter((location) => typeof location.deviceId === "string")
        .map((location) => location.deviceId);

      // Fetch devices from Device collection
      const devices = deviceIds.length
        ? await Device.find({ deviceId: { $in: deviceIds } })
            .select("_id deviceId type status")
            .lean()
        : [];

      // Attach corresponding devices to locations
      return locations.map((location) => {
        // Find the matching device for this location
        const device = devices.find((d) => d.deviceId === location.deviceId);
        return {
          ...location,
          device: device || undefined, // Attach device if found
        };
      });
    } catch (error) {
      console.error("Error in getLocations:", error);
      throw new AppError(500, "Error fetching locations");
    }
  }

  //   async getLocationById(
  //     locationId: string,
  //     userId: string
  //   ): Promise<ILocation> {
  //     try {
  //       // Validate inputs
  //       if (
  //         !Types.ObjectId.isValid(locationId) ||
  //         !Types.ObjectId.isValid(userId)
  //       ) {
  //         throw new AppError(400, "Invalid locationId or userId");
  //       }

  //       // Fetch location
  //       const location = await Location.findOne({
  //         _id: new Types.ObjectId(locationId),
  //         userId: new Types.ObjectId(userId),
  //         isActive: true,
  //       }).populate("deviceId");

  //       // Check if location exists
  //       if (!location) {
  //         throw new AppError(404, "Location not found or is inactive");
  //       }

  //       return location;
  //     } catch (error:any) {
  //       console.error("Error in getLocationById:", error);

  //       // Re-throw AppError as is
  //       if (error instanceof AppError) {
  //         throw error;
  //       }

  //       // Handle Mongoose errors
  //       if (error.name === "CastError") {
  //         throw new AppError(400, "Invalid ID format");
  //       }

  //       // Default error
  //       throw new AppError(500, "Error fetching location");
  //     }
  //   }

  async getLocationById(
    locationId: string,
    userId: string
  ): Promise<ILocation & { device?: IDevice }> {
    try {
      // Validate input IDs
      if (
        !Types.ObjectId.isValid(locationId) ||
        !Types.ObjectId.isValid(userId)
      ) {
        throw new AppError(400, "Invalid locationId or userId");
      }

      // Fetch location without population (because deviceId is a string)
      let location = await Location.findOne({
        _id: new Types.ObjectId(locationId),
        userId: new Types.ObjectId(userId),
        isActive: true,
      }).lean(); // Convert to plain object

      // Check if location exists
      if (!location) {
        throw new AppError(404, "Location not found or is inactive");
      }

      let device: IDevice | null = null;

      // If deviceId exists and is a string, fetch device details
      if (location.deviceId && typeof location.deviceId === "string") {
        device = await Device.findOne({ deviceId: location.deviceId })
          .select("_id deviceId type status")
          .lean();
      }

      return {
        ...location,
        device: device || undefined, // Attach device details properly
      };
    } catch (error: any) {
      console.error("Error in getLocationById:", error);

      if (error instanceof AppError) {
        throw error;
      }

      if (error.name === "CastError") {
        throw new AppError(400, "Invalid ID format");
      }

      throw new AppError(500, "Error fetching location");
    }
  }

  // async updateLocation(
  //   locationId: string,
  //   userId: string,
  //   data: Partial<ILocation>
  // ): Promise<ILocation> {
  //   try {
  //     const location = await Location.findOneAndUpdate(
  //       {
  //         _id: locationId,
  //         userId: new Types.ObjectId(userId),
  //         isActive: true,
  //       },
  //       data,
  //       { new: true, runValidators: true }
  //     ).populate("deviceId");

  //     if (!location) {
  //       throw new AppError(404, "Location not found");
  //     }

  //     return location;
  //   } catch (error) {
  //     if (error instanceof AppError) throw error;
  //     throw new AppError(400, "Error updating location");
  //   }
  // }

  async updateLocation(
    locationId: string,
    userId: string,
    data: Partial<ILocation> | Record<string, any> // Allow for MongoDB operators
  ): Promise<ILocation> {
    try {
      const location = await Location.findOneAndUpdate(
        {
          _id: locationId,
          userId: new Types.ObjectId(userId),
          isActive: true,
        },
        data,
        { new: true, runValidators: true }
      )

      if (!location) {
        throw new AppError(404, "Location not found");
      }

      return location;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(400, "Error updating location");
    }
  }

  async deleteLocation(locationId: string, userId: string): Promise<void> {
    try {
      const location = await Location.findOneAndUpdate(
        {
          _id: locationId,
          userId: new Types.ObjectId(userId),
          isActive: true,
        },
        { isActive: false },
        { new: true }
      );

      if (!location) {
        throw new AppError(404, "Location not found");
      }

      // Unassign device if exists
      if (location.deviceId) {
        await Device.findOneAndUpdate(
          { deviceId: location.deviceId },
          { $unset: { locationId: 1 } }
        );
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, "Error deleting location");
    }
  }

  async assignDeviceToLocation(
    locationId: string,
    userId: string,
    deviceId: string
  ): Promise<ILocation> {
    try {
      // Check if device exists and is available
      const device = await Device.findOne({
        deviceId: deviceId,
        userId: new Types.ObjectId(userId),
        isActive: true,
      });

      if (!device) {
        throw new AppError(404, "Device not found");
      }

      // Check if device is already assigned to another location
      const isDeviceAssigned = await Location.findOne({
        deviceId: deviceId,
        _id: { $ne: locationId },
        isActive: true,
      });

      if (isDeviceAssigned) {
        throw new AppError(
          400,
          "Device is already assigned to another location"
        );
      }

      // Update location with the deviceId
      const location = await Location.findOneAndUpdate(
        {
          _id: locationId,
          userId: new Types.ObjectId(userId),
          isActive: true,
        },
        { deviceId: deviceId },
        { new: true }
      );

      if (!location) {
        throw new AppError(404, "Location not found");
      }

      // Update device with locationId
      await Device.findOneAndUpdate(
        { deviceId: deviceId },
        { locationId: location._id }
      );

      return location;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(400, "Error assigning device to location");
    }
  }

  async removeDeviceFromLocation(
    locationId: string,
    userId: string
  ): Promise<any> {
    try {
      // Find the location to get the deviceId
      const location = await Location.findOne({
        _id: locationId,
        userId: new Types.ObjectId(userId),
        isActive: true,
      });

      if (!location) {
        throw new AppError(404, "Location not found");
      }

      const deviceId = location.deviceId;

      // Update location to remove deviceId
      const updatedLocation = await Location.findByIdAndUpdate(
        locationId,
        { $unset: { deviceId: "" } },
        { new: true }
      );

      // If there was a device, update it too
      if (deviceId) {
        await Device.findOneAndUpdate(
          { deviceId: deviceId },
          { $unset: { locationId: "" } }
        );
      }

      return updatedLocation;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(400, "Error removing device from location");
    }
  }
  async getLocationByDeviceId(deviceId: string): Promise<ILocation | null> {
    try {
      const location = await Location.findOne({
        deviceId: deviceId,
        isActive: true,
      });

      return location;
    } catch (error) {
      console.error("Error finding location by device ID:", error);
      throw new AppError(500, "Error finding location for device");
    }
  }
}
