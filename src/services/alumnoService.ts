import type { Alumno, AlumnoFilter, PaginatedResponse, PaginationParams } from '../types';
import { apiService } from './apiService';

class AlumnoService {
  private endpoint = 'alumnos';

  async getAllAlumnos(): Promise<Alumno[]> {
    return apiService.getAll<Alumno>(this.endpoint);
  }

  async getAlumnosPaginated(
    params: PaginationParams & AlumnoFilter = {}
  ): Promise<PaginatedResponse<Alumno>> {
    return apiService.getPaginated<Alumno>(this.endpoint, params);
  }

  async getAlumnoById(id: number): Promise<Alumno> {
    return apiService.getById<Alumno>(this.endpoint, id);
  }

  async getAlumnoByNumero(numeroEstudiante: string): Promise<Alumno> {
    return apiService.request<Alumno>(`/${this.endpoint}/numero/${numeroEstudiante}`, {
      method: 'GET',
    });
  }

  async createAlumno(alumno: Omit<Alumno, 'id'>): Promise<Alumno> {
    return apiService.create<Alumno>(this.endpoint, alumno);
  }

  async updateAlumno(id: number, alumno: Partial<Alumno>): Promise<Alumno> {
    return apiService.update<Alumno>(this.endpoint, id, alumno);
  }

  async deleteAlumno(id: number): Promise<void> {
    return apiService.delete(this.endpoint, id);
  }

  async getAlumnosActivos(): Promise<Alumno[]> {
    return apiService.getActive<Alumno>(this.endpoint);
  }

  async buscarAlumnos(busqueda: string): Promise<Alumno[]> {
    return apiService.search<Alumno>(this.endpoint, busqueda);
  }

  async getEstadisticas(): Promise<{ total: number }> {
    return apiService.getStatistics(this.endpoint);
  }
}

export const alumnoService = new AlumnoService();