import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import './styles/global.css';
import { validateOpenCageKey, validateWeatherKey } from './utils/apiKeyValidator';

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
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 