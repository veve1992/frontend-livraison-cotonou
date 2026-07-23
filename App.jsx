import SignatureComponent from './SignatureComponent';
import ParcelDetailsModal from './ParcelDetailsModal';
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
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);

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

  // NOTE: Changez cette URL si vous testez localement
  // LOCAL: http://localhost:3000
  // PRODUCTION: https://saas-livraison-cotonou.vercel.app
  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou.onrender.com';

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

  // Ajouter un colis (ROUTE FIXÉE!)
  const handleAddParcel = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!parcelForm.de || !parcelForm.a || !parcelForm.prix) {
        alert('❌ Veuillez remplir tous les champs');
        return;
      }

      const response = await fetch(`${API_URL}/parcels`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          de: parcelForm.de.trim(),
          a: parcelForm.a.trim(),
          prix: parseInt(parcelForm.prix),
          status: 'En attente'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setParcelForm({ de: '', a: '', prix: '' });
        setShowParcelForm(false);
        setSuccessMessage('✅ Colis ajouté avec succès !');
        fetchData();
        
        // Effacer le message après 3 secondes
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const error = await response.json();
        alert(`❌ Erreur: ${error.error || 'Impossible d\'ajouter le colis'}`);
      }
    } catch (error) {
      alert('❌ Erreur de connexion au serveur');
      console.error(error);
    }
  };

  // Ajouter un livreur (ROUTE FIXÉE!)
  const handleAddLivreur = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!livreurForm.nom || !livreurForm.phone) {
        alert('❌ Veuillez remplir tous les champs');
        return;
      }

      const response = await fetch(`${API_URL}/livreurs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nom: livreurForm.nom.trim(),
          phone: livreurForm.phone.trim()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setLivreurForm({ nom: '', phone: '' });
        setShowLivreurForm(false);
        setSuccessMessage('✅ Livreur ajouté avec succès !');
        fetchData();
        
        // Effacer le message après 3 secondes
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const error = await response.json();
        alert(`❌ Erreur: ${error.error || 'Impossible d\'ajouter le livreur'}`);
      }
    } catch (error) {
      alert('❌ Erreur de connexion au serveur');
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
        >
          📦 Colis
        </button>
        <button 
          className={`nav-btn ${activeTab === 'livreurs' ? 'active' : ''}`}
          onClick={() => setActiveTab('livreurs')}
        >
          👥 Livreurs
        </button>
        <button 
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
      </nav>

      {/* Message de succès */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

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
                        onChange={(e) => setParcelForm({...parcelForm, de: e.target.value}{parcels.length > 0 ? (
  <div className="table-container">
    <table className="data-table">
      ...TABLEAU...
    </table>
  </div>
) : (
  <div className="empty-state">
    <p>📦 Aucun colis pour le moment</p>
  </div>
)}

{/* 👇 AJOUTER CECI 👇 */}
{parcels.map(parcel => (
  parcel.status === 'En route' && (
    <div key={parcel.id} style={{marginTop: '30px'}}>
      <h3>Signer la livraison du colis #{parcel.id}</h3>
      <SignatureComponent 
        colis_id={parcel.id}
        onSuccess={() => {
          setSuccessMessage('✅ Colis signé avec succès!');
          fetchData();
        }}
      />
    </div>
  )
))})}
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
                          s<th>Actions</th>  {/* ← AJOUTER */}
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
    <td>
      <button 
        onClick={() => setSelectedParcel(parcel)}
        style={{
          padding: '8px 12px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        📋 Détails
      </button>
    </td>
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
          </>
        )}
      </main>
</main>

      {/* Modal Détails Colis */}
      {selectedParcel && (
        <ParcelDetailsModal
          parcel={selectedParcel}
          livreurs={livreurs}
          onClose={() => setSelectedParcel(null)}
          onRefresh={() => {
            setSelectedParcel(null);
            fetchData();
          }
         }}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Livraison Cotonou - Plateforme de gestion des livraisons</p>
      </footer>
    </div>
  );
}

export default App;
      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Livraison Cotonou - Plateforme de gestion des livraisons</p>
      </footer>
    </div>
  );
}

export default App;
