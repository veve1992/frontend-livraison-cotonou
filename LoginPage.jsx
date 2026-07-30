import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom_entreprise: '',
    country: '',
    phone_prefix: ''
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
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        localStorage.setItem('entreprise', JSON.stringify(data.entreprise));
        localStorage.setItem('token', data.token);
        
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(data.entreprise);
        }, 1500);
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (error) {
      setError('❌ Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🚚 DeliverHub</h1>
        
        <div className="toggle">
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
          {!isLogin && (
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