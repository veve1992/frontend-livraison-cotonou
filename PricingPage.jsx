import React, { useState } from 'react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  const plans = [
    {
      id: 'startup',
      name: 'Startup',
      price: 0,
      duration: 'Gratuit 7 jours',
      features: [
        '✅ 10 colis/mois',
        '✅ 2 livreurs',
        '✅ Support email',
        '❌ SMS notifications',
        '❌ Analytics complet'
      ],
      button: 'Commencer gratuitement',
      color: '#007BFF'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      duration: 'par mois',
      features: [
        '✅ 1000 colis/mois',
        '✅ 20 livreurs',
        '✅ SMS notifications',
        '✅ Analytics complet',
        '✅ Support prioritaire'
      ],
      button: 'S\'abonner maintenant',
      color: '#28a745'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      duration: 'par mois',
      features: [
        '✅ Colis illimités',
        '✅ Livreurs illimités',
        '✅ API access',
        '✅ Intégrations custom',
        '✅ Support 24/7'
      ],
      button: 'Contacter ventes',
      color: '#dc3545'
    }
  ];

  const handleSubscribe = async (plan) => {
    if (plan.id === 'startup') {
      // Gratuit 7 jours
      alert('✅ Accès gratuit activé pour 7 jours !');
      localStorage.setItem('currentUser', JSON.stringify({
        type: 'gestionnaire',
        plan: 'startup',
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        token: 'trial-token-' + Date.now()
      }));
      window.location.href = '/';
      return;
    }

    setLoading(true);
    setSelectedPlan(plan.id);

    try {
      const saved = localStorage.getItem('currentUser');
      const currentUser = saved ? JSON.parse(saved) : null;

      if (!currentUser) {
        alert('❌ Veuillez vous connecter d\'abord');
        setLoading(false);
        return;
      }

      // Appel backend pour créer la transaction FedaPay
      const response = await fetch(`${API_URL}/api/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          plan: plan.id,
          amount: plan.price * 100, // Cents
          currency: 'XOF',
          enterprise_id: currentUser.entreprise?.id
        })
      });
const data = await response.json();
if (response.ok && data.success) {
  // Afficher succès
  alert(`✅ Demande de paiement envoyée !\n\nRéférence: ${data.reference}\nMontant: ${data.amount} XOF\n\nL'admin va valider votre paiement.`);
  // Redirection vers dashboard
  window.location.href = '/#/dashboard';
} else {
  alert('❌ Erreur: ' + (data.error || 'Impossible de créer le paiement'));
}
     
    } catch (error) {
      alert('❌ Erreur de connexion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>💳 Plans d\'abonnement</h1>
        <p>Choisissez le plan qui convient à votre entreprise</p>
      </div>

      <div style={styles.cardsContainer}>
        {plans.map(plan => (
          <div key={plan.id} style={{...styles.card, borderTop: `4px solid ${plan.color}`}}>
            <h2 style={{color: plan.color}}>{plan.name}</h2>
            <div style={styles.price}>
              <span style={styles.amount}>{plan.price === 0 ? 'Gratuit' : `$${plan.price}`}</span>
              <span style={styles.duration}>{plan.duration}</span>
            </div>

            <ul style={styles.features}>
              {plan.features.map((feature, idx) => (
                <li key={idx} style={styles.feature}>{feature}</li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={loading && selectedPlan === plan.id}
              style={{
                ...styles.button,
                backgroundColor: plan.color,
                opacity: loading && selectedPlan === plan.id ? 0.6 : 1
              }}
            >
              {loading && selectedPlan === plan.id ? '⏳ Traitement...' : plan.button}
            </button>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <p>Besoin d\'aide ? <a href="mailto:support@deliverhub-africa.com" style={styles.link}>support@deliverhub-africa.com</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  cardsContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  price: {
    margin: '20px 0',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '10px'
  },
  amount: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333'
  },
  duration: {
    fontSize: '14px',
    color: '#666'
  },
  features: {
    listStyle: 'none',
    padding: '20px 0',
    textAlign: 'left'
  },
  feature: {
    padding: '10px 0',
    borderBottom: '1px solid #eee',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '15px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '50px',
    color: '#666'
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none'
  }
};