import { Router } from "express";
import { WateringController } from "../controllers/wateringController";
import { authenticateJWT } from "../middleware/auth";
import {
  validateWateringSchedule,
  validateDateRange,
} from "../middleware/wateringValidation";
import { rateLimiters } from "../middleware/rateLimiter";

const router = Router();
const wateringController = new WateringController();

// Apply authentication to all routes
router.use(authenticateJWT);

// Apply rate limiting
router.use(rateLimiters.public);

// Schedule creation and management
router.post(
  "/schedule/:locationId",
  // validateWateringSchedule,
  wateringController.createSchedule
);

// Schedule retrieval
router.get(
  "/history",
  validateDateRange,
  wateringController.getScheduleHistory
);

router.get("/today", wateringController.getTodaySchedules);

router.get(
  "/location/:locationId",
  validateDateRange,
  wateringController.getLocationSchedules
);

router.put("/schedule/:id/status", wateringController.updateScheduleStatus);

router.delete("/schedule/:id", wateringController.deleteSchedule);
//
router.get("/schedule/:id", wateringController.getScheduleById);

export default router;
