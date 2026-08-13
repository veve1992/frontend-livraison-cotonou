import React from 'react';

export default function LandingPageMarketing() {
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    },
    hero: {
      background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center'
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    heroSubtitle: {
      fontSize: '20px',
      marginBottom: '30px',
      opacity: 0.9
    },
    heroButtons: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    button: {
      padding: '15px 30px',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    buttonPrimary: {
      background: 'white',
      color: '#0066cc'
    },
    buttonSecondary: {
      background: 'transparent',
      color: 'white',
      border: '2px solid white'
    },
    section: {
      padding: '60px 20px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    sectionTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '40px',
      textAlign: 'center',
      color: '#0066cc'
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      marginBottom: '40px'
    },
    feature: {
      background: '#f9f9f9',
      padding: '30px',
      borderRadius: '10px',
      textAlign: 'center'
    },
    featureIcon: {
      fontSize: '48px',
      marginBottom: '15px'
    },
    featureTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    featureText: {
      fontSize: '14px',
      color: '#666'
    },
    pricing: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    pricingCard: {
      border: '2px solid #0066cc',
      borderRadius: '10px',
      padding: '30px',
      textAlign: 'center'
    },
    pricingCardHighlight: {
      borderColor: '#ffc107',
      background: '#fffbf0',
      transform: 'scale(1.05)'
    },
    priceName: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    pricingAmount: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#0066cc',
      marginBottom: '20px'
    },
    pricingFeatures: {
      textAlign: 'left',
      marginBottom: '20px'
    },
    pricingFeature: {
      fontSize: '14px',
      padding: '8px 0',
      borderBottom: '1px solid #eee'
    },
    footer: {
      background: '#333',
      color: 'white',
      padding: '40px 20px',
      textAlign: 'center'
    },
    howItWorksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '30px'
    },
    howItWorksItem: {
      textAlign: 'center'
    },
    howItWorksIcon: {
      fontSize: '48px',
      marginBottom: '15px'
    },
    howItWorksTitle: {
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    howItWorksText: {
      color: '#666',
      fontSize: '14px'
    },
    cta: {
      background: '#0066cc',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center'
    },
    ctaTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    ctaSubtitle: {
      fontSize: '16px',
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🚚 DeliverHub Africa</h1>
        <p style={styles.heroSubtitle}>
          La plateforme de gestion des livraisons la plus simple et efficace
        </p>
        <div style={styles.heroButtons}>
          <button 
            style={{...styles.button, ...styles.buttonPrimary}}
           onClick={() => window.location.href = '/#/landing'}          >
            ➕ S'inscrire - Gestionnaire
          </button>
          
          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={() => window.location.href = '/#/landing'}          >

            👨‍💼 S'inscrire - Livreur
          </button>

          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
          onClick={() => window.location.href = '/#/landing'}
>  
            🔍 Suivre mon colis
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>✨ POURQUOI DELIVERHUB ?</h2>
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📱</div>
            <div style={styles.featureTitle}>Simple & Intuitif</div>
            <div style={styles.featureText}>
              Interface facile à utiliser, même pour les débutants
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>📍</div>
            <div style={styles.featureTitle}>Suivi en Temps Réel</div>
            <div style={styles.featureText}>
              Position GPS du livreur visible à chaque instant
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>💰</div>
            <div style={styles.featureTitle}>Tarifs Compétitifs</div>
            <div style={styles.featureText}>
              Gratuit pendant 7 jours - Paiement abordable après
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>⚡</div>
            <div style={styles.featureTitle}>Rapide & Fiable</div>
            <div style={styles.featureText}>
              Pas de lag, pas de bugs - Performance garantie
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>🔒</div>
            <div style={styles.featureTitle}>Sécurisé</div>
            <div style={styles.featureText}>
              Vos données sont protégées et chiffrées
            </div>
          </div>

          <div style={styles.feature}>
            <div style={styles.featureIcon}>📞</div>
            <div style={styles.featureTitle}>Support Réactif</div>
            <div style={styles.featureText}>
              Aide par email et WhatsApp - Réponse rapide
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎯 COMMENT ÇA MARCHE ?</h2>
        <div style={styles.howItWorksGrid}>
          <div style={styles.howItWorksItem}>
            <div style={styles.howItWorksIcon}>1️⃣</div>
            <h3 style={styles.howItWorksTitle}>Inscrivez-vous</h3>
            <p style={styles.howItWorksText}>
              Créez votre compte en 2 minutes
            </p>
          </div>

          <div style={styles.howItWorksItem}>
            <div style={styles.howItWorksIcon}>2️⃣</div>
            <h3 style={styles.howItWorksTitle}>Ajoutez des colis</h3>
            <p style={styles.howItWorksText}>
              Créez vos livraisons facilement
            </p>
          </div>

          <div style={styles.howItWorksItem}>
            <div style={styles.howItWorksIcon}>3️⃣</div>
            <h3 style={styles.howItWorksTitle}>Assignez les livreurs</h3>
            <p style={styles.howItWorksText}>
              Distribuez les colis à votre équipe
            </p>
          </div>

          <div style={styles.howItWorksItem}>
            <div style={styles.howItWorksIcon}>4️⃣</div>
            <h3 style={styles.howItWorksTitle}>Suivez en temps réel</h3>
            <p style={styles.howItWorksText}>
              GPS du livreur visible instantanément
            </p>
          </div>
        </div>
      </div>

      {/* PRICING SECTION */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>💳 NOS TARIFS</h2>
        <div style={styles.pricing}>
          <div style={styles.pricingCard}>
            <div style={styles.priceName}>🆓 STARTUP</div>
            <div style={styles.pricingAmount}>GRATUIT</div>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '20px'}}>7 jours</div>
            <div style={styles.pricingFeatures}>
              <div style={styles.pricingFeature}>✅ 10 colis/mois</div>
              <div style={styles.pricingFeature}>✅ 2 livreurs max</div>
              <div style={styles.pricingFeature}>✅ Suivi basic</div>
            </div>
            <button 
              style={{...styles.button, ...styles.buttonPrimary, width: '100%'}}
             onClick={() => window.location.href = '/#/landing'}
>
              Commencer
            </button>
          </div>

          <div style={{...styles.pricingCard, ...styles.pricingCardHighlight}}>
            <div style={styles.priceName}>💰 PRO</div>
            <div style={styles.pricingAmount}>26,950 XOF</div>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '20px'}}>par mois</div>
            <div style={styles.pricingFeatures}>
              <div style={styles.pricingFeature}>✅ 1000 colis/mois</div>
              <div style={styles.pricingFeature}>✅ 20 livreurs</div>
              <div style={styles.pricingFeature}>✅ Analytics avancés</div>
            </div>
            <button 
              style={{...styles.button, ...styles.buttonPrimary, width: '100%'}}
              onClick={() => window.location.href = '/#/landing'}
>
              Choisir PRO
            </button>
          </div>

          <div style={styles.pricingCard}>
            <div style={styles.priceName}>🚀 ENTERPRISE</div>
            <div style={styles.pricingAmount}>54,450 XOF</div>
            <div style={{fontSize: '12px', color: '#666', marginBottom: '20px'}}>par mois</div>
            <div style={styles.pricingFeatures}>
              <div style={styles.pricingFeature}>✅ Colis illimités</div>
              <div style={styles.pricingFeature}>✅ Livreurs illimités</div>
              <div style={styles.pricingFeature}>✅ API integration</div>
            </div>
            <button 
              style={{...styles.button, ...styles.buttonPrimary, width: '100%'}}
               onClick={() => window.location.href = '/#/landing'}
>
              Choisir ENTERPRISE
            </button>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>🎉 Prêt à lancer ?</h2>
        <p style={styles.ctaSubtitle}>
          Démarrez votre essai gratuit de 7 jours dès maintenant
        </p>
        <button 
          style={{...styles.button, ...styles.buttonPrimary}}
          onClick={() => window.location.href = '/#/landing'}
>
          ➕ COMMENCER MAINTENANT
        </button>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>📞 Support : bienhagla@gmail.com | +229 95 90 46 78</p>
        <p>
          <a href="/#/guide" style={{color: '#0066cc', textDecoration: 'none'}}>📚 Guide d'utilisation</a> | 
          <a href="/#/support" style={{color: '#0066cc', textDecoration: 'none', marginLeft: '15px'}}>🆘 Support</a>
        </p>
        <p style={{fontSize: '12px', marginTop: '20px'}}>© 2026 DeliverHub Africa - Tous droits réservés</p>
      </div>
    </div>
  );
}