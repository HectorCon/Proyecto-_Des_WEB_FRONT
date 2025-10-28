import type { PaginatedResponse, PaginationParams } from '../types';
import { authService } from './authService';

const API_BASE_URL = 'http://3.95.198.93:8080/api/v1';

class ApiService {
  private inactivityTimer: number | null = null;
  private readonly INACTIVITY_TIMEOUT = 60000; // 1 minuto en milisegundos
  private activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  constructor() {
    this.initInactivityDetection();
  }

  // Inicializar detección de inactividad
  private initInactivityDetection(): void {
    // Solo inicializar si hay un token válido
    if (authService.isAuthenticated()) {
      this.startInactivityTimer();
      this.bindActivityListeners();
    }
  }

  // Iniciar timer de inactividad
  private startInactivityTimer(): void {
    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      this.handleInactivityTimeout();
    }, this.INACTIVITY_TIMEOUT);
  }

  // Limpiar timer existente
  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // Manejar timeout por inactividad
  private handleInactivityTimeout(): void {
    this.clearInactivityTimer();
    this.unbindActivityListeners();
    authService.logout();
    
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Manejar actividad del usuario
  private handleUserActivity = (): void => {
    // Solo reiniciar si el usuario está autenticado
    if (authService.isAuthenticated()) {
      this.startInactivityTimer();
    }
  };

  // Vincular listeners de actividad
  private bindActivityListeners(): void {
    this.activityEvents.forEach(event => {
      document.addEventListener(event, this.handleUserActivity, true);
    });
  }

  // Desvincular listeners de actividad
  private unbindActivityListeners(): void {
    this.activityEvents.forEach(event => {
      document.removeEventListener(event, this.handleUserActivity, true);
    });
  }

  // Método público para inicializar cuando el usuario hace login
  public startInactivityDetection(): void {
    this.startInactivityTimer();
    this.bindActivityListeners();
  }

  // Método público para detener cuando el usuario hace logout
  public stopInactivityDetection(): void {
    this.clearInactivityTimer();
    this.unbindActivityListeners();
  }

  // Función para redirigir al login
  private redirectToLogin(): void {
    this.stopInactivityDetection(); // Detener detección al hacer logout
    authService.logout();
    
    // Usar React Router si está disponible, sino usar window.location
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Verificar si el token está expirado antes de hacer la petición
    if (authService.isTokenExpired()) {
      this.redirectToLogin();
      return Promise.reject(new Error('Token expired'));
    }

    const headers = {
      ...authService.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 401) {
        this.redirectToLogin();
        return Promise.reject(new Error('Unauthorized - Token expired'));
      }
      
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    // Si es una respuesta 204 No Content, retornar null
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  // Métodos genéricos CRUD
  async getAll<T>(endpoint: string): Promise<T[]> {
    return this.request<T[]>(`/${endpoint}`);
  }

  async getPaginated<T>(
    endpoint: string,
    params: PaginationParams & Record<string, any> = {}
  ): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `/${endpoint}/paginated${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<T>>(url);
  }

  async getById<T>(endpoint: string, id: number): Promise<T> {
    return this.request<T>(`/${endpoint}/${id}`);
  }

  async create<T>(endpoint: string, data: Partial<T>): Promise<T> {
    return this.request<T>(`/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update<T>(endpoint: string, id: number, data: Partial<T>): Promise<T> {
    return this.request<T>(`/${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string, id: number): Promise<void> {
    return this.request<void>(`/${endpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos específicos
  async getActive<T>(endpoint: string): Promise<T[]> {
    return this.request<T[]>(`/${endpoint}/activos`);
  }

  async search<T>(endpoint: string, searchTerm: string): Promise<T[]> {
    return this.request<T[]>(`/${endpoint}/buscar?busqueda=${encodeURIComponent(searchTerm)}`);
  }

  async getStatistics(endpoint: string): Promise<{ total: number }> {
    return this.request<{ total: number }>(`/${endpoint}/estadisticas`);
  }
}

export const apiService = new ApiService();