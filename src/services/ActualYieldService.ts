import { log } from 'console';
import ActualYield from '../models/ActualYield';

class ActualYieldService {
  public async createActualYield(data: any, userId: string, locationId: string): Promise<any> {
    const yieldPredictionId = data.yieldPredictionId; // Assuming yieldPredictionId comes from data

    const actualYield = new ActualYield({
      ...data,
      user: userId,
      location: locationId,
      yieldPrediction: yieldPredictionId
    });
    await actualYield.save();
    return actualYield;
  }

  public async getActualYieldsByUser(userId: string): Promise<any> {
    return ActualYield.find({ user: userId });
  }

  public async getActualYieldById(id: string): Promise<any> {
    return ActualYield.findById(id);
  }

  public async getActualYieldByPrdiction(yieldPredictionId: string): Promise<any> {
    return ActualYield.find({ yieldPrediction: yieldPredictionId })
      .sort({ createdAt: -1 })
      .limit(1);  // Limits the result to the latest one
  }


  public async deleteActualYield(id: string): Promise<any> {
    return ActualYield.deleteOne({ _id: id });
  }

  public async getActualYieldsByYearAndLocation(userId: string, year: number, locationId: string): Promise<any> {
    return ActualYield.find({ user: userId, year, location: locationId });
  }
}

export default new ActualYieldService();