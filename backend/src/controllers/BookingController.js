import asyncHandler from 'express-async-handler';
import BookingService from '../services/BookingService.js';
import { apiResponse, paginateResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * BookingController - Handles booking endpoints
 */
class BookingController {
  /**
   * POST /api/bookings
   * Create a new booking
   */
  createBooking = asyncHandler(async (req, res) => {
    const booking = await BookingService.createBooking(
      req.user.userId,
      req.validatedBody
    );

    apiResponse(
      res,
      HTTP_STATUS.CREATED,
      'Booking created successfully',
      booking
    );
  });

  /**
   * GET /api/bookings
   * Get all bookings (admin only)
   */
  getAllBookings = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      guestId: req.query.guestId,
      status: req.query.status,
      roomId: req.query.roomId,
      checkInDate: req.query.checkInDate,
      checkOutDate: req.query.checkOutDate,
    };

    const result = await BookingService.getAllBookings(page, limit, filters);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Bookings retrieved successfully',
      paginateResponse(result.bookings, page, limit, result.pagination.total)
    );
  });

  /**
   * GET /api/bookings/my-bookings
   * Get current user's bookings
   */
  getMyBookings = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await BookingService.getGuestBookings(
      req.user.userId,
      page,
      limit
    );

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Your bookings retrieved successfully',
      paginateResponse(result.bookings, page, limit, result.pagination.total)
    );
  });

  /**
   * GET /api/bookings/:id
   * Get booking by ID
   */
  getBookingById = asyncHandler(async (req, res) => {
    const booking = await BookingService.getBookingById(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Booking retrieved successfully',
      booking
    );
  });

  /**
   * PUT /api/bookings/:id
   * Update booking
   */
  updateBooking = asyncHandler(async (req, res) => {
    const booking = await BookingService.updateBooking(
      req.params.id,
      req.validatedBody
    );

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Booking updated successfully',
      booking
    );
  });

  /**
   * POST /api/bookings/:id/confirm
   * Confirm booking
   */
  confirmBooking = asyncHandler(async (req, res) => {
    const booking = await BookingService.confirmBooking(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Booking confirmed successfully',
      booking
    );
  });

  /**
   * POST /api/bookings/:id/check-in
   * Check in guest
   */
  checkIn = asyncHandler(async (req, res) => {
    const booking = await BookingService.checkIn(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Guest checked in successfully',
      booking
    );
  });

  /**
   * POST /api/bookings/:id/check-out
   * Check out guest
   */
  checkOut = asyncHandler(async (req, res) => {
    const booking = await BookingService.checkOut(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Guest checked out successfully',
      booking
    );
  });

  /**
   * POST /api/bookings/:id/cancel
   * Cancel booking
   */
  cancelBooking = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    const booking = await BookingService.cancelBooking(req.params.id, reason);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Booking cancelled successfully',
      booking
    );
  });

  /**
   * POST /api/bookings/:id/payment
   * Record payment for booking
   */
  recordPayment = asyncHandler(async (req, res) => {
    const { status, method, transactionId, paidAmount } = req.body;

    if (!status || !method) {
      return apiResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Status and method are required'
      );
    }

    const booking = await BookingService.recordPayment(req.params.id, {
      status,
      method,
      transactionId,
      paidAmount,
    });

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Payment recorded successfully',
      booking
    );
  });
}

export default new BookingController();
