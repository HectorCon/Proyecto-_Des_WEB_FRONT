import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Alert,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { cursoService } from '../services/cursoService';
import { profesorService } from '../services/profesorService';
import { useAuth } from '../context/AuthContext';
import type { Curso, Profesor, PaginatedResponse } from '../types';
import Swal from 'sweetalert2';

const Cursos: React.FC = () => {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Curso> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  
  // Estados para el diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState<Partial<Curso>>({
    nombre: '',
    codigo: '',
    descripcion: '',
    creditos: 1,
    capacidadMaxima: 30,
    fechaInicio: '',
    fechaFin: '',
    horario: '',
    aula: '',
    profesorId: 0,
  });

  // Solo ADMIN puede crear, editar y eliminar
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isAdmin;

  useEffect(() => {
    loadCursos();
    loadProfesores();
  }, [page]);

  const loadCursos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await cursoService.getCursosPaginated({
        page: page - 1,
        size: rowsPerPage,
        sortBy: 'nombre',
        sortDir: 'asc',
      });
      setPaginatedData(response);
      setCursos(response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  const loadProfesores = async () => {
    try {
      const profesoresActivos = await profesorService.getProfesoresActivos();
      setProfesores(profesoresActivos);
    } catch (err) {
      // Error silencioso al cargar profesores
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenDialog = (curso?: Curso) => {
    if (curso) {
      setEditingCurso(curso);
      setFormData({
        ...curso,
        fechaInicio: curso.fechaInicio?.split('T')[0] || '', // Formato YYYY-MM-DD
        fechaFin: curso.fechaFin?.split('T')[0] || '',
      });
    } else {
      setEditingCurso(null);
      setFormData({
        nombre: '',
        codigo: '',
        descripcion: '',
        creditos: 1,
        capacidadMaxima: 30,
        fechaInicio: '',
        fechaFin: '',
        horario: '',
        aula: '',
        profesorId: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCurso(null);
    setFormData({
      nombre: '',
      codigo: '',
      descripcion: '',
      creditos: 1,
      capacidadMaxima: 30,
      fechaInicio: '',
      fechaFin: '',
      horario: '',
      aula: '',
      profesorId: 0,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'creditos' || name === 'capacidadMaxima' || name === 'profesorId' 
        ? parseInt(value) || 0 
        : value,
    }));
  };

  const handleSelectChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      profesorId: parseInt(e.target.value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCurso) {
        await cursoService.updateCurso(editingCurso.id!, formData);
        Swal.fire({
          title: 'Curso Actualizado',
          text: 'El registro fue actualizado correctamente.',
          icon: 'success'
        });
      } else {
        await cursoService.createCurso(formData as Omit<Curso, 'id'>);
        Swal.fire({
          title: 'Curso Creado',
          text: 'El registro fue almacenado correctamente.',
          icon: 'success'
        });
      }
      handleCloseDialog();
      loadCursos();
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err instanceof Error ? err.message : 'Error al guardar el curso',
        icon: 'error'
      });
    }
  };

  const handleDelete = async (curso: Curso) => {
    const result = await Swal.fire({
      title: '¿Está seguro que desea eliminar el registro?',
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await cursoService.deleteCurso(curso.id!);
        Swal.fire({
          title: 'Registro Eliminado',
          text: 'El curso fue eliminado correctamente.',
          icon: 'success'
        });
        loadCursos();
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err instanceof Error ? err.message : 'Error al eliminar el curso',
          icon: 'error'
        });
      }
    }
  };

  const getProfesorNombre = (profesorId: number) => {
    const profesor = profesores.find(p => p.id === profesorId);
    return profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Sin asignar';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Cursos
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            AGREGAR CURSO
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Solo tienes permisos de visualización. Las funciones de crear, editar y eliminar están disponibles únicamente para administradores.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>CÓDIGO</strong></TableCell>
              <TableCell><strong>NOMBRE</strong></TableCell>
              <TableCell><strong>PROFESOR</strong></TableCell>
              <TableCell><strong>CRÉDITOS</strong></TableCell>
              <TableCell><strong>HORARIO</strong></TableCell>
              <TableCell align="center"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.map((curso) => (
              <TableRow key={curso.id} hover>
                <TableCell>{curso.id}</TableCell>
                <TableCell>{curso.codigo}</TableCell>
                <TableCell>{curso.nombre}</TableCell>
                <TableCell>{getProfesorNombre(curso.profesorId)}</TableCell>
                <TableCell>{curso.creditos}</TableCell>
                <TableCell>{curso.horario}</TableCell>
                <TableCell align="center">
                  {canEdit && (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(curso)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(curso)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {cursos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay cursos registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {paginatedData && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            {`${((page - 1) * rowsPerPage) + 1}-${Math.min(page * rowsPerPage, paginatedData.totalElements)} de ${paginatedData.totalElements}`}
          </Typography>
          <Pagination
            count={paginatedData.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Diálogo para agregar/editar curso */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCurso ? 'Editar Curso' : 'Agregar Curso'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nombre del Curso"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Código"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                multiline
                rows={2}
                required
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Créditos"
                  name="creditos"
                  type="number"
                  value={formData.creditos}
                  onChange={handleInputChange}
                  inputProps={{ min: 1, max: 10 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Capacidad Máxima"
                  name="capacidadMaxima"
                  type="number"
                  value={formData.capacidadMaxima}
                  onChange={handleInputChange}
                  inputProps={{ min: 5, max: 100 }}
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Fecha de Inicio"
                  name="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
                <TextField
                  fullWidth
                  label="Fecha de Fin"
                  name="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Horario"
                  name="horario"
                  value={formData.horario}
                  onChange={handleInputChange}
                  placeholder="Ej: Lunes y Miércoles 08:00-10:00"
                  required
                />
                <TextField
                  fullWidth
                  label="Aula"
                  name="aula"
                  value={formData.aula}
                  onChange={handleInputChange}
                  placeholder="Ej: Aula 101"
                  required
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel id="profesor-label">Profesor</InputLabel>
                <Select
                  labelId="profesor-label"
                  value={formData.profesorId || ''}
                  label="Profesor"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">
                    <em>Seleccionar profesor</em>
                  </MenuItem>
                  {profesores.map((profesor) => (
                    <MenuItem key={profesor.id} value={profesor.id}>
                      {`${profesor.nombre} ${profesor.apellido} - ${profesor.especialidad}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingCurso ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Cursos;