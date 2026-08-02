import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLoginSuccess }) {
  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';
  
  const [userType, setUserType] = useState('gestionnaire');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom_entreprise: '',
    company_code: '',
    country: '',
    phone_prefix: '',
    nom: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let endpoint, body;

    if (userType === 'gestionnaire') {
      endpoint = isLogin ? '/auth/login' : '/auth/register';
      body = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            email: formData.email,
            password: formData.password,
            nom_entreprise: formData.nom_entreprise,
            company_code: formData.company_code.toUpperCase(),
            country: formData.country,
            phone_prefix: formData.phone_prefix
          };
    } else {
      endpoint = isLogin ? '/auth/livreur/login' : '/auth/livreur/register';
      body = isLogin
        ? { 
            email: formData.email, 
            password: formData.password,
            company_code: formData.company_code.toUpperCase()
          }
        : {
            email: formData.email,
            password: formData.password,
            nom: formData.nom,
            phone: formData.phone,
            company_code: formData.company_code.toUpperCase()
          };
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
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

        // Redirection automatique
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
        return;
      } else {
        alert('❌ Erreur: ' + (data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      alert('❌ Erreur de connexion: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🚚 DeliverHub</h1>
        <p className="subtitle">Plateforme de gestion des livraisons</p>

        {/* Sélection type utilisateur */}
        <div className="user-type-selector">
          <button
            className={`type-btn ${userType === 'gestionnaire' ? 'active' : ''}`}
            onClick={() => {
              setUserType('gestionnaire');
              setFormData({
                email: '',
                password: '',
                nom_entreprise: '',
                company_code: '',
                country: '',
                phone_prefix: '',
                nom: '',
                phone: ''
              });
            }}
          >
            👨‍💼 Gestionnaire
          </button>
          <button
            className={`type-btn ${userType === 'livreur' ? 'active' : ''}`}
            onClick={() => {
              setUserType('livreur');
              setFormData({
                email: '',
                password: '',
                nom_entreprise: '',
                company_code: '',
                country: '',
                phone_prefix: '',
                nom: '',
                phone: ''
              });
            }}
          >
            🚚 Livreur
          </button>
        </div>

        {/* Toggle Connexion/Inscription */}
        <div className="toggle-auth">
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

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* GESTIONNAIRE INSCRIPTION */}
          {userType === 'gestionnaire' && !isLogin && (
            <>
              <input
                type="text"
                name="nom_entreprise"
                placeholder="Nom de l'entreprise"
                value={formData.nom_entreprise}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="company_code"
                placeholder="Code entreprise (ex: ALPHA-2026)"
                value={formData.company_code}
                onChange={handleChange}
                maxLength="50"
                required
              />
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Choisir un pays</option>
                <option value="France">France</option>
                <option value="Bénin">Bénin</option>
                <option value="Togo">Togo</option>
                <option value="Cameroun">Cameroun</option>
              </select>
              <input
                type="text"
                name="phone_prefix"
                placeholder="Préfixe téléphonique (ex: +33)"
                value={formData.phone_prefix}
                onChange={handleChange}
              />
            </>
          )}

          {/* LIVREUR INSCRIPTION */}
          {userType === 'livreur' && !isLogin && (
            <>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
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
                type="text"
                name="company_code"
                placeholder="Code de votre entreprise (ex: ALPHA-2026)"
                value={formData.company_code}
                onChange={handleChange}
                maxLength="50"
                required
              />
            </>
          )}

          {/* LIVREUR CONNEXION */}
          {userType === 'livreur' && isLogin && (
            <input
              type="text"
              name="company_code"
              placeholder="Code de votre entreprise (ex: FINAL-TEST-2026)"
              value={formData.company_code}
              onChange={handleChange}
              maxLength="50"
              required
            />
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

          <button type="submit" className="btn-submit">
            {isLogin ? '🔓 Se connecter' : '📝 S\'inscrire'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Pas encore de compte? " : "Vous avez déjà un compte? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: 'pointer', color: '#007BFF', fontWeight: 'bold' }}
          >
            {isLogin ? 'S\'inscrire' : 'Se connecter'}
          </span>
        </p>
      </div>
    </div>
  );
}