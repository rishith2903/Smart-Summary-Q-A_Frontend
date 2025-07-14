import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  QuestionAnswer,
  Send,
  ContentCopy,
  Lightbulb,
  Clear,
  Psychology,
} from '@mui/icons-material';
import { qaAPI, handleAPIError } from '../services/api';

const QAPage = () => {
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [processing, setProcessing] = useState(false);
  const [qaResults, setQaResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
  ];

  const sampleSummaries = [
    {
      title: 'AI & Machine Learning',
      content: 'This content discusses artificial intelligence and machine learning technologies. It covers neural networks, deep learning algorithms, and their applications in healthcare, finance, and transportation industries. The presentation explains how AI systems can perform complex tasks like image recognition, natural language processing, and predictive analytics.',
    },
    {
      title: 'Climate Change',
      content: 'This document explores climate change impacts and solutions. It discusses renewable energy sources like solar and wind power, carbon emission reduction strategies, and the importance of sustainable development. The content covers global warming effects on ecosystems and the urgent need for environmental protection measures.',
    },
    {
      title: 'Space Exploration',
      content: 'This content covers space exploration missions and discoveries. It discusses Mars exploration, satellite technology, and the International Space Station. The material explains how space research contributes to scientific advancement and technological innovation on Earth.',
    },
  ];

  const askQuestion = async () => {
    if (!summary.trim()) {
      setError('Please enter content summary first');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await qaAPI.askQuestion(summary, question, targetLanguage);
      setQaResults([...qaResults, {
        question: question,
        answer: response.data.answer,
        confidence: response.data.confidence,
        context: response.data.context,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setQuestion('');
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setProcessing(false);
    }
  };

  const getSuggestions = async () => {
    if (!summary.trim()) {
      setError('Please enter content summary first');
      return;
    }

    setLoadingSuggestions(true);
    setError(null);

    try {
      const response = await qaAPI.getQuestionSuggestions(summary);
      setSuggestions(response.data.suggestions);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const loadSampleSummary = (sampleContent) => {
    setSummary(sampleContent);
    setSuggestions([]);
    setQaResults([]);
  };

  const selectSuggestedQuestion = (suggestedQuestion) => {
    setQuestion(suggestedQuestion);
  };

  const clearAll = () => {
    setSummary('');
    setQuestion('');
    setQaResults([]);
    setSuggestions([]);
    setError(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: 700,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Q&A Assistant
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Ask intelligent questions about any content and get AI-powered answers with context
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Sample Content Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology color="primary" />
            Try Sample Content
          </Typography>
          
          <Grid container spacing={2}>
            {sampleSummaries.map((sample, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.50',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => loadSampleSummary(sample.content)}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {sample.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to use this sample content
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Content Input Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuestionAnswer color="primary" />
            Content & Questions
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Content Summary"
                placeholder="Paste your content summary here... (from video processing, PDF analysis, or any text content)"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                helperText={`${summary.length} characters`}
              />
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Your Question"
                placeholder="What would you like to know about this content?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && askQuestion()}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={targetLanguage}
                  label="Language"
                  onChange={(e) => setTargetLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={askQuestion}
                  disabled={processing || !summary.trim() || !question.trim()}
                  startIcon={processing ? <CircularProgress size={20} /> : <Send />}
                >
                  {processing ? 'Processing...' : 'Ask Question'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={getSuggestions}
                  disabled={loadingSuggestions || !summary.trim()}
                  startIcon={loadingSuggestions ? <CircularProgress size={20} /> : <Lightbulb />}
                >
                  {loadingSuggestions ? 'Loading...' : 'Get Suggestions'}
                </Button>
                
                <Button
                  variant="text"
                  onClick={clearAll}
                  startIcon={<Clear />}
                  color="error"
                >
                  Clear All
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Question Suggestions */}
      {suggestions.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lightbulb color="primary" />
              Suggested Questions
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  onClick={() => selectSuggestedQuestion(suggestion)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'primary.100',
                    },
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Q&A Results */}
      {qaResults.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Q&A Results ({qaResults.length})
            </Typography>
            
            {qaResults.map((qa, index) => (
              <Paper key={index} sx={{ p: 3, mb: 3, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600, flex: 1 }}>
                    Q: {qa.question}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {qa.timestamp}
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  <strong>A:</strong> {qa.answer}
                </Typography>
                
                {qa.context && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      <strong>Context:</strong> {qa.context}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`Confidence: ${(qa.confidence * 100).toFixed(0)}%`} 
                      size="small" 
                      color={qa.confidence > 0.7 ? 'success' : qa.confidence > 0.5 ? 'warning' : 'error'}
                    />
                    <Chip 
                      label={targetLanguage.toUpperCase()} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Copy question">
                      <IconButton size="small" onClick={() => copyToClipboard(qa.question)}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy answer">
                      <IconButton size="small" onClick={() => copyToClipboard(qa.answer)}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default QAPage;
