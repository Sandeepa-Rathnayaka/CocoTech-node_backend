"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const userController = new userController_1.default();
router.use(auth_1.authenticateJWT);
router.use((0, auth_1.authorizeRoles)('admin'));
router.get('/', validation_1.validatePagination, userController.getUsers);
router.get('/:id', validation_1.validateId, userController.getUserById);
router.post('/', validation_1.validateUserUpdate, userController.createUser);
router.put('/:id', validation_1.validateId, validation_1.validateUserUpdate, userController.updateUser);
router.delete('/:id', validation_1.validateId, userController.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map