import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useLocation } from '../../hooks/useLocation';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 20.5937, // Default to India's center
  lng: 78.9629
};

const SafetyMap = () => {
  const { currentLocation } = useLocation();
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    }
  }, [currentLocation]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Safety Map
        </Typography>
        
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={15}
          >
            {currentLocation && (
              <Marker
                position={currentLocation}
              />
            )}
          </GoogleMap>
        </LoadScript>

        {!currentLocation && (
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <CircularProgress />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SafetyMap; 