import { useState, useEffect, useCallback } from 'react';
import featureIntegrationService from '../services/integration/featureIntegrationService';

export const useFeatures = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFeatures, setActiveFeatures] = useState({
    geofencing: false,
    tracking: false,
    threatDetection: false,
    emergencyResponse: false
  });

  // Geofencing
  const setupGeofence = useCallback(async (location, radius) => {
    try {
      setLoading(true);
      await featureIntegrationService.setupGeofence(userId, location, radius);
      setActiveFeatures(prev => ({ ...prev, geofencing: true }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Location tracking
  const updateLocation = useCallback(async (location) => {
    try {
      await featureIntegrationService.updateUserLocation(userId, location);
    } catch (err) {
      console.error('Error updating location:', err);
    }
  }, [userId]);

  // Route planning
  const planSafeRoute = useCallback(async (origin, destination) => {
    try {
      setLoading(true);
      return await featureIntegrationService.calculateSafeRoute(origin, destination);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Threat detection
  const analyzeThreat = useCallback(async (data) => {
    try {
      setLoading(true);
      return await featureIntegrationService.analyzeThreat(data);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Emergency response
  const triggerEmergencyResponse = useCallback(async (incidentData) => {
    try {
      setLoading(true);
      const incidentRef = await featureIntegrationService.createIncident(incidentData);
      await featureIntegrationService.coordinateEmergencyResponse(incidentRef.id, incidentData.responders);
      return incidentRef.id;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Community alerts
  const createAlert = useCallback(async (alertData) => {
    try {
      setLoading(true);
      return await featureIntegrationService.createCommunityAlert(alertData);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Evidence collection
  const collectEvidence = useCallback(async (incidentId, evidenceData) => {
    try {
      setLoading(true);
      await featureIntegrationService.collectEvidence(incidentId, evidenceData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    activeFeatures,
    setupGeofence,
    updateLocation,
    planSafeRoute,
    analyzeThreat,
    triggerEmergencyResponse,
    createAlert,
    collectEvidence
  };
}; 