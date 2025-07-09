import { Schema, model, Document, Types } from 'mongoose';

interface IInputData {
  humidity: number;
  plant_age: number;
  rainfall: number;
  soil_moisture_10cm: number;
  soil_moisture_20cm: number;
  soil_moisture_30cm: number;
  soil_type: number;
  temperature: number;
  weather_description: string;
}

interface IMonthlyPrediction {
  confidence_score: number;
  ensemble_prediction: number;
  input_data: IInputData;
  long_term_prediction: number;
  month: number;
  month_name: string;
  seasonal_factor: number;
  seasonal_prediction: number;
  weights: number[];
  year: number;
}

interface IYieldPrediction extends Document {
  year: number;
  average_prediction: number;
  monthly_predictions: IMonthlyPrediction[];
  status: string;
  user: Types.ObjectId;
  location: Types.ObjectId;
}

const InputDataSchema = new Schema<IInputData>({
  humidity: { type: Number, required: true },
  plant_age: { type: Number, required: true },
  rainfall: { type: Number, required: true },
  soil_moisture_10cm: { type: Number, required: true },
  soil_moisture_20cm: { type: Number, required: true },
  soil_moisture_30cm: { type: Number, required: true },
  soil_type: { type: Number, required: true },
  temperature: { type: Number, required: true },
  weather_description: { type: String, required: true },
});

const MonthlyPredictionSchema = new Schema<IMonthlyPrediction>({
  confidence_score: { type: Number, required: true },
  ensemble_prediction: { type: Number, required: true },
  input_data: { type: InputDataSchema, required: true },
  long_term_prediction: { type: Number, required: true },
  month: { type: Number, required: true },
  month_name: { type: String, required: true },
  seasonal_factor: { type: Number, required: true },
  seasonal_prediction: { type: Number, required: true },
  weights: { type: [Number], required: true },
  year: { type: Number, required: true },
});

const YieldPredictionSchema = new Schema<IYieldPrediction>({
  year: { type: Number, required: true },
  average_prediction: { type: Number, required: true },
  monthly_predictions: { type: [MonthlyPredictionSchema], required: true },
  status: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
}, { timestamps: true });

const YieldPrediction = model<IYieldPrediction>('YieldPrediction', YieldPredictionSchema);

export default YieldPrediction;