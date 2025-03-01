import { useState, useEffect, useCallback } from 'react';
import contactsService from '../services/contacts/contactsService';
import { useAuth } from '../contexts/AuthContext';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchContacts = useCallback(async () => {
    if (!currentUser?.uid) {
      setContacts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedContacts = await contactsService.getContacts(currentUser.uid);
      setContacts(fetchedContacts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const addContact = useCallback(async (contactData) => {
    if (!currentUser?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      await contactsService.addContact(currentUser.uid, contactData);
      await fetchContacts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentUser, fetchContacts]);

  const removeContact = useCallback(async (contactId) => {
    if (!currentUser?.uid) throw new Error('User not authenticated');
    await contactsService.removeContact(currentUser.uid, contactId);
    await fetchContacts();
  }, [currentUser, fetchContacts]);

  const updateContact = useCallback(async (contactId, updates) => {
    if (!currentUser?.uid) throw new Error('User not authenticated');
    await contactsService.updateContact(currentUser.uid, contactId, updates);
    await fetchContacts();
  }, [currentUser, fetchContacts]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    addContact,
    removeContact,
    updateContact,
    refreshContacts: fetchContacts
  };
}; 