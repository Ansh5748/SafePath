import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn
} from '@mui/icons-material';
import { GoogleMap, Circle } from '@react-google-maps/api';
import { useLocation } from '../../hooks/useLocation';

const GeofenceManager = ({ features }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { currentLocation } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    radius: 100, // meters
    isActive: true
  });

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) return;

    try {
      await features.setupGeofence(selectedLocation, formData.radius);
      handleCloseDialog();
    } catch (err) {
      console.error('Error setting up geofence:', err);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLocation(null);
    setFormData({
      name: '',
      radius: 100,
      isActive: true
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Safe Zones
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 2 }}
        >
          Add Safe Zone
        </Button>

        {features.loading ? (
          <CircularProgress />
        ) : features.error ? (
          <Typography color="error">{features.error}</Typography>
        ) : (
          <List>
            {features.activeFeatures.geofencing && (
              <ListItem>
                <ListItemText
                  primary="Home Zone"
                  secondary="100m radius • Active"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={true}
                    onChange={() => {}}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </List>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Add Safe Zone</DialogTitle>
          <DialogContent>
            <GoogleMap
              center={currentLocation || { lat: 20.5937, lng: 78.9629 }}
              zoom={15}
              onClick={handleMapClick}
              mapContainerStyle={{ height: '300px', marginBottom: '20px' }}
            >
              {selectedLocation && (
                <Circle
                  center={selectedLocation}
                  radius={formData.radius}
                  options={{
                    fillColor: '#4CAF50',
                    fillOpacity: 0.3,
                    strokeColor: '#4CAF50',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              )}
            </GoogleMap>

            <TextField
              fullWidth
              label="Zone Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Radius (meters)"
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={!selectedLocation}
            >
              Create Zone
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default GeofenceManager; 