import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  TextField,
  Rating,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import {
  Warning,
  LocationOn,
  Report,
  ThumbUp,
  Comment
} from '@mui/icons-material';
import { useFeatures } from '../../hooks/useFeatures';
import { useLocation } from '../../hooks/useLocation';

const CommunityReports = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { currentLocation } = useLocation();
  const { createAlert, loading } = useFeatures();
  const [reportData, setReportData] = useState({
    type: 'unsafe_area',
    description: '',
    safetyRating: 3,
    anonymous: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAlert({
        ...reportData,
        location: currentLocation,
        timestamp: new Date()
      });
      setOpenDialog(false);
    } catch (err) {
      console.error('Error creating report:', err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs>
            <Typography variant="h6">Community Safety Reports</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Report />}
              onClick={() => setOpenDialog(true)}
            >
              Report Incident
            </Button>
          </Grid>
        </Grid>

        <List>
          {/* Sample reports - will be replaced with real data */}
          <ListItem divider>
            <ListItemText
              primary={
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Warning color="warning" />
                  </Grid>
                  <Grid item>Suspicious Activity</Grid>
                  <Grid item>
                    <Chip size="small" label="Verified" color="success" />
                  </Grid>
                </Grid>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    <LocationOn fontSize="small" /> Near Central Park
                  </Typography>
                  <Typography variant="body2">
                    Group of suspicious individuals loitering in the area
                  </Typography>
                </>
              }
            />
            <IconButton>
              <ThumbUp />
            </IconButton>
            <IconButton>
              <Comment />
            </IconButton>
          </ListItem>
        </List>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report Safety Concern
              </Typography>

              <TextField
                select
                fullWidth
                label="Type of Incident"
                value={reportData.type}
                onChange={(e) => setReportData({ ...reportData, type: e.target.value })}
                margin="normal"
                SelectProps={{
                  native: true
                }}
              >
                <option value="unsafe_area">Unsafe Area</option>
                <option value="suspicious_activity">Suspicious Activity</option>
                <option value="harassment">Harassment</option>
                <option value="other">Other</option>
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                margin="normal"
              />

              <Typography component="legend" sx={{ mt: 2 }}>
                Safety Rating
              </Typography>
              <Rating
                value={reportData.safetyRating}
                onChange={(e, newValue) => setReportData({ ...reportData, safetyRating: newValue })}
              />

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    Submit Report
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CommunityReports; 