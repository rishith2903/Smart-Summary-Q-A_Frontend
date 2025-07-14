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
} from '@mui/material';
import {
  PlayArrow,
  ContentCopy,
  Download,
  VideoLibrary,
  QuestionAnswer,
} from '@mui/icons-material';
import { videoAPI, qaAPI } from '../services/api';

const SingleVideoProcessor = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState(null);
  const [qaLoading, setQaLoading] = useState(false);

  const handleProcessVideo = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setQaAnswer(null);

    try {
      const response = await videoAPI.processVideo(videoUrl);
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error?.message || 'Failed to process video');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing the video');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!qaQuestion.trim() || !result?.summary) {
      setError('Please enter a question and ensure video is processed first');
      return;
    }

    setQaLoading(true);
    setError('');

    try {
      const response = await qaAPI.askQuestion({
        summary: result.summary,
        question: qaQuestion,
        targetLanguage: 'en'
      });

      if (response.success) {
        setQaAnswer(response.data);
      } else {
        setError(response.error?.message || 'Failed to get answer');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing the question');
    } finally {
      setQaLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadSummary = () => {
    if (!result) return;
    
    const content = `Video Summary\n\nTitle: ${result.title}\nAuthor: ${result.author}\nDuration: ${result.duration}\n\nSummary:\n${result.summary}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title || 'video'}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <VideoLibrary sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Single Video Processor
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Process individual YouTube videos to extract metadata, generate summaries, and get AI-powered insights
        </Typography>
      </Box>

      {/* Video Input Section */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Enter YouTube Video URL
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="YouTube Video URL"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              variant="outlined"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleProcessVideo}
              disabled={loading || !videoUrl.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
              sx={{
                minWidth: 140,
                height: 56,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {loading ? 'Processing...' : 'Process'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Grid container spacing={3}>
          {/* Video Information */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Video Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Title
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {result.title || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Author
                  </Typography>
                  <Typography variant="body1">
                    {result.author || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {result.duration || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Video ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {result.videoId || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Processing Method
                  </Typography>
                  <Chip 
                    label={result.method || 'Unknown'} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Summary
                  </Typography>
                  <Box>
                    <Tooltip title="Copy Summary">
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard(result.summary)}
                        sx={{ mr: 1 }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Summary">
                      <IconButton size="small" onClick={downloadSummary}>
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 2,
                    maxHeight: 300,
                    overflow: 'auto'
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {result.summary || 'No summary available'}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Q&A Section */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <QuestionAnswer sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ask Questions About This Video
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Ask a question about the video content"
                    placeholder="What are the main points discussed in this video?"
                    value={qaQuestion}
                    onChange={(e) => setQaQuestion(e.target.value)}
                    variant="outlined"
                    disabled={qaLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAskQuestion}
                    disabled={qaLoading || !qaQuestion.trim() || !result?.summary}
                    startIcon={qaLoading ? <CircularProgress size={20} /> : <QuestionAnswer />}
                    sx={{
                      minWidth: 120,
                      height: 56,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    {qaLoading ? 'Asking...' : 'Ask'}
                  </Button>
                </Box>

                {qaAnswer && (
                  <Paper
                    sx={{
                      p: 3,
                      backgroundColor: 'primary.50',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'primary.200',
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary.main">
                        AI Answer (Confidence: {Math.round(qaAnswer.confidence * 100)}%)
                      </Typography>
                      <Tooltip title="Copy Answer">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(qaAnswer.answer)}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {qaAnswer.answer}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default SingleVideoProcessor;
