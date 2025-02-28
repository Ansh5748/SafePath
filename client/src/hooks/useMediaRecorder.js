import { useState, useEffect, useRef } from 'react';
import { storage } from '../config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useMediaRecorder = (type = 'video') => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaURL, setMediaURL] = useState(null);
  const [error, setError] = useState(null);
  
  const mediaRecorder = useRef(null);
  const mediaChunks = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const constraints = {
        video: type === 'video',
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      mediaRecorder.current = new MediaRecorder(stream);
      mediaChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const mediaBlob = new Blob(mediaChunks.current, {
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        });
        const url = URL.createObjectURL(mediaBlob);
        setMediaURL(url);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      setError(err.message);
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const uploadMedia = async (incidentId) => {
    if (!mediaURL) return null;

    try {
      const timestamp = new Date().toISOString();
      const path = `evidence/${incidentId}/${type}_${timestamp}.webm`;
      const storageRef = ref(storage, path);
      
      const response = await fetch(mediaURL);
      const blob = await response.blob();
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      return {
        type,
        url: downloadURL,
        timestamp: new Date(),
        metadata: {
          duration: mediaRecorder.current?.recordingDuration,
          size: blob.size
        }
      };
    } catch (err) {
      setError(err.message);
      console.error('Error uploading media:', err);
      return null;
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    mediaURL,
    error,
    startRecording,
    stopRecording,
    uploadMedia
  };
}; 