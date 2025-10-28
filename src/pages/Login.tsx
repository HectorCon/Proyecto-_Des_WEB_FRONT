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
  InputAdornment,
  IconButton,
  Fade,
  Slide,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  School,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '../types';
import SocialLinks from '../components/SocialLinks';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

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

    // Validaciones básicas
    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return;
    }

    if (!formData.password.trim()) {
      setError('La contraseña es obligatoria');
      return;
    }

    try {
      const response = await login(formData);
      
      // Mostrar alerta de éxito
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Inicio de sesión exitoso. ${response.message || 'Has ingresado correctamente al sistema.'}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Navegar al dashboard después de un breve delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      // Manejo mejorado de errores
      let errorMessage = 'Error en el inicio de sesión';
      
      if (err instanceof Error) {
        // Personalizar mensajes según el tipo de error
        if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('credenciales')) {
          errorMessage = 'Usuario o contraseña incorrectos';
        } else if (err.message.includes('404')) {
          errorMessage = 'Usuario no encontrado';
        } else if (err.message.includes('500')) {
          errorMessage = 'Error interno del servidor. Intenta más tarde';
        } else if (err.message.includes('Network') || err.message.includes('fetch')) {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet';
        } else {
          errorMessage = err.message;
        }
      }

      // Mostrar error con SweetAlert2
      Swal.fire({
        title: 'Error de Inicio de Sesión',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });

      // También mostrar en el Alert del formulario
      setError(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={12} 
            sx={{ 
              p: { xs: 3, sm: 5 }, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <Slide in={true} direction="down" timeout={600}>
              <Box textAlign="center" mb={4}>
                <School 
                  sx={{ 
                    fontSize: 64, 
                    color: 'primary.main', 
                    mb: 2,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }} 
                />
                <Typography 
                  variant="h3" 
                  component="h1" 
                  fontWeight="bold" 
                  color="primary.main"
                  gutterBottom
                >
                  EduSystem
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ mb: 1 }}
                >
                  Sistema de Gestión Académica
                </Typography>
                <Box sx={{ height: 3, bgcolor: 'primary.main', borderRadius: 2, mx: 'auto', width: 60 }} />
              </Box>
            </Slide>

            {error && (
              <Fade in={true}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: 24
                    }
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nombre de Usuario"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderWidth: 2,
                    },
                  },
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderWidth: 2,
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={isLoading ? null : <LoginIcon />}
                sx={{ 
                  mt: 4, 
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Box display="flex" alignItems="center" gap={2}>
                    <CircularProgress size={24} color="inherit" />
                    <span>Iniciando sesión...</span>
                  </Box>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>

              <Box textAlign="center" sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ¿No tienes cuenta?
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Crear Cuenta Nueva
                </Button>

                {/* Divisor */}
                <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
                  <Typography variant="caption" color="text.secondary">
                    O síguenos en
                  </Typography>
                  <Box sx={{ flex: 1, height: 1, bgcolor: 'divider' }} />
                </Box>

                {/* Redes Sociales */}
                <SocialLinks variant="horizontal" size="medium" />
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;