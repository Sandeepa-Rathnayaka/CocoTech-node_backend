import mongoose, { Schema, Document } from "mongoose";

export interface IDevice extends Document {
  deviceId: string;
  locationId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "soil_sensor" | "moisture_sensor";
  status: "active" | "inactive" | "maintenance";
  lastReading?: {
    moisture10cm: number;
    moisture20cm: number;
    moisture30cm: number;
    timestamp: Date;
  };
  lastMaintenance?: Date;
  batteryLevel?: number;
  firmware: string;
  settings: {
    readingInterval: number;
    reportingInterval: number;
    thresholds: {
      moisture?: number;
      temperature?: number;
      humidity?: number;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const deviceSchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["soil_sensor", "moisture_sensor"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
    lastReading: {
      moisture10cm: Number,
      moisture20cm: Number,
      moisture30cm: Number,
      timestamp: Date,
    },
    lastMaintenance: {
      type: Date,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
    },
    firmware: {
      type: String,
      required: true,
    },
    settings: {
      readingInterval: {
        type: Number,
        required: true,
        default: 30,
      },
      reportingInterval: {
        type: Number,
        required: true,
        default: 60,
      },
      thresholds: {
        moisture: Number,
        temperature: Number,
        humidity: Number,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ locationId: 1 });
deviceSchema.index({ userId: 1 });
deviceSchema.index({ status: 1 });
deviceSchema.index({ isActive: 1 });

export const Device = mongoose.model<IDevice>("Device", deviceSchema);
