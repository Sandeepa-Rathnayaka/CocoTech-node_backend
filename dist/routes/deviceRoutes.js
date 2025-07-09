"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deviceController_1 = require("../controllers/deviceController");
const auth_1 = require("../middleware/auth");
const locationDeviceValidation_1 = require("../middleware/locationDeviceValidation");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
const deviceController = new deviceController_1.DeviceController();
router.use(auth_1.authenticateJWT);
router.use(rateLimiter_1.rateLimiters.public);
router.post('/register', locationDeviceValidation_1.validateDevice, deviceController.registerDevice);
router.get('/', deviceController.getDevices);
router.get('/:id', deviceController.getDeviceById);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);
router.post('/:id/readings', deviceController.updateDeviceReading);
exports.default = router;
//# sourceMappingURL=deviceRoutes.js.map