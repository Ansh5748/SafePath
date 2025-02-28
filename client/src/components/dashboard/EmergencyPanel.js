import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

const EmergencyPanel = ({ user }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleSOSActivation = async () => {
    setConfirmDialog(false);
    setIsSOSActive(true);
    // Trigger emergency response
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Emergency Assistance
      </Typography>

      <Button
        fullWidth
        size="large"
        variant="contained"
        color={isSOSActive ? "error" : "primary"}
        onClick={() => setConfirmDialog(true)}
        sx={{ mt: 2, py: 2 }}
      >
        {isSOSActive ? "SOS ACTIVE" : "ACTIVATE SOS"}
      </Button>

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm SOS Activation</DialogTitle>
        <DialogContent>
          Are you sure you want to activate emergency response?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleSOSActivation} color="error" variant="contained">
            Activate SOS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyPanel; 