import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    name: string;
    userId: mongoose.Types.ObjectId;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    area: number;
    soilType: string;
    totalTrees: number;
    deviceId?: string;
    status: 'active' | 'inactive';
    plantationDate: Date;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const locationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    area: {
        type: Number,
        required: true
    },
    soilType: {
        type: String,
        required: true,
        enum: ['Lateritic', 'Sandy Loam', 'Cinnamon Sand', 'Red Yellow Podzolic', 'Alluvial']
    },
    totalTrees: {
        type: Number,
        required: true,
        min: 1
    },
    deviceId: {
        type: String,
        ref: 'Device',
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    plantationDate: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes
locationSchema.index({ userId: 1 });
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ status: 1 });
locationSchema.index({ isActive: 1 });

export const Location = mongoose.model<ILocation>('Location', locationSchema);
