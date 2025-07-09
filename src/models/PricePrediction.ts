import { Schema, model, Document, Types } from 'mongoose';

interface IPricePrediction extends Document {
  user: Types.ObjectId;
  location: Types.ObjectId;
  yield_nuts: number;
  export_volume: number;
  domestic_consumption: number;
  inflation_rate: number;
  prediction_date: Date;
  previous_prices: {
    "1": number;
    "3": number;
    "6": number;
    "12": number;
  };
  predicted_price: number;
  month: string;
  year: number;
}

const PricePredictionSchema = new Schema<IPricePrediction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  yield_nuts: { type: Number, required: true },
  export_volume: { type: Number, required: true },
  domestic_consumption: { type: Number, required: true },
  inflation_rate: { type: Number, required: true },
  prediction_date: { type: Date, required: true },
  previous_prices: {
    "1": { type: Number },
    "3": { type: Number },
    "6": { type: Number },
    "12": { type: Number }
  },
  predicted_price: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true }
}, { timestamps: true });

const PricePrediction = model<IPricePrediction>('PricePrediction', PricePredictionSchema);

export default PricePrediction;