import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  WbSunny,
  DarkMode,
  Menu as MenuIcon,
  Home,
  VideoLibrary,
  PictureAsPdf,
  QuestionAnswer,
  Info,
  Close,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../App';
import { healthAPI } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { darkMode, toggleTheme } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health on component mount and periodically
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await healthAPI.checkHealth();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };

    // Initial check
    checkBackendHealth();

    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home sx={{ fontSize: 18 }} /> },
    { label: 'Video Processing', path: '/video-processing', icon: <VideoLibrary sx={{ fontSize: 18 }} /> },
    { label: 'Document AI', path: '/pdf', icon: <PictureAsPdf sx={{ fontSize: 18 }} /> },
    { label: 'Q&A', path: '/qa', icon: <QuestionAnswer sx={{ fontSize: 18 }} /> },
    { label: 'About', path: '/about', icon: <Info sx={{ fontSize: 18 }} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const renderDesktopMenu = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
      {menuItems.map((item, index) => (
        <Button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          sx={{
            color: isActivePath(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
            fontWeight: 500,
            fontSize: '0.9rem',
            textTransform: 'none',
            borderRadius: 2,
            px: 2.5,
            py: 1,
            minWidth: 'auto',
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.primary.main,
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
            ...(isActivePath(item.path) && {
              backgroundColor: theme.palette.action.selected,
            }),
          }}
          startIcon={item.icon}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Menu
        </Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              backgroundColor: isActivePath(item.path)
                ? theme.palette.action.selected
                : 'transparent',
              borderLeft: isActivePath(item.path) ? 4 : 0,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ color: isActivePath(item.path) ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: isActivePath(item.path) ? 600 : 400,
                  color: isActivePath(item.path) ? 'primary.main' : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
          {/* Logo and Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
            onClick={() => handleNavigation('/')}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              RK
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                fontSize: '1.1rem',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Smart-Summary-Q&A
            </Typography>
          </Box>

          {/* Status Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: backendStatus === 'connected'
                  ? 'rgba(76, 175, 80, 0.1)'
                  : backendStatus === 'checking'
                  ? 'rgba(255, 193, 7, 0.1)'
                  : 'rgba(244, 67, 54, 0.1)',
                border: backendStatus === 'connected'
                  ? '1px solid rgba(76, 175, 80, 0.3)'
                  : backendStatus === 'checking'
                  ? '1px solid rgba(255, 193, 7, 0.3)'
                  : '1px solid rgba(244, 67, 54, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: backendStatus === 'connected'
                    ? '#4caf50'
                    : backendStatus === 'checking'
                    ? '#ffc107'
                    : '#f44336',
                  animation: backendStatus === 'checking' ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: backendStatus === 'connected'
                    ? '#4caf50'
                    : backendStatus === 'checking'
                    ? '#ffc107'
                    : '#f44336',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                }}
              >
                {backendStatus === 'connected' ? 'CONNECTED' :
                 backendStatus === 'checking' ? 'CHECKING...' : 'DISCONNECTED'}
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {renderDesktopMenu()}

          {/* Theme Toggle and Mobile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Theme Toggle Switch */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
                borderRadius: '25px',
                padding: '4px',
                border: `2px solid ${darkMode ? '#444' : '#ddd'}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={toggleTheme}
            >
              {/* Light Mode Section */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '20px',
                  backgroundColor: !darkMode ? '#fff' : 'transparent',
                  color: !darkMode ? '#333' : '#888',
                  transition: 'all 0.3s ease',
                  boxShadow: !darkMode ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <WbSunny sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                  LIGHT
                </Typography>
              </Box>

              {/* Dark Mode Section */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '20px',
                  backgroundColor: darkMode ? '#444' : 'transparent',
                  color: darkMode ? '#fff' : '#888',
                  transition: 'all 0.3s ease',
                  boxShadow: darkMode ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                <DarkMode sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                  DARK
                </Typography>
              </Box>
            </Box>

            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  color: theme.palette.text.secondary,
                  width: 40,
                  height: 40,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      {renderMobileMenu()}
    </>
  );
};

export default Navbar;
