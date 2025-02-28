import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { Card, CardContent, Typography } from '@mui/material';
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
        </LoadScript>
      </CardContent>
    </Card>
  );
};

export default SafetyMap; 