import React, { useState } from 'react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`✅ Merci ! Vous recevrez une notification à ${email}`);
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.logo}>🚚 DeliverHub</h1>
          <p style={styles.tagline}>Plateforme SaaS de gestion de livraisons</p>
        </div>

        {/* Main Content */}
        <div style={styles.card}>
          <h2 style={styles.title}>🚀 Bientôt en ligne !</h2>
          <p style={styles.description}>
            Nous préparons une plateforme révolutionnaire pour faciliter la gestion de vos livraisons en Afrique.
          </p>

          {/* Features Preview */}
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📦</span>
              <h3>Suivi Temps Réel</h3>
              <p>GPS et localisation en direct</p>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>💳</span>
              <h3>Paiement Sécurisé</h3>
              <p>Stripe & Flutterwave intégrés</p>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📊</span>
              <h3>Analytics Complet</h3>
              <p>Dashboard détaillé et intuitive</p>
            </div>
          </div>

          {/* Waitlist */}
          <div style={styles.waitlist}>
            <h3 style={styles.waitlistTitle}>Soyez parmi les premiers !</h3>
            <p>Entrez votre email pour être notifié du lancement</p>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                📧 M'avertir
              </button>
            </form>
            {submitted && (
              <p style={styles.success}>✅ Inscription confirmée !</p>
            )}
          </div>
        </div>

    {/* Footer */}
<div style={styles.footer}>
  <p>© 2024 DeliverHub - Tous droits réservés</p>
  
  <p style={{marginTop: '15px'}}>
    <a 
      href="/#/pricing" 
      style={{color: '#ffd700', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px'}}
    >
      📊 Voir nos plans d'abonnement →
    </a>
  </p>
  <p style={styles.contact}>
    Questions ? <a href="mailto:support@deliverhub-africa.com" style={styles.link}>support@deliverhub-africa.com</a>
  </p>
</div>   
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  content: {
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center',
    color: 'white'
  },
  header: {
    marginBottom: '40px'
  },
  logo: {
    fontSize: '48px',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  tagline: {
    fontSize: '18px',
    opacity: 0.9
  },
  card: {
    backgroundColor: 'white',
    color: '#333',
    borderRadius: '15px',
    padding: '50px 40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    marginBottom: '30px'
  },
  title: {
    fontSize: '36px',
    marginBottom: '20px',
    color: '#667eea'
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '40px',
    color: '#666'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    marginBottom: '40px'
  },
  feature: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '2px solid #667eea'
  },
  featureIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '10px'
  },
  waitlist: {
    backgroundColor: '#f0f4ff',
    padding: '30px',
    borderRadius: '10px',
    marginTop: '30px'
  },
  waitlistTitle: {
    color: '#667eea',
    marginBottom: '10px'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  input: {
    flex: '1',
    minWidth: '200px',
    padding: '12px 15px',
    border: '2px solid #667eea',
    borderRadius: '5px',
    fontSize: '14px',
    outline: 'none'
  },
  button: {
    padding: '12px 30px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  success: {
    marginTop: '15px',
    color: '#28a745',
    fontWeight: 'bold'
  },
  footer: {
    color: 'white',
    fontSize: '14px',
    opacity: 0.9
  },
  contact: {
    marginTop: '10px'
  },
  link: {
    color: '#ffd700',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};