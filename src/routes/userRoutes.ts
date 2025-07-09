import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { 
    validateId, 
    validateUserUpdate,
    validatePagination 
} from '../middleware/validation';

const router = Router();
const userController = new UserController();

// Apply authentication to all routes
router.use(authenticateJWT);

// Admin only routes
router.use(authorizeRoles('admin'));

// User management routes (admin only)
router.get('/', validatePagination, userController.getUsers);
router.get('/:id', validateId, userController.getUserById);
router.post('/', validateUserUpdate, userController.createUser);
router.put('/:id', validateId, validateUserUpdate, userController.updateUser);
router.delete('/:id', validateId, userController.deleteUser);

export default router;