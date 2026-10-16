import express from 'express';
import BookingController from '../controllers/BookingController.js';
import { authMiddleware, authorize } from '../middleware/auth.js';
import { validateRequest, validationSchemas } from '../middleware/validation.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

/**
 * Protected routes
 */
router.use(authMiddleware);

/**
 * Customer routes
 */
router.post(
  '/',
  validateRequest(validationSchemas.createBooking),
  BookingController.createBooking
);

router.get('/my-bookings', BookingController.getMyBookings);
router.get('/:id', BookingController.getBookingById);

/**
 * Staff/Manager/Admin routes
 */
router.use(authorize([ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]));

router.get('/', BookingController.getAllBookings);

router.put(
  '/:id',
  validateRequest(validationSchemas.updateBooking),
  BookingController.updateBooking
);

router.post('/:id/confirm', BookingController.confirmBooking);
router.post('/:id/check-in', BookingController.checkIn);
router.post('/:id/check-out', BookingController.checkOut);
router.post('/:id/cancel', BookingController.cancelBooking);
router.post('/:id/payment', BookingController.recordPayment);

export default router;
