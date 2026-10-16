import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { APIError } from '../middleware/errorHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES, BOOKING_STATUS } from '../constants/index.js';
import { calculateNights, generateBookingReference } from '../utils/helpers.js';
import RoomService from './RoomService.js';

/**
 * BookingService - Handles booking operations
 */
class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(guestId, bookingData) {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests } =
      bookingData;

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      throw new APIError(
        HTTP_STATUS.BAD_REQUEST,
        'Check-out date must be after check-in date'
      );
    }

    // Check if room is available
    const isAvailable = await RoomService.isRoomAvailable(
      roomId,
      checkIn,
      checkOut
    );

    if (!isAvailable) {
      throw new APIError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.ROOM_NOT_AVAILABLE
      );
    }

    // Get room details for pricing
    const room = await Room.findById(roomId);
    if (!room) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    // Calculate booking details
    const numberOfNights = calculateNights(checkIn, checkOut);
    const totalPrice = room.basePrice * numberOfNights;

    // Create booking
    const booking = await Booking.create({
      bookingReference: generateBookingReference(),
      guest: guestId,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      numberOfNights,
      roomPrice: room.basePrice,
      totalPrice,
      specialRequests,
    });

    return booking.populate('guest room');
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId) {
    const booking = await Booking.findById(bookingId).populate('guest room');

    if (!booking) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return booking;
  }

  /**
   * Get all bookings with filters
   */
  async getAllBookings(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    // Apply filters
    if (filters.guestId) query.guest = filters.guestId;
    if (filters.status) query.status = filters.status;
    if (filters.roomId) query.room = filters.roomId;

    if (filters.checkInDate || filters.checkOutDate) {
      query.$or = [];

      if (filters.checkInDate) {
        query.$or.push({
          checkInDate: { $gte: new Date(filters.checkInDate) },
        });
      }

      if (filters.checkOutDate) {
        query.$or.push({
          checkOutDate: { $lte: new Date(filters.checkOutDate) },
        });
      }
    }

    const bookings = await Booking.find(query)
      .populate('guest room')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get guest's bookings
   */
  async getGuestBookings(guestId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({ guest: guestId })
      .populate('guest room')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments({ guest: guestId });

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update booking
   */
  async updateBooking(bookingId, updateData) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    // Don't allow status/payment changes via regular update
    delete updateData.status;
    delete updateData.payment;

    Object.assign(booking, updateData);
    await booking.save();

    return booking.populate('guest room');
  }

  /**
   * Confirm booking
   */
  async confirmBooking(bookingId) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    booking.status = BOOKING_STATUS.CONFIRMED;
    await booking.save();

    return booking;
  }

  /**
   * Check in
   */
  async checkIn(bookingId) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    if (booking.status !== BOOKING_STATUS.CONFIRMED) {
      throw new APIError(
        HTTP_STATUS.BAD_REQUEST,
        'Booking must be confirmed before check-in'
      );
    }

    booking.status = BOOKING_STATUS.CHECKED_IN;
    await booking.save();

    return booking;
  }

  /**
   * Check out
   */
  async checkOut(bookingId) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    if (booking.status !== BOOKING_STATUS.CHECKED_IN) {
      throw new APIError(
        HTTP_STATUS.BAD_REQUEST,
        'Booking must be checked in before check-out'
      );
    }

    booking.status = BOOKING_STATUS.CHECKED_OUT;
    await booking.save();

    return booking;
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId, cancellationReason) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    if (
      booking.status === BOOKING_STATUS.CHECKED_OUT ||
      booking.status === BOOKING_STATUS.CANCELLED
    ) {
      throw new APIError(
        HTTP_STATUS.BAD_REQUEST,
        'Cannot cancel completed or already cancelled bookings'
      );
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    await booking.save();

    return booking;
  }

  /**
   * Record payment
   */
  async recordPayment(bookingId, paymentData) {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    booking.payment = {
      status: paymentData.status,
      method: paymentData.method,
      transactionId: paymentData.transactionId,
      paidAmount: paymentData.paidAmount,
      paidAt: new Date(),
    };

    await booking.save();

    return booking;
  }
}

export default new BookingService();
