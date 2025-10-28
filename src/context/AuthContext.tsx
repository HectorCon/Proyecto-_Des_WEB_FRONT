import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  hasRole: (role: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Cargar usuario al inicializar y verificar expiración del token
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        // Verificar si el token está expirado
        if (authService.isTokenExpired()) {
          await authService.logout();
          setUser(null);
          setIsLoading(false);
          return;
        }

        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          // Iniciar detección de inactividad cuando el usuario está autenticado
          apiService.startInactivityDetection();
        } catch (error) {
          await authService.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();

    // Verificar cada 30 segundos si el token ha expirado
    const tokenCheckInterval = setInterval(() => {
      if (authService.isAuthenticated() && authService.isTokenExpired()) {
        authService.logout();
        setUser(null);
        window.location.href = '/login';
      }
    }, 30000); // 30 segundos

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      // Iniciar detección de inactividad después del login exitoso
      apiService.startInactivityDetection();
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      // Iniciar detección de inactividad después del registro exitoso
      apiService.startInactivityDetection();
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Detener detección de inactividad antes del logout
      apiService.stopInactivityDetection();
      await authService.logout();
      setUser(null);
    } catch (error) {
      // Error silencioso durante logout
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = async (role: string): Promise<boolean> => {
    return authService.hasRole(role);
  };

  const refreshUser = async (): Promise<void> => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        await logout();
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};