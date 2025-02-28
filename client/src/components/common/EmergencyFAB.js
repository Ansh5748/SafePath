import React from 'react';
import { Fab, Zoom, useTheme } from '@mui/material';
import { Warning } from '@mui/icons-material';

const EmergencyFAB = ({ onClick }) => {
  const theme = useTheme();

  return (
    <Zoom in={true}>
      <Fab
        color="error"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 64,
          height: 64,
          boxShadow: theme.shadows[8],
          '&:hover': {
            backgroundColor: theme.palette.error.dark
          }
        }}
        onClick={onClick}
      >
        <Warning sx={{ fontSize: 32 }} />
      </Fab>
    </Zoom>
  );
};

export default EmergencyFAB; 