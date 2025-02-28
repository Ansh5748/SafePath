import React, { useRef, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useThreatDetection } from '../../hooks/useThreatDetection';

const ThreatDetection = ({ onThreatDetected }) => {
  const videoRef = useRef(null);
  const {
    isAnalyzing,
    threats,
    error,
    startAnalysis,
    stopAnalysis
  } = useThreatDetection(videoRef);

  useEffect(() => {
    if (threats.length > 0) {
      const latestThreat = threats[threats.length - 1];
      onThreatDetected?.(latestThreat);
    }
  }, [threats, onThreatDetected]);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await startAnalysis();
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    setupCamera();

    return () => {
      stopAnalysis();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          maxHeight: '300px',
          objectFit: 'cover',
          display: 'none' // Hidden video for analysis
        }}
      />

      {isAnalyzing && (
        <Typography variant="body2" color="text.secondary">
          Analyzing surroundings for potential threats...
        </Typography>
      )}

      {threats.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="error">
            Potential threats detected:
          </Typography>
          {threats.map((threat, index) => (
            <Alert key={index} severity="warning" sx={{ mt: 1 }}>
              {`${threat.type} detected (${Math.round(threat.confidence * 100)}% confidence)`}
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ThreatDetection; 