import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './constants.js';
import { getTokens, setTokens, clearTokens } from '@/lib/auth.js';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = getTokens();
        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
          refreshToken: tokens?.refreshToken,
        });

        const { accessToken, refreshToken } = response.data.data;
        setTokens(accessToken, refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
