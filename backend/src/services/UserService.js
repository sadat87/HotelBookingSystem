import User from '../models/User.js';
import { APIError } from '../middleware/errorHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES, ROLES } from '../constants/index.js';
import { hashPassword } from '../utils/jwt.js';

/**
 * UserService - Handles user management operations
 */
class UserService {
  /**
   * Get all users with pagination
   */
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    // Apply filters
    if (filters.role) query.role = filters.role;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const users = await User.find(query)
      .select('-password -refreshTokens')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -refreshTokens');

    if (!user) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password -refreshTokens');

    if (!user) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return user;
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(userId, newRole) {
    // Validate role
    if (!Object.values(ROLES).includes(newRole)) {
      throw new APIError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid role'
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return user;
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false, refreshTokens: [] },
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return user;
  }

  /**
   * Activate user
   */
  async activateUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password -refreshTokens');

    if (!user) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return user;
  }

  /**
   * Search users by name or email
   */
  async searchUsers(searchTerm, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ],
    };

    const users = await User.find(query)
      .select('-password -refreshTokens')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
    const managerCount = await User.countDocuments({ role: ROLES.MANAGER });
    const staffCount = await User.countDocuments({ role: ROLES.STAFF });
    const customerCount = await User.countDocuments({ role: ROLES.CUSTOMER });
    const activeUsers = await User.countDocuments({ isActive: true });

    return {
      totalUsers,
      activeUsers,
      roleDistribution: {
        admin: adminCount,
        manager: managerCount,
        staff: staffCount,
        customer: customerCount,
      },
    };
  }
}

export default new UserService();
