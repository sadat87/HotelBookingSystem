import asyncHandler from 'express-async-handler';
import AuthService from '../services/AuthService.js';
import { apiResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * AuthController - Handles authentication endpoints
 */
class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  register = asyncHandler(async (req, res) => {
    const result = await AuthService.registerUser(req.validatedBody);

    apiResponse(
      res,
      HTTP_STATUS.CREATED,
      'User registered successfully',
      result
    );
  });

  /**
   * POST /api/auth/login
   * Login user and return tokens
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.validatedBody;
    const result = await AuthService.loginUser(email, password);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Login successful',
      result
    );
  });

  /**
   * POST /api/auth/refresh
   * Refresh access token using refresh token
   */
  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return apiResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Refresh token is required'
      );
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Token refreshed successfully',
      result
    );
  });

  /**
   * POST /api/auth/logout
   * Logout user
   */
  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const userId = req.user.userId;

    await AuthService.logoutUser(userId, refreshToken);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Logout successful'
    );
  });

  /**
   * POST /api/auth/logout-all
   * Logout from all devices
   */
  logoutAll = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    await AuthService.logoutAllDevices(userId);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Logged out from all devices'
    );
  });

  /**
   * POST /api/auth/change-password
   * Change user password
   */
  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!oldPassword || !newPassword) {
      return apiResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Old and new passwords are required'
      );
    }

    const result = await AuthService.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    apiResponse(
      res,
      HTTP_STATUS.OK,
      result.message
    );
  });

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = await AuthService.getUserById(req.user.userId);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'User profile retrieved',
      user
    );
  });
}

export default new AuthController();
