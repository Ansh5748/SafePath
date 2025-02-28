import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper
} from '@mui/material';

const AlertsList = () => {
  const alerts = [
    { id: 1, type: 'Emergency', message: 'SOS activated in your area', time: '2 min ago' },
    { id: 2, type: 'Warning', message: 'Suspicious activity reported', time: '5 min ago' }
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Recent Alerts
      </Typography>
      <List>
        {alerts.map((alert) => (
          <ListItem key={alert.id}>
            <ListItemText
              primary={alert.type}
              secondary={`${alert.message} - ${alert.time}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default AlertsList; 