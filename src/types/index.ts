// Tipos para autenticación
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  // Campos adicionales que requiere el backend para crear el perfil
  nombre: string;
  apellido: string;
  // Campos específicos según el rol
  numeroEstudiante?: string; // Para ALUMNO
  numeroEmpleado?: string;   // Para PROFESOR  
  especialidad?: string;     // Para PROFESOR
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;  // Para ALUMNO
}

export interface AuthResponse {
  token: string;
  username: string;
  role: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  roleName: string;
  message: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ALUMNO' | 'PROFESOR' | 'ADMIN';
  roleName: string;
  activo: boolean;
  fechaCreacion: string;
  fechaUltimoAcceso: string;
  perfil?: Alumno | Profesor;
}

// Tipos para entidades principales
export interface Alumno {
  id?: number;
  nombre: string;
  apellido: string;
  numeroEstudiante: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  activo?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface Profesor {
  id?: number;
  nombre: string;
  apellido: string;
  numeroEmpleado: string;
  email: string;
  telefono: string;
  especialidad: string;
  direccion: string;
  fechaContratacion?: string;
  activo?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface Curso {
  id?: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  creditos: number;
  capacidadMaxima: number;
  fechaInicio: string;
  fechaFin: string;
  horario: string;
  aula: string;
  profesorId: number;
  profesor?: Profesor;
  activo?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface Inscripcion {
  id?: number;
  alumnoId: number;
  cursoId: number;
  alumno?: Alumno;
  curso?: Curso;
  fechaInscripcion?: string;
  calificacion?: number;
  estado?: 'INSCRITO' | 'EN_CURSO' | 'APROBADO' | 'REPROBADO' | 'RETIRADO';
  observaciones?: string;
}

// Tipos para respuestas paginadas
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Tipos para filtros
export interface AlumnoFilter {
  activo?: boolean;
  busqueda?: string;
}

export interface ProfesorFilter {
  activo?: boolean;
  especialidad?: string;
  busqueda?: string;
}

export interface CursoFilter {
  activo?: boolean;
  profesorId?: number;
  busqueda?: string;
}

export interface InscripcionFilter {
  alumnoId?: number;
  cursoId?: number;
  estado?: string;
}

// Tipos para parámetros de paginación
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}