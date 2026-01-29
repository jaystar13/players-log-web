import axios, { AxiosError } from 'axios';
import { tokenStore } from '../auth/tokenStore';
import { refreshToken } from './auth'; // Import refreshToken directly

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Variable to prevent multiple token refresh requests
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not a retry request
    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        // If we are already refreshing, push the request to the queue
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          (originalRequest as any).headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest as any);
        });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const { accessToken: newAccessToken } = await refreshToken(); // Use imported function
        tokenStore.set(newAccessToken);
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        (originalRequest as any).headers['Authorization'] = 'Bearer ' + newAccessToken;
        
        processQueue(null, newAccessToken);
        return apiClient(originalRequest as any);

      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        tokenStore.clear();
        // Redirect to login page
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;