import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import { useRoutePlanning } from '../../hooks/useRoutePlanning';
import { useLocation } from '../../hooks/useLocation';
import { DirectionsWalk, Security } from '@mui/icons-material';

const SafeRoutePlanner = () => {
  const [destination, setDestination] = useState('');
  const { currentLocation } = useLocation();
  const {
    routes,
    loading,
    error,
    planRoute,
    clearRoutes
  } = useRoutePlanning();

  const handlePlanRoute = async () => {
    if (!currentLocation || !destination) return;
    
    await planRoute(currentLocation, destination);
  };

  const getSafetyColor = (safetyLevel) => {
    switch (safetyLevel) {
      case 'very_safe': return 'success';
      case 'safe': return 'info';
      case 'moderate': return 'warning';
      case 'unsafe': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Safe Route Planner
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            margin="normal"
            placeholder="Enter destination address"
          />
          <Button
            variant="contained"
            onClick={handlePlanRoute}
            disabled={loading || !destination}
            startIcon={<DirectionsWalk />}
            sx={{ mt: 1 }}
          >
            Plan Safe Route
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {routes.length > 0 && (
          <List>
            {routes.map((route, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        Route {index + 1}
                      </Typography>
                      <Chip
                        icon={<Security />}
                        label={`${Math.round(route.safetyScore)}% Safe`}
                        color={getSafetyColor(route.safetyLevel)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={`${route.legs[0].duration.text} • ${route.legs[0].distance.text}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default SafeRoutePlanner; 