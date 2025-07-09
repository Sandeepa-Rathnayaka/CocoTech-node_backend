"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const wateringService_1 = require("../services/wateringService");
const deviceService_1 = require("../services/deviceService");
class ScheduleCron {
    constructor() {
        this.wateringService = new wateringService_1.WateringService();
        this.DeviceService = new deviceService_1.DeviceService();
        this.initCronJobs();
    }
    initCronJobs() {
        node_cron_1.default.schedule("* * * * *", async () => {
            try {
                await this.wateringService.createDailySchedules();
            }
            catch (error) {
                console.error("Error in cron job:", error);
            }
        });
        node_cron_1.default.schedule("0 6 * * *", async () => {
            try {
                const result = await this.DeviceService.updateDeviceBatteryLevels();
            }
            catch (error) {
                console.error("Error in battery update cron job:", error);
            }
        });
    }
}
exports.ScheduleCron = ScheduleCron;
//# sourceMappingURL=sheduleCron.js.map