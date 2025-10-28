import React, { useState, useRef } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera,
  Upload,
  Delete,
} from '@mui/icons-material';

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  size?: number;
  editable?: boolean;
  onAvatarChange?: (file: File | null) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  username,
  size = 80,
  editable = false,
  onAvatarChange,
}) => {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onAvatarChange?.(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    onAvatarChange?.(null);
    setDialogOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          editable ? (
            <IconButton
              size="small"
              onClick={() => setDialogOpen(true)}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: size * 0.3,
                height: size * 0.3,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <PhotoCamera sx={{ fontSize: size * 0.15 }} />
            </IconButton>
          ) : null
        }
      >
        <Avatar
          src={preview || undefined}
          sx={{
            width: size,
            height: size,
            background: preview 
              ? 'transparent' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: size * 0.4,
            fontWeight: 'bold',
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {!preview && getInitials(username)}
        </Avatar>
      </Badge>

      {/* Dialog para gestionar avatar */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PhotoCamera color="primary" />
            <Typography variant="h6">Gestionar Foto de Perfil</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box textAlign="center" py={2}>
            <Avatar
              src={preview || undefined}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                background: preview 
                  ? 'transparent' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: 48,
                fontWeight: 'bold',
                border: '4px solid white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              {!preview && getInitials(username)}
            </Avatar>

            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={uploading ? <CircularProgress size={20} /> : <Upload />}
                onClick={handleUploadClick}
                disabled={uploading}
                sx={{ minWidth: 140 }}
              >
                {uploading ? 'Subiendo...' : 'Subir Imagen'}
              </Button>

              {preview && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleRemoveAvatar}
                  sx={{ minWidth: 140 }}
                >
                  Eliminar
                </Button>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Formatos soportados: JPG, PNG, GIF (máx. 5MB)
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </>
  );
};

export default AvatarUpload;