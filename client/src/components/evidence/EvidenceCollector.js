import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  VideoCall,
  AudioFile,
  Image,
  Delete,
  CloudUpload
} from '@mui/icons-material';

const EvidenceCollector = ({ features, incidentId }) => {
  const [collecting, setCollecting] = useState(false);
  const [evidenceList, setEvidenceList] = useState([]);
  const fileInputRef = useRef();

  const handleStartCollection = (type) => {
    setCollecting(true);
    // Start media recording based on type
  };

  const handleStopCollection = async () => {
    setCollecting(false);
    // Stop media recording and save evidence
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const evidenceData = {
        type: file.type.startsWith('video/') ? 'video' : 
              file.type.startsWith('audio/') ? 'audio' : 'image',
        blob: file,
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      };

      await features.collectEvidence(incidentId, evidenceData);
      setEvidenceList(prev => [...prev, evidenceData]);
    } catch (err) {
      console.error('Error uploading evidence:', err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Evidence Collection
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<VideoCall />}
              onClick={() => handleStartCollection('video')}
              disabled={collecting}
            >
              Record Video
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AudioFile />}
              onClick={() => handleStartCollection('audio')}
              disabled={collecting}
            >
              Record Audio
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              disabled={collecting}
            >
              Upload File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*,video/*,audio/*"
              onChange={handleFileUpload}
            />
          </Grid>
        </Grid>

        {collecting && (
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleStopCollection}
            sx={{ mb: 2 }}
          >
            Stop Recording
          </Button>
        )}

        {features.loading ? (
          <CircularProgress />
        ) : (
          <List>
            {evidenceList.map((evidence, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {evidence.type === 'video' ? <VideoCall /> :
                   evidence.type === 'audio' ? <AudioFile /> : <Image />}
                </ListItemIcon>
                <ListItemText
                  primary={evidence.metadata.name}
                  secondary={`${evidence.type} • ${(evidence.metadata.size / 1024 / 1024).toFixed(2)} MB`}
                />
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default EvidenceCollector; 