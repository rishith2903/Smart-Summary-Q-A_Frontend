import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Email,
  Favorite,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Video Processor AI
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Transform your videos and documents into intelligent, searchable content with AI-powered processing.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/video" color="text.secondary" underline="hover">
                Video Processing
              </Link>
              <Link href="/pdf" color="text.secondary" underline="hover">
                PDF Analysis
              </Link>
              <Link href="/qa" color="text.secondary" underline="hover">
                Q&A Assistant
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/about" color="text.secondary" underline="hover">
                About
              </Link>
              <Link href="http://localhost:5000" color="text.secondary" underline="hover" target="_blank">
                API Documentation
              </Link>
              <Link href="http://localhost:5000/api/health" color="text.secondary" underline="hover" target="_blank">
                API Health
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton
                component="a"
                href="https://github.com/rishith2903"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
                aria-label="GitHub"
              >
                <GitHub />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/rishith-kumar-pachipulusu-13351a31b/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
                aria-label="LinkedIn"
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                component="a"
                href="mailto:rishithpachipulusu@gmail.com"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
                aria-label="Email"
              >
                <Email />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Developed by Rishith Kumar Pachipulusu
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            © 2025 Rishith Kumar Pachipulusu
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
