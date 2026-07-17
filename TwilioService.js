// TwilioService.js - Service SMS avec Twilio
// Envoie des SMS automatiques aux clients et livreurs

class TwilioService {
  constructor() {
    // Les variables d'environnement doivent être définies
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // Import dynamique de Twilio (côté backend)
    this.isBackend = typeof window === 'undefined';
    
    if (this.isBackend) {
      try {
        const twilio = require('twilio');
        this.client = twilio(this.accountSid, this.authToken);
      } catch (error) {
        console.warn('Twilio non configuré - SMS simulés uniquement');
        this.client = null;
      }
    }
  }

  // Notification : Colis créé
  async notifyParcelCreated(phoneNumber, parcelId, destination) {
    const message = `🚚 Livraison Cotonou: Votre colis #${parcelId} a été créé. Destination: ${destination}. Suivi: https://frontend-livraison-cotonou.vercel.app/track/${parcelId}`;
    return this.sendSMS(phoneNumber, message);
  }

  // Notification : En route
  async notifyParcelInTransit(phoneNumber, parcelId, driverName, driverPhone) {
    const message = `🚚 Votre colis #${parcelId} est en route! Livreur: ${driverName} (${driverPhone}). Suivi: https://frontend-livraison-cotonou.vercel.app/track/${parcelId}`;
    return this.sendSMS(phoneNumber, message);
  }

  // Notification : Arrivée imminente
  async notifyParcelArriving(phoneNumber, parcelId) {
    const message = `✅ Colis #${parcelId}: Le livreur arrive dans 10 minutes! Préparez-vous à recevoir.`;
    return this.sendSMS(phoneNumber, message);
  }

  // Notification : Livré
  async notifyParcelDelivered(phoneNumber, parcelId) {
    const message = `✅ Livraison Cotonou: Colis #${parcelId} livré avec succès! Merci.`;
    return this.sendSMS(phoneNumber, message);
  }

  // Notification livreur : Nouveau colis
  async notifyDriverNewParcel(phoneNumber, parcelId, destination, price) {
    const message = `📦 Nouveau colis! #${parcelId} → ${destination} | Tarif: ${price} XOF`;
    return this.sendSMS(phoneNumber, message);
  }

  // Notification livreur : Paiement
  async notifyDriverPayment(phoneNumber, amount, parcelId) {
    const message = `💰 Paiement reçu: ${amount} XOF pour colis #${parcelId}`;
    return this.sendSMS(phoneNumber, message);
  }

  // Envoyer SMS via Twilio
  async sendSMS(phoneNumber, message) {
    try {
      // Si Twilio n'est pas configuré, simuler l'envoi
      if (!this.client) {
        console.log(`[SMS SIMULÉ] À: ${phoneNumber}`);
        console.log(`[SMS SIMULÉ] Message: ${message}`);
        return { success: true, simulated: true, message: 'SMS simulé' };
      }

      // Envoyer via Twilio
      const result = await this.client.messages.create({
        from: this.twilioPhoneNumber,
        to: phoneNumber,
        body: message
      });

      console.log(`✅ SMS envoyé à ${phoneNumber}: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error(`❌ Erreur SMS à ${phoneNumber}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // Envoyer Email via SendGrid (optionnel)
  async sendEmail(email, subject, message) {
    try {
      // Exemple avec fetch (pour backend)
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email }],
            subject
          }],
          from: { email: 'noreply@livraison-cotonou.com' },
          content: [{
            type: 'text/plain',
            value: message
          }]
        })
      });

      if (response.ok) {
        console.log(`✅ Email envoyé à ${email}`);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Erreur Email:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export pour Node.js backend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = new TwilioService();
}

// Export pour frontend
export default new TwilioService();
