import AdminEnterprises from './AdminEnterprises';
import AdminPayments from './AdminPayments';
import ComingSoon from './ComingSoon';
import PricingPage from './PricingPage';
import React, { useState, useEffect } from 'react';
import LivreurDashboard from './LivreurDashboard';
import SignatureComponent from './SignatureComponent';
import ParcelDetailsModal from './ParcelDetailsModal';
import TrackingPublic from './TrackingPublic';
import LandingPage from './LandingPage';
import './App.css';
import './styles-premium.css';
import LoginPage from './LoginPage';

function App() {
  // ====================================
  // ÉTAPE 1 : TOUS LES STATES (AVANT toute logique)
  // ====================================
  const [activeTab, setActiveTab] = useState('dashboard');
  const [parcels, setParcels] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entreprise, setEntreprise] = useState(null);
  const [userType, setUserType] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showParcelForm, setShowParcelForm] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [parcelForm, setParcelForm] = useState({
    de: '', a: '', prix: '', numero_receptionnaire: '',
    nom_receptionnaire: '', prenom_receptionnaire: '',
    contact_receptionnaire: '', adresse_livraison: '',
    description_colis: '', photo_colis: ''
  });

  // ====================================
  // ÉTAPE 2 : API URL (constante)
  // ====================================
  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  // ====================================
  // ÉTAPE 3 : TOUS LES USEEFFECT
  // ====================================
  
  // UseEffect 1 : Charger entreprise du localStorage
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const userData = JSON.parse(saved);
      setUserType(userData.type);
      setEntreprise(userData.entreprise);
    }
  }, []);

  // UseEffect 2 : Écouter les changements de hash
  useEffect(() => {
    const handleHashChange = () => {
      window.location.reload();
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // UseEffect 3 : Appeler fetchData
  useEffect(() => {
    if (entreprise) {
      fetchData();
    }
  }, [currentPage, API_URL, entreprise]);

// Barre d'expiration
const ExpiredBanner = () => {
  if (!isExpired) return null;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '15px',
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '20px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(220, 53, 69, 0.3)'
    }}>
      🔴 VOTRE PLAN A EXPIRÉ
      <br />
      <span style={{ fontSize: '12px', marginTop: '5px', display: 'block' }}>
        Vous serez redirigé dans 10 secondes...
      </span>
    </div>
  );
};
 
  // ====================================
  // ÉTAPE 4 : TOUTES LES FONCTIONS
  // ====================================
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const saved = localStorage.getItem('currentUser');
      const token = saved ? JSON.parse(saved).token : '';
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const [parcelRes, livreurRes] = await Promise.all([
        fetch(`${API_URL}/parcels?page=${currentPage}&enterprise_id=${entreprise.id}`, { headers }),
        fetch(`${API_URL}/livreurs?enterprise_id=${entreprise.id}`, { headers })
      ]);
      
      if (parcelRes.ok) {
        const data = await parcelRes.json();
        setParcels(data.data || []);
        setTotalPages(data.pages || 1);
      }
      if (livreurRes.ok) {
        const data = await livreurRes.json();
        setLivreurs(Array.isArray(data) ? data : data.livreurs || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLivreurNom = (livreurId) => {
    if (!livreurId) return '—';
    const id = parseInt(livreurId);
    const livreur = livreurs.find(l => l.id === id);
    return livreur ? livreur.nom : `Livreur #${id}`;
  };

  const getRevenuLivreur = (livreurId) => {
    if (!livreurId) return 0;
    return parcels
      .filter(p => parseInt(p.livreur) === parseInt(livreurId) && p.status === 'Livré')
      .reduce((sum, p) => sum + parseInt(p.prix), 0);
  };

  const getColisLivresLivreur = (livreurId) => {
    if (!livreurId) return 0;
    return parcels.filter(p => parseInt(p.livreur) === parseInt(livreurId) && p.status === 'Livré').length;
  };

  const getColisEnInstanceLivreur = (livreurId) => {
    if (!livreurId) return 0;
    return parcels.filter(p => parseInt(p.livreur) === parseInt(livreurId) && (p.status === 'Pris' || p.status === 'En route')).length;
  };
// ====================================
// FONCTIONS POUR LES LIMITES TRIAL
// ====================================

const isTrialActive = () => {
  const saved = localStorage.getItem('currentUser');
  if (!saved) return false;
  
  try {
    const user = JSON.parse(saved);
    
    // Check plan_expiry au bon niveau
    if (user.entreprise && user.entreprise.plan_expiry) {
      const now = new Date();
      const expiry = new Date(user.entreprise.plan_expiry);
      return now <= expiry && user.entreprise.plan === 'startup';
    }
    
    return false;
  } catch (error) {
    return false;
  }
};
const getPlanStatus = () => {
  const saved = localStorage.getItem('currentUser');
  if (!saved) return 'expired';
  
  try {
    const user = JSON.parse(saved);
    
    // Vérifier plan_expiry si existe
    if (user.entreprise && user.entreprise.plan_expiry) {
      const now = new Date();
      const expiry = new Date(user.entreprise.plan_expiry);
            
      if (now > expiry) {
        return 'expired';
      }
      
      if (user.entreprise.plan === 'startup') {
        return 'trial';
      }
      
      return 'paid';
    }
    
    return 'expired';
  } catch (error) {
    console.error('Erreur getPlanStatus:', error);
    return 'expired';
  }
};
const getTrialDaysLeft = () => {
  const saved = localStorage.getItem('currentUser');
  if (!saved) return 0;
  
  try {
    const user = JSON.parse(saved);
    
    // Check plan_expiry au bon niveau
    if (user.entreprise && user.entreprise.plan_expiry) {
      const now = new Date();
      const expiry = new Date(user.entreprise.plan_expiry);
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      
      return daysLeft > 0 ? daysLeft : 0;
    }
    
    return 0;
  } catch (error) {
    return 0;
  }
};
const getTrialLimits = () => {
  const status = getPlanStatus();
  
  if (status === 'trial') {
    return {
      maxColis: 10,
      maxLivreurs: 2,
      maxCar: '(Trial: 10 max)'
    };
  }
  
  if (status === 'paid') {
    return {
      maxColis: 1000,
      maxLivreurs: 20,
      maxCar: '(Pro)'
    };
  }
  
  return {
    maxColis: 0,
    maxLivreurs: 0,
    maxCar: '(Expiré)'
  };
};

const canAddParcel = () => {
  const limits = getTrialLimits();
  return parcels.length < limits.maxColis;
};

const canAddLivreur = () => {
  const limits = getTrialLimits();
  return livreurs.length < limits.maxLivreurs;
};

const getColisRemaining = () => {
  const limits = getTrialLimits();
  return limits.maxColis - parcels.length;
};

const getLivreursRemaining = () => {
  const limits = getTrialLimits();
  return limits.maxLivreurs - livreurs.length;
};

  const handleAddParcel = async (e) => {
  e.preventDefault();
  
  // VÉRIFIER LE PLAN D'ABORD
  const status = getPlanStatus();
  
  if (status === 'expired') {
    alert('❌ Votre trial gratuit a expiré.\nChoisissez un plan pour continuer.');
    window.location.href = '/#/pricing';
    return;
  }
  
  // VÉRIFIER LA LIMITE DE COLIS
  if (!canAddParcel()) {
    const limits = getTrialLimits();
    alert(`❌ Limite atteinte : ${limits.maxColis} colis max pour ${status === 'trial' ? 'le trial' : 'votre plan'}`);
    window.location.href = '/#/pricing';
    return;
  }
  
  if (!parcelForm.de || !parcelForm.a || !parcelForm.prix) {
    alert('❌ Veuillez remplir tous les champs');
    return;
  }
    try {
      const saved = localStorage.getItem('currentUser');
      const token = saved ? JSON.parse(saved).token : '';
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`${API_URL}/parcels`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          de: parcelForm.de.trim(),
          a: parcelForm.a.trim(),
          prix: parseInt(parcelForm.prix),
          enterprise_id: entreprise.id,
          nom_receptionnaire: parcelForm.nom_receptionnaire || '',
          prenom_receptionnaire: parcelForm.prenom_receptionnaire || '',
          contact_receptionnaire: parcelForm.contact_receptionnaire || '',
          adresse_livraison: parcelForm.adresse_livraison || '',
          description_colis: parcelForm.description_colis || '',
          photo_colis: parcelForm.photo_colis || '',
          status: 'En attente'
        })
      });
      
      if (response.ok) {
        alert('✅ Colis ajouté avec succès !');
        setParcelForm({
          de: '', a: '', prix: '', nom_receptionnaire: '',
          prenom_receptionnaire: '', contact_receptionnaire: '',
          adresse_livraison: '', description_colis: '', photo_colis: ''
        });
        fetchData();
      } else {
        const error = await response.json();
        alert('❌ Erreur: ' + (error.error || 'Impossible d\'ajouter le colis'));
      }
    } catch (error) {
      alert('❌ Erreur de connexion');
      console.error(error);
    }
  };

  // ====================================
  // ÉTAPE 5 : CONDITIONS DE RETURN (DANS LE BON ORDRE)
  // ====================================

  // Vérifier le hash pour suivi public
  const hash = window.location.hash.slice(1);
  const suiviMatch = hash.match(/^\/suivi\/([^\/]+)\/(\d+)$/);

  if (suiviMatch) {
    const company_code = suiviMatch[1];
    const colis_id = suiviMatch[2];
    return <TrackingPublic company_code={company_code} colis_id={colis_id} />;
  }
// Hash /admin
if (hash === '/admin') {
  return <AdminPayments />;
}
if (hash === '/admin-enterprises') {
  return <AdminEnterprises />;
}
  // Hash /login
  if (hash === '/login') {
    return <LoginPage onLoginSuccess={(user, type) => {
      setUserType(type);
      setEntreprise(user);
    }} />;
  }

  // Hash /pricing
  if (hash === '/pricing') {
    return <PricingPage />;
  }

  // Hash /dashboard
  if (hash === '/dashboard') {
    if (!entreprise) {
      return <LoginPage onLoginSuccess={(user, type) => {
        setUserType(type);
        setEntreprise(user);
      }} />;
    }
    if (userType === 'livreur') {
      const saved = localStorage.getItem('currentUser');
      const livreur = saved ? JSON.parse(saved).user : null;
      return <LivreurDashboard livreur={livreur} entreprise={entreprise} />;
    }
    // Continue to render dashboard below
  }

  // Si pas d'entreprise = pas connecté = LandingPage
  if (!entreprise) {
    return <LandingPage />;
  }

  // Si livreur = LivreurDashboard
  if (userType === 'livreur') {
    const saved = localStorage.getItem('currentUser');
    const livreur = saved ? JSON.parse(saved).user : null;
    return <LivreurDashboard livreur={livreur} entreprise={entreprise} />;
  }

  // ====================================
  // RENDER DASHBOARD GESTIONNAIRE (défaut)
  // ====================================
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚚</span>
            <h1>DeliverHub</h1>
          </div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🚪 Déconnexion
          </button>
          <p className="subtitle">Plateforme internationale de gestion des livraisons</p>
          {entreprise && (
            <p className="company-info" style={{fontSize: '14px', marginTop: '5px', color: '#666'}}>
              📍 {entreprise.country} {entreprise.phone_prefix}
            </p>
          )}
        </div>
      </header>
<ExpiredBanner />

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
        <button
          className="nav-btn"
          onClick={() => {
            window.location.href = '/#/pricing';
          }}
          style={{
            backgroundColor: '#ffc107',
            color: 'black',
            fontWeight: 'bold',
            marginLeft: 'auto'
          }}
        >
          💳 Plans & Paiement
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
{getPlanStatus() === 'expired' && (
      <div style={{
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '20px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3>❌ Votre trial gratuit a expiré !</h3>
        <p>Choisissez un plan pour continuer à utiliser la plateforme.</p>
        <button 
          onClick={() => window.location.href = '/#/pricing'}
          style={{
            backgroundColor: '#ffc107',
            color: 'black',
            padding: '10px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          💳 Voir les plans
        </button>
      </div>
    )}

    {getPlanStatus() === 'trial' && (
      <div style={{
        backgroundColor: '#ffc107',
        color: 'black',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <strong>⏰ Trial gratuit actif : {getTrialDaysLeft()} jours restants</strong>
            <p style={{marginTop: '10px', fontSize: '14px'}}>
              📦 Colis : {parcels.length}/{getTrialLimits().maxColis} | 👥 Livreurs : {livreurs.length}/{getTrialLimits().maxLivreurs}
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/#/pricing'}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            💳 Upgrade
          </button>
        </div>
      </div>
    )}
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
                 <button 
  className="btn-add" 
  onClick={() => setShowParcelForm(!showParcelForm)}
  disabled={getPlanStatus() === 'expired' || !canAddParcel()}
  style={{
    opacity: (!canAddParcel() || getPlanStatus() === 'expired') ? 0.5 : 1,
    cursor: (!canAddParcel() || getPlanStatus() === 'expired') ? 'not-allowed' : 'pointer'
  }}
>
  {getPlanStatus() === 'expired' ? '🔒 Trial expiré' : !canAddParcel() ? `📦 Limite atteinte (${parcels.length}/${getTrialLimits().maxColis})` : '+ Ajouter un colis'}
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
                    <div className="form-group">
                      <label>Nom réceptionnaire</label>
                      <input
                        type="text"
                        placeholder="Jean Doe"
                        value={parcelForm.nom_receptionnaire}
                        onChange={(e) => setParcelForm({...parcelForm, nom_receptionnaire: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Prénom du client</label>
                      <input
                        type="text"
                        placeholder="Jean"
                        value={parcelForm.prenom_receptionnaire}
                        onChange={(e) => setParcelForm({...parcelForm, prenom_receptionnaire: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact du client</label>
                      <input
                        type="tel"
                        placeholder="+22961234567"
                        value={parcelForm.contact_receptionnaire}
                        onChange={(e) => setParcelForm({...parcelForm, contact_receptionnaire: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Adresse de livraison</label>
                      <input
                        type="text"
                        placeholder="123 Rue de la Paix"
                        value={parcelForm.adresse_livraison}
                        onChange={(e) => setParcelForm({...parcelForm, adresse_livraison: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Description du colis</label>
                      <textarea
                        placeholder="Ex: Électronique fragile, livrer avec soin..."
                        value={parcelForm.description_colis}
                        onChange={(e) => setParcelForm({...parcelForm, description_colis: e.target.value})}
                        rows="4"
                      />
                    </div>
                    <div className="form-group">
                      <label>Photo du colis</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setParcelForm({...parcelForm, photo_colis: event.target.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
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
                          <th>Actions</th>
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
                            <td>{parcel.livreur ? `Livreur #${parcel.livreur}` : '—'}</td>
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
                    {totalPages > 1 && (
                      <div style={{marginTop: '20px', textAlign: 'center', padding: '15px'}}>
                        <button 
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={{padding: '10px 20px', marginRight: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                        >
                          Previous
                        </button>
                        <span style={{margin: '0 20px', fontSize: '16px', fontWeight: 'bold'}}>
                          Page {currentPage} of {totalPages}
                        </span>
                        <button 
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          style={{padding: '10px 20px', marginLeft: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                        >
                          Next
                        </button>
                      </div>
                    )}
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
                  <h2>👥 Gestion des Livreurs</h2>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    💡 Les livreurs s'inscrivent directement avec le code entreprise : <strong>{entreprise.company_code}</strong>
                  </p>
                </div>

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
                    <p className="hint">Les livreurs s'inscrivent directement en utilisant le code entreprise</p>
                  </div>
                )}
              </div>
            )}

            {/* Tracking */}
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
                  
                  <button className="btn-add" onClick={async () => {
                    if (!trackingId) {
                      alert('⚠️ Veuillez entrer un numéro de colis');
                      return;
                    }

                    try {
                      const saved = localStorage.getItem('currentUser');
                      const token = saved ? JSON.parse(saved).token : '';

                      const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      };

                      const response = await fetch(`${API_URL}/tracking/${trackingId}?enterprise_id=${entreprise.id}`, { headers });
                      const data = await response.json();

                      if (data.latitude && data.longitude) {
                        alert(`📍 SUIVI COLIS #${trackingId}\n📍 Position: ${data.latitude}, ${data.longitude}\n📍 Adresse: ${data.adresse || 'En cours'}\n📍 Statut: ${data.status || 'En route'}`);
                      } else {
                        alert('⚠️ Aucune position enregistrée pour ce colis');
                      }
                    } catch (error) {
                      console.error('Erreur:', error);
                      alert('❌ Erreur lors du suivi');
                    }
                  }}>
                    🔍 Suivre
                  </button>
                </div>
              </div>
            )}

            {/* Livreur Dashboard */}
            {activeTab === 'livreur' && (
              <div className="tab-content">
                <h2>🚚 Dashboard Livreur</h2>
                
                <div className="cards-grid">
                  {livreurs.map(livreur => (
                    <div key={livreur.id} className="livreur-card">
                      <h3>{livreur.nom}</h3>
                      <p className="phone">📱 {livreur.phone}</p>
                      <div className="livreur-stats">
                        <div>
                          <strong>Colis Livrés</strong>
                          <p>{getColisLivresLivreur(livreur.id)}</p>
                        </div>
                        <div>
                          <strong>Colis En Instance</strong>
                          <p>{getColisEnInstanceLivreur(livreur.id)}</p>
                        </div>
                        <div>
                          <strong>Revenu</strong>
                          <p>{getRevenuLivreur(livreur.id)} XOF</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="section-header">
                  <h3>Colis à Livrer</h3>
                </div>

                {parcels.filter(p => p.status === 'Pris' || p.status === 'En route').length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>De</th>
                          <th>À</th>
                          <th>Client</th>
                          <th>Contact</th>
                          <th>Prix</th>
                          <th>Livreur</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parcels.filter(p => p.status === 'Pris' || p.status === 'En route').map(parcel => (
                          <tr key={parcel.id}>
                            <td className="id">#{parcel.id}</td>
                            <td>{parcel.de}</td>
                            <td>{parcel.a}</td>
                            <td>{parcel.nom_receptionnaire} {parcel.prenom_receptionnaire}</td>
                            <td>{parcel.contact_receptionnaire || 'N/A'}</td>
                            <td className="price">{parcel.prix} XOF</td>
                            <td>{getLivreurNom(parcel.livreur)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>🎉 Aucun colis à livrer!</p>
                  </div>
                )}
              </div>
            )}

          </>
        )}
      </main>

      {/* Modal Détails Colis */}
      {selectedParcel && (
        <ParcelDetailsModal
          parcel={{...selectedParcel, enterprise_id: entreprise.id}}
          livreurs={livreurs}
          onClose={() => setSelectedParcel(null)}
          onRefresh={() => {
            setSelectedParcel(null);
            fetchData();
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
