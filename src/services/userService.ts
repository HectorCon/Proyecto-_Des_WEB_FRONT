import { apiService } from './apiService';
import type { User, PaginatedResponse, PaginationParams } from '../types';

interface UserUpdateDTO {
  username?: string;
  email?: string;
  role?: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  activo?: boolean;
  password?: string;
}

interface UserStatsResponse {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  totalAlumnos: number;
  totalProfesores: number;
  totalAdmins: number;
}

class UserService {
  // Obtener todos los usuarios (sin paginación)
  async getAllUsers(): Promise<User[]> {
    return apiService.request<User[]>('/usuarios');
  }

  // Obtener usuarios con paginación
  async getUsers(params: PaginationParams = {}): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const url = `/usuarios/paginated${queryString ? `?${queryString}` : ''}`;
    
    return apiService.request<PaginatedResponse<User>>(url);
  }

  // Obtener usuario por ID
  async getUserById(id: number): Promise<User> {
    return apiService.request<User>(`/usuarios/${id}`);
  }

  // Obtener mi perfil
  async getMyProfile(): Promise<User> {
    return apiService.request<User>('/usuarios/me');
  }

  // Obtener usuario por username
  async getUserByUsername(username: string): Promise<User> {
    return apiService.request<User>(`/usuarios/username/${username}`);
  }

  // Obtener usuarios por rol
  async getUsersByRole(role: 'ALUMNO' | 'PROFESOR' | 'ADMIN'): Promise<User[]> {
    return apiService.request<User[]>(`/usuarios/role/${role}`);
  }

  // Obtener usuarios activos
  async getActiveUsers(): Promise<User[]> {
    return apiService.request<User[]>('/usuarios/activos');
  }

  // Buscar usuarios
  async searchUsers(searchTerm: string): Promise<User[]> {
    return apiService.request<User[]>(`/usuarios/search?q=${encodeURIComponent(searchTerm)}`);
  }

  // Estadísticas de usuarios
  async getUserStatistics(): Promise<UserStatsResponse> {
    try {
      return await apiService.request<UserStatsResponse>('/usuarios/stats');
    } catch (error) {
      // Fallback si no existe el endpoint o hay errores del servidor
      try {
        // Intentar obtener usuarios para calcular estadísticas localmente
        const users = await this.getAllUsers();
        return {
          totalUsuarios: users.length,
          usuariosActivos: users.filter(u => u.activo).length,
          usuariosInactivos: users.filter(u => !u.activo).length,
          totalAlumnos: users.filter(u => u.role === 'ALUMNO').length,
          totalProfesores: users.filter(u => u.role === 'PROFESOR').length,
          totalAdmins: users.filter(u => u.role === 'ADMIN').length,
        };
      } catch (fallbackError) {
        // Si también falla el fallback, retornar estadísticas vacías
        return {
          totalUsuarios: 0,
          usuariosActivos: 0,
          usuariosInactivos: 0,
          totalAlumnos: 0,
          totalProfesores: 0,
          totalAdmins: 0,
        };
      }
    }
  }

  // Actualizar usuario (ADMIN)
  async updateUser(userId: number, userData: UserUpdateDTO): Promise<User> {
    return apiService.request<User>(`/usuarios/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Actualizar solo el rol del usuario
  async updateUserRole(userId: number, newRole: 'ALUMNO' | 'PROFESOR' | 'ADMIN'): Promise<User> {
    return this.updateUser(userId, { role: newRole });
  }

  // Actualizar mi perfil
  async updateMyProfile(userData: { email?: string; password?: string }): Promise<User> {
    return apiService.request<User>('/usuarios/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Activar usuario
  async activateUser(userId: number): Promise<void> {
    return apiService.request<void>(`/usuarios/${userId}/activar`, {
      method: 'PUT',
    });
  }

  // Desactivar usuario
  async deactivateUser(userId: number): Promise<void> {
    return apiService.request<void>(`/usuarios/${userId}/desactivar`, {
      method: 'PUT',
    });
  }

  // Activar/desactivar usuario (toggle)
  async toggleUserStatus(userId: number): Promise<User> {
    // Primero obtenemos el usuario para saber su estado actual
    const user = await this.getUserById(userId);
    
    if (user.activo) {
      await this.deactivateUser(userId);
    } else {
      await this.activateUser(userId);
    }
    
    // Retornamos el usuario actualizado
    return this.getUserById(userId);
  }

  // Eliminar usuario
  async deleteUser(id: number): Promise<void> {
    return apiService.request<void>(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  }
}

export const userService = new UserService();