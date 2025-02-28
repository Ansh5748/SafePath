import { useState, useEffect, useRef } from 'react';
import tensorflowService from '../services/ai/tensorflowService';

export const useThreatDetection = (videoRef) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [threats, setThreats] = useState([]);
  const [error, setError] = useState(null);
  
  const detectionHistory = useRef([]);
  const animationFrame = useRef(null);

  const startAnalysis = async () => {
    if (!videoRef.current || isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      await tensorflowService.initialize();
      analyzeFrame();
    } catch (err) {
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  const stopAnalysis = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    setIsAnalyzing(false);
    detectionHistory.current = [];
  };

  const analyzeFrame = async () => {
    if (!videoRef.current || !isAnalyzing) return;

    try {
      // Detect people in the current frame
      const detections = await tensorflowService.detectPeople(videoRef.current);
      
      // Update detection history
      detectionHistory.current.push(...detections);
      if (detectionHistory.current.length > 30) { // Keep last 30 frames
        detectionHistory.current = detectionHistory.current.slice(-30);
      }

      // Analyze for stalking behavior
      if (detectionHistory.current.length >= 5) {
        const analysis = tensorflowService.analyzeStalking(detectionHistory.current);
        
        if (analysis.isStalking) {
          setThreats(prev => [...prev, {
            type: 'stalking',
            confidence: analysis.confidence,
            timestamp: new Date(),
            detections: detections
          }]);
        }
      }

      // Continue analysis
      animationFrame.current = requestAnimationFrame(analyzeFrame);
    } catch (err) {
      setError(err.message);
      stopAnalysis();
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    isAnalyzing,
    threats,
    error,
    startAnalysis,
    stopAnalysis
  };
}; 