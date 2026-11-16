import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/api';
import { getAuthToken, setAuthToken, deleteAuthToken } from '../api/authStorage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  profileImage?: string;
  weight?: number;
  height?: number;
  bodyFat?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage functions imported from ../api/authStorage

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await getAuthToken();
      if (token) {
        // Fetch user from real backend
        const response = await apiClient.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      console.log('Session expired or invalid', error);
      await deleteAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, userData: User) => {
    await setAuthToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await deleteAuthToken();
    setUser(null);
  };

  const refreshUser = async () => {
    setIsLoading(true);
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
