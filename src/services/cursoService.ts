import type { Curso, CursoFilter, PaginatedResponse, PaginationParams } from '../types';
import { apiService } from './apiService';

class CursoService {
  private endpoint = 'cursos';

  async getAllCursos(): Promise<Curso[]> {
    return apiService.getAll<Curso>(this.endpoint);
  }

  async getCursosPaginated(
    params: PaginationParams & CursoFilter = {}
  ): Promise<PaginatedResponse<Curso>> {
    return apiService.getPaginated<Curso>(this.endpoint, params);
  }

  async getCursoById(id: number): Promise<Curso> {
    return apiService.getById<Curso>(this.endpoint, id);
  }

  async getCursoByCodigo(codigo: string): Promise<Curso> {
    return apiService.request<Curso>(`/${this.endpoint}/codigo/${codigo}`, {
      method: 'GET',
    });
  }

  async createCurso(curso: Omit<Curso, 'id'>): Promise<Curso> {
    return apiService.create<Curso>(this.endpoint, curso);
  }

  async updateCurso(id: number, curso: Partial<Curso>): Promise<Curso> {
    return apiService.update<Curso>(this.endpoint, id, curso);
  }

  async deleteCurso(id: number): Promise<void> {
    return apiService.delete(this.endpoint, id);
  }

  async getCursosActivos(): Promise<Curso[]> {
    return apiService.getActive<Curso>(this.endpoint);
  }

  async getCursosByProfesor(profesorId: number): Promise<Curso[]> {
    return apiService.request<Curso[]>(`/${this.endpoint}/profesor/${profesorId}`, {
      method: 'GET',
    });
  }

  async getCursosConCupos(): Promise<Curso[]> {
    return apiService.request<Curso[]>(`/${this.endpoint}/cupos-disponibles`, {
      method: 'GET',
    });
  }

  async getCursosByCreditos(creditos: number): Promise<Curso[]> {
    return apiService.request<Curso[]>(`/${this.endpoint}/creditos/${creditos}`, {
      method: 'GET',
    });
  }

  async getEstadisticas(): Promise<{ total: number }> {
    try {
      // Usar el método directo en lugar del genérico
      return apiService.request<{ total: number }>(`/${this.endpoint}/estadisticas`, {
        method: 'GET',
      });
    } catch (error) {
      // Si falla, intentemos contar los cursos activos como alternativa
      try {
        const cursosActivos = await this.getCursosActivos();
        return { total: cursosActivos.length };
      } catch (fallbackError) {
        return { total: 0 };
      }
    }
  }

  async buscarCursos(busqueda: string): Promise<Curso[]> {
    return apiService.search<Curso>(this.endpoint, busqueda);
  }
}

export const cursoService = new CursoService();