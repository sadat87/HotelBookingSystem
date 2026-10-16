import express from 'express';
import UserController from '../controllers/UserController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';
import { validateRequest, validationSchemas } from '../middleware/validation.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

/**
 * Protected routes
 */
router.use(authMiddleware);

/**
 * User profile routes
 */
router.put(
  '/profile',
  validateRequest(validationSchemas.updateProfile),
  UserController.updateProfile
);

/**
 * Admin routes
 */
router.use(authorize(ROLES.ADMIN));

router.get('/', UserController.getAllUsers);
router.get('/search', UserController.searchUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id/role', UserController.updateUserRole);
router.put('/:id/deactivate', UserController.deactivateUser);
router.put('/:id/activate', UserController.activateUser);
router.get('/stats/dashboard', UserController.getDashboardStats);

export default router;
