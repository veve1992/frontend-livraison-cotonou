import React, { useState, useEffect } from 'react';
import './App.css';
import TrackingPage from './TrackingPage';
import LivreurDashboard from './LivreurDashboard';
import './styles-premium.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [parcels, setParcels] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showParcelForm, setShowParcelForm] = useState(false);
  const [showLivreurForm, setShowLivreurForm] = useState(false);
const [trackingId, setTrackingId] = useState('');

  // Formulaire Colis
  const [parcelForm, setParcelForm] = useState({
    de: '',
    a: '',
    prix: ''
  });

  // Formulaire Livreur
  const [livreurForm, setLivreurForm] = useState({
    nom: '',
    phone: ''
  });

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

  // Ajouter un colis
  const handleAddParcel = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/parcels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          de: parcelForm.de,
          a: parcelForm.a,
          prix: parseInt(parcelForm.prix),
          status: 'En attente'
        })
      });

      if (response.ok) {
        setParcelForm({ de: '', a: '', prix: '' });
        setShowParcelForm(false);
        fetchData();
        alert('✅ Colis ajouté avec succès !');
      }
    } catch (error) {
      alert('❌ Erreur lors de l\'ajout du colis');
      console.error(error);
    }
  };

  // Ajouter un livreur
  const handleAddLivreur = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/livreurs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: livreurForm.nom,
          phone: livreurForm.phone
        })
      });

      if (response.ok) {
        setLivreurForm({ nom: '', phone: '' });
        setShowLivreurForm(false);
        fetchData();
        alert('✅ Livreur ajouté avec succès !');
      }
    } catch (error) {
      alert('❌ Erreur lors de l\'ajout du livreur');
      console.error(error);
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
        ><button 
  className={`nav-btn ${activeTab === 'tracking' ? 'active' : ''}`}
  onClick={() => setActiveTab('tracking')}
>
  📍 Suivi
</button>

<button 
  className={`nav-btn ${activeTab === 'livreur' ? 'active' : ''}`}
  onClick={() => setActiveTab('livreur')}
>
  🚚 Livreur
</button>
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
                <div className="section-header">
                  <h2>Gestion des Colis</h2>
                  <button className="btn-add" onClick={() => setShowParcelForm(!showParcelForm)}>
                    {showParcelForm ? '✕ Fermer' : '+ Ajouter un colis'}
                  </button>
                </div>

                {showParcelForm && (
                  <form className="form-card" onSubmit={handleAddParcel}>
                    <h3>Ajouter un nouveau colis</h3>
                    <div className="form-group">
                      <label>De (lieu de départ)</label>
                      <input
                        type="text"
                        placeholder="Ex: Cotonou"
                        value={parcelForm.de}
                        onChange={(e) => setParcelForm({...parcelForm, de: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>À (lieu d'arrivée)</label>
                      <input
                        type="text"
                        placeholder="Ex: Porto-Novo"
                        value={parcelForm.a}
                        onChange={(e) => setParcelForm({...parcelForm, a: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Prix (XOF)</label>
                      <input
                        type="number"
                        placeholder="Ex: 1500"
                        value={parcelForm.prix}
                        onChange={(e) => setParcelForm({...parcelForm, prix: e.target.value})}
                        required
                      />
                    </div>
                    <button type="submit" className="btn-submit">Ajouter le colis</button>
                  </form>
                )}

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
                    <p className="hint">Cliquez "Ajouter un colis" pour commencer !</p>
                  </div>
                )}
              </div>
            )}

            {/* Livreurs */}
            {activeTab === 'livreurs' && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Gestion des Livreurs</h2>
                  <button className="btn-add" onClick={() => setShowLivreurForm(!showLivreurForm)}>
                    {showLivreurForm ? '✕ Fermer' : '+ Ajouter un livreur'}
                  </button>
                </div>

                {showLivreurForm && (
                  <form className="form-card" onSubmit={handleAddLivreur}>
                    <h3>Ajouter un nouveau livreur</h3>
                    <div className="form-group">
                      <label>Nom du livreur</label>
                      <input
                        type="text"
                        placeholder="Ex: Jean Doe"
                        value={livreurForm.nom}
                        onChange={(e) => setLivreurForm({...livreurForm, nom: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input
                        type="tel"
                        placeholder="Ex: +229 90123456"
                        value={livreurForm.phone}
                        onChange={(e) => setLivreurForm({...livreurForm, phone: e.target.value})}
                        required
                      />
                    </div>
                    <button type="submit" className="btn-submit">Ajouter le livreur</button>
                  </form>
                )}

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
                    <p className="hint">Cliquez "Ajouter un livreur" pour commencer !</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
{/* Tracking Page */}
{activeTab === 'tracking' && (
  <div className="tab-content">
    <div className="tracking-input">
      <h2>📍 Suivi de colis</h2>
      <input
        type="text"
        placeholder="Entrez le numéro de colis (ex: 1, 2, 3)"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
      />
    </div>
    {trackingId && <TrackingPage parcelId={trackingId} />}
  </div>
)}

{/* Livreur Dashboard */}
{activeTab === 'livreur' && (
  <LivreurDashboard />
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
