import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Fade,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  Email,
  Phone,
  AccessTime,
  Send,
  ContactMail,
} from '@mui/icons-material';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envío
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <LocationOn />,
      title: 'Dirección',
      content: 'Av. Educación 123, Ciudad Universitaria\nSector Académico, CP 12345',
      color: '#1976d2',
    },
    {
      icon: <Email />,
      title: 'Email',
      content: 'info@edusystem.edu\nsoporte@edusystem.edu',
      color: '#388e3c',
    },
    {
      icon: <Phone />,
      title: 'Teléfono',
      content: '+1 (555) 123-4567\n+1 (555) 987-6543',
      color: '#f57c00',
    },
    {
      icon: <AccessTime />,
      title: 'Horario',
      content: 'Lunes - Viernes: 8:00 AM - 6:00 PM\nSábados: 9:00 AM - 2:00 PM',
      color: '#7b1fa2',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={800}>
        <Box>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 4,
              mb: 4,
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <ContactMail sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Contáctanos
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Estamos aquí para ayudarte. Conecta con nosotros a través de múltiples canales
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Información de Contacto */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                📍 Información de Contacto
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                {contactInfo.map((info, index) => (
                  <Fade in={true} timeout={800 + index * 200} key={info.title}>
                    <Card
                      elevation={2}
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        overflow: 'visible',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '50%',
                            backgroundColor: `${info.color}15`,
                            color: info.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {info.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color="text.primary">
                            {info.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: 'pre-line' }}
                          >
                            {info.content}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                ))}
              </Box>

              {/* Información Adicional */}
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="primary.main" mb={3}>
                  💡 Información Adicional
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta relacionada con el sistema académico.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Respuesta promedio: 24 horas • Soporte técnico especializado • Disponible en múltiples idiomas
                </Typography>
              </Paper>
            </Box>

            {/* Formulario de Contacto */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                📧 Envíanos un Mensaje
              </Typography>

              {success && (
                <Fade in={true}>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: 24,
                      },
                    }}
                  >
                    ¡Mensaje enviado exitosamente! Te responderemos pronto.
                  </Alert>
                </Fade>
              )}

              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                }}
              >
                <Box component="form" onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        fullWidth
                        label="Nombre Completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="Asunto"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Mensaje"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      disabled={loading}
                      sx={{
                        py: 2,
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
                    >
                      {loading ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </Box>
                </Box>
              </Paper>

              {/* Mapa */}
              <Paper
                elevation={2}
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
                  🗺️ Ubicación
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Estamos ubicados en el corazón de la zona universitaria
                </Typography>
                <Box
                  sx={{
                    height: 200,
                    background: 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed rgba(25, 118, 210, 0.3)',
                  }}
                >
                  <Typography variant="body1" color="white" fontWeight="bold">
                    📍 Mapa Interactivo
                    <br />
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      (Integración con Google Maps próximamente)
                    </Typography>
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default Contact;