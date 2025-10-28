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
import { alumnoService } from '../services/alumnoService';
import { useAuth } from '../context/AuthContext';
import type { Alumno, PaginatedResponse } from '../types';
import Swal from 'sweetalert2';

const Alumnos: React.FC = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Alumno> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  
  // Estados para el diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const [formData, setFormData] = useState<Partial<Alumno>>({
    nombre: '',
    apellido: '',
    numeroEstudiante: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    direccion: '',
  });

  // Solo ADMIN puede crear, editar y eliminar
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isAdmin;

  useEffect(() => {
    loadAlumnos();
  }, [page]);

  const loadAlumnos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await alumnoService.getAlumnosPaginated({
        page: page - 1,
        size: rowsPerPage,
        sortBy: 'nombre',
        sortDir: 'asc',
      });
      setPaginatedData(response);
      setAlumnos(response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los alumnos');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenDialog = (alumno?: Alumno) => {
    if (alumno) {
      setEditingAlumno(alumno);
      setFormData(alumno);
    } else {
      setEditingAlumno(null);
      setFormData({
        nombre: '',
        apellido: '',
        numeroEstudiante: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        direccion: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAlumno(null);
    setFormData({
      nombre: '',
      apellido: '',
      numeroEstudiante: '',
      email: '',
      telefono: '',
      fechaNacimiento: '',
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
      if (editingAlumno) {
        await alumnoService.updateAlumno(editingAlumno.id!, formData);
        Swal.fire({
          title: 'Alumno Actualizado',
          text: 'El registro fue actualizado correctamente.',
          icon: 'success'
        });
      } else {
        await alumnoService.createAlumno(formData as Omit<Alumno, 'id'>);
        Swal.fire({
          title: 'Alumno Creado',
          text: 'El registro fue almacenado correctamente.',
          icon: 'success'
        });
      }
      handleCloseDialog();
      loadAlumnos();
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err instanceof Error ? err.message : 'Error al guardar el alumno',
        icon: 'error'
      });
    }
  };

  const handleDelete = async (alumno: Alumno) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar el registro?",
      text: "Los cambios no serán reversibles!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    });

    if (result.isConfirmed) {
      try {
        await alumnoService.deleteAlumno(alumno.id!);
        Swal.fire({
          title: "Eliminado",
          text: "El registro fue eliminado correctamente",
          icon: "success"
        });
        loadAlumnos();
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err instanceof Error ? err.message : 'Error al eliminar el alumno',
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
          Alumnos
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            AGREGAR ALUMNO
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
              <TableCell><strong>NÚMERO ESTUDIANTE</strong></TableCell>
              <TableCell><strong>NOMBRE COMPLETO</strong></TableCell>
              <TableCell><strong>EMAIL</strong></TableCell>
              <TableCell><strong>TELÉFONO</strong></TableCell>
              <TableCell align="center"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alumnos.map((alumno) => (
              <TableRow key={alumno.id} hover>
                <TableCell>{alumno.id}</TableCell>
                <TableCell>{alumno.numeroEstudiante}</TableCell>
                <TableCell>{`${alumno.nombre} ${alumno.apellido}`}</TableCell>
                <TableCell>{alumno.email}</TableCell>
                <TableCell>{alumno.telefono}</TableCell>
                <TableCell align="center">
                  {canEdit && (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(alumno)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(alumno)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {alumnos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay alumnos registrados
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

      {/* Diálogo para agregar/editar alumno */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingAlumno ? 'Editar Alumno' : 'Agregar Alumno'}
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
                  label="Número de Estudiante"
                  name="numeroEstudiante"
                  value={formData.numeroEstudiante}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
              {editingAlumno ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Alumnos;