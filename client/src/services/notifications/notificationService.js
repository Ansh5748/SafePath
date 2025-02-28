import { db } from '../../config/firebase.config';
import { doc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

class NotificationService {
  async sendEmergencyAlert(userId, incidentData) {
    try {
      // Get user's emergency contacts
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDocs(userRef);
      const contacts = userDoc.data().emergencyContacts;

      // Create notification for each contact based on their preferences
      const notifications = contacts
        .filter(contact => contact.notificationPreference !== 'none')
        .filter(contact => 
          contact.notificationPreference === 'all' || 
          incidentData.type === 'emergency'
        )
        .map(contact => ({
          recipientPhone: contact.phone,
          recipientName: contact.name,
          userId,
          incidentId: incidentData.id,
          type: incidentData.type,
          message: this.createAlertMessage(incidentData, contact),
          timestamp: new Date(),
          status: 'pending'
        }));

      // Store notifications in Firestore
      const notificationsRef = collection(db, 'notifications');
      await Promise.all(
        notifications.map(notification => 
          addDoc(notificationsRef, notification)
        )
      );

      // In a real app, you'd integrate with SMS/calling API here
      console.log('Emergency notifications sent:', notifications);
      return notifications;
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  private createAlertMessage(incident, contact) {
    const userName = incident.userName || 'Your contact';
    const location = incident.location?.address || 'their current location';
    
    return `EMERGENCY: ${userName} needs help at ${location}. Type: ${incident.type}`;
  }
}

export default new NotificationService(); 