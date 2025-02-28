import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

const UserSettings = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    autoRecordEnabled: false,
    geofencingRadius: 100,
    notificationsEnabled: true,
    emergencyServices: {
      police: true,
      medical: true
    },
    privacySettings: {
      shareLocation: true,
      shareStatus: true
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setSettings(userDoc.data().settings || settings);
        }
      } catch (err) {
        setError('Failed to load settings');
      }
    };

    fetchSettings();
  }, [currentUser]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        settings
      });
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Settings
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Safety Features
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoRecordEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  autoRecordEnabled: e.target.checked
                })}
              />
            }
            label="Auto-record in dangerous situations"
          />
          <TextField
            fullWidth
            label="Geofencing Radius (meters)"
            type="number"
            value={settings.geofencingRadius}
            onChange={(e) => setSettings({
              ...settings,
              geofencingRadius: Number(e.target.value)
            })}
            margin="normal"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Notifications
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notificationsEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  notificationsEnabled: e.target.checked
                })}
              />
            }
            label="Enable notifications"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Emergency Services
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emergencyServices.police}
                onChange={(e) => setSettings({
                  ...settings,
                  emergencyServices: {
                    ...settings.emergencyServices,
                    police: e.target.checked
                  }
                })}
              />
            }
            label="Police"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.emergencyServices.medical}
                onChange={(e) => setSettings({
                  ...settings,
                  emergencyServices: {
                    ...settings.emergencyServices,
                    medical: e.target.checked
                  }
                })}
              />
            }
            label="Medical Services"
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSave}
          fullWidth
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserSettings; 