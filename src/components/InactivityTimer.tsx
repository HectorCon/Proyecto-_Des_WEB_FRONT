import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Alert } from '@mui/material';

interface InactivityTimerProps {
  show?: boolean;
  warningThreshold?: number; // Segundos antes de mostrar advertencia
}

export const InactivityTimer: React.FC<InactivityTimerProps> = ({ 
  show = true, 
  warningThreshold = 10 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      // Verificar si el usuario está autenticado
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setShowWarning(false);
        return;
      }

      // Simular countdown (esto es solo visual)
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        if (newTime <= warningThreshold && newTime > 0) {
          setShowWarning(true);
        } else if (newTime <= 0) {
          setShowWarning(false);
          return 60; // Reset
        } else {
          setShowWarning(false);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show, warningThreshold]);

  // Activa la sesion nuevamente al detectar actividad del usuario
  useEffect(() => {
    const resetTimer = () => {
      setTimeRemaining(60);
      setShowWarning(false);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  if (!show || !showWarning) return null;

  const progress = (timeRemaining / 60) * 100;

  return (
    <Box 
      position="fixed" 
      top={16} 
      right={16} 
      width={300} 
      zIndex={9999}
    >
      <Alert 
        severity="warning" 
        sx={{ 
          mb: 1,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Typography variant="body2" gutterBottom>
          Sesión expirará por inactividad en:
        </Typography>
        <Typography variant="h6" color="warning.main">
          {timeRemaining} segundos
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color="warning" 
          sx={{ mt: 1 }}
        />
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Mueva el mouse o presione una tecla para mantener la sesión activa
        </Typography>
      </Alert>
    </Box>
  );
};