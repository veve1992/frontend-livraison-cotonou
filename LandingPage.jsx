import React, { useState } from 'react';

export default function LandingPage() {
  const [code, setCode] = useState('');
  const [id, setId] = useState('');

  const handleSuivre = () => {
    if (!code || !id) {
      alert('⚠️ Veuillez remplir tous les champs');
      return;
    }
    window.location.replace(`/#/suivi/${code}/${id}`);
  };
const handleGestionnaire = () => {
  window.location.href = '/#/dashboard';
};
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🚚 DeliverHub</h1>
        <p>Plateforme de suivi de colis professionnel</p>
      </div>

      <div style={styles.card}>
        <h2>📍 Suivre Votre Colis</h2>
        <p>Vous avez un code entreprise et un ID de colis ?</p>
        <div style={styles.form}>
          <input 
            type="text" 
            placeholder="Code entreprise (ex: FINAL-TEST-2026)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.input}
          />
          <input 
            type="number" 
            placeholder="ID colis (ex: 44)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={styles.input}
          />
          <button 
            onClick={handleSuivre}
            style={styles.button}
          >
            🔍 Suivre le Colis
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2>👨‍💼 Gestionnaire</h2>
        <button 
          onClick={handleGestionnaire}
          style={styles.buttonSecondary}
        >
          📊 Accès Gestionnaire
        </button>
      </div>

      <div style={styles.footer}>
        <p>© 2026 DeliverHub - Tous droits réservés</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonSecondary: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '20px',
    color: '#666'
  }
};