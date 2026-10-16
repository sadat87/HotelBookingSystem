import { apiResponse } from '../utils/helpers.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Global error handling middleware
 * Should be used as the last middleware in the app
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return apiResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGES.VALIDATION_ERROR,
      { errors: details }
    );
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return apiResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      `${field} already exists`,
      null
    );
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return apiResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Invalid ID format',
      null
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return apiResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.INVALID_TOKEN,
      null
    );
  }

  if (err.name === 'TokenExpiredError') {
    return apiResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      'Token expired',
      null
    );
  }

  // Custom API error
  if (err.statusCode) {
    return apiResponse(
      res,
      err.statusCode,
      err.message,
      err.data || null
    );
  }

  // Default error
  return apiResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.INTERNAL_ERROR,
    null
  );
};

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found middleware
 */
export const notFoundHandler = (req, res) => {
  apiResponse(
    res,
    HTTP_STATUS.NOT_FOUND,
    `Route ${req.originalUrl} not found`,
    null
  );
};
