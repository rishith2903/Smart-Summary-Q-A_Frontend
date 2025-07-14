import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
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
  Send,
} from '@mui/icons-material';
import { videoAPI, qaAPI } from '../services/api';

const SingleVideo = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaResults, setQaResults] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);

  const handleProcessVideo = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setQaResults([]);

    try {
      const response = await videoAPI.processVideo(videoUrl);
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Failed to process video');
      }
    } catch (err) {
      setError('An error occurred while processing the video');
      console.error('Error processing video:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQASubmit = async () => {
    if (!qaQuestion.trim() || !result) {
      setError('Please enter a question and ensure video is processed');
      return;
    }

    setQaLoading(true);
    setError('');

    try {
      const context = result.summary || result.transcript;
      const response = await qaAPI.askQuestion(context, qaQuestion);

      if (response.success) {
        setQaResults([...qaResults, {
          question: qaQuestion,
          answer: response.data.answer,
          confidence: response.data.confidence || 0.8,
          timestamp: new Date().toLocaleTimeString(),
        }]);
        setQaQuestion('');
      } else {
        setError(response.error || 'Failed to get answer');
      }
    } catch (err) {
      setError('An error occurred while getting the answer');
      console.error('Error in Q&A:', err);
    } finally {
      setQaLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadText = (text, filename) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box>
      {/* Input Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <VideoLibrary sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Process Single Video
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              label="YouTube Video URL"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              variant="outlined"
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleProcessVideo}
              disabled={loading || !videoUrl.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
              sx={{ minWidth: 120, height: 56 }}
            >
              {loading ? 'Processing...' : 'Process'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Results Section */}
      {result && (
        <Grid container spacing={3}>
          {/* Video Info */}
          {result.metadata && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Video Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={`Duration: ${result.metadata.duration || 'N/A'}`} />
                    <Chip label={`Views: ${result.metadata.viewCount || 'N/A'}`} />
                    <Chip label={`Published: ${result.metadata.publishDate || 'N/A'}`} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {result.metadata.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {result.metadata.author || 'Unknown'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Summary */}
          {result.summary && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      AI Summary
                    </Typography>
                    <Box>
                      <Tooltip title="Copy Summary">
                        <IconButton onClick={() => copyToClipboard(result.summary)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Summary">
                        <IconButton onClick={() => downloadText(result.summary, 'summary.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Paper sx={{ p: 2, backgroundColor: 'background.default', maxHeight: 300, overflow: 'auto' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {result.summary}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Transcript */}
          {result.transcript && (
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Transcript
                    </Typography>
                    <Box>
                      <Tooltip title="Copy Transcript">
                        <IconButton onClick={() => copyToClipboard(result.transcript)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Transcript">
                        <IconButton onClick={() => downloadText(result.transcript, 'transcript.txt')}>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Paper sx={{ p: 2, backgroundColor: 'background.default', maxHeight: 300, overflow: 'auto' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {result.transcript}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Q&A Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <QuestionAnswer sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ask Questions About This Video
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Ask a question about the video content"
                    placeholder="What is the main topic of this video?"
                    value={qaQuestion}
                    onChange={(e) => setQaQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQASubmit()}
                    variant="outlined"
                    disabled={qaLoading}
                  />
                  <Button
                    variant="contained"
                    onClick={handleQASubmit}
                    disabled={qaLoading || !qaQuestion.trim()}
                    startIcon={qaLoading ? <CircularProgress size={20} /> : <Send />}
                    sx={{ minWidth: 120 }}
                  >
                    {qaLoading ? 'Asking...' : 'Ask'}
                  </Button>
                </Box>

                {qaResults.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Q&A History
                    </Typography>
                    {qaResults.map((qa, index) => (
                      <Paper key={index} sx={{ p: 3, mb: 2, backgroundColor: 'background.default' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                          Q: {qa.question}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          A: {qa.answer}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={`Confidence: ${(qa.confidence * 100).toFixed(0)}%`}
                            size="small"
                            color={qa.confidence > 0.7 ? 'success' : 'warning'}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {qa.timestamp}
                          </Typography>
                          <Tooltip title="Copy answer">
                            <IconButton size="small" onClick={() => copyToClipboard(qa.answer)}>
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SingleVideo;
