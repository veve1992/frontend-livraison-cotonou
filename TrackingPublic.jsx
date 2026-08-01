import React, { useState, useEffect } from 'react';

export default function TrackingPublic({ company_code, colis_id }) {
  const [colis, setColis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!company_code || !colis_id) {
          setError('Code entreprise ou ID colis manquant');
          setLoading(false);
          return;
        }

        // Récupérer le colis avec vérification du company_code
       const colisRes = await fetch(
  `${API_URL}/tracking/public/${company_code}/${colis_id}`
);
        
        if (!colisRes.ok) {
          if (colisRes.status === 404) {
            setError('Colis non trouvé ou accès refusé');
          } else if (colisRes.status === 403) {
            setError('Colis n\'appartient pas à cette entreprise');
          } else {
            setError('Erreur lors de la récupération du colis');
          }
          setLoading(false);
          return;
        }

        const colisData = await colisRes.json();
        setColis(colisData.colis || colisData);
        setLoading(false);
      } catch (err) {
        setError('Erreur serveur: ' + err.message);
        setLoading(false);
      }
    };

    if (company_code && colis_id) {
      fetchData();
    }
  }, [company_code, colis_id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>📍 Suivi de Votre Colis</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !colis) {
    return (
      <div style={styles.container}>
        <h1>❌ Erreur</h1>
        <p>{error || 'Colis non trouvé'}</p>
        <button onClick={() => window.location.href = '/'} style={styles.button}>
          ← Retour
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📍 Suivi de Votre Colis</h1>
        <p style={styles.colis_id}>Colis #{colis.id}</p>
      </div>

      {/* STATUT PRINCIPAL */}
      <div style={styles.card}>
        <h2>📦 Statut du Colis</h2>
        <p style={styles.status}>
          <span style={{
            ...styles.badge, 
            backgroundColor: colis.status === 'Livré' ? '#4caf50' : 
                            colis.status === 'En route' ? '#ff9800' : 
                            colis.status === 'Pris' ? '#2196f3' : '#9e9e9e'
          }}>
            {colis.status}
          </span>
        </p>
      </div>

      {/* INFOS ITINÉRAIRE */}
      <div style={styles.card}>
        <h2>🗺️ Itinéraire</h2>
        <div style={styles.route}>
          <div style={styles.routePoint}>
            <div style={styles.routeDot}>📍</div>
            <div>
              <strong>Départ</strong>
              <p>{colis.de}</p>
            </div>
          </div>
          <div style={styles.routeLine}></div>
          <div style={styles.routePoint}>
            <div style={styles.routeDot}>🏁</div>
            <div>
              <strong>Arrivée</strong>
              <p>{colis.a}</p>
            </div>
          </div>
        </div>
      </div>

      {/* LOCALISATION GPS */}
      {colis.latitude && colis.longitude && (
        <div style={styles.card}>
          <h2>📡 Localisation GPS</h2>
          <p><strong>Position actuelle:</strong> {colis.latitude?.toFixed(6)}, {colis.longitude?.toFixed(6)}</p>
          <p style={styles.small}>
            🕐 Mise à jour: {colis.date_livraison ? new Date(colis.date_livraison).toLocaleString('fr-FR') : 'En attente'}
          </p>
        </div>
      )}

      {/* HEURE DE LIVRAISON */}
      {colis.date_livraison && (
        <div style={styles.card}>
          <h2>🕐 Heure de Livraison</h2>
          <p><strong>Date et heure:</strong> {new Date(colis.date_livraison).toLocaleString('fr-FR')}</p>
        </div>
      )}

      {/* LIVREUR ASSIGNÉ */}
      {colis.livreur && (
        <div style={styles.card}>
          <h2>🚚 Livreur Assigné</h2>
          <p><strong>ID Livreur:</strong> {colis.livreur}</p>
          <p style={styles.small}>Votre colis est en cours de livraison</p>
        </div>
      )}

      {/* DÉTAILS CLIENT */}
      <div style={styles.card}>
        <h2>👤 Informations de Livraison</h2>
        <p><strong>Destinataire:</strong> {colis.nom_receptionnaire || 'N/A'} {colis.prenom_receptionnaire || ''}</p>
        <p><strong>Contact:</strong> {colis.contact_receptionnaire || 'N/A'}</p>
        <p><strong>Adresse de livraison:</strong> {colis.adresse_livraison || 'N/A'}</p>
      </div>

      {/* DÉTAILS COLIS */}
      <div style={styles.card}>
        <h2>📦 Détails du Colis</h2>
        <p><strong>Prix:</strong> {colis.prix} XOF</p>
        {colis.description_colis && (
          <>
            <p><strong>Description:</strong> {colis.description_colis}</p>
          </>
        )}
      </div>

      {/* PHOTO */}
      {colis.photo_colis && (
        <div style={styles.card}>
          <h2>📸 Photo du Colis</h2>
          <img 
            src={colis.photo_colis} 
            alt="Photo du colis" 
            style={{maxWidth: '100%', height: 'auto', borderRadius: '5px'}} 
          />
        </div>
      )}

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>Merci pour votre confiance ! Pour toute question, contactez le support.</p>
        <button onClick={() => window.location.href = '/'} style={styles.button}>
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    borderBottom: '3px solid #007BFF',
    paddingBottom: '20px'
  },
  colis_id: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007BFF',
    margin: '10px 0 0 0'
  },
  card: {
    backgroundColor: 'white',
    padding: '25px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '5px solid #007BFF'
  },
  status: {
    fontSize: '18px',
    marginTop: '10px'
  },
  badge: {
    padding: '10px 20px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: 'bold',
    display: 'inline-block',
    fontSize: '16px'
  },
  route: {
    padding: '20px 0'
  },
  routePoint: {
    display: 'flex',
    gap: '15px',
    marginBottom: '10px'
  },
  routeDot: {
    fontSize: '24px'
  },
  routeLine: {
    width: '3px',
    height: '30px',
    backgroundColor: '#007BFF',
    margin: '0 auto 10px 12px'
  },
  small: {
    fontSize: '12px',
    color: '#999',
    marginTop: '10px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  button: {
    marginTop: '20px',
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};