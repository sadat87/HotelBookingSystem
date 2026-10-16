import asyncHandler from 'express-async-handler';
import UserService from '../services/UserService.js';
import { apiResponse, paginateResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * UserController - Handles user management endpoints
 */
class UserController {
  /**
   * GET /api/users
   * Get all users (admin only)
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      role: req.query.role,
      isActive: req.query.isActive === 'true',
    };

    const result = await UserService.getAllUsers(page, limit, filters);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Users retrieved successfully',
      paginateResponse(result.users, page, limit, result.pagination.total)
    );
  });

  /**
   * GET /api/users/search
   * Search users by name or email
   */
  searchUsers = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!q) {
      return apiResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Search query is required'
      );
    }

    const result = await UserService.searchUsers(q, page, limit);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Users found',
      paginateResponse(result.users, page, limit, result.pagination.total)
    );
  });

  /**
   * GET /api/users/:id
   * Get user by ID
   */
  getUserById = asyncHandler(async (req, res) => {
    const user = await UserService.getUserById(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'User retrieved successfully',
      user
    );
  });

  /**
   * PUT /api/users/profile
   * Update own profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const user = await UserService.updateUserProfile(
      req.user.userId,
      req.validatedBody
    );

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Profile updated successfully',
      user
    );
  });

  /**
   * PUT /api/users/:id/role
   * Update user role (admin only)
   */
  updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!role) {
      return apiResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Role is required'
      );
    }

    const user = await UserService.updateUserRole(req.params.id, role);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'User role updated successfully',
      user
    );
  });

  /**
   * PUT /api/users/:id/deactivate
   * Deactivate user (admin only)
   */
  deactivateUser = asyncHandler(async (req, res) => {
    const user = await UserService.deactivateUser(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'User deactivated successfully',
      user
    );
  });

  /**
   * PUT /api/users/:id/activate
   * Activate user (admin only)
   */
  activateUser = asyncHandler(async (req, res) => {
    const user = await UserService.activateUser(req.params.id);

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'User activated successfully',
      user
    );
  });

  /**
   * GET /api/users/stats/dashboard
   * Get user dashboard statistics (admin only)
   */
  getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await UserService.getDashboardStats();

    apiResponse(
      res,
      HTTP_STATUS.OK,
      'Dashboard statistics retrieved',
      stats
    );
  });
}

export default new UserController();
