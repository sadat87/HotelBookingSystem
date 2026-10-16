import { verifyToken } from '../utils/jwt.js';
import { apiResponse } from '../utils/helpers.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Middleware to verify JWT token and attach user to request
 * Checks if token exists in Authorization header and validates it
 */
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return apiResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return apiResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_TOKEN
      );
    }

    req.user = decoded;
    next();
  } catch (error) {
    return apiResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_MESSAGES.UNAUTHORIZED
    );
  }
};

/**
 * Middleware to check if user has specific role(s)
 * @param {string|array} allowedRoles - Role(s) that are allowed
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return apiResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.UNAUTHORIZED
      );
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.role)) {
      return apiResponse(
        res,
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGES.FORBIDDEN
      );
    }

    next();
  };
};
