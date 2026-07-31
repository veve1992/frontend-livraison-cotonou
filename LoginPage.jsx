import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLoginSuccess }) {
  const [userType, setUserType] = useState('gestionnaire'); // 'gestionnaire' ou 'livreur'
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom_entreprise: '',
    nom: '',
    phone: '',
    country: '',
    phone_prefix: '',
    enterprise_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let endpoint = '';
      let body = {};

      if (userType === 'gestionnaire') {
        endpoint = isLogin ? '/auth/login' : '/auth/register';
        body = isLogin 
          ? { email: formData.email, password: formData.password }
          : {
              email: formData.email,
              password: formData.password,
              nom_entreprise: formData.nom_entreprise,
              country: formData.country,
              phone_prefix: formData.phone_prefix
            };
      } else {
        // Livreur
        endpoint = isLogin ? '/auth/livreur/login' : '/auth/livreur/register';
        body = isLogin
          ? { email: formData.email, password: formData.password }
          : {
              email: formData.email,
              password: formData.password,
              nom: formData.nom,
              phone: formData.phone,
              enterprise_id: parseInt(formData.enterprise_id)
            };
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        
        // Sauvegarder le bon type d'utilisateur
        if (userType === 'gestionnaire') {
          
// Structure unique et sécurisée
const userData = {
  type: userType,
  user: userType === 'gestionnaire' ? data.entreprise : data.livreur,
  entreprise: data.entreprise,
  token: data.token,
  timestamp: Date.now()
};
localStorage.setItem('currentUser', JSON.stringify(userData));

setTimeout(() => {
  if (onLoginSuccess) {
    if (userType === 'gestionnaire') {
      onLoginSuccess(data.entreprise, 'gestionnaire');
    } else {
      onLoginSuccess(data.livreur, 'livreur');
    }
  }
}, 1500);

    } catch (error) {
      setError('❌ Erreur de connexion au serveur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🚚 DeliverHub</h1>
        
        {/* SÉLECTEUR TYPE D'UTILISATEUR */}
        <div className="toggle">
          <button 
            className={userType === 'gestionnaire' ? 'active' : ''} 
            onClick={() => {
              setUserType('gestionnaire');
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
          >
            👨‍💼 Gestionnaire
          </button>
          <button 
            className={userType === 'livreur' ? 'active' : ''} 
            onClick={() => {
              setUserType('livreur');
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
          >
            🚚 Livreur
          </button>
        </div>

        {/* ONGLETS CONNEXION/INSCRIPTION */}
        <div className="toggle" style={{marginTop: '10px'}}>
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Connexion
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ========== GESTIONNAIRE ========== */}
          {userType === 'gestionnaire' && !isLogin && (
            <>
              <input
                type="text"
                name="nom_entreprise"
                placeholder="Nom de votre entreprise"
                value={formData.nom_entreprise}
                onChange={handleChange}
                required
              />
              
              <select
                name="country"
                value={formData.country}
                onChange={(e) => {
                  const country = e.target.value;
                  const prefixes = {
                    'Bénin': '+229',
                    'Sénégal': '+221',
                    'Côte d\'Ivoire': '+225',
                    'Cameroun': '+237',
                    'France': '+33',
                    'Belgique': '+32',
                    'Canada': '+1',
                    'USA': '+1'
                  };
                  setFormData({
                    ...formData,
                    country: country,
                    phone_prefix: prefixes[country] || ''
                  });
                }}
                required
              >
                <option value="">Sélectionnez votre pays</option>
                <option value="Bénin">🇧🇯 Bénin</option>
                <option value="Sénégal">🇸🇳 Sénégal</option>
                <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                <option value="Cameroun">🇨🇲 Cameroun</option>
                <option value="France">🇫🇷 France</option>
                <option value="Belgique">🇧🇪 Belgique</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="USA">🇺🇸 USA</option>
              </select>
            </>
          )}

          {/* ========== LIVREUR ========== */}
          {userType === 'livreur' && !isLogin && (
            <>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom complet"
                value={formData.nom}
                onChange={handleChange}
                required
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Votre téléphone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="enterprise_id"
                placeholder="ID de votre entreprise (donné par le gestionnaire)"
                value={formData.enterprise_id}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* EMAIL ET PASSWORD (TOUS) */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? '⏳ Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </div>
    </div>
  );
}