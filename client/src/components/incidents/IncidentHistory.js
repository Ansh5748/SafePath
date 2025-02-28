import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Paper,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Error,
  CheckCircle,
  ExpandMore,
  VideoFile,
  AudioFile,
  Image,
  LocationOn
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useFeatures } from '../../hooks/useFeatures';

const IncidentHistory = () => {
  const [expanded, setExpanded] = useState({});
  const { loading, error, incidents } = useFeatures();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'error';
      case 'resolved': return 'success';
      case 'false_alarm': return 'warning';
      default: return 'default';
    }
  };

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'stalking': return <Error color="error" />;
      case 'harassment': return <Error color="warning" />;
      case 'unsafe_area': return <LocationOn color="info" />;
      default: return <Error />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Incident History
        </Typography>

        <Timeline>
          {incidents?.map((incident) => (
            <TimelineItem key={incident.incidentId}>
              <TimelineOppositeContent color="text.secondary">
                {format(incident.timestamp.toDate(), 'PPp')}
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineDot color={getStatusColor(incident.status)}>
                  {getIncidentIcon(incident.type)}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>

              <TimelineContent>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="subtitle1">
                    {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                    <Chip
                      size="small"
                      label={incident.status}
                      color={getStatusColor(incident.status)}
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <LocationOn fontSize="small" /> {incident.location.address}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => setExpanded({ ...expanded, [incident.incidentId]: !expanded[incident.incidentId] })}
                    sx={{ mt: 1 }}
                  >
                    <ExpandMore />
                  </IconButton>

                  <Collapse in={expanded[incident.incidentId]}>
                    <List dense>
                      {incident.evidence?.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {item.type === 'video' ? <VideoFile /> :
                             item.type === 'audio' ? <AudioFile /> : <Image />}
                          </ListItemIcon>
                          <ListItemText
                            primary={`${item.type} Evidence`}
                            secondary={format(item.timestamp.toDate(), 'Pp')}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default IncidentHistory; 