import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import type { RegisterRequest } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    role: 'ALUMNO', // Por defecto siempre ALUMNO
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    // Campos específicos removidos - solo datos básicos
    numeroEstudiante: '',
    numeroEmpleado: '',
    especialidad: '',
    fechaNacimiento: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');

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



    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validaciones básicas - solo datos principales
    if (!formData.telefono) {
      setError('El teléfono es obligatorio');
      return;
    }

    if (!formData.direccion) {
      setError('La dirección es obligatoria');
      return;
    }

    if (!formData.numeroEstudiante) {
      setError('El carnet es obligatorio');
      return;
    }

    if (!formData.fechaNacimiento) {
      setError('La fecha de nacimiento es obligatoria');
      return;
    }

    // Validar que la fecha no sea futura y que el usuario tenga al menos 10 años
    const birthDate = new Date(formData.fechaNacimiento);
    const today = new Date();
    const minAge = new Date();
    minAge.setFullYear(today.getFullYear() - 10);

    if (birthDate > today) {
      setError('La fecha de nacimiento no puede ser futura');
      return;
    }

    if (birthDate > minAge) {
      setError('Debes tener al menos 10 años para registrarte');
      return;
    }

    try {
      // Preparar datos - solo datos básicos del usuario
      const dataToSend: RegisterRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'ALUMNO', // Siempre ALUMNO por defecto
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        direccion: formData.direccion,
        numeroEstudiante: formData.numeroEstudiante, // Incluir el carnet
        fechaNacimiento: formData.fechaNacimiento, // Incluir fecha de nacimiento
      };

      await register(dataToSend);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el registro');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Sistema Escolar
          </Typography>
          <Typography variant="h6" component="h2" align="center" color="text.secondary" gutterBottom>
            Registro de Usuario
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nombre"
              label="Nombre"
              name="nombre"
              autoComplete="given-name"
              autoFocus
              value={formData.nombre}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="apellido"
              label="Apellido"
              name="apellido"
              autoComplete="family-name"
              value={formData.apellido}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />

            {/* Rol fijo como ALUMNO por defecto - No mostrar selector */}
            {/* <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={formData.role}
                label="Rol"
                onChange={handleRoleChange}
                disabled={isLoading}
              >
                <MenuItem value="ALUMNO">Alumno</MenuItem>
                <MenuItem value="PROFESOR">Profesor</MenuItem>
              </Select>
            </FormControl> */}

            {/* Campos adicionales requeridos */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="telefono"
              label="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="direccion"
              label="Dirección"
              value={formData.direccion}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="numeroEstudiante"
              label="Carnet"
              value={formData.numeroEstudiante}
              onChange={handleChange}
              disabled={isLoading}
              helperText="Número de carnet estudiantil"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              disabled={isLoading}
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Selecciona tu fecha de nacimiento"
            />

            {/* Campos básicos del alumno - los datos avanzados los asigna el ADMIN después */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>
            <Box textAlign="center">
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography color="primary">
                  ¿Ya tienes cuenta? Inicia sesión aquí
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;