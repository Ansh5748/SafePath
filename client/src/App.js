import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/dashboard/Dashboard';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import './styles/global.css';
import { validateOpenCageKey, validateWeatherKey } from './utils/apiKeyValidator';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  useEffect(() => {
    const validateKeys = async () => {
      const isOpenCageValid = await validateOpenCageKey();
      const isWeatherValid = await validateWeatherKey();
      
      if (!isOpenCageValid) {
        console.error('OpenCage API key validation failed');
      }
      if (!isWeatherValid) {
        console.error('OpenWeather API key validation failed');
      }
    };
    
    validateKeys();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 