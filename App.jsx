import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import PricingPage from './PricingPage';
import LivreurDashboard from './LivreurDashboard';
import TrackingPublic from './TrackingPublic';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userType, setUserType] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [showParcelForm, setShowParcelForm] = useState(false);
  const [showLivreurForm, setShowLivreurForm] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [parcelForm, setParcelForm] = useState({
    de: '', a: '', prix: '', nom_receptionnaire: '',
    prenom_receptionnaire: '', contact_receptionnaire: '',
    adresse_livraison: '', description_colis: '', photo_colis: ''
  });
  const [livreurForm, setLivreurForm] = useState({
    nom: '', phone: '', email: '', password: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  // ====================================
  // FONCTIONS POUR LES LIMITES TRIAL
  // ====================================

  const isTrialActive = () => {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return false;
    
    try {
      const user = JSON.parse(saved);
      
      if (user.entreprise && user.entreprise.plan_expiry) {
        const now = new Date();
        const expiry = new Date(user.entreprise.plan_expiry);
        return now <= expiry && user.entreprise.plan === 'startup';
      }
      
      return false;
    } catch (error) {
      console.error('Erreur isTrialActive:', error);
      return false;
    }
  };

  const getPlanStatus = () => {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return 'expired';
    
    try {
      const user = JSON.parse(saved);
      
      if (user.entreprise && user.entreprise.plan_expiry) {
        const now = new Date();
        const expiry = new Date(user.entreprise.plan_expiry);
        
        console.log('🔍 Plan status check:', {
          now: now.toISOString(),
          expiry: expiry.toISOString(),
          plan: user.entreprise.plan,
          isExpired: now > expiry
        });
        
        if (now > expiry) {
          return 'expired';
        }
        
        if (user.entreprise.plan === 'startup') {
          return 'trial';
        }
        
        if (user.entreprise.plan === 'pro' || user.entreprise.plan === 'enterprise') {
          return 'paid';
        }
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
      
      if (user.entreprise && user.entreprise.plan_expiry) {
        const now = new Date();
        const expiry = new Date(user.entreprise.plan_expiry);
        const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        
        return daysLeft > 0 ? daysLeft : 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Erreur getTrialDaysLeft:', error);
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

  // ====================================
  // AUTRES FONCTIONS
  // ====================================

  const getColisEnInstanceLivreur = (livreurId) => {
    if (!livreurId) return 0;
    return parcels.filter(p => parseInt(p.livreur) === parseInt(livreurId) && (p.status === 'Pris' || p.status === 'En route')).length;
  };

  const fetchData = async () => {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return;

    try {
      const user = JSON.parse(saved);
      const token = user.token;
      const enterprise_id = user.entreprise.id;

      const [parcelRes, livreurRes] = await Promise.all([
        fetch(`${API_URL}/parcels?enterprise_id=${enterprise_id}&page=1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/livreurs?enterprise_id=${enterprise_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (parcelRes.ok) {
        const data = await parcelRes.json();
        setParcels(data.data || []);
      }

      if (livreurRes.ok) {
        const data = await livreurRes.json();
        setLivreurs(data || []);
      }
    } catch (error) {
      console.error('Erreur fetch:', error);
    }
  };

  const handleAddParcel = async (e) => {
    e.preventDefault();
    
    const status = getPlanStatus();
    
    if (status === 'expired') {
      alert('❌ Votre trial gratuit a expiré.\nChoisissez un plan pour continuer.');
      window.location.href = '/#/pricing';
      return;
    }
    
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
      
      const response = await fetch(`${API_URL}/parcels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
        setShowParcelForm(false);
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

  const handleAddLivreur = async (e) => {
    e.preventDefault();
    
    const status = getPlanStatus();
    
    if (status === 'expired') {
      alert('❌ Votre trial a expiré');
      return;
    }
    
    if (!canAddLivreur()) {
      alert(`❌ Limite de livreurs atteinte (${livreurs.length}/${getTrialLimits().maxLivreurs})`);
      return;
    }

    if (!livreurForm.nom || !livreurForm.phone) {
      alert('❌ Remplissez tous les champs');
      return;
    }

    try {
      const saved = localStorage.getItem('currentUser');
      const user = JSON.parse(saved);
      
      const response = await fetch(`${API_URL}/livreurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          nom: livreurForm.nom,
          phone: livreurForm.phone,
          enterprise_id: entreprise.id,
          email: livreurForm.email || '',
          password: livreurForm.password || ''
        })
      });

      if (response.ok) {
        alert('✅ Livreur ajouté !');
        setLivreurForm({ nom: '', phone: '', email: '', password: '' });
        setShowLivreurForm(false);
        fetchData();
      } else {
        alert('❌ Erreur lors de l\'ajout');
      }
    } catch (error) {
      alert('❌ Erreur de connexion');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const user = JSON.parse(saved);
      setUserType(user.type);
      setEntreprise(user.entreprise);
      fetchData();
    }
  }, []);

  // ====================================
  // ROUTING
  // ====================================

  const hash = window.location.hash.slice(1);
  const suiviMatch = hash.match(/^\/suivi\/([^\/]+)\/(\d+)$/);

  if (suiviMatch) {
    return <TrackingPublic company_code={suiviMatch[1]} colis_id={suiviMatch[2]} />;
  }

  if (hash === '/login') {
    return <LoginPage />;
  }

  if (hash === '/pricing') {
    return <PricingPage />;
  }

  if (hash === '/dashboard') {
    if (!entreprise) {
      return <LoginPage />;
    }
  }

  if (!entreprise) {
    return <LandingPage />;
  }

  if (userType === 'livreur') {
    return <LivreurDashboard />;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2>🚚 DeliverHub</h2>
        <div>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{...styles.navBtn, backgroundColor: activeTab === 'dashboard' ? '#3498db' : '#ecf0f1'}}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('parcels')}
            style={{...styles.navBtn, backgroundColor: activeTab === 'parcels' ? '#3498db' : '#ecf0f1'}}
          >
            📦 Colis
          </button>
          <button 
            onClick={() => setActiveTab('livreurs')}
            style={{...styles.navBtn, backgroundColor: activeTab === 'livreurs' ? '#3498db' : '#ecf0f1'}}
          >
            👥 Livreurs
          </button>
          <button
            onClick={() => { window.location.href = '/#/pricing'; }}
            style={{ backgroundColor: '#ffc107', color: 'black', fontWeight: 'bold', marginLeft: 'auto', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            💳 Plans & Paiement
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('currentUser');
              window.location.href = '/';
            }}
            style={{...styles.navBtn, backgroundColor: '#dc3545'}}
          >
            🚪 Déconnexion
          </button>
        </div>
      </nav>

      {activeTab === 'dashboard' && (
        <div style={styles.tabContent}>
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

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px'}}>
            <div style={styles.statCard}>
              <h4>📦 Total Colis</h4>
              <p style={{fontSize: '28px', fontWeight: 'bold'}}>{parcels.length}</p>
            </div>
            <div style={styles.statCard}>
              <h4>👥 Livreurs</h4>
              <p style={{fontSize: '28px', fontWeight: 'bold'}}>{livreurs.length}</p>
            </div>
            <div style={styles.statCard}>
              <h4>💰 Revenue</h4>
              <p style={{fontSize: '28px', fontWeight: 'bold'}}>
                {parcels.reduce((sum, p) => sum + (p.prix || 0), 0)} XOF
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'parcels' && (
        <div style={styles.tabContent}>
          <h2>Gestion des Colis</h2>

          <button 
            onClick={() => setShowParcelForm(!showParcelForm)}
            disabled={getPlanStatus() === 'expired' || !canAddParcel()}
            style={{
              opacity: (!canAddParcel() || getPlanStatus() === 'expired') ? 0.5 : 1,
              cursor: (!canAddParcel() || getPlanStatus() === 'expired') ? 'not-allowed' : 'pointer',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginBottom: '20px'
            }}
          >
            {getPlanStatus() === 'expired' ? '🔒 Trial expiré' : !canAddParcel() ? `📦 Limite atteinte (${parcels.length}/${getTrialLimits().maxColis})` : '+ Ajouter un colis'}
          </button>

          {showParcelForm && (
            <form onSubmit={handleAddParcel} style={styles.form}>
              <input
                placeholder="De (ex: Cotonou)"
                value={parcelForm.de}
                onChange={(e) => setParcelForm({...parcelForm, de: e.target.value})}
                style={styles.input}
              />
              <input
                placeholder="À (ex: Parakou)"
                value={parcelForm.a}
                onChange={(e) => setParcelForm({...parcelForm, a: e.target.value})}
                style={styles.input}
              />
              <input
                placeholder="Prix (XOF)"
                value={parcelForm.prix}
                onChange={(e) => setParcelForm({...parcelForm, prix: e.target.value})}
                type="number"
                style={styles.input}
              />
              <button type="submit" style={styles.submitBtn}>✅ Ajouter</button>
            </form>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                <th>De</th>
                <th>À</th>
                <th>Prix</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map(p => (
                <tr key={p.id}>
                  <td>{p.de}</td>
                  <td>{p.a}</td>
                  <td>{p.prix} XOF</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'livreurs' && (
        <div style={styles.tabContent}>
          <h2>Gestion des Livreurs</h2>

          {livreurs.length >= getTrialLimits().maxLivreurs && getPlanStatus() === 'trial' && (
            <div style={{
              backgroundColor: '#fff3cd',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px',
              color: '#856404'
            }}>
              ⚠️ Limite de livreurs atteinte ({livreurs.length}/{getTrialLimits().maxLivreurs})
              <br/>
              <a href="/#/pricing" style={{color: '#dc3545', fontWeight: 'bold', textDecoration: 'none'}}>
                Upgrade maintenant →
              </a>
            </div>
          )}

          <button 
            onClick={() => setShowLivreurForm(!showLivreurForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            + Ajouter un livreur
          </button>

          {showLivreurForm && (
            <form onSubmit={handleAddLivreur} style={styles.form}>
              <input
                placeholder="Nom"
                value={livreurForm.nom}
                onChange={(e) => setLivreurForm({...livreurForm, nom: e.target.value})}
                style={styles.input}
              />
              <input
                placeholder="Téléphone"
                value={livreurForm.phone}
                onChange={(e) => setLivreurForm({...livreurForm, phone: e.target.value})}
                style={styles.input}
              />
              <button type="submit" style={styles.submitBtn}>✅ Ajouter</button>
            </form>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Colis en cours</th>
              </tr>
            </thead>
            <tbody>
              {livreurs.map(l => (
                <tr key={l.id}>
                  <td>{l.nom}</td>
                  <td>{l.phone}</td>
                  <td>{getColisEnInstanceLivreur(l.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  nav: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navBtn: {
    padding: '10px 20px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  tabContent: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '5px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    marginTop: '20px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};