import apiClient from './api';

export const testBackendConnection = async () => {
  try {
    // The backend server.ts defines a basic health check route: app.get('/api/health')
    const response = await apiClient.get('/health');
    return {
      success: true,
      data: response.data,
      message: 'Successfully connected to the backend!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to connect to the backend.',
      error,
    };
  }
};
