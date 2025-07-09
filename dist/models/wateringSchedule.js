"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WateringSchedule = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const wateringScheduleSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    locationId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
wateringScheduleSchema.index({ userId: 1, locationId: 1, date: 1 });
wateringScheduleSchema.index({ deviceId: 1, date: 1 });
wateringScheduleSchema.index({ status: 1, date: 1 });
wateringScheduleSchema.index({ deletedAt: 1 });
exports.WateringSchedule = mongoose_1.default.model("WateringSchedule", wateringScheduleSchema);
//# sourceMappingURL=wateringSchedule.js.map