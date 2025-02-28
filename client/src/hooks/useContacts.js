import { useState, useEffect, useCallback } from 'react';
import contactsService from '../services/contacts/contactsService';

export const useContacts = (userId) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedContacts = await contactsService.getContacts(userId);
      setContacts(fetchedContacts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addContact = useCallback(async (contactData) => {
    try {
      await contactsService.addContact(userId, contactData);
      await fetchContacts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, fetchContacts]);

  const removeContact = useCallback(async (contactId) => {
    try {
      await contactsService.removeContact(userId, contactId);
      await fetchContacts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, fetchContacts]);

  const updateContact = useCallback(async (contactId, updates) => {
    try {
      await contactsService.updateContact(userId, contactId, updates);
      await fetchContacts();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, fetchContacts]);

  useEffect(() => {
    if (userId) {
      fetchContacts();
    }
  }, [userId, fetchContacts]);

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