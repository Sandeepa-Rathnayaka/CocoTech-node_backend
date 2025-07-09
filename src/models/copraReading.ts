import mongoose, { Schema, Document } from "mongoose";

export interface ICopraReading extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId?: string;
  batchId: string;
  moistureLevel: number;
  weatherConditions: {
    temperature: number;
    humidity: number;
  };
  startTime: Date;
  endTime: Date;
  status: "dryed" | "newly_harvested" | "over_dryed" | "Moderate_level";
  dryingTime: number;
  notes?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const copraReadingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: String,
      ref: "Device",
    },
    batchId: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["dryed", "newly_harvested", "over_dryed", "Moderate_level"],
      default: "newly_harvested",
    },
    moistureLevel: {
      type: Number,
      required: true,
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
    },
    dryingTime: {
      type: Number,
      required: true,
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
copraReadingSchema.index({ userId: 1, date: 1 });
copraReadingSchema.index({ deviceId: 1, date: 1 });
copraReadingSchema.index({ status: 1, date: 1 });
copraReadingSchema.index({ deletedAt: 1 });

export const CopraReading = mongoose.model<ICopraReading>(
  "CopraReading",
  copraReadingSchema
);
