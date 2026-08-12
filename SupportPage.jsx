import React from 'react';

export default function SupportPage() {
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666'
    },
    card: {
      background: '#f9f9f9',
      padding: '30px',
      borderRadius: '10px',
      marginBottom: '30px',
      border: '1px solid #ddd'
    },
    contactMethod: {
      marginBottom: '25px',
      paddingBottom: '25px',
      borderBottom: '1px solid #eee'
    },
    contactMethodLast: {
      marginBottom: '25px',
      paddingBottom: '0px',
      borderBottom: 'none'
    },
    icon: {
      fontSize: '24px',
      marginRight: '10px'
    },
    label: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#333',
      marginBottom: '8px'
    },
    value: {
      fontSize: '16px',
      color: '#0066cc',
      textDecoration: 'none'
    },
    button: {
      display: 'inline-block',
      padding: '10px 20px',
      background: '#0066cc',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '5px',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📞 SUPPORT DELIVERHUB</h1>
        <p style={styles.subtitle}>Nous sommes là pour vous aider</p>
      </div>

      <div style={styles.card}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#333' }}>
          Contactez-nous
        </h2>

        <div style={styles.contactMethod}>
          <div style={styles.label}>
            <span style={styles.icon}>📧</span>
            EMAIL
          </div>
          <a 
            href="mailto:bienhagla@gmail.com" 
            style={styles.value}
          >
            bienhagla@gmail.com
          </a>
          <a 
            href="mailto:bienhagla@gmail.com" 
            style={styles.button}
          >
            Envoyer un email
          </a>
        </div>

        <div style={styles.contactMethod}>
          <div style={styles.label}>
            <span style={styles.icon}>💬</span>
            WHATSAPP
          </div>
          <a 
            href="https://wa.me/22995904678" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.value}
          >
            +229 95 90 46 78
          </a>
          <a 
            href="https://wa.me/22995904678" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.button}
          >
            Envoyer un message WhatsApp
          </a>
        </div>

        <div style={styles.contactMethodLast}>
          <div style={styles.label}>
            <span style={styles.icon}>⏱️</span>
            TEMPS DE RÉPONSE
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Généralement dans les 24 heures
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#333' }}>
          Questions fréquentes
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', color: '#333' }}>
            ❓ Je ne vois pas mes colis
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Essayez Shift+F5 pour rafraîchir votre navigateur
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', color: '#333' }}>
            ❓ Mon paiement n'a pas été approuvé
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Nous approuvons les paiements dans les 24-48 heures. Reconnectez-vous après approbation.
          </p>
        </div>

        <div>
          <p style={{ fontWeight: 'bold', color: '#333' }}>
            ❓ Je ne reçois pas d'email
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Vérifiez votre dossier SPAM. Les emails peuvent être marqués comme spam.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
        <p>🚀 DeliverHub - Plateforme de livraison fiable</p>
        <p style={{ fontSize: '12px' }}>© 2026 - Tous droits réservés</p>
      </div>
    </div>
  );
}