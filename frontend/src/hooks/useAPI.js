import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/index.js';
import apiClient from '@/config/api.js';
import { API_ENDPOINTS } from '@/config/constants.js';
import { setTokens, setStoredUser } from '@/lib/auth.js';

/**
 * Hook for authentication operations
 */
export const useAuth = () => {
  const { user, setUser, setLoading, setError, clearError, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState(null);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    clearError();
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
      const { user, accessToken, refreshToken } = response.data.data;

      setTokens(accessToken, refreshToken);
      setUser(user);
      setStoredUser(user);

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setErrorState(message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setError, clearError]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    clearError();
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      setTokens(accessToken, refreshToken);
      setUser(user);
      setStoredUser(user);

      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setErrorState(message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setError, clearError]);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    setIsLoading(true);
    clearError();
    try {
      const response = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Password change failed';
      setErrorState(message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, clearError]);

  return {
    user,
    isLoading,
    error,
    register,
    login,
    logout,
    changePassword,
    clearError,
  };
};

/**
 * Hook for room operations
 */
export const useRooms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllRooms = useCallback(async (page = 1, limit = 10, filters = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await apiClient.get(`${API_ENDPOINTS.GET_ROOMS}?${params}`);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch rooms';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAvailableRooms = useCallback(async (checkIn, checkOut, capacity) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        capacity,
      });
      const response = await apiClient.get(`${API_ENDPOINTS.GET_AVAILABLE_ROOMS}?${params}`);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch available rooms';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRoomById = useCallback(async (roomId) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_ROOM(roomId));
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch room';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getAllRooms,
    getAvailableRooms,
    getRoomById,
  };
};

/**
 * Hook for booking operations
 */
export const useBookings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = useCallback(async (bookingData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.CREATE_BOOKING, bookingData);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create booking';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMyBookings = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      const response = await apiClient.get(`${API_ENDPOINTS.GET_MY_BOOKINGS}?${params}`);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch bookings';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBookingById = useCallback(async (bookingId) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_BOOKING(bookingId));
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch booking';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId, reason) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.CANCEL_BOOKING(bookingId), {
        reason,
      });
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to cancel booking';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
  };
};
