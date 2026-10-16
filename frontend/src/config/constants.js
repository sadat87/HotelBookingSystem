// Frontend environment configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  CHANGE_PASSWORD: '/auth/change-password',
  GET_PROFILE: '/auth/me',

  // Rooms
  GET_ROOMS: '/rooms',
  GET_ROOM: (id) => `/rooms/${id}`,
  CREATE_ROOM: '/rooms',
  UPDATE_ROOM: (id) => `/rooms/${id}`,
  DELETE_ROOM: (id) => `/rooms/${id}`,
  GET_AVAILABLE_ROOMS: '/rooms/available',
  GET_ROOM_CALENDAR: (id) => `/rooms/${id}/calendar`,

  // Bookings
  GET_BOOKINGS: '/bookings',
  GET_BOOKING: (id) => `/bookings/${id}`,
  CREATE_BOOKING: '/bookings',
  UPDATE_BOOKING: (id) => `/bookings/${id}`,
  GET_MY_BOOKINGS: '/bookings/my-bookings',
  CONFIRM_BOOKING: (id) => `/bookings/${id}/confirm`,
  CHECK_IN: (id) => `/bookings/${id}/check-in`,
  CHECK_OUT: (id) => `/bookings/${id}/check-out`,
  CANCEL_BOOKING: (id) => `/bookings/${id}/cancel`,
  RECORD_PAYMENT: (id) => `/bookings/${id}/payment`,

  // Users
  GET_USERS: '/users',
  GET_USER: (id) => `/users/${id}`,
  UPDATE_PROFILE: '/users/profile',
  SEARCH_USERS: '/users/search',
  UPDATE_USER_ROLE: (id) => `/users/${id}/role`,
  DEACTIVATE_USER: (id) => `/users/${id}/deactivate`,
  ACTIVATE_USER: (id) => `/users/${id}/activate`,
  GET_DASHBOARD_STATS: '/users/stats/dashboard',
};

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

export const ROOM_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  SUITE: 'suite',
  DELUXE: 'deluxe',
  PENTHOUSE: 'penthouse',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};
