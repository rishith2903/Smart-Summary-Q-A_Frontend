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
  QuestionAnswer,
  Send,
} from '@mui/icons-material';
import { videoAPI, qaAPI } from '../services/api';

const MultipleVideos = () => {
  const [videoUrls, setVideoUrls] = useState(['']);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [currentProcessing, setCurrentProcessing] = useState(-1);
  const [qaQuestions, setQaQuestions] = useState({});
  const [qaResults, setQaResults] = useState({});
  const [qaLoading, setQaLoading] = useState({});

  const addVideoUrl = () => {
    setVideoUrls([...videoUrls, '']);
  };

  const removeVideoUrl = (index) => {
    const newUrls = videoUrls.filter((_, i) => i !== index);
    setVideoUrls(newUrls.length > 0 ? newUrls : ['']);
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

    const newResults = [];

    for (let i = 0; i < validUrls.length; i++) {
      setCurrentProcessing(i);
      try {
        const response = await videoAPI.processVideo(validUrls[i]);
        newResults.push({
          url: validUrls[i],
          success: response.success,
          data: response.success ? response.data : null,
          error: response.success ? null : response.error
        });
      } catch (err) {
        newResults.push({
          url: validUrls[i],
          success: false,
          data: null,
          error: 'Failed to process video'
        });
      }
      setResults([...newResults]);
    }

    setProcessing(false);
    setCurrentProcessing(-1);
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

  const downloadAllSummaries = () => {
    const allSummaries = results
      .filter(result => result.success && result.data.summary)
      .map((result, index) => `Video ${index + 1}: ${result.url}\n\n${result.data.summary}`)
      .join('\n\n' + '='.repeat(50) + '\n\n');
    
    downloadText(allSummaries, 'all_summaries.txt');
  };

  const getProgressValue = () => {
    if (!processing) return 0;
    return ((currentProcessing + 1) / videoUrls.filter(url => url.trim()).length) * 100;
  };

  const handleQASubmit = async (resultIndex) => {
    const question = qaQuestions[resultIndex];
    const result = results[resultIndex];

    if (!question?.trim() || !result?.success) {
      setError('Please enter a question and ensure video is processed');
      return;
    }

    setQaLoading({ ...qaLoading, [resultIndex]: true });
    setError('');

    try {
      const context = result.data.summary || result.data.transcript;
      const response = await qaAPI.askQuestion(context, question);

      if (response.success) {
        const newQAResult = {
          question: question,
          answer: response.data.answer,
          confidence: response.data.confidence || 0.8,
          timestamp: new Date().toLocaleTimeString(),
        };

        setQaResults({
          ...qaResults,
          [resultIndex]: [...(qaResults[resultIndex] || []), newQAResult]
        });

        setQaQuestions({
          ...qaQuestions,
          [resultIndex]: ''
        });
      } else {
        setError(response.error || 'Failed to get answer');
      }
    } catch (err) {
      setError('An error occurred while getting the answer');
      console.error('Error in Q&A:', err);
    } finally {
      setQaLoading({ ...qaLoading, [resultIndex]: false });
    }
  };

  const updateQAQuestion = (resultIndex, question) => {
    setQaQuestions({
      ...qaQuestions,
      [resultIndex]: question
    });
  };

  return (
    <Box>
      {/* Input Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PlaylistPlay sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Process Multiple Videos
            </Typography>
          </Box>
          
          {videoUrls.map((url, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label={`Video URL ${index + 1}`}
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => updateVideoUrl(index, e.target.value)}
                variant="outlined"
                disabled={processing}
              />
              {videoUrls.length > 1 && (
                <IconButton
                  onClick={() => removeVideoUrl(index)}
                  disabled={processing}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={addVideoUrl}
              startIcon={<Add />}
              disabled={processing}
            >
              Add Video
            </Button>
            <Button
              variant="contained"
              onClick={processAllVideos}
              disabled={processing || videoUrls.every(url => !url.trim())}
              startIcon={processing ? <CircularProgress size={20} /> : <PlayArrow />}
              sx={{ minWidth: 150 }}
            >
              {processing ? 'Processing...' : 'Process All'}
            </Button>
          </Box>

          {processing && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Processing video {currentProcessing + 1} of {videoUrls.filter(url => url.trim()).length}
              </Typography>
              <LinearProgress variant="determinate" value={getProgressValue()} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Processing Results ({results.filter(r => r.success).length}/{results.length} successful)
              </Typography>
              {results.some(r => r.success && r.data.summary) && (
                <Button
                  variant="outlined"
                  onClick={downloadAllSummaries}
                  startIcon={<Download />}
                >
                  Download All Summaries
                </Button>
              )}
            </Box>

            {results.map((result, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {result.success ? (
                      <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                    ) : (
                      <Error sx={{ color: 'error.main', mr: 1 }} />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Video {index + 1}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {result.url}
                      </Typography>
                    </Box>
                    {result.success && result.data.metadata && (
                      <Chip 
                        label={result.data.metadata.title} 
                        size="small" 
                        sx={{ maxWidth: 200, mr: 1 }} 
                      />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {result.success ? (
                    <Grid container spacing={2}>
                      {result.data.metadata && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Video Information
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip label={`Duration: ${result.data.metadata.duration || 'N/A'}`} size="small" />
                            <Chip label={`Views: ${result.data.metadata.viewCount || 'N/A'}`} size="small" />
                            <Chip label={`Published: ${result.data.metadata.publishDate || 'N/A'}`} size="small" />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {result.data.metadata.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            by {result.data.metadata.author || 'Unknown'}
                          </Typography>
                        </Grid>
                      )}
                      
                      {result.data.summary && (
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Summary
                            </Typography>
                            <Box>
                              <Tooltip title="Copy Summary">
                                <IconButton size="small" onClick={() => copyToClipboard(result.data.summary)}>
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download Summary">
                                <IconButton size="small" onClick={() => downloadText(result.data.summary, `summary_${index + 1}.txt`)}>
                                  <Download fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <Paper sx={{ p: 2, backgroundColor: 'background.default', maxHeight: 200, overflow: 'auto' }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {result.data.summary}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}

                      {result.data.transcript && (
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Transcript
                            </Typography>
                            <Box>
                              <Tooltip title="Copy Transcript">
                                <IconButton size="small" onClick={() => copyToClipboard(result.data.transcript)}>
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download Transcript">
                                <IconButton size="small" onClick={() => downloadText(result.data.transcript, `transcript_${index + 1}.txt`)}>
                                  <Download fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <Paper sx={{ p: 2, backgroundColor: 'background.default', maxHeight: 200, overflow: 'auto' }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {result.data.transcript}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}

                      {/* Q&A Section */}
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <QuestionAnswer sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Ask Questions About This Video
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Ask a question about this video"
                              placeholder="What is the main topic of this video?"
                              value={qaQuestions[index] || ''}
                              onChange={(e) => updateQAQuestion(index, e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleQASubmit(index)}
                              disabled={qaLoading[index]}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleQASubmit(index)}
                              disabled={qaLoading[index] || !(qaQuestions[index]?.trim())}
                              startIcon={qaLoading[index] ? <CircularProgress size={16} /> : <Send />}
                              sx={{ minWidth: 80 }}
                            >
                              {qaLoading[index] ? 'Asking...' : 'Ask'}
                            </Button>
                          </Box>

                          {qaResults[index] && qaResults[index].length > 0 && (
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                                Q&A History
                              </Typography>
                              {qaResults[index].map((qa, qaIndex) => (
                                <Paper key={qaIndex} sx={{ p: 2, mb: 1, backgroundColor: 'background.default' }}>
                                  <Typography variant="body2" color="primary" sx={{ mb: 0.5, fontWeight: 600 }}>
                                    Q: {qa.question}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
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
                        </Box>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="error">
                      {result.error || 'Failed to process this video'}
                    </Alert>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MultipleVideos;
