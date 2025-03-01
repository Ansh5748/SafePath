import React from 'react';
import { Grid, Container, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../common/Navbar';
import EmergencyPanel from './EmergencyPanel';
import SafetyMap from '../maps/SafetyMap';
import AlertsList from '../alerts/AlertsList';
import EmergencyContacts from '../contacts/EmergencyContacts';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Emergency Button */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <EmergencyPanel />
            </Paper>
          </Grid>

          {/* Map */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <SafetyMap />
            </Paper>
          </Grid>

          {/* Alerts */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <AlertsList />
            </Paper>
          </Grid>

          {/* Emergency Contacts */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <EmergencyContacts />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard; 