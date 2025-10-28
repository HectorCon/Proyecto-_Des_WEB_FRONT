import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

// Prefer build-time Vite env var (VITE_API_BASE_URL). If missing, allow runtime injection
// via `window.__API_BASE_URL` or fall back to an inferred host.
const _envBase = (import.meta.env && (import.meta.env as any).VITE_API_BASE_URL) as string | undefined;

declare global {
  interface Window {
    __API_BASE_URL?: string;
  }
}

const _runtimeBase = typeof window !== 'undefined' ? window.__API_BASE_URL : undefined;
const _inferredBase = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}${window.location.protocol === 'http:' ? ':8080' : ''}/api/v1`
  : 'http://127.0.0.1:8080/api/v1';

const API_BASE_URL = _envBase || _runtimeBase || _inferredBase;

class AuthService {
  private tokenKey = 'authToken';

  // Realizar login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = 'Error en el inicio de sesión';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Si no es JSON, intentar leer como texto
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Si tampoco puede leer el texto, usar mensaje por defecto
          }
        }

        // Personalizar mensaje según el status code
        switch (response.status) {
          case 401:
            errorMessage = 'Credenciales incorrectas. Verifica tu usuario y contraseña';
            break;
          case 404:
            errorMessage = 'Usuario no encontrado';
            break;
          case 403:
            errorMessage = 'Acceso denegado. Tu cuenta puede estar desactivada';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Intenta más tarde';
            break;
        }

        throw new Error(errorMessage);
      }

      const data: AuthResponse = await response.json();
      localStorage.setItem(this.tokenKey, data.token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Verifica tu conexión a internet');
    }
  }

  // Registrar usuario
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error en el registro');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem(this.tokenKey, data.token);
    return data;
  }

  // Obtener información del usuario actual
  async getCurrentUser(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      throw new Error('Error al obtener información del usuario');
    }

    return response.json();
  }

  // Validar token
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Verificar rol
  async hasRole(role: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-role/${role}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.hasRole;
    } catch {
      return false;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    const token = this.getToken();
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        // Error silencioso durante logout
      }
    }
    
    localStorage.removeItem(this.tokenKey);
  }

  // Obtener token del localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Obtener headers con autorización
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
    
    return headers;
  }

  // Verificar si el token está expirado (decodificando el JWT)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

export const authService = new AuthService();