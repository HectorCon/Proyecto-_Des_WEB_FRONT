import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'ALUMNO' as 'ALUMNO' | 'PROFESOR' | 'ADMIN',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role as 'ALUMNO' | 'PROFESOR' | 'ADMIN',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones básicas del email
    if (!formData.email.trim()) {
      setError('El correo electrónico es obligatorio');
      setLoading(false);
      return;
    }

    // Si se quiere cambiar la contraseña, validar que coincidan
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }
    }

    try {
      // Preparar datos para actualizar
      const updateData: { email: string; password?: string } = {
        email: formData.email,
      };

      // Solo incluir password si se proporcionó una nueva
      if (formData.newPassword.trim()) {
        updateData.password = formData.newPassword;
      }

      const { userService } = await import('../services/userService');
      await userService.updateMyProfile(updateData);
      
      await refreshUser();
      
      // Limpiar campos de contraseña después de la actualización
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
      }));
      
      Swal.fire({
        title: 'Perfil Actualizado',
        text: `Tu ${updateData.password ? 'correo electrónico y contraseña han' : 'correo electrónico ha'} sido actualizado correctamente.`,
        icon: 'success'
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Mi Perfil
          </Typography>
          <Typography variant="h6" component="h2" align="center" color="text.secondary" gutterBottom>
            Editar información personal
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Información de solo lectura */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Información del Usuario</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nombre de Usuario"
                  value={formData.username}
                  disabled={true}
                  helperText="No se puede modificar"
                />
                <TextField
                  fullWidth
                  label="Rol"
                  value={formData.role === 'ALUMNO' ? 'Alumno' : formData.role === 'PROFESOR' ? 'Profesor' : 'Administrador'}
                  disabled={true}
                  helperText="Solo el administrador puede cambiar tu rol"
                />
              </Box>
            </Box>

            {/* Campos editables */}
            <Typography variant="h6" gutterBottom>Información Editable</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              helperText="Puedes actualizar tu correo electrónico"
            />

            {/* Cambio de contraseña */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Cambiar Contraseña (Opcional)</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                margin="normal"
                fullWidth
                id="newPassword"
                label="Nueva Contraseña"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Mínimo 6 caracteres (dejar vacío para no cambiar)"
              />
              <TextField
                margin="normal"
                fullWidth
                id="confirmPassword"
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Debe coincidir con la nueva contraseña"
              />
            </Box>

            {/* Nota informativa */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" color="info.contrastText">
                <strong>Nota:</strong> Solo puedes actualizar tu correo electrónico y contraseña. 
                Otros datos como información personal específica son gestionados por el administrador del sistema.
                Si necesitas actualizar otra información, contacta al administrador.
              </Typography>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Actualizar Perfil'}
              </Button>
              <Button
                variant="outlined"
                disabled={loading}
                onClick={() => window.history.back()}
                sx={{ minWidth: 150 }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;