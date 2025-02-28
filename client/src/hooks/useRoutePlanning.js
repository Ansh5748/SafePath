import { useState, useCallback } from 'react';
import routePlanningService from '../services/maps/routePlanningService';

export const useRoutePlanning = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const planRoute = useCallback(async (origin, destination) => {
    setLoading(true);
    setError(null);
    
    try {
      const safeRoutes = await routePlanningService.getSafeRoute(origin, destination);
      setRoutes(safeRoutes);
    } catch (err) {
      setError(err.message);
      console.error('Error planning route:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRoutes = useCallback(() => {
    setRoutes([]);
    setError(null);
  }, []);

  return {
    routes,
    loading,
    error,
    planRoute,
    clearRoutes
  };
}; 