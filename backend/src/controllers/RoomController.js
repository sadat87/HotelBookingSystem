import asyncHandler from 'express-async-handler';
import RoomService from '../services/RoomService.js';
import { apiResponse, paginateResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * RoomController - Handles room management endpoints
 */
class RoomController {
  /**
   * POST /api/rooms
   * Create a new room
   */
  createRoom = asyncHandler(async (req, res) => {
    const room = await RoomService.createRoom(req.validatedBody);

    apiResponse(
      res,
      HTTP_STATUS.CREATED,
      'Room created successfully',
      room
    );
  });

  /**
   * GET /api/rooms
   * Get all rooms with pagination
   */
  getAllRooms = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      type: req.query.type,
      isAvailable: req.query.isAvailable === 'true',
      floor: req.query.floor ? parseInt(req.query.floor) : undefined,
    };

    const result = await RoomService.getAllRooms(page, limit, filters);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Rooms retrieved successfully',
      paginateResponse(result.rooms, page, limit, result.pagination.total)
    );
  });

  /**
   * GET /api/rooms/available
   * Get available rooms for date range
   */
  getAvailableRooms = asyncHandler(async (req, res) => {
    const { checkIn, checkOut, capacity } = req.query;

    if (!checkIn || !checkOut || !capacity) {
      return apiResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'checkIn, checkOut, and capacity are required'
      );
    }

    const rooms = await RoomService.getAvailableRooms(
      checkIn,
      checkOut,
      parseInt(capacity)
    );

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Available rooms retrieved',
      { rooms }
    );
  });

  /**
   * GET /api/rooms/:id
   * Get room by ID
   */
  getRoomById = asyncHandler(async (req, res) => {
    const room = await RoomService.getRoomById(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Room retrieved successfully',
      room
    );
  });

  /**
   * GET /api/rooms/:id/calendar
   * Get room availability calendar
   */
  getRoomCalendar = asyncHandler(async (req, res) => {
    const { year, month } = req.query;

    if (!year || !month) {
      return apiResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Year and month are required'
      );
    }

    const calendar = await RoomService.getRoomAvailabilityCalendar(
      req.params.id,
      parseInt(year),
      parseInt(month)
    );

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Calendar retrieved successfully',
      calendar
    );
  });

  /**
   * PUT /api/rooms/:id
   * Update room
   */
  updateRoom = asyncHandler(async (req, res) => {
    const room = await RoomService.updateRoom(req.params.id, req.validatedBody);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Room updated successfully',
      room
    );
  });

  /**
   * DELETE /api/rooms/:id
   * Delete room
   */
  deleteRoom = asyncHandler(async (req, res) => {
    await RoomService.deleteRoom(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Room deleted successfully'
    );
  });
}

export default new RoomController();
