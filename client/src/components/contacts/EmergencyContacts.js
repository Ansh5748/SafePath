import React, { useState } from 'react';
import {
  Box,
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
  CircularProgress,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useContacts } from '../../hooks/useContacts';

const EmergencyContacts = ({ user }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: '',
    notificationPreference: 'all'
  });

  const {
    contacts,
    loading,
    error,
    addContact,
    removeContact,
    updateContact
  } = useContacts(user?.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await updateContact(editingContact.id, formData);
      } else {
        await addContact(formData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  };

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData(contact);
    } else {
      setEditingContact(null);
      setFormData({
        name: '',
        phone: '',
        relation: '',
        notificationPreference: 'all'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      relation: '',
      notificationPreference: 'all'
    });
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to remove this contact?')) {
      try {
        await removeContact(contactId);
      } catch (err) {
        console.error('Error removing contact:', err);
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Emergency Contacts</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Contact
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List>
            {contacts.map((contact) => (
              <ListItem key={contact.id} divider>
                <ListItemText
                  primary={contact.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        {contact.relation} • {contact.phone}
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption" color="textSecondary">
                        Notifications: {contact.notificationPreference}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenDialog(contact)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                margin="normal"
                required
                InputProps={{
                  startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                }}
              />
              <TextField
                fullWidth
                label="Relation"
                value={formData.relation}
                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                select
                fullWidth
                label="Notification Preference"
                value={formData.notificationPreference}
                onChange={(e) => setFormData({ ...formData, notificationPreference: e.target.value })}
                margin="normal"
              >
                <MenuItem value="all">All Alerts</MenuItem>
                <MenuItem value="emergency">Emergency Only</MenuItem>
                <MenuItem value="none">No Notifications</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingContact ? 'Save Changes' : 'Add Contact'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts; 