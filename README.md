# Smart-Summary-Q&A Frontend

## 🚀 Overview

Modern React frontend application for the Smart-Summary-Q&A platform, providing an intuitive user interface for AI-powered video and document analysis with intelligent summarization and interactive Q&A capabilities.

## ✨ Features

- **Video Intelligence**: Smart YouTube video analysis with automatic transcript extraction
- **Document Intelligence**: Advanced PDF processing with intelligent text extraction
- **Interactive Q&A**: Context-aware question answering system for both video and document content
- **Batch Processing**: Process multiple videos simultaneously
- **Real-time Status**: Live backend connection monitoring
- **Responsive Design**: Mobile-first design with Material-UI components
- **Dark/Light Theme**: Toggle between dark and light modes
- **Progress Tracking**: Real-time processing progress indicators

## 🛠️ Technology Stack

- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: Material-UI theming system
- **Icons**: Material-UI Icons
- **Build Tool**: Create React App
- **State Management**: React Hooks

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running on port 5000

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML template
│   ├── manifest.json       # PWA manifest
│   └── favicon.svg         # App icon
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.js       # Navigation bar
│   │   ├── Footer.js       # Footer component
│   │   └── ThemeProvider.js # Theme management
│   ├── pages/              # Page components
│   │   ├── HomePage.js     # Landing page
│   │   ├── SingleVideoProcessor.js # Single video processing
│   │   ├── MultipleVideoProcessor.js # Batch video processing
│   │   ├── PDFProcessor.js # PDF processing interface
│   │   ├── QAPage.js       # Q&A interface
│   │   └── AboutPage.js    # About page
│   ├── services/           # API service functions
│   │   └── api.js          # Backend API calls
│   ├── App.js              # Main app component
│   ├── index.js            # App entry point
│   └── index.css           # Global styles
└── package.json            # Dependencies and scripts
```

## 🎨 UI Components

### Core Pages
- **Home Page**: Platform overview with feature highlights
- **Video Processing**: YouTube video analysis interface with single and batch modes
- **Document AI**: PDF upload and processing interface
- **Q&A System**: Interactive question-answering interface
- **About**: Technology stack and platform information

### Key Features
- **Responsive Navigation**: Mobile-friendly navigation with drawer
- **Theme Toggle**: Switch between light and dark modes
- **Status Indicators**: Real-time backend connection status
- **Progress Tracking**: Visual progress indicators for processing
- **Error Handling**: User-friendly error messages and fallbacks

## 🔗 API Integration

The frontend communicates with the backend through RESTful API calls:

```javascript
// Example API usage
import { processVideo, uploadPDF, askQuestion } from './services/api';

// Process YouTube video
const result = await processVideo(videoUrl);

// Upload and process PDF
const pdfResult = await uploadPDF(file);

// Ask question about content
const answer = await askQuestion(question, context);
```

## 🚀 Deployment

### Development
```bash
npm start
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates optimized build in 'build' folder
```

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Smart-Summary-Q&A
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📱 Features Overview

### Video Processing
- YouTube URL input with validation
- Real-time processing status
- Transcript extraction and display
- AI-powered summarization
- Interactive Q&A on video content
- Batch processing for multiple videos

### Document Processing
- Drag-and-drop PDF upload
- File validation and size limits
- Text extraction and analysis
- Document summarization
- Q&A on document content

### User Experience
- Intuitive interface design
- Real-time feedback
- Error handling and validation
- Mobile-responsive layout
- Accessibility features

## 🔧 Configuration

### Backend Connection
The app automatically connects to the backend server and displays connection status in the navbar.

### Theme Customization
The app supports both light and dark themes with Material-UI theming system.

## 📚 Dependencies

### Main Dependencies
- React 18
- Material-UI (MUI)
- React Router DOM
- Axios
- Material-UI Icons

### Development Dependencies
- Create React App
- Web Vitals
- Testing Library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rishith Kumar Pachipulusu**
- GitHub: [@rishith2903](https://github.com/rishith2903)
- LinkedIn: [rishith-kumar-pachipulusu](https://linkedin.com/in/rishith-kumar-pachipulusu-13351a31b)
- Email: rishithpachipulusu@gmail.com

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact via email: rishithpachipulusu@gmail.com
- Visit the live application for documentation

## 🌟 Acknowledgments

- Material-UI for the excellent component library
- React team for the amazing framework
- Create React App for the development setup
