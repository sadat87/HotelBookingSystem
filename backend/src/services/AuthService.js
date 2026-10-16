import User from '../models/User.js';
import {
  hashPassword,
  comparePasswords,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { APIError } from '../middleware/errorHandler.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * AuthService - Handles all authentication operations
 */
class AuthService {
  /**
   * Register a new user
   */
  async registerUser(userData) {
    const { email, password, firstName, lastName, phone } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.ALREADY_EXISTS
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Generate tokens
    const accessToken = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: { token: refreshToken } },
    });

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async loginUser(email, password) {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new APIError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Check password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new APIError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: { token: refreshToken } },
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new APIError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_TOKEN
      );
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      throw new APIError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_TOKEN
      );
    }

    // Generate new access token
    const accessToken = generateToken(user._id, user.role);

    return { accessToken };
  }

  /**
   * Logout user - remove refresh token
   */
  async logoutUser(userId, refreshToken) {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } },
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Logout from all devices
   */
  async logoutAllDevices(userId) {
    await User.findByIdAndUpdate(userId, {
      refreshTokens: [],
    });

    return { message: 'Logged out from all devices' };
  }

  /**
   * Change password
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    // Verify old password
    const isPasswordValid = await comparePasswords(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new APIError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }

    // Hash and update new password
    user.password = await hashPassword(newPassword);
    user.refreshTokens = []; // Invalidate all tokens
    await user.save();

    return { message: 'Password changed successfully' };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new APIError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND
      );
    }

    return user;
  }
}

export default new AuthService();
