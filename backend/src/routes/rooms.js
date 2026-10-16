import express from 'express';
import RoomController from '../controllers/RoomController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';
import { validateRequest, validationSchemas } from '../middleware/validation.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

/**
 * Public routes
 */
router.get('/', RoomController.getAllRooms);
router.get('/available', RoomController.getAvailableRooms);
router.get('/:id', RoomController.getRoomById);
router.get('/:id/calendar', RoomController.getRoomCalendar);

/**
 * Protected routes (staff/manager/admin)
 */
router.use(authMiddleware);
router.use(authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]));

router.post(
  '/',
  validateRequest(validationSchemas.createRoom),
  RoomController.createRoom
);

router.put(
  '/:id',
  validateRequest(validationSchemas.updateRoom),
  RoomController.updateRoom
);

router.delete('/:id', RoomController.deleteRoom);

export default router;
