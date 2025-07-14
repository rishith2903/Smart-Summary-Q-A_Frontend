import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,

  Fade,
  Grow,
} from '@mui/material';
import {
  VideoLibrary,
  PictureAsPdf,
  Speed,
  Language,
  Security,
  CloudUpload,
  Analytics,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();


  const features = [
    {
      icon: <VideoLibrary sx={{ fontSize: 60, color: '#9c88ff' }} />,
      title: 'Video Processing',
      subtitle: 'AI-POWERED VIDEO ANALYSIS & INSIGHTS',
      description: 'Process single or multiple YouTube videos with advanced AI transcription, summarization, and interactive Q&A capabilities.',
      path: '/video-processing',
      color: '#667eea',
      capabilities: [
        'Single & batch video processing',
        'Real-time transcript extraction',
        'BART neural summarization',
        'Interactive Q&A system',
        'Comparative analysis',
        'Multi-language support'
      ],
      buttonText: 'PROCESS VIDEOS',
    },
    {
      icon: <PictureAsPdf sx={{ fontSize: 60, color: '#9c88ff' }} />,
      title: 'Document Intelligence',
      subtitle: 'SMART PDF PROCESSING & Q&A',
      description: 'Extract meaningful insights from PDF documents with AI analysis and ask questions directly about the content.',
      path: '/pdf',
      color: '#e74c3c',
      capabilities: [
        'Advanced text extraction',
        'AI-powered summarization',
        'Interactive Q&A system',
        'Document structure analysis'
      ],
      buttonText: 'PROCESS DOCUMENTS',
    },
  ];

  const highlights = [
    { icon: <Speed />, title: 'Fast Processing', description: 'Optimized algorithms for quick results' },
    { icon: <Language />, title: 'Multi-Language', description: 'Support for multiple languages with auto-detection' },
    { icon: <Security />, title: 'Secure & Private', description: 'Your data is processed securely and not stored' },
    { icon: <CloudUpload />, title: 'Easy Upload', description: 'Simple drag-and-drop interface for files' },
    { icon: <Analytics />, title: 'Smart Analytics', description: 'AI-powered insights and summaries' },
  ];



  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Fade in timeout={1000}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            color: 'white',
            textAlign: 'center',
            py: 8,
            px: 4,
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            smart-summary-QA
            <br />
            Platform
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              maxWidth: 700,
              mx: 'auto',
              opacity: 0.95,
              lineHeight: 1.6
            }}
          >
            Experience the future of content processing with our advanced AI platform.
            <br />
            Extract insights, generate summaries, and get intelligent answers from videos and documents.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/video-processing')}
              startIcon={<VideoLibrary />}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              🎬 Try Video AI
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/pdf')}
              startIcon={<PictureAsPdf />}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              📄 Process Documents
            </Button>
          </Box>
        </Box>
      </Fade>



      {/* Features Section */}
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
      >
        Discover our comprehensive suite of AI-powered tools designed to
      </Typography>
      <Typography
        variant="h6"
        textAlign="center"
        sx={{ mb: 8, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
      >
        transform how you work with content.
      </Typography>

      <Box sx={{
        display: 'flex',
        gap: 4,
        mb: 8,
        mx: { xs: 2, sm: 4, md: 6 }, // Add horizontal margins
        flexDirection: { xs: 'column', sm: 'row' },
        '& > *': { flex: 1 }
      }}>
        {features.map((feature, index) => (
          <Box key={index}>
            <Grow in timeout={1000 + index * 200}>
              <Card
                sx={{
                  height: '100%',
                  minHeight: 450,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? `0 8px 25px rgba(0,0,0,0.4)`
                      : `0 8px 25px rgba(0,0,0,0.15)`,
                  },
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                }}
                onClick={() => navigate(feature.path)}
              >


                <CardContent sx={{ p: 4, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Icon */}
                  <Box sx={{ mb: 3, mt: 2 }}>
                    {feature.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    component="h3"
                    sx={{ mb: 1, fontWeight: 600, color: 'text.primary', fontSize: '1.75rem' }}
                  >
                    {feature.title}
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 3,
                      color: '#667eea',
                      fontWeight: 600,
                      letterSpacing: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    {feature.subtitle}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.5, fontSize: '0.9rem' }}
                  >
                    {feature.description}
                  </Typography>

                  {/* Key Features */}
                  <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}
                    >
                      KEY FEATURES
                    </Typography>
                    {feature.capabilities.map((capability, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'success.main',
                            mr: 2,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {capability}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Box>
        ))}
      </Box>

      {/* Highlights Section */}
      <Fade in timeout={2000}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" textAlign="center" sx={{ mb: 4, fontWeight: 600 }}>
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={3}>
            {highlights.map((highlight, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      mb: 2,
                    }}
                  >
                    {highlight.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {highlight.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {highlight.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default HomePage;
