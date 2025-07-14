import React from 'react';
import { Alert, AlertTitle, Box, Button, Container, Typography } from '@mui/material';
import { Refresh, BugReport } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box textAlign="center">
            <BugReport sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Oops! Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>

            <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
              <AlertTitle>Error Details</AlertTitle>
              {this.state.error && this.state.error.toString()}
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={this.handleReload}
                startIcon={<Refresh />}
                size="large"
              >
                Reload Page
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
                size="large"
              >
                Go Back
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Alert severity="warning" sx={{ mt: 4, textAlign: 'left' }}>
                <AlertTitle>Stack Trace (Development Only)</AlertTitle>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </Alert>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
