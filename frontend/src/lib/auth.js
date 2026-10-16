import Cookies from 'js-cookie';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Get tokens from cookies
 */
export const getTokens = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    accessToken: Cookies.get(TOKEN_KEY),
    refreshToken: Cookies.get(REFRESH_TOKEN_KEY),
  };
};

/**
 * Set tokens in cookies
 */
export const setTokens = (accessToken, refreshToken) => {
  Cookies.set(TOKEN_KEY, accessToken, { expires: 7 });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30 });
};

/**
 * Clear tokens from cookies
 */
export const clearTokens = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_KEY);
};

/**
 * Get stored user from cookies
 */
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Set stored user in cookies
 */
export const setStoredUser = (user) => {
  Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const tokens = getTokens();
  return !!tokens?.accessToken;
};

/**
 * Get user role from stored user
 */
export const getUserRole = () => {
  const user = getStoredUser();
  return user?.role || null;
};

/**
 * Check if user has specific role
 */
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};
