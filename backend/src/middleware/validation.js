import Joi from 'joi';
import { apiResponse } from '../utils/helpers.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Middleware factory to validate request body against Joi schema
 * @param {object} schema - Joi validation schema
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return apiResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.VALIDATION_ERROR,
        { errors: details }
      );
    }

    req.validatedBody = value;
    next();
  };
};

/**
 * Joi validation schemas
 */
export const validationSchemas = {
  // User schemas
  registerUser: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    phone: Joi.string().regex(/^[0-9+\-\s()]{10,}$/).required(),
  }),

  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    phone: Joi.string().regex(/^[0-9+\-\s()]{10,}$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      postalCode: Joi.string(),
      country: Joi.string(),
    }),
  }).min(1),

  // Room schemas
  createRoom: Joi.object({
    roomNumber: Joi.string().required(),
    type: Joi.string().valid('single', 'double', 'suite', 'deluxe', 'penthouse').required(),
    floor: Joi.number().integer().min(0).required(),
    capacity: Joi.number().integer().min(1).max(10).required(),
    basePrice: Joi.number().positive().required(),
    description: Joi.string().max(1000),
    amenities: Joi.array().items(Joi.string()),
  }),

  updateRoom: Joi.object({
    roomNumber: Joi.string(),
    type: Joi.string().valid('single', 'double', 'suite', 'deluxe', 'penthouse'),
    floor: Joi.number().integer().min(0),
    capacity: Joi.number().integer().min(1).max(10),
    basePrice: Joi.number().positive(),
    description: Joi.string().max(1000),
    amenities: Joi.array().items(Joi.string()),
    isAvailable: Joi.boolean(),
  }).min(1),

  // Booking schemas
  createBooking: Joi.object({
    roomId: Joi.string().required(),
    checkInDate: Joi.date().iso().required(),
    checkOutDate: Joi.date().iso().min(Joi.ref('checkInDate')).required(),
    numberOfGuests: Joi.number().integer().min(1).required(),
    specialRequests: Joi.string().max(500),
  }),

  updateBooking: Joi.object({
    checkInDate: Joi.date().iso(),
    checkOutDate: Joi.date().iso(),
    numberOfGuests: Joi.number().integer().min(1),
    specialRequests: Joi.string().max(500),
    status: Joi.string().valid('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'),
  }).min(1),

  // Pricing schemas
  updatePricing: Joi.object({
    basePrice: Joi.number().positive(),
    seasonalPricing: Joi.array().items(
      Joi.object({
        season: Joi.string().valid('low', 'medium', 'high', 'peak'),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        priceMultiplier: Joi.number().min(0.5).max(2.0),
      })
    ),
    weekendMultiplier: Joi.number().min(1.0),
  }).min(1),
};
