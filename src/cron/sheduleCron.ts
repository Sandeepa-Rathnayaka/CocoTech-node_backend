import cron from "node-cron";
import { WateringService } from "../services/wateringService";
import { DeviceService } from "../services/deviceService";

export class ScheduleCron {
  private wateringService: WateringService;
  private DeviceService: DeviceService;

  constructor() {
    this.wateringService = new WateringService();
    this.DeviceService = new DeviceService();
    this.initCronJobs();
  }

  // Examples:
  // '0 6 * * *'  // 6:00 AM every day
  // '0 7 * * *'  // 7:00 AM every day
  // '0 */6 * * *' // Every 6 hours
  // '0 6,18 * * *' // Twice a day at 6 AM and 6 PM

  private initCronJobs() {
    // Run every day at 6:00 AM
    cron.schedule("0 6 * * *", async () => {
      // console.log('Starting daily schedule creation...');
      try {
        await this.wateringService.createDailySchedules();
        // console.log('Daily schedule creation completed successfully');
      } catch (error) {
        console.error("Error in cron job:", error);
      }
    });

    cron.schedule("* * * * *", async () => {
      // console.log('Starting battery level updates...');
      try {
        const result = await this.DeviceService.updateDeviceBatteryLevels();
      } catch (error) {
        console.error("Error in battery update cron job:", error);
      }
    });
  }
}
