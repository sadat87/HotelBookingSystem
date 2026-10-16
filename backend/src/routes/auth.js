import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateRequest, validationSchemas } from '../middleware/validation.js';

const router = express.Router();

/**
 * Public routes
 */
router.post(
  '/register',
  validateRequest(validationSchemas.registerUser),
  AuthController.register
);

router.post(
  '/login',
  validateRequest(validationSchemas.loginUser),
  AuthController.login
);

router.post('/refresh', AuthController.refreshToken);

/**
 * Protected routes
 */
router.use(authMiddleware);

router.post('/logout', AuthController.logout);
router.post('/logout-all', AuthController.logoutAll);
router.post('/change-password', AuthController.changePassword);
router.get('/me', AuthController.getProfile);

export default router;
