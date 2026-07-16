import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [parcels, setParcels] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://saas-livraison-cotonou.vercel.app';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [parcelsRes, livreursRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/parcels`),
        fetch(`${API_URL}/livreurs`),
        fetch(`${API_URL}/stats`)
      ]);

      if (parcelsRes.ok) {
        const data = await parcelsRes.json();
        setParcels(data);
      }

      if (livreursRes.ok) {
        const data = await livreursRes.json();
        setLivreurs(data);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚚</span>
            <h1>Livraison Cotonou</h1>
          </div>
          <p className="subtitle">Plateforme de gestion des livraisons</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Tableau de bord
        </button>
        <button 
          className={`nav-btn ${activeTab === 'parcels' ? 'active' : ''}`}
          onClick={() => setActiveTab('parcels')}
        >
          📦 Colis
        </button>
        <button 
          className={`nav-btn ${activeTab === 'livreurs' ? 'active' : ''}`}
          onClick={() => setActiveTab('livreurs')}
        >
          👥 Livreurs
        </button>
      </nav>

      {/* Contenu Principal */}
      <main className="main-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des données...</p>
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="tab-content">
                <h2>Tableau de bord</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Colis</h3>
                    <p className="stat-number">{parcels.length}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Livreurs Actifs</h3>
                    <p className="stat-number">{livreurs.length}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Statut Système</h3>
                    <p className="stat-status">✅ En ligne</p>
                  </div>
                  <div className="stat-card">
                    <h3>Performance</h3>
                    <p className="stat-status">📈 Optimal</p>
                  </div>
                </div>

                {/* Aperçu Rapide */}
                <div className="quick-view">
                  <div className="quick-section">
                    <h3>Colis Récents</h3>
                    {parcels.length > 0 ? (
                      <div className="item-list">
                        {parcels.slice(0, 3).map(parcel => (
                          <div key={parcel.id} className="item">
                            <span className="item-id">#{parcel.id}</span>
                            <span className="item-status">{parcel.status}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty">Aucun colis</p>
                    )}
                  </div>

                  <div className="quick-section">
                    <h3>Livreurs</h3>
                    {livreurs.length > 0 ? (
                      <div className="item-list">
                        {livreurs.slice(0, 3).map(livreur => (
                          <div key={livreur.id} className="item">
                            <span className="item-name">{livreur.nom}</span>
                            <span className="item-rating">⭐ {livreur.rating || '—'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty">Aucun livreur</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Colis */}
            {activeTab === 'parcels' && (
              <div className="tab-content">
                <h2>Gestion des Colis</h2>
                {parcels.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>De</th>
                          <th>À</th>
                          <th>Prix</th>
                          <th>Statut</th>
                          <th>Livreur</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parcels.map(parcel => (
                          <tr key={parcel.id}>
                            <td className="id">#{parcel.id}</td>
                            <td>{parcel.de}</td>
                            <td>{parcel.a}</td>
                            <td className="price">{parcel.prix} XOF</td>
                            <td><span className={`status ${parcel.status.toLowerCase()}`}>{parcel.status}</span></td>
                            <td>{parcel.livreur || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>📦 Aucun colis pour le moment</p>
                  </div>
                )}
              </div>
            )}

            {/* Livreurs */}
            {activeTab === 'livreurs' && (
              <div className="tab-content">
                <h2>Gestion des Livreurs</h2>
                {livreurs.length > 0 ? (
                  <div className="cards-grid">
                    {livreurs.map(livreur => (
                      <div key={livreur.id} className="livreur-card">
                        <h3>{livreur.nom}</h3>
                        <p className="phone">📱 {livreur.phone}</p>
                        <div className="livreur-stats">
                          <div>
                            <strong>Colis Livrés</strong>
                            <p>{livreur.colis_livres || 0}</p>
                          </div>
                          <div>
                            <strong>Revenus</strong>
                            <p>{livreur.revenus || 0} XOF</p>
                          </div>
                          <div>
                            <strong>Rating</strong>
                            <p>⭐ {livreur.rating || '—'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>👥 Aucun livreur enregistré</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Livraison Cotonou - Plateforme de gestion des livraisons</p>
      </footer>
    </div>
  );
}

export default App;
