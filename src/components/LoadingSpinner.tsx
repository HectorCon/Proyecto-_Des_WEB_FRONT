import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Fade,
  Paper,
} from '@mui/material';
import { School } from '@mui/icons-material';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando...',
  fullScreen = false,
  size = 60,
}) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{
        ...(fullScreen && {
          minHeight: '100vh',
          width: '100%',
        }),
        p: 4,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            minWidth: 200,
          }}
        >
          <Box position="relative" display="inline-flex" mb={2}>
            <CircularProgress
              size={size}
              thickness={4}
              sx={{
                color: 'rgba(255,255,255,0.3)',
                position: 'absolute',
              }}
            />
            <CircularProgress
              size={size}
              thickness={4}
              sx={{
                color: 'white',
                animationDuration: '1.5s',
              }}
              variant="indeterminate"
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              right={0}
            >
              <School sx={{ fontSize: size * 0.4, opacity: 0.8 }} />
            </Box>
          </Box>

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            EduSystem
          </Typography>
          
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {message}
          </Typography>

          {/* Puntos animados */}
          <Box sx={{ mt: 2 }}>
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  mx: 0.5,
                  animation: 'bounce 1.4s ease-in-out infinite both',
                  animationDelay: `${index * 0.16}s`,
                  '@keyframes bounce': {
                    '0%, 80%, 100%': {
                      transform: 'scale(0)',
                    },
                    '40%': {
                      transform: 'scale(1)',
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Paper>
      </Fade>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;