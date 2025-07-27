import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import VideoProcessing from './components/VideoProcessing';
import PDFProcessor from './pages/PDFProcessor';
import QAPage from './pages/QAPage';
import AboutPage from './pages/AboutPage';
import './App.css';

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#667eea',
        light: '#9bb5ff',
        dark: '#3f51b5',
      },
      secondary: {
        main: '#764ba2',
        light: '#a777d3',
        dark: '#4a2c73',
      },
      background: {
        default: darkMode ? '#1e1e1e' : '#f5f5f5',
        paper: darkMode ? '#303030' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: darkMode
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#303030' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            '&.MuiCardContent-root': {
              backgroundColor: darkMode ? '#303030' : '#ffffff',
            }
          },
        },
      },
    },
  });

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Update data-theme attribute for CSS custom properties
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1, pt: 2 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/video-processing" element={<VideoProcessing />} />
                  <Route path="/pdf" element={<PDFProcessor />} />
                  <Route path="/qa" element={<QAPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;






