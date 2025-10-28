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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { profesorService } from '../services/profesorService';
import { useAuth } from '../context/AuthContext';
import type { Profesor, PaginatedResponse } from '../types';
import Swal from 'sweetalert2';

const Profesores: React.FC = () => {
  const { user } = useAuth();
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Profesor> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  
  // Estados para el diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState<Profesor | null>(null);
  const [formData, setFormData] = useState<Partial<Profesor>>({
    nombre: '',
    apellido: '',
    numeroEmpleado: '',
    email: '',
    telefono: '',
    especialidad: '',
    direccion: '',
  });

  // Solo ADMIN puede crear, editar y eliminar
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isAdmin;

  useEffect(() => {
    loadProfesores();
  }, [page]);

  const loadProfesores = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Intentar primero con el endpoint paginado, si falla usar getAllProfesores
      try {
        const response = await profesorService.getProfesoresPaginated({
          page: page - 1,
          size: rowsPerPage,
          sortBy: 'nombre',
          sortDir: 'asc',
        });
        setPaginatedData(response);
        setProfesores(response.content);
      } catch (paginatedError) {
        // Fallback: usar getAllProfesores
        const allProfesores = await profesorService.getAllProfesores();
        
        // Simular paginación local
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedProfesores = allProfesores.slice(startIndex, endIndex);
        
        const simulatedResponse = {
          content: paginatedProfesores,
          totalPages: Math.ceil(allProfesores.length / rowsPerPage),
          totalElements: allProfesores.length,
          size: rowsPerPage,
          number: page - 1,
          first: page === 1,
          last: page === Math.ceil(allProfesores.length / rowsPerPage)
        };
        
        setPaginatedData(simulatedResponse);
        setProfesores(paginatedProfesores);
        
        // Mostrar advertencia al usuario
        setError('El endpoint paginado no está disponible. Usando vista completa con paginación local.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los profesores');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenDialog = (profesor?: Profesor) => {
    if (profesor) {
      setEditingProfesor(profesor);
      setFormData(profesor);
    } else {
      setEditingProfesor(null);
      setFormData({
        nombre: '',
        apellido: '',
        numeroEmpleado: '',
        email: '',
        telefono: '',
        especialidad: '',
        direccion: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProfesor(null);
    setFormData({
      nombre: '',
      apellido: '',
      numeroEmpleado: '',
      email: '',
      telefono: '',
      especialidad: '',
      direccion: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProfesor) {
        await profesorService.updateProfesor(editingProfesor.id!, formData);
        Swal.fire({
          title: 'Profesor Actualizado',
          text: 'El registro fue actualizado correctamente.',
          icon: 'success'
        });
      } else {
        await profesorService.createProfesor(formData as Omit<Profesor, 'id'>);
        Swal.fire({
          title: 'Profesor Creado',
          text: 'El registro fue almacenado correctamente.',
          icon: 'success'
        });
      }
      handleCloseDialog();
      loadProfesores();
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err instanceof Error ? err.message : 'Error al guardar el profesor',
        icon: 'error'
      });
    }
  };

  const handleDelete = async (profesor: Profesor) => {
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
        await profesorService.deleteProfesor(profesor.id!);
        Swal.fire({
          title: 'Registro Eliminado',
          text: 'El profesor fue eliminado correctamente.',
          icon: 'success'
        });
        loadProfesores();
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err instanceof Error ? err.message : 'Error al eliminar el profesor',
          icon: 'error'
        });
      }
    }
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
          Profesores
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            AGREGAR PROFESOR
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
              <TableCell><strong>NÚMERO EMPLEADO</strong></TableCell>
              <TableCell><strong>NOMBRE COMPLETO</strong></TableCell>
              <TableCell><strong>ESPECIALIDAD</strong></TableCell>
              <TableCell><strong>EMAIL</strong></TableCell>
              <TableCell align="center"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map((profesor) => (
              <TableRow key={profesor.id} hover>
                <TableCell>{profesor.id}</TableCell>
                <TableCell>{profesor.numeroEmpleado}</TableCell>
                <TableCell>{`${profesor.nombre} ${profesor.apellido}`}</TableCell>
                <TableCell>{profesor.especialidad}</TableCell>
                <TableCell>{profesor.email}</TableCell>
                <TableCell align="center">
                  {canEdit && (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(profesor)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(profesor)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {profesores.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay profesores registrados
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

      {/* Diálogo para agregar/editar profesor */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProfesor ? 'Editar Profesor' : 'Agregar Profesor'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Número de Empleado"
                  name="numeroEmpleado"
                  value={formData.numeroEmpleado}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                multiline
                rows={2}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingProfesor ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profesores;