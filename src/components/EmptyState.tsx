import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Fade,
} from '@mui/material';
import {
  SearchOff,
  AddCircleOutline,
  School,
  Person,
  Class,
  Assignment,
  Refresh,
} from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'add' | 'school' | 'person' | 'class' | 'assignment' | 'refresh';
  actionLabel?: string;
  onAction?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'search',
  actionLabel,
  onAction,
  showRefresh = false,
  onRefresh,
}) => {
  const iconMap = {
    search: SearchOff,
    add: AddCircleOutline,
    school: School,
    person: Person,
    class: Class,
    assignment: Assignment,
    refresh: Refresh,
  };

  const IconComponent = iconMap[icon];

  return (
    <Fade in={true} timeout={800}>
      <Paper
        elevation={2}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: '2px dashed #dee2e6',
          mx: 'auto',
          maxWidth: 500,
        }}
      >
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
          }}
        >
          <IconComponent sx={{ fontSize: 48, color: 'white' }} />
        </Box>

        <Typography
          variant="h5"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6 }}
        >
          {description}
        </Typography>

        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          {actionLabel && onAction && (
            <Button
              variant="contained"
              size="large"
              onClick={onAction}
              startIcon={<AddCircleOutline />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {actionLabel}
            </Button>
          )}

          {showRefresh && onRefresh && (
            <Button
              variant="outlined"
              size="large"
              onClick={onRefresh}
              startIcon={<Refresh />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Actualizar
            </Button>
          )}
        </Box>

        {/* Decoración */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <Box
              key={index}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                opacity: 0.3,
                animation: 'pulse 2s ease-in-out infinite',
                animationDelay: `${index * 0.2}s`,
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 0.3,
                    transform: 'scale(1)',
                  },
                  '50%': {
                    opacity: 0.8,
                    transform: 'scale(1.2)',
                  },
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Fade>
  );
};

export default EmptyState;