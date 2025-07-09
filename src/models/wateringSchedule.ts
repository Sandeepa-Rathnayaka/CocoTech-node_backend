import mongoose, { Schema, Document } from "mongoose";

export interface IWateringSchedule extends Document {
  userId: mongoose.Types.ObjectId;
  locationId: mongoose.Types.ObjectId;
  deviceId?: string;
  date: Date;
  status: "pending" | "in_progress" | "completed" | "skipped" | "cancelled";
  recommendedAmount: number;
  actualAmount?: number;
  soilConditions: {
    moisture10cm: number;
    moisture20cm: number;
    moisture30cm: number;
    soilType: string;
  };
  weatherConditions: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  plantAge: number;
  predictionConfidence: number;
  executionDetails?: {
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    executedBy?: "automatic" | "manual";
    deviceStatus?: string;
    errors?: string[];
  };
  notes?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const wateringScheduleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    deviceId: {
      type: String,
      ref: "Device",
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "skipped", "cancelled"],
      default: "pending",
    },
    recommendedAmount: {
      type: Number,
      required: true,
    },
    actualAmount: {
      type: Number,
    },
    soilConditions: {
      moisture10cm: {
        type: Number,
        required: true,
      },
      moisture20cm: {
        type: Number,
        required: true,
      },
      moisture30cm: {
        type: Number,
        required: true,
      },
      soilType: {
        type: String,
        required: true,
        enum: [
          "Lateritic",
          "Sandy Loam",
          "Cinnamon Sand",
          "Red Yellow Podzolic",
          "Alluvial",
        ],
      },
    },
    weatherConditions: {
      temperature: {
        type: Number,
        required: true,
      },
      humidity: {
        type: Number,
        required: true,
      },
      rainfall: {
        type: Number,
        required: true,
      },
    },
    plantAge: {
      type: Number,
      required: false,
      default: 4,
    },
    predictionConfidence: {
      type: Number,
      required: true,
    },
    executionDetails: {
      startTime: Date,
      endTime: Date,
      duration: Number,
      executedBy: {
        type: String,
        enum: ["automatic", "manual"],
      },
      deviceStatus: String,
      errors: [String],
    },
    notes: {
      type: String,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
wateringScheduleSchema.index({ userId: 1, locationId: 1, date: 1 });
wateringScheduleSchema.index({ deviceId: 1, date: 1 });
wateringScheduleSchema.index({ status: 1, date: 1 });
wateringScheduleSchema.index({ deletedAt: 1 });

export const WateringSchedule = mongoose.model<IWateringSchedule>(
  "WateringSchedule",
  wateringScheduleSchema
);
