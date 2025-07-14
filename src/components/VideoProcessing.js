import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Fade,
} from '@mui/material';
import {
  VideoLibrary,
  PlaylistPlay,
} from '@mui/icons-material';
import SingleVideo from './SingleVideo';
import MultipleVideos from './MultipleVideos';

const VideoProcessing = () => {
  const theme = useTheme();
  const [selectedMode, setSelectedMode] = useState('single');

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setSelectedMode(newMode);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Video Processing
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 400,
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Process single videos or multiple videos in batch. Extract transcripts, generate summaries, and get AI-powered insights.
        </Typography>
      </Box>

      {/* Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 1,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <ToggleButtonGroup
            value={selectedMode}
            exclusive
            onChange={handleModeChange}
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 1.5,
                px: 3,
                py: 1.5,
                mx: 0.5,
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              },
            }}
          >
            <ToggleButton value="single">
              <VideoLibrary sx={{ mr: 1, fontSize: 20 }} />
              Single Video
            </ToggleButton>
            <ToggleButton value="multiple">
              <PlaylistPlay sx={{ mr: 1, fontSize: 20 }} />
              Multiple Videos
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </Box>

      {/* Content Section */}
      <Box sx={{ position: 'relative', minHeight: 600 }}>
        <Fade in={selectedMode === 'single'} timeout={300}>
          <Box
            sx={{
              display: selectedMode === 'single' ? 'block' : 'none',
              position: selectedMode === 'single' ? 'relative' : 'absolute',
              width: '100%',
            }}
          >
            <SingleVideo />
          </Box>
        </Fade>
        
        <Fade in={selectedMode === 'multiple'} timeout={300}>
          <Box
            sx={{
              display: selectedMode === 'multiple' ? 'block' : 'none',
              position: selectedMode === 'multiple' ? 'relative' : 'absolute',
              width: '100%',
            }}
          >
            <MultipleVideos />
          </Box>
        </Fade>
      </Box>
    </Container>
  );
};

export default VideoProcessing;
