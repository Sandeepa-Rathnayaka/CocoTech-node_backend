import axios from 'axios';
import YieldPrediction from '../models/YieldPrediction';

class YieldPredictionService {
  private predictionApiUrl = 'https://flask-be-deploy.onrender.com/predict';

  public async predictYield(data: any): Promise<any> {
    try {
      const response = await axios.post(this.predictionApiUrl, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error predicting yield: ' + error.message);
      } else {
        throw new Error('Error predicting yield');
      }
    }
  }

  public async createYieldPrediction(data: any, userId: string, locationId: string): Promise<any> {
    const predictionResponse = await this.predictYield(data);
    const yieldPrediction = new YieldPrediction({
      ...predictionResponse,
      user: userId,
      location: locationId,
    });
    await yieldPrediction.save();
    return yieldPrediction;
  }
  public async getAllYieldPredictions(): Promise<any> {
    return YieldPrediction.find();
  }

  public async getYieldPredictionById(id: string): Promise<any> {
    return YieldPrediction.findById(id);
  }

  public async getYieldPredictionsByUser(userId: string): Promise<any> {
    return YieldPrediction.find({ user: userId });
  }

  public async deleteYieldPrediction(id: string): Promise<any> {
    return YieldPrediction.deleteOne({ _id: id });
  }

  public async getLatestYieldPredictionByUser(userId: string): Promise<any> {
    return YieldPrediction.findOne({ user: userId }).sort({ createdAt: -1 });
  }
}

export default new YieldPredictionService();