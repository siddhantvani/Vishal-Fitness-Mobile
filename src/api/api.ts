import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from './config';
import { ApiError } from './types';

// Create Axios instance with centralized config
const apiClient: AxiosInstance = axios.create(API_CONFIG);

import { getAuthToken } from './authStorage';

// Request interceptor: attach Authorization token and log requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Safely fetch token from secure storage (cross-platform)
      const token = await getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API] Error retrieving auth token:', error);
    }
    
    // Development logging (safe, no secrets)
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors and log responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Structured error handling
    const apiError: ApiError = {
      message: 'An unexpected error occurred.',
      isNetworkError: false,
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      apiError.status = error.response.status;
      apiError.data = error.response.data;
      
      const responseData = error.response.data as any;
      const serverMessage = responseData?.message;
      
      if (serverMessage) {
        if (serverMessage === 'Validation error' && Array.isArray(responseData.errors)) {
          // Format Zod errors nicely
          const detailedErrors = responseData.errors
            .map((e: any) => {
              const field = e.path ? e.path.join('.') : 'Field';
              return `${field}: ${e.message}`;
            })
            .join('\n');
          apiError.message = `${serverMessage}\n${detailedErrors}`;
        } else {
          apiError.message = serverMessage;
        }
      } else {
        switch (error.response.status) {
          case 400: apiError.message = 'Bad Request.'; break;
          case 401: apiError.message = 'Unauthorized. Please login again.'; break;
          case 403: apiError.message = 'Forbidden. You do not have permission.'; break;
          case 404: apiError.message = 'Resource not found.'; break;
          case 409: apiError.message = 'Conflict with existing data.'; break;
          case 422: apiError.message = 'Validation failed.'; break;
          case 500: apiError.message = 'Internal Server Error.'; break;
          default: apiError.message = `Request failed with status ${error.response.status}`;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      apiError.message = 'Network error. Please check your internet connection.';
      apiError.isNetworkError = true;
    } else {
      // Something happened in setting up the request that triggered an Error
      apiError.message = error.message;
    }

    if (__DEV__) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Message: ${apiError.message}`);
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
