import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { Card, CardContent, Typography, Alert, Box, CircularProgress } from '@mui/material';
import { useLocation } from '../../hooks/useLocation';
import { useSafetyScores } from '../../hooks/useSafetyScores';

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 20.5937, // Default to India's center
  lng: 78.9629
};

const SafetyMap = ({ user }) => {
  const { currentLocation } = useLocation();
  const { safetyScores, loading } = useSafetyScores();
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    }
  }, [currentLocation]);

  const renderSafetyZones = () => {
    return safetyScores.map((zone) => (
      <Circle
        key={zone.areaId}
        center={{
          lat: zone.coordinates.lat,
          lng: zone.coordinates.lng
        }}
        radius={zone.coordinates.radius}
        options={{
          fillColor: getColorForSafetyScore(zone.safetyScore),
          fillOpacity: 0.3,
          strokeColor: getColorForSafetyScore(zone.safetyScore),
          strokeOpacity: 0.8,
          strokeWeight: 2,
        }}
      />
    ));
  };

  const getColorForSafetyScore = (score) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  // Add error handling for API key issues
  const handleMapError = (error) => {
    console.error('Google Maps Error:', error);
    // Show fallback UI or error message
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Safety Map
        </Typography>
        
        {loadError ? (
          <Alert severity="error">
            Error loading map: {loadError}
          </Alert>
        ) : (
          <LoadScript 
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            onLoad={() => setIsLoaded(true)}
            onError={(error) => setLoadError(error.message)}
          >
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={15}
                onLoad={map => {
                  console.log("Map loaded successfully");
                }}
                onError={handleMapError}
              >
                {/* User's current location */}
                {currentLocation && (
                  <Marker
                    position={currentLocation}
                    icon={{
                      url: '/user-marker.png',
                      scaledSize: { width: 40, height: 40 }
                    }}
                  />
                )}

                {/* Safety zones */}
                {!loading && renderSafetyZones()}
              </GoogleMap>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading map...</Typography>
              </Box>
            )}
          </LoadScript>
        )}
      </CardContent>
    </Card>
  );
};

export default SafetyMap; 