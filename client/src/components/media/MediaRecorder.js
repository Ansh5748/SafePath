import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Typography,
  IconButton
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  Stop
} from '@mui/icons-material';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';

const MediaRecorder = ({ type, onRecordingComplete, incidentId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const {
    isRecording,
    mediaURL,
    error,
    startRecording,
    stopRecording,
    uploadMedia
  } = useMediaRecorder(type);

  const handleStopRecording = async () => {
    stopRecording();
    setIsUploading(true);
    
    const mediaData = await uploadMedia(incidentId);
    if (mediaData && onRecordingComplete) {
      onRecordingComplete(mediaData);
    }
    
    setIsUploading(false);
  };

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {!isRecording && !mediaURL && (
        <IconButton
          color="primary"
          onClick={startRecording}
          size="large"
        >
          {type === 'video' ? <Videocam /> : <Mic />}
        </IconButton>
      )}

      {isRecording && (
        <>
          <IconButton
            color="error"
            onClick={handleStopRecording}
            size="large"
          >
            <Stop />
          </IconButton>
          <Typography color="error" variant="caption" display="block">
            Recording...
          </Typography>
        </>
      )}

      {isUploading && (
        <CircularProgress size={24} sx={{ ml: 2 }} />
      )}

      {mediaURL && !isRecording && (
        <Box sx={{ mt: 2 }}>
          {type === 'video' ? (
            <video src={mediaURL} controls width="100%" />
          ) : (
            <audio src={mediaURL} controls />
          )}
          <Button
            variant="contained"
            onClick={startRecording}
            sx={{ mt: 1 }}
          >
            Record Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MediaRecorder; 