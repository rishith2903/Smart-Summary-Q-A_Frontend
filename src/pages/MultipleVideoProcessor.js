import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlaylistPlay,
  Add,
  Delete,
  ContentCopy,
  Download,
  CheckCircle,
  Error,
  PlayArrow,
  ExpandMore,
} from '@mui/icons-material';
import { videoAPI } from '../services/api';

const MultipleVideoProcessor = () => {
  const [videoUrls, setVideoUrls] = useState(['']);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [currentProcessing, setCurrentProcessing] = useState(-1);

  const addVideoUrl = () => {
    setVideoUrls([...videoUrls, '']);
  };

  const removeVideoUrl = (index) => {
    if (videoUrls.length > 1) {
      const newUrls = videoUrls.filter((_, i) => i !== index);
      setVideoUrls(newUrls);
    }
  };

  const updateVideoUrl = (index, value) => {
    const newUrls = [...videoUrls];
    newUrls[index] = value;
    setVideoUrls(newUrls);
  };

  const processAllVideos = async () => {
    const validUrls = videoUrls.filter(url => url.trim());
    
    if (validUrls.length === 0) {
      setError('Please enter at least one valid YouTube URL');
      return;
    }

    setProcessing(true);
    setError('');
    setResults([]);
    setCurrentProcessing(0);

    const processedResults = [];

    for (let i = 0; i < validUrls.length; i++) {
      setCurrentProcessing(i);
      
      try {
        const response = await videoAPI.processVideo(validUrls[i]);
        processedResults.push({
          url: validUrls[i],
          success: response.success,
          data: response.data,
          error: response.error,
          index: i
        });
      } catch (err) {
        processedResults.push({
          url: validUrls[i],
          success: false,
          error: { message: err.message },
          index: i
        });
      }
    }

    setResults(processedResults);
    setCurrentProcessing(-1);
    setProcessing(false);
  };

  const copyAllSummaries = () => {
    const summaries = results
      .filter(result => result.success && result.data?.summary)
      .map((result, index) => 
        `Video ${index + 1}: ${result.data.title || 'Unknown Title'}\n${result.data.summary}\n\n`
      )
      .join('');
    
    navigator.clipboard.writeText(summaries);
  };

  const downloadAllSummaries = () => {
    const content = results
      .filter(result => result.success && result.data?.summary)
      .map((result, index) => 
        `Video ${index + 1}\nTitle: ${result.data.title || 'Unknown'}\nAuthor: ${result.data.author || 'Unknown'}\nDuration: ${result.data.duration || 'Unknown'}\nURL: ${result.url}\n\nSummary:\n${result.data.summary}\n\n${'='.repeat(80)}\n\n`
      )
      .join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multiple_videos_summary_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getProgressPercentage = () => {
    if (!processing) return 0;
    const validUrls = videoUrls.filter(url => url.trim());
    return ((currentProcessing + 1) / validUrls.length) * 100;
  };

  const successfulResults = results.filter(r => r.success);
  const failedResults = results.filter(r => !r.success);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <PlaylistPlay sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Multiple Video Processor
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Process multiple YouTube videos in batch to generate comprehensive summaries and insights
        </Typography>
      </Box>

      {/* Video URLs Input Section */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Enter YouTube Video URLs
          </Typography>
          
          {videoUrls.map((url, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={`Video URL ${index + 1}`}
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => updateVideoUrl(index, e.target.value)}
                variant="outlined"
                disabled={processing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              {videoUrls.length > 1 && (
                <IconButton
                  onClick={() => removeVideoUrl(index)}
                  disabled={processing}
                  color="error"
                  sx={{ height: 56 }}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={addVideoUrl}
              disabled={processing}
              startIcon={<Add />}
              sx={{ borderRadius: 2 }}
            >
              Add Another URL
            </Button>
            
            <Button
              variant="contained"
              onClick={processAllVideos}
              disabled={processing || videoUrls.every(url => !url.trim())}
              startIcon={processing ? <CircularProgress size={20} /> : <PlayArrow />}
              sx={{
                minWidth: 160,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {processing ? 'Processing...' : 'Process All Videos'}
            </Button>
          </Box>

          {processing && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Processing video {currentProcessing + 1} of {videoUrls.filter(url => url.trim()).length}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getProgressPercentage()} 
                sx={{ borderRadius: 1, height: 8 }}
              />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Processing Results
              </Typography>
              {successfulResults.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Copy All Summaries">
                    <IconButton onClick={copyAllSummaries}>
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download All Summaries">
                    <IconButton onClick={downloadAllSummaries}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            {/* Summary Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                    {results.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Videos
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                    {successfulResults.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successful
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                    {failedResults.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* Individual Results */}
            {results.map((result, index) => (
              <Accordion key={index} sx={{ mb: 2, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {result.success ? (
                      <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                    ) : (
                      <Error sx={{ color: 'error.main', mr: 2 }} />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {result.success ? result.data?.title || `Video ${index + 1}` : `Failed: Video ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        maxWidth: 400
                      }}>
                        {result.url}
                      </Typography>
                    </Box>
                    <Chip 
                      label={result.success ? 'Success' : 'Failed'} 
                      color={result.success ? 'success' : 'error'}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {result.success ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Video Information
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText 
                              primary="Author" 
                              secondary={result.data?.author || 'N/A'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Duration" 
                              secondary={result.data?.duration || 'N/A'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Method" 
                              secondary={
                                <Chip 
                                  label={result.data?.method || 'Unknown'} 
                                  size="small" 
                                  variant="outlined"
                                />
                              } 
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Summary
                          </Typography>
                          <Tooltip title="Copy Summary">
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(result.data?.summary || '');
                              }}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Paper sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {result.data?.summary || 'No summary available'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {result.error?.message || 'Unknown error occurred'}
                    </Alert>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default MultipleVideoProcessor;
