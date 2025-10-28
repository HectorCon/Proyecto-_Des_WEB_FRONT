import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Paper,
  Fade,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Person,
  Class,
  Assignment,
  Logout,
  AccountCircle,
  SupervisorAccount,
  Notifications,
  Settings,
  ContactMail,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { InactivityTimer } from './InactivityTimer';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleMenuClose();
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard',
      color: '#667eea',
      description: 'Panel principal'
    },
    { 
      text: 'Alumnos', 
      icon: <School />, 
      path: '/alumnos',
      color: '#1976d2',
      description: 'Gestión de estudiantes'
    },
    { 
      text: 'Profesores', 
      icon: <Person />, 
      path: '/profesores',
      color: '#388e3c',
      description: 'Gestión de docentes'
    },
    { 
      text: 'Cursos', 
      icon: <Class />, 
      path: '/cursos',
      color: '#f57c00',
      description: 'Materias y asignaturas'
    },
    { 
      text: 'Inscripciones', 
      icon: <Assignment />, 
      path: '/inscripciones',
      color: '#7b1fa2',
      description: 'Matrículas de estudiantes'
    },
    { 
      text: 'Contacto', 
      icon: <ContactMail />, 
      path: '/contact',
      color: '#00695c',
      description: 'Información de contacto'
    },
    ...(user?.role === 'ADMIN' ? [
      { 
        text: 'Gestión de Usuarios', 
        icon: <SupervisorAccount />, 
        path: '/users',
        color: '#d32f2f',
        description: 'Administrar usuarios'
      }
    ] : []),
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  const drawer = (
    <Box sx={{ background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)', height: '100%' }}>
      {/* Header del Sidebar */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          p: 3,
          textAlign: 'center',
        }}
      >
        <School sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          EduSystem
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Gestión Académica
        </Typography>
      </Paper>

      {/* Usuario Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            <AccountCircle />
          </Avatar>
          <Box flex={1}>
            <Typography variant="body2" fontWeight="bold" color="white">
              {user?.username}
            </Typography>
            <Chip 
              label={user?.roleName} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontSize: '0.7rem',
                height: 20
              }} 
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <Fade in={true} timeout={800} key={item.text}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  color: 'white',
                  background: isActiveRoute(item.path) 
                    ? 'rgba(255,255,255,0.2)' 
                    : 'transparent',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.15)',
                    transform: 'translateX(8px)',
                  },
                  transition: 'all 0.3s ease',
                  backdropFilter: isActiveRoute(item.path) ? 'blur(10px)' : 'none',
                  border: isActiveRoute(item.path) 
                    ? '1px solid rgba(255,255,255,0.3)' 
                    : '1px solid transparent',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'white',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: isActiveRoute(item.path) ? 'bold' : 'normal',
                    fontSize: '0.9rem'
                  }}
                  secondaryTypographyProps={{
                    sx: { 
                      color: 'rgba(255,255,255,0.7)', 
                      fontSize: '0.7rem' 
                    }
                  }}
                />
                {isActiveRoute(item.path) && (
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 4, 
                      bgcolor: 'white', 
                      borderRadius: '50%',
                      boxShadow: '0 0 8px rgba(255,255,255,0.8)'
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          </Fade>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <Paper 
          sx={{ 
            p: 2, 
            textAlign: 'center',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="white" sx={{ opacity: 0.8 }}>
            v1.0.0 - Sistema Académico
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: 'text.primary',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {menuItems.find(item => isActiveRoute(item.path))?.text || 'EduSystem'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {menuItems.find(item => isActiveRoute(item.path))?.description || 'Sistema de Gestión Académica'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notificaciones */}
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Configuraciones */}
            <IconButton color="inherit">
              <Settings />
            </IconButton>

            {/* Perfil de Usuario */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight="bold" color="text.primary">
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.roleName}
                </Typography>
              </Box>
              
              <IconButton
                onClick={handleMenuOpen}
                sx={{ p: 0.5 }}
              >
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Box>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 200,
                  '& .MuiMenuItem-root': {
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Mi Perfil
              </MenuItem>
              
              <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Configuración
              </MenuItem>
              
              <Divider sx={{ my: 1 }} />
              
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Fade in={true} timeout={600}>
            <Box>
              <Outlet />
            </Box>
          </Fade>
        </Box>
      </Box>
      
      {/* Timer de inactividad */}
      <InactivityTimer show={true} warningThreshold={10} />
    </Box>
  );
};

export default Layout;