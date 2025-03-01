import React, { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import weatherService from '../../services/weather/weatherService';

const SafetyAlert = ({ location }) => {
  const [weatherAlert, setWeatherAlert] = useState(null);

  useEffect(() => {
    const checkWeather = async () => {
      if (location) {
        const weather = await weatherService.getCurrentWeather(
          location.lat,
          location.lng
        );
        
        if (weather?.isHazardous) {
          setWeatherAlert({
            type: 'warning',
            message: `Hazardous weather conditions: ${weather.conditions}`
          });
        }
      }
    };

    checkWeather();
  }, [location]);

  return weatherAlert ? (
    <Alert severity="warning">
      {weatherAlert.message}
    </Alert>
  ) : null;
};

export default SafetyAlert; 