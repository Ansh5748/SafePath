import { db } from '../../config/firebase.config';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  getDoc 
} from 'firebase/firestore';

class ContactsService {
  async addContact(userId, contactData) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const userRef = doc(db, 'users', userId);
      
      // Verify user exists
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      await updateDoc(userRef, {
        emergencyContacts: arrayUnion({
          ...contactData,
          id: Date.now().toString(),
          addedAt: new Date()
        })
      });

      return true;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw new Error(error.message || 'Failed to add contact');
    }
  }

  async removeContact(userId, contactId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const contact = userDoc.data().emergencyContacts.find(c => c.id === contactId);
      
      if (contact) {
        await updateDoc(userRef, {
          emergencyContacts: arrayRemove(contact)
        });
      }
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  }

  async updateContact(userId, contactId, updates) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const contacts = userDoc.data().emergencyContacts;
      const updatedContacts = contacts.map(contact => 
        contact.id === contactId ? { ...contact, ...updates } : contact
      );
      
      await updateDoc(userRef, {
        emergencyContacts: updatedContacts
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async getContacts(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      return userDoc.data()?.emergencyContacts || [];
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw error;
    }
  }
}

export default new ContactsService(); 