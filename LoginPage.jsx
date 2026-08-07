import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('gestionnaire');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Déterminer l'endpoint selon le type utilisateur
      const endpoint = userType === 'gestionnaire' ? '/login-gestionnaire' : '/login-livreur';
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Connexion réussie');
        
        // Sauvegarder dans localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          type: userType,
          user: userType === 'gestionnaire' ? data.entreprise : data.livreur,
          entreprise: data.entreprise,
          token: data.token,
          timestamp: Date.now()
        }));
        
        // Redirection automatique vers dashboard
        setTimeout(() => {
          window.location.href = '/#/dashboard';
        }, 500);
        return;
      } else {
        alert('❌ Erreur: ' + (data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      alert('❌ Erreur de connexion: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1>🚚 DeliverHub</h1>
          <p>Plateforme de gestion des livraisons</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.toggleButtons}>
            <button
              type="button"
              onClick={() => setUserType('gestionnaire')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: userType === 'gestionnaire' ? '#3498db' : '#ecf0f1',
                color: userType === 'gestionnaire' ? 'white' : '#333'
              }}
            >
              👔 Gestionnaire
            </button>
            <button
              type="button"
              onClick={() => setUserType('livreur')}
              style={{
                ...styles.toggleBtn,
                backgroundColor: userType === 'livreur' ? '#3498db' : '#ecf0f1',
                color: userType === 'livreur' ? 'white' : '#333'
              }}
            >
              🚚 Livreur
            </button>
          </div>

          <div style={styles.formGroup}>
            <label>📧 Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>🔐 Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Connexion en cours...' : '✅ Connexion'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Besoin d'aide ? <a href="mailto:support@deliverhub-africa.com" style={styles.link}>support@deliverhub-africa.com</a></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  loginBox: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    padding: '40px',
    maxWidth: '400px',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  toggleButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif'
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666'
  },
  link: {
    color: '#3498db',
    textDecoration: 'none'
  }
};