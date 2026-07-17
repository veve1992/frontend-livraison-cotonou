// Service de notifications SMS et Email
// À intégrer avec Twilio pour SMS et SendGrid pour Email

class NotificationService {
  constructor() {
    this.apiUrl = 'https://saas-livraison-cotonou.vercel.app';
  }

  // Envoyer notification de création de colis
  async notifyParcelCreated(phoneNumber, parcelId, destination) {
    const message = `🚚 Livraison Cotonou: Votre colis #${parcelId} a été créé. Destination: ${destination}. Suivi: livraison-cotonou.vercel.app/track/${parcelId}`;
    
    return this.sendSMS(phoneNumber, message);
  }

  // Envoyer notification de départ en livraison
  async notifyParcelInTransit(phoneNumber, parcelId, driverName, driverPhone) {
    const message = `🚚 Votre colis #${parcelId} est en route ! Livreur: ${driverName} (${driverPhone}). Suivi: livraison-cotonou.vercel.app/track/${parcelId}`;
    
    return this.sendSMS(phoneNumber, message);
  }

  // Envoyer notification d'arrivée
  async notifyParcelArriving(phoneNumber, parcelId) {
    const message = `✅ Colis #${parcelId}: Le livreur arrive dans 10 minutes ! Préparez-vous à recevoir.`;
    
    return this.sendSMS(phoneNumber, message);
  }

  // Envoyer notification de livraison confirmée
  async notifyParcelDelivered(phoneNumber, parcelId, signature) {
    const message = `✅ Livraison Cotonou: Colis #${parcelId} livré avec succès ! Merci.`;
    
    return this.sendSMS(phoneNumber, message);
  }

  // Envoyer SMS (Twilio)
  async sendSMS(phoneNumber, message) {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          message
        })
      });

      if (response.ok) {
        console.log('✅ SMS envoyé');
        return true;
      } else {
        console.error('❌ Erreur SMS');
        return false;
      }
    } catch (error) {
      console.error('Erreur SMS:', error);
      return false;
    }
  }

  // Envoyer Email (SendGrid)
  async sendEmail(email, subject, message) {
    try {
      const response = await fetch(`${this.apiUrl}/notifications/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subject,
          message
        })
      });

      if (response.ok) {
        console.log('✅ Email envoyé');
        return true;
      } else {
        console.error('❌ Erreur Email');
        return false;
      }
    } catch (error) {
      console.error('Erreur Email:', error);
      return false;
    }
  }

  // Notification pour le livreur
  async notifyDriverNewParcel(phoneNumber, parcelId, destination, price) {
    const message = `📦 Nouveau colis! #${parcelId} → ${destination} | Tarif: ${price} XOF`;
    
    return this.sendSMS(phoneNumber, message);
  }

  // Notification de paiement
  async notifyPayment(phoneNumber, amount, parcelId) {
    const message = `💰 Paiement reçu: ${amount} XOF pour colis #${parcelId}`;
    
    return this.sendSMS(phoneNumber, message);
  }
}

export default new NotificationService();
