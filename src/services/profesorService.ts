import type { Profesor, ProfesorFilter, PaginatedResponse, PaginationParams } from '../types';
import { apiService } from './apiService';

class ProfesorService {
  private endpoint = 'profesores';

  async getAllProfesores(): Promise<Profesor[]> {
    return apiService.getAll<Profesor>(this.endpoint);
  }

  async getProfesoresPaginated(
    params: PaginationParams & ProfesorFilter = {}
  ): Promise<PaginatedResponse<Profesor>> {
    return apiService.getPaginated<Profesor>(this.endpoint, params);
  }

  async getProfesorById(id: number): Promise<Profesor> {
    return apiService.getById<Profesor>(this.endpoint, id);
  }

  async getProfesorByNumero(numeroEmpleado: string): Promise<Profesor> {
    return apiService.request<Profesor>(`/${this.endpoint}/numero/${numeroEmpleado}`, {
      method: 'GET',
    });
  }

  async createProfesor(profesor: Omit<Profesor, 'id'>): Promise<Profesor> {
    return apiService.create<Profesor>(this.endpoint, profesor);
  }

  async updateProfesor(id: number, profesor: Partial<Profesor>): Promise<Profesor> {
    return apiService.update<Profesor>(this.endpoint, id, profesor);
  }

  async deleteProfesor(id: number): Promise<void> {
    return apiService.delete(this.endpoint, id);
  }

  async getProfesoresActivos(): Promise<Profesor[]> {
    return apiService.getActive<Profesor>(this.endpoint);
  }

  async getProfesoresByEspecialidad(especialidad: string): Promise<Profesor[]> {
    return apiService.request<Profesor[]>(`/${this.endpoint}/especialidad/${especialidad}`, {
      method: 'GET',
    });
  }

  async getProfesoresSinCursos(): Promise<Profesor[]> {
    return apiService.request<Profesor[]>(`/${this.endpoint}/sin-cursos`, {
      method: 'GET',
    });
  }

  async getEstadisticas(): Promise<{ total: number }> {
    return apiService.getStatistics(this.endpoint);
  }
}

export const profesorService = new ProfesorService();