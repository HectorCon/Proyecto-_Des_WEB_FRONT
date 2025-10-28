import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Fade,
  Grow,
} from '@mui/material';
import {
  School,
  Person,
  Class,
  Assignment,
  TrendingUp,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alumnoService } from '../services/alumnoService';
import { profesorService } from '../services/profesorService';
import { cursoService } from '../services/cursoService';
import SocialLinks from '../components/SocialLinks';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    alumnos: 0,
    profesores: 0,
    cursos: 0,
    inscripciones: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas por separado para manejar errores individualmente
      const [alumnosStats, profesoresStats] = await Promise.all([
        alumnoService.getEstadisticas().catch(() => ({ total: 0 })),
        profesorService.getEstadisticas().catch(() => ({ total: 0 })),
      ]);

      // Intentar cargar estadísticas de cursos, con fallback
      let cursosTotal = 0;
      try {
        const cursosStats = await cursoService.getEstadisticas();
        cursosTotal = cursosStats.total;
      } catch (err) {
        try {
          // Fallback: contar cursos activos
          const cursosActivos = await cursoService.getCursosActivos();
          cursosTotal = cursosActivos.length;
        } catch (fallbackErr) {
          cursosTotal = 0;
        }
      }
      
      setStats({
        alumnos: alumnosStats.total,
        profesores: profesoresStats.total,
        cursos: cursosTotal,
        inscripciones: 0, // Placeholder hasta implementar inscripciones
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Alumnos Registrados',
      value: stats.alumnos,
      icon: <School sx={{ fontSize: 48 }} />,
      color: '#1976d2',
      bgGradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      subtitle: 'Estudiantes activos',
    },
    {
      title: 'Profesores',
      value: stats.profesores,
      icon: <Person sx={{ fontSize: 48 }} />,
      color: '#388e3c',
      bgGradient: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
      subtitle: 'Docentes disponibles',
    },
    {
      title: 'Cursos Disponibles',
      value: stats.cursos,
      icon: <Class sx={{ fontSize: 48 }} />,
      color: '#f57c00',
      bgGradient: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)',
      subtitle: 'Materias ofertadas',
    },
    {
      title: 'Inscripciones',
      value: stats.inscripciones,
      icon: <Assignment sx={{ fontSize: 48 }} />,
      color: '#7b1fa2',
      bgGradient: 'linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%)',
      subtitle: 'Matrículas activas',
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
              Cargando estadísticas...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header con gradiente */}
          <Paper 
            elevation={0}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 4,
              mb: 4,
              borderRadius: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <DashboardIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Bienvenido, {user?.username} - {user?.roleName}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {error && (
            <Fade in={true}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {/* Estadísticas Cards */}
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 3, 
              mb: 4 
            }}
          >
            {statCards.map((card, index) => (
              <Grow in={true} timeout={800 + index * 200} key={card.title}>
                <Card 
                  elevation={4}
                  sx={{ 
                    height: '100%',
                    background: card.bgGradient,
                    color: 'white',
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box sx={{ opacity: 0.9 }}>
                        {card.icon}
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingUp sx={{ fontSize: 20 }} />
                      </Box>
                    </Box>
                    <Typography variant="h3" component="div" fontWeight="bold" mb={1}>
                      {card.value}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {card.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </Box>

          {/* Panel de información */}
          <Fade in={true} timeout={1200}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Assignment sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  Panel de Control Académico
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                {user?.role === 'ADMIN' 
                  ? '🔧 Como administrador, tienes control total sobre el sistema. Puedes gestionar usuarios, asignar roles y supervisar todas las operaciones académicas.'
                  : user?.role === 'PROFESOR' 
                  ? '👨‍🏫 Como profesor, puedes gestionar cursos, ver información de estudiantes y administrar el contenido académico de tus materias.'
                  : '📚 Como estudiante, puedes acceder a la información de tus cursos, consultar calificaciones y mantenerte al día con tu progreso académico.'
                }
              </Typography>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 2,
                mt: 3,
              }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Sistema Integrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gestión completa del entorno académico
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" color="secondary" fontWeight="bold">
                    Tiempo Real
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Información actualizada al instante
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" color="success.main" fontWeight="bold">
                    Seguro
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Control de acceso por roles
                  </Typography>
                </Box>
              </Box>
              
              {/* Redes Sociales */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold" mb={2}>
                  🌐 Síguenos en Redes Sociales
                </Typography>
                <SocialLinks variant="horizontal" size="large" />
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Fade>
    </Container>
  );
};

export default Dashboard;