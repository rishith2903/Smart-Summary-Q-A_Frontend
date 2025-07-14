import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import {
  VideoLibrary,
  PictureAsPdf,
  QuestionAnswer,
  Speed,
  Language,
  Security,
  Analytics,
  CheckCircle,
  Code,
  Storage,
  Api,
  GitHub,
  LinkedIn,
  Email,
} from '@mui/icons-material';

const AboutPage = () => {

  const features = [
    {
      icon: <VideoLibrary />,
      title: 'Video Intelligence',
      description: 'Smart YouTube video analysis with automatic transcript extraction, AI-powered summarization, and interactive Q&A',
      technologies: ['YouTube Transcript API', 'NLP Summarization', 'Question Answering'],
    },
    {
      icon: <PictureAsPdf />,
      title: 'Document Intelligence',
      description: 'Advanced PDF processing with intelligent text extraction, content analysis, and document Q&A capabilities',
      technologies: ['PDF Parsing', 'Text Extraction', 'Document Analysis'],
    },
    {
      icon: <QuestionAnswer />,
      title: 'Interactive Q&A',
      description: 'Context-aware question answering system that works with both video and document content with confidence scoring',
      technologies: ['Transformer Models', 'Context Understanding', 'Confidence Scoring'],
    },
  ];

  const capabilities = [
    'Multi-language support with auto-detection',
    'Batch processing for multiple videos',
    'Real-time transcript extraction',
    'AI-powered summarization',
    'Intelligent question suggestions',
    'Context-aware answer generation',
    'Secure file processing',
    'Responsive web interface',
    'Dark/Light theme support',
    'RESTful API architecture',
  ];

  const techStack = {
    frontend: [
      'React 18',
      'Material-UI (MUI)',
      'React Router',
      'Axios',
      'JavaScript ES6+',
    ],
    backend: [
      'Node.js',
      'Express.js',
      'Multer',
      'CORS',
      'dotenv',
    ],
    ai: [
      'Transformers.js',
      'Google Translate API',
      'Extractive Summarization',
      'Question Answering Models',
    ],
    tools: [
      'YouTube API',
      'PDF Processing',
      'File Upload Handling',
      'Error Management',
    ],
  };

  const apiEndpoints = [
    { method: 'GET', path: '/api/health', description: 'Health check and service status' },
    { method: 'POST', path: '/api/video/process', description: 'Process single YouTube video' },
    { method: 'POST', path: '/api/video/process-batch', description: 'Process multiple videos' },
    { method: 'POST', path: '/api/qa/ask', description: 'Ask questions about content' },
    { method: 'POST', path: '/api/qa/suggestions', description: 'Get question suggestions' },
    { method: 'POST', path: '/api/pdf/process', description: 'Process PDF documents' },
    { method: 'POST', path: '/api/pdf/ask', description: 'Ask questions about PDFs' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          About smart-summary-QA
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          An intelligent AI-powered platform for processing videos and documents,
          enabling smart content analysis, summarization, and interactive question-answering capabilities.
        </Typography>

        {/* Demo Mode Notice */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="body1" color="info.main" sx={{ fontWeight: 600, mb: 1 }}>
            🚀 Currently Running in Demo Mode
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This platform demonstrates the full capabilities of our AI processing pipeline.
            In production, it would connect to real YouTube and document processing APIs for enhanced functionality.
          </Typography>
        </Box>
      </Box>

      {/* Features Overview */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          Core Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        p: 1,
                        borderRadius: '50%',
                        backgroundColor: 'primary.100',
                        color: 'primary.main',
                        mr: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {feature.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {feature.technologies.map((tech, idx) => (
                      <Chip key={idx} label={tech} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Capabilities */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          Platform Capabilities
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              {capabilities.map((capability, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle color="success" sx={{ mr: 2 }} />
                    <Typography variant="body1">{capability}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Technology Stack */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          Technology Stack
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Code color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Frontend
              </Typography>
              <List dense>
                {techStack.frontend.map((tech, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText primary={tech} sx={{ textAlign: 'center' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Storage color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Backend
              </Typography>
              <List dense>
                {techStack.backend.map((tech, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText primary={tech} sx={{ textAlign: 'center' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Analytics color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                AI & ML
              </Typography>
              <List dense>
                {techStack.ai.map((tech, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText primary={tech} sx={{ textAlign: 'center' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Api color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Tools & APIs
              </Typography>
              <List dense>
                {techStack.tools.map((tech, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText primary={tech} sx={{ textAlign: 'center' }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* API Documentation */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          API Endpoints
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              RESTful API Documentation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Base URL: <code>http://localhost:5000</code>
            </Typography>
            
            {apiEndpoints.map((endpoint, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                  <Chip
                    label={endpoint.method}
                    size="small"
                    color={endpoint.method === 'GET' ? 'success' : 'primary'}
                    sx={{ mr: 2, minWidth: 60, fontFamily: 'monospace' }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: 'monospace', mr: 2, fontWeight: 600 }}
                  >
                    {endpoint.path}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {endpoint.description}
                  </Typography>
                </Box>
                {index < apiEndpoints.length - 1 && <Divider />}
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* Project Info */}
      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Project Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Architecture
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  This application follows a modern full-stack architecture with a React frontend 
                  and Node.js backend. The system is designed for scalability, maintainability, 
                  and optimal user experience.
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Key Benefits
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Speed color="primary" /></ListItemIcon>
                    <ListItemText primary="Fast processing with optimized algorithms" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Security color="primary" /></ListItemIcon>
                    <ListItemText primary="Secure file handling and data processing" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Language color="primary" /></ListItemIcon>
                    <ListItemText primary="Multi-language support and translation" />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Development Status
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Backend Development</Typography>
                    <Typography variant="body2" color="success.main">100%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Frontend Development</Typography>
                    <Typography variant="body2" color="success.main">100%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">API Integration</Typography>
                    <Typography variant="body2" color="success.main">100%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Testing Coverage</Typography>
                    <Typography variant="body2" color="success.main">100%</Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  This project demonstrates modern web development practices with a focus on 
                  user experience, performance, and maintainable code architecture.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Developer Section */}
      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
              Developer
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Rishith Kumar Pachipulusu
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Full-Stack Developer & AI Enthusiast
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <IconButton
                  component="a"
                  href="https://github.com/rishith2903"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
                    transition: 'all 0.2s ease'
                  }}
                  aria-label="GitHub Profile"
                >
                  <GitHub sx={{ fontSize: 30 }} />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://www.linkedin.com/in/rishith-kumar-pachipulusu-13351a31b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
                    transition: 'all 0.2s ease'
                  }}
                  aria-label="LinkedIn Profile"
                >
                  <LinkedIn sx={{ fontSize: 30 }} />
                </IconButton>
                <IconButton
                  component="a"
                  href="mailto:rishithpachipulusu@gmail.com"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', transform: 'scale(1.1)' },
                    transition: 'all 0.2s ease'
                  }}
                  aria-label="Email Contact"
                >
                  <Email sx={{ fontSize: 30 }} />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Passionate about creating intelligent applications that leverage AI and machine learning
                to solve real-world problems. This project showcases modern web development practices
                combined with cutting-edge AI technologies for content processing and analysis.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AboutPage;
