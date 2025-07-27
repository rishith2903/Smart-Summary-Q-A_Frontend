import axios from 'axios';

// Base API configuration - Support both Vite and Create React App
const API_BASE_URL = import.meta.env?.VITE_API_URL ||
                     process.env.REACT_APP_API_URL ||
                     'http://localhost:5001';

// Debug logging
console.log('🔧 API Configuration:', {
  API_BASE_URL,
  NODE_ENV: import.meta.env?.MODE || process.env.NODE_ENV,
  VITE_API_URL: import.meta.env?.VITE_API_URL,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  BUILD_TOOL: import.meta.env ? 'Vite' : 'Create React App'
});

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Add request interceptor for additional cache busting
api.interceptors.request.use(config => {
  // Add unique parameter to every request
  config.params = {
    ...config.params,
    _t: Date.now(),
    _r: Math.random().toString(36).substring(7)
  };
  console.log('🌐 Axios Request:', config.url, config.params);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(response => {
  console.log('📡 Axios Response:', response.config.url, {
    status: response.status,
    dataPreview: response.data?.data?.videoInfo?.videoId || 'No videoId'
  });
  return response;
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health API
export const healthAPI = {
  checkHealth: async () => {
    try {
      console.log('🏥 Checking backend health at:', API_BASE_URL + '/api/health');
      const response = await api.get('/api/health');
      console.log('✅ Backend health check successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Backend health check failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      throw error;
    }
  },
  
  getAPIInfo: async () => {
    const response = await api.get('/');
    return response.data;
  },
};

// Video Processing API
export const videoAPI = {
  getVideoInfo: async (url) => {
    const response = await api.post('/api/video/info', { url });
    return response.data;
  },
  
  processVideo: async (url, targetLanguage = 'en', useGpu = false) => {
    // Create unique endpoint URL to bypass any caching
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const requestData = {
      url,
      targetLanguage,
      useGpu,
      timestamp: Date.now(), // Cache-busting parameter
      random: Math.random().toString(36).substring(7), // Additional randomness
      _cacheBust: uniqueId, // Extra cache busting
      _forceRefresh: true, // Force refresh flag
    };

    console.log('🚀 Frontend API Request:', requestData);

    // Use a unique URL path with timestamp to bypass caching completely
    const response = await api.post(`/api/video/process?_cb=${uniqueId}`, requestData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'If-Modified-Since': '0',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Cache-Bust': uniqueId,
      }
    });

    console.log('📥 Frontend API Response:', {
      videoId: response.data?.data?.videoInfo?.videoId,
      title: response.data?.data?.videoInfo?.title,
      summaryPreview: response.data?.data?.summary?.substring(0, 100) + '...'
    });

    return response.data;
  },
  
  processBatchVideos: async (urls, targetLanguage = 'en', useGpu = false, maxWorkers = 4) => {
    const requestData = {
      urls,
      targetLanguage,
      useGpu,
      maxWorkers,
      timestamp: Date.now(), // Cache-busting parameter
      _cacheBust: `${Date.now()}-${Math.random()}`, // Additional cache busting
    };

    console.log('🚀 Frontend Batch API Request:', requestData);

    const response = await api.post('/api/video/process-batch', requestData);

    console.log('📥 Frontend Batch API Response:', {
      totalProcessed: response.data.totalProcessed,
      results: response.data.data?.map(result => ({
        videoId: result.videoInfo?.videoId,
        title: result.videoInfo?.title,
        summaryPreview: result.summary?.substring(0, 100) + '...'
      }))
    });

    return response.data;
  },
};

// Q&A API
export const qaAPI = {
  askQuestion: async (summary, question, targetLanguage = 'en', useGpu = false) => {
    const response = await api.post('/api/qa/ask', {
      summary,
      question,
      targetLanguage,
      useGpu,
    });
    return response.data;
  },
  
  getQuestionSuggestions: async (summary) => {
    const response = await api.post('/api/qa/suggestions', { summary });
    return response.data;
  },
};

// PDF Processing API
export const pdfAPI = {
  processPDF: async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await api.post('/api/pdf/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  askPDFQuestion: async (pdfText, question, targetLanguage = 'en') => {
    const response = await api.post('/api/pdf/ask', {
      pdfText,
      question,
      targetLanguage,
    });
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  isValidYouTubeURL: (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  },
  
  extractVideoId: (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  },
  
  formatDuration: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },
  
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  truncateText: (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      type: 'server_error',
      status,
      message: data.error?.message || 'Server error occurred',
      code: data.error?.code || 'UNKNOWN_ERROR',
      details: data.error?.details,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      type: 'network_error',
      message: 'Network error - please check your connection and ensure the backend server is running',
      details: 'Backend server might be offline at http://localhost:5000',
    };
  } else {
    // Something else happened
    return {
      type: 'client_error',
      message: error.message || 'An unexpected error occurred',
    };
  }
};

// Export default api instance for custom requests
export default api;
