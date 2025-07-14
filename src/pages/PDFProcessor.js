import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
  Tooltip,

  Paper,
} from '@mui/material';
import {
  CloudUpload,
  ExpandMore,
  ContentCopy,
  PictureAsPdf,
  QuestionAnswer,
  Delete,
  Send,
} from '@mui/icons-material';
import { pdfAPI, apiUtils, handleAPIError } from '../services/api';

const PDFProcessor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [pdfResults, setPdfResults] = useState(null);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const [qaResults, setQaResults] = useState([]);
  const [askingQuestion, setAskingQuestion] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please drop a PDF file');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const processPDF = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setProcessing(true);
    setError(null);
    setPdfResults(null);

    try {
      const response = await pdfAPI.processPDF(selectedFile);
      setPdfResults(response.data);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setProcessing(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    if (!pdfResults?.extractedText) {
      setError('Please process a PDF first');
      return;
    }

    setAskingQuestion(true);
    setError(null);

    try {
      const response = await pdfAPI.askPDFQuestion(pdfResults.extractedText, question);
      setQaResults([...qaResults, {
        question: question,
        answer: response.data.answer,
        confidence: response.data.confidence,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setQuestion('');
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setAskingQuestion(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPdfResults(null);
    setQaResults([]);
    setError(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderFileUpload = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PictureAsPdf color="primary" />
          PDF Upload & Processing
        </Typography>

        <Paper
          sx={{
            border: '2px dashed',
            borderColor: selectedFile ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: selectedFile ? 'primary.50' : 'background.default',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'primary.50',
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('pdf-upload').click()}
        >
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          
          {selectedFile ? (
            <Box>
              <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Size: {apiUtils.formatFileSize(selectedFile.size)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    processPDF();
                  }}
                  disabled={processing}
                  startIcon={processing ? <CircularProgress size={20} /> : <PictureAsPdf />}
                >
                  {processing ? 'Processing...' : 'Process PDF'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  startIcon={<Delete />}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Drop your PDF here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum file size: 10MB
              </Typography>
            </Box>
          )}
        </Paper>
      </CardContent>
    </Card>
  );

  const renderPDFResults = () => {
    if (!pdfResults) return null;

    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            PDF Processing Results
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Filename:</Typography>
                <Typography variant="body1">{pdfResults.filename}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Pages:</Typography>
                <Typography variant="body1">{pdfResults.pageCount}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip label={`${pdfResults.extractedText.length} characters`} size="small" />
            <Chip label={`Processing time: ${pdfResults.processingTime}s`} size="small" />
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                AI Summary
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ position: 'relative' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {pdfResults.summary}
                </Typography>
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(pdfResults.summary)}
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Extracted Text
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ position: 'relative' }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    maxHeight: 300, 
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                  }}
                >
                  {apiUtils.truncateText(pdfResults.extractedText, 2000)}
                  {pdfResults.extractedText.length > 2000 && '...'}
                </Typography>
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(pdfResults.extractedText)}
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    );
  };

  const renderQASection = () => {
    if (!pdfResults) return null;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuestionAnswer color="primary" />
            Ask Questions About This PDF
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Ask a question about the PDF content"
              placeholder="What is the main topic of this document?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
            />
            <Button
              variant="contained"
              onClick={askQuestion}
              disabled={askingQuestion || !question.trim()}
              startIcon={askingQuestion ? <CircularProgress size={20} /> : <Send />}
              sx={{ minWidth: 120 }}
            >
              {askingQuestion ? 'Asking...' : 'Ask'}
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
    );
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
        PDF Processor
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Upload PDF documents for AI-powered text extraction, summarization, and intelligent Q&A
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {renderFileUpload()}
      {renderPDFResults()}
      {renderQASection()}
    </Container>
  );
};

export default PDFProcessor;
