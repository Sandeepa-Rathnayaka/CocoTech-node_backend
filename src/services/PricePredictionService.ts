import axios from 'axios';
import PricePrediction from '../models/PricePrediction';

class PricePredictionService {
    private predictionApiUrl = 'https://flask-be-deploy.onrender.com/predict_price';
    

    public async predictPrice(data: any): Promise<any> {
        try {
            const response = await axios.post(this.predictionApiUrl, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error predicting price: ' + error.message);
            } else {
                throw new Error('Error predicting price');
            }
        }
    }

    public async createPricePrediction(data: any, userId: string, locationId: string): Promise<any> {
        const predictionResponse = await this.predictPrice(data);
        const predictionDate = new Date(data.prediction_date);
        const year = predictionDate.getFullYear();
        const month = predictionDate.toLocaleString('default', { month: 'long' });

        const pricePrediction = new PricePrediction({
            ...data,
            ...predictionResponse,
            user: userId,
            location: locationId,
            year,
            month,
        });
        await pricePrediction.save();
        return pricePrediction;
    }

    public async getAllPricePredictions(): Promise<any> {
        return PricePrediction.find();
    }

    public async getPricePredictionById(id: string): Promise<any> {
        return PricePrediction.findById(id);
    }

    public async getPricePredictionsByUser(userId: string): Promise<any> {
        return PricePrediction.find({ user: userId });
    }

    public async deletePricePrediction(id: string): Promise<any> {
        return PricePrediction.deleteOne({ _id: id });
    }
}

export default new PricePredictionService();