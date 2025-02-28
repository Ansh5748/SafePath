import { useState, useEffect, useCallback } from 'react';
import speechRecognitionService from '../services/ai/speechRecognitionService';

export const useSpeechRecognition = (onHarassmentDetected) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');

  const handleSpeechResult = useCallback((analysis) => {
    setTranscript(analysis.text);
    
    if (analysis.isHarassment && onHarassmentDetected) {
      onHarassmentDetected({
        type: 'verbal_harassment',
        confidence: analysis.confidence,
        evidence: {
          text: analysis.text,
          threats: analysis.threats,
          timestamp: new Date()
        }
      });
    }
  }, [onHarassmentDetected]);

  const startListening = useCallback(() => {
    try {
      speechRecognitionService.start(
        handleSpeechResult,
        (error) => setError(error)
      );
      setIsListening(true);
    } catch (err) {
      setError(err.message);
    }
  }, [handleSpeechResult]);

  const stopListening = useCallback(() => {
    speechRecognitionService.stop();
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
}; 