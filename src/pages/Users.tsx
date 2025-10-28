import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Button,
  Pagination,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonOff as PersonOffIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import type { User, PaginatedResponse } from '../types';
import Swal from 'sweetalert2';

interface UserStats {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  totalAlumnos: number;
  totalProfesores: number;
  totalAdmins: number;
}

const Users: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRole, setNewRole] = useState<'ALUMNO' | 'PROFESOR' | 'ADMIN'>('ALUMNO');
  const [statsError, setStatsError] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalUsuarios: 0,
    usuariosActivos: 0,
    usuariosInactivos: 0,
    totalAlumnos: 0,
    totalProfesores: 0,
    totalAdmins: 0,
  });

  // Solo ADMIN puede acceder a esta página
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadStats();
    }
  }, [page, isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<User> = await userService.getUsers({
        page: page - 1,
        size: 10,
      });
      setUsers(response.content);
      setTotalPages(response.totalPages);
      setError('');

      // Si hay error en estadísticas, calcular localmente con todos los usuarios
      if (statsError) {
        try {
          const allUsers = await userService.getAllUsers();
          setStats({
            totalUsuarios: allUsers.length,
            usuariosActivos: allUsers.filter(u => u.activo).length,
            usuariosInactivos: allUsers.filter(u => !u.activo).length,
            totalAlumnos: allUsers.filter(u => u.role === 'ALUMNO').length,
            totalProfesores: allUsers.filter(u => u.role === 'PROFESOR').length,
            totalAdmins: allUsers.filter(u => u.role === 'ADMIN').length,
          });
        } catch (statsErr) {
          // Error silencioso en estadísticas locales
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statistics = await userService.getUserStatistics();
      setStats(statistics);
      setStatsError(false);
    } catch (err) {
      setStatsError(true);
      // Mantener estadísticas en 0 si hay error
      setStats({
        totalUsuarios: 0,
        usuariosActivos: 0,
        usuariosInactivos: 0,
        totalAlumnos: 0,
        totalProfesores: 0,
        totalAdmins: 0,
      });
    }
  };

  const handleEditRole = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setNewRole(userToEdit.role);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingUser(null);
    setOpenDialog(false);
    setNewRole('ALUMNO');
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;

    try {
      await userService.updateUserRole(editingUser.id, newRole);
      Swal.fire({
        title: 'Rol Actualizado',
        text: `El rol del usuario ${editingUser.username} ha sido cambiado a ${newRole}.`,
        icon: 'success'
      });
      handleCloseDialog();
      loadUsers();
      loadStats(); // Recargar estadísticas después de cambiar rol
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err instanceof Error ? err.message : 'Error al actualizar el rol',
        icon: 'error'
      });
    }
  };

  const handleToggleStatus = async (userToToggle: User) => {
    const action = userToToggle.activo ? 'desactivar' : 'activar';
    const result = await Swal.fire({
      title: `¿Está seguro que desea ${action} el usuario?`,
      text: `El usuario ${userToToggle.username} será ${userToToggle.activo ? 'desactivado' : 'activado'}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await userService.toggleUserStatus(userToToggle.id);
        Swal.fire({
          title: 'Estado Actualizado',
          text: `El usuario ha sido ${userToToggle.activo ? 'desactivado' : 'activado'} correctamente.`,
          icon: 'success'
        });
        loadUsers();
        loadStats(); // Recargar estadísticas después de cambiar estado
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err instanceof Error ? err.message : 'Error al cambiar el estado del usuario',
          icon: 'error'
        });
      }
    }
  };

  const handleDeleteUser = async (userToDelete: User) => {
    const result = await Swal.fire({
      title: '¿Está seguro que desea eliminar el usuario?',
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await userService.deleteUser(userToDelete.id);
        Swal.fire({
          title: 'Usuario Eliminado',
          text: 'El usuario fue eliminado correctamente.',
          icon: 'success'
        });
        loadUsers();
        loadStats(); // Recargar estadísticas después de eliminar usuario
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: err instanceof Error ? err.message : 'Error al eliminar el usuario',
          icon: 'error'
        });
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'PROFESOR': return 'primary';
      case 'ALUMNO': return 'secondary';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'PROFESOR': return 'Profesor';
      case 'ALUMNO': return 'Alumno';
      default: return role;
    }
  };

  if (!isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">
          No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar usuarios.
        </Alert>
      </Box>
    );
  }

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
          Gestión de Usuarios
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}



      {/* Tarjetas de estadísticas */}
      {statsError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se pudieron cargar las estadísticas del servidor. Los datos se calcularán localmente cuando se carguen los usuarios.
        </Alert>
      )}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 3,
        '& > *': { flex: '1 1 150px', minWidth: '150px' }
      }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Total Usuarios
            </Typography>
            <Typography variant="h4" component="div">
              {stats.totalUsuarios}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Usuarios Activos
            </Typography>
            <Typography variant="h4" component="div" color="success.main">
              {stats.usuariosActivos}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Usuarios Inactivos
            </Typography>
            <Typography variant="h4" component="div" color="error.main">
              {stats.usuariosInactivos}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Alumnos
            </Typography>
            <Typography variant="h4" component="div" color="secondary.main">
              {stats.totalAlumnos}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Profesores
            </Typography>
            <Typography variant="h4" component="div" color="primary.main">
              {stats.totalProfesores}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Administradores
            </Typography>
            <Typography variant="h4" component="div" color="error.main">
              {stats.totalAdmins}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>USUARIO</strong></TableCell>
              <TableCell><strong>EMAIL</strong></TableCell>
              <TableCell><strong>ROL</strong></TableCell>
              <TableCell><strong>ESTADO</strong></TableCell>
              <TableCell><strong>FECHA CREACIÓN</strong></TableCell>
              <TableCell align="center"><strong>ACCIONES</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((usuario) => (
              <TableRow key={usuario.id} hover>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.username}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={getRoleLabel(usuario.role)} 
                    color={getRoleColor(usuario.role)} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.activo ? 'Activo' : 'Inactivo'} 
                    color={usuario.activo ? 'success' : 'default'} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(usuario.fechaCreacion).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditRole(usuario)}
                    size="small"
                    title="Cambiar rol"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color={usuario.activo ? 'warning' : 'success'}
                    onClick={() => handleToggleStatus(usuario)}
                    size="small"
                    title={usuario.activo ? 'Desactivar' : 'Activar'}
                    sx={{ mr: 1 }}
                  >
                    {usuario.activo ? <PersonOffIcon /> : <PersonAddIcon />}
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(usuario)}
                    size="small"
                    title="Eliminar usuario"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Stack>

      {/* Dialog para cambiar rol */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cambiar Rol de Usuario
        </DialogTitle>
        <DialogContent>
          {editingUser && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Usuario: <strong>{editingUser.username}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Email: <strong>{editingUser.email}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                Rol actual: <strong>{getRoleLabel(editingUser.role)}</strong>
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Nuevo Rol</InputLabel>
                <Select
                  value={newRole}
                  label="Nuevo Rol"
                  onChange={(e) => setNewRole(e.target.value as 'ALUMNO' | 'PROFESOR' | 'ADMIN')}
                >
                  <MenuItem value="ALUMNO">Alumno</MenuItem>
                  <MenuItem value="PROFESOR">Profesor</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateRole} 
            variant="contained"
            disabled={!editingUser || newRole === editingUser.role}
          >
            Actualizar Rol
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;