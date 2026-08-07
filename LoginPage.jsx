import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('gestionnaire');
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Inscription Gestionnaire state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [country, setCountry] = useState('BJ');
  const [phonePrefix, setPhonePrefix] = useState('+229');

  // Inscription Livreur state
  const [livreurEmail, setLivreurEmail] = useState('');
  const [livreurPassword, setLivreurPassword] = useState('');
  const [livreurNom, setLivreurNom] = useState('');
  const [livreurPhone, setLivreurPhone] = useState('');
  const [livreurCode, setLivreurCode] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = userType === 'gestionnaire' ? '/login-gestionnaire' : '/login-livreur';
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Connexion réussie');
        
        localStorage.setItem('currentUser', JSON.stringify({
          type: userType,
          user: userType === 'gestionnaire' ? data.entreprise : data.livreur,
          entreprise: data.entreprise,
          token: data.token,
          timestamp: Date.now()
        }));
        
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

  // INSCRIPTION GESTIONNAIRE
  const handleRegisterGestionnaire = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register-gestionnaire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: regEmail.trim(),
          password: regPassword,
          nom_entreprise: nomEntreprise,
          company_code: companyCode,
          country,
          phone_prefix: phonePrefix
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Inscription réussie ! Connectez-vous');
        
        localStorage.setItem('currentUser', JSON.stringify({
          type: 'gestionnaire',
          user: data.entreprise,
          entreprise: data.entreprise,
          token: data.token,
          timestamp: Date.now()
        }));
        
        setTimeout(() => {
          window.location.href = '/#/dashboard';
        }, 500);
      } else {
        alert('❌ Erreur: ' + (data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      alert('❌ Erreur: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // INSCRIPTION LIVREUR
  const handleRegisterLivreur = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register-livreur`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: livreurEmail.trim(),
          password: livreurPassword,
          nom: livreurNom,
          phone: livreurPhone,
          company_code: livreurCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Inscription réussie ! Connectez-vous');
        
        localStorage.setItem('currentUser', JSON.stringify({
          type: 'livreur',
          user: data.livreur,
          entreprise: data.entreprise,
          token: data.token,
          timestamp: Date.now()
        }));
        
        setTimeout(() => {
          window.location.href = '/#/dashboard';
        }, 500);
      } else {
        alert('❌ Erreur: ' + (data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      alert('❌ Erreur: ' + error.message);
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

        {/* ONGLETS LOGIN / INSCRIPTION */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('login')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'login' ? '#3498db' : '#ecf0f1',
              color: activeTab === 'login' ? 'white' : '#333'
            }}
          >
            🔐 Connexion
          </button>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'register' ? '#3498db' : '#ecf0f1',
              color: activeTab === 'register' ? 'white' : '#333'
            }}
          >
            ✍️ Inscription
          </button>
        </div>

        {/* LOGIN TAB */}
        {activeTab === 'login' && (
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
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label>🔐 Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
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
              {loading ? '⏳ Connexion...' : '✅ Connexion'}
            </button>
          </form>
        )}

        {/* REGISTER TAB */}
        {activeTab === 'register' && (
          <div>
            {userType === 'gestionnaire' ? (
              <form onSubmit={handleRegisterGestionnaire} style={styles.form}>
                <h3>📝 Inscription Gestionnaire</h3>
                
                <div style={styles.formGroup}>
                  <label>📧 Email</label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>🔐 Mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>🏢 Nom de l'entreprise</label>
                  <input
                    type="text"
                    placeholder="Mon Entreprise"
                    value={nomEntreprise}
                    onChange={(e) => setNomEntreprise(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>🔑 Code entreprise</label>
                  <input
                    type="text"
                    placeholder="Ex: MY-CODE-2024"
                    value={companyCode}
                    onChange={(e) => setCompanyCode(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>🌍 Pays</label>
                  <input
                    type="text"
                    placeholder="Ex: BJ (Bénin)"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>📱 Préfixe téléphone</label>
                  <input
                    type="text"
                    placeholder="Ex: +229"
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? '⏳ Inscription...' : '✅ S\'inscrire'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterLivreur} style={styles.form}>
                <h3>📝 Inscription Livreur</h3>
                
                <div style={styles.formGroup}>
                  <label>📧 Email</label>
                  <input
                    type="email"
                    placeholder="livreur@email.com"
                    value={livreurEmail}
                    onChange={(e) => setLivreurEmail(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>🔐 Mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={livreurPassword}
                    onChange={(e) => setLivreurPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>👤 Nom</label>
                  <input
                    type="text"
                    placeholder="Jean Doe"
                    value={livreurNom}
                    onChange={(e) => setLivreurNom(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>📱 Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+22961234567"
                    value={livreurPhone}
                    onChange={(e) => setLivreurPhone(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>🔑 Code entreprise</label>
                  <input
                    type="text"
                    placeholder="Code fourni par l'entreprise"
                    value={livreurCode}
                    onChange={(e) => setLivreurCode(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? '⏳ Inscription...' : '✅ S\'inscrire'}
                </button>
              </form>
            )}

            {/* Toggle Gestionnaire/Livreur */}
            <div style={styles.toggleButtons}>
              <button
                type="button"
                onClick={() => setUserType('gestionnaire')}
                style={{
                  ...styles.toggleBtn,
                  backgroundColor: userType === 'gestionnaire' ? '#3498db' : '#ecf0f1',
                  color: userType === 'gestionnaire' ? 'white' : '#333',
                  marginTop: '20px'
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
                  color: userType === 'livreur' ? 'white' : '#333',
                  marginTop: '20px'
                }}
              >
                🚚 Livreur
              </button>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <p>Support: <a href="mailto:support@deliverhub-africa.com" style={styles.link}>support@deliverhub-africa.com</a></p>
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
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  tabBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
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
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
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
    fontSize: '14px'
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
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