import React, { useEffect } from 'react';
import { Box, Typography, Alert, IconButton } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

const HarassmentDetector = ({ onHarassmentDetected }) => {
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  } = useSpeechRecognition(onHarassmentDetected);

  useEffect(() => {
    // Auto-start listening when component mounts
    startListening();
    return () => stopListening();
  }, [startListening, stopListening]);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton
          color={isListening ? 'error' : 'primary'}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? <MicOff /> : <Mic />}
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {isListening ? 'Monitoring for verbal harassment...' : 'Monitoring paused'}
        </Typography>
      </Box>

      {transcript && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Last heard: {transcript}
        </Typography>
      )}
    </Box>
  );
};

export default HarassmentDetector; 