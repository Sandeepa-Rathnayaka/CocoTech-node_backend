import { Schema, model, Document, Types } from 'mongoose';

interface IActualYield extends Document {
  user: Types.ObjectId;
  location: Types.ObjectId;
  year: number;
  month: number;
  actual_yield: number;
  yieldPrediction: Types.ObjectId;
}

const ActualYieldSchema = new Schema<IActualYield>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  actual_yield: { type: Number, required: true },
  yieldPrediction: { type: Schema.Types.ObjectId, ref: 'YieldPrediction' }, // Reference to YieldPrediction model
}, { timestamps: true });

const ActualYield = model<IActualYield>('ActualYield', ActualYieldSchema);

export default ActualYield;