import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { APIError } from '../middleware/errorHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';
import { doesDateRangeOverlap } from '../utils/helpers.js';

/**
 * RoomService - Handles room management operations
 */
class RoomService {
  /**
   * Create a new room
   */
  async createRoom(roomData) {
    // Check if room number already exists
    const existingRoom = await Room.findOne({
      roomNumber: roomData.roomNumber,
    });

    if (existingRoom) {
      throw new APIError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.ALREADY_EXISTS
      );
    }

    const room = await Room.create(roomData);
    return room;
  }

  /**
   * Get all rooms with pagination
   */
  async getAllRooms(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    // Apply filters
    if (filters.type) query.type = filters.type;
    if (filters.isAvailable !== undefined)
      query.isAvailable = filters.isAvailable;
    if (filters.floor) query.floor = filters.floor;

    const rooms = await Room.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ roomNumber: 1 });

    const total = await Room.countDocuments(query);

    return {
      rooms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get room by ID
   */
  async getRoomById(roomId) {
    const room = await Room.findById(roomId);

    if (!room) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return room;
  }

  /**
   * Update room
   */
  async updateRoom(roomId, updateData) {
    const room = await Room.findByIdAndUpdate(roomId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return room;
  }

  /**
   * Delete room
   */
  async deleteRoom(roomId) {
    const room = await Room.findByIdAndDelete(roomId);

    if (!room) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return room;
  }

  /**
   * Get available rooms for date range
   */
  async getAvailableRooms(checkIn, checkOut, capacity) {
    // Find booked rooms for the date range
    const bookedRooms = await Booking.find({
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    }).select('room');

    const bookedRoomIds = bookedRooms.map((b) => b.room.toString());

    // Find available rooms
    const availableRooms = await Room.find({
      _id: { $nin: bookedRoomIds },
      isAvailable: true,
      capacity: { $gte: capacity },
    }).sort({ basePrice: 1 });

    return availableRooms;
  }

  /**
   * Check if room is available for dates
   */
  async isRoomAvailable(roomId, checkIn, checkOut) {
    const room = await Room.findById(roomId);

    if (!room || !room.isAvailable) {
      return false;
    }

    // Check for overlapping bookings
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    return !conflictingBooking;
  }

  /**
   * Get room availability calendar for a month
   */
  async getRoomAvailabilityCalendar(roomId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const bookings = await Booking.find({
      room: roomId,
      $or: [
        {
          checkInDate: { $lt: endDate },
          checkOutDate: { $gt: startDate },
        },
      ],
    });

    const calendar = {};

    // Generate calendar for all days
    for (let day = 1; day <= endDate.getDate(); day++) {
      calendar[day] = { available: true };
    }

    // Mark booked days
    bookings.forEach((booking) => {
      let current = new Date(booking.checkInDate);
      while (current < booking.checkOutDate) {
        if (
          current.getFullYear() === year &&
          current.getMonth() === month - 1
        ) {
          const day = current.getDate();
          calendar[day].available = false;
        }
        current.setDate(current.getDate() + 1);
      }
    });

    return calendar;
  }
}

export default new RoomService();
