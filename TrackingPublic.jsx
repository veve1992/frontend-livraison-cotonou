import React, { useState, useEffect } from 'react';

export default function TrackingPublic({ colis_id }) {
  const [colis, setColis] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le colis
        const colisRes = await fetch(`${API_URL}/parcels/${colis_id}`);
        const colisData = await colisRes.json();
        setColis(colisData);

        // Récupérer le tracking GPS
        try {
          const trackingRes = await fetch(`${API_URL}/tracking/${colis_id}`);
          const trackingData = await trackingRes.json();
          setTracking(trackingData);
        } catch {
          setTracking(null);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (colis_id) {
      fetchData();
    }
  }, [colis_id]);

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
        <p>Colis non trouvé ou erreur serveur</p>
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

      {/* INFOS GÉNÉRALES */}
      <div style={styles.card}>
        <h2>📦 Détails du Colis</h2>
        <p><strong>De:</strong> {colis.de}</p>
        <p><strong>À:</strong> {colis.a}</p>
        <p><strong>Statut:</strong> {colis.status}</p>
        <p><strong>Livreur:</strong> {tracking?.livreur_nom || 'En cours'}</p>
        <p><strong>Contact Livreur:</strong> {tracking?.livreur_phone || 'N/A'}</p>
      </div>

      {/* STATUS */}
      <div style={styles.card}>
        <h2>📦 Statut</h2>
        <p style={styles.status}>
          <span style={{...styles.badge, backgroundColor: colis.status === 'Livré' ? '#28a745' : colis.status === 'En route' ? '#ffc107' : '#6c757d'}}>
            {colis.status}
          </span>
        </p>
      </div>

      {/* LOCALISATION GPS */}
      {tracking && tracking.latitude && (
        <div style={styles.card}>
          <h2>🗺️ Localisation GPS</h2>
          <p><strong>Position:</strong> {tracking.latitude}, {tracking.longitude}</p>
          <p><strong>Adresse:</strong> {tracking.adresse || 'En cours de mise à jour'}</p>
          <p style={styles.small}>Dernière mise à jour: {new Date(tracking.created_at).toLocaleString('fr-FR')}</p>
        </div>
      )}
      {/* DÉTAILS CLIENT */}
      <div style={styles.card}>
        <h2>👤 Détails Client</h2>
        <p><strong>Nom:</strong> {colis.nom_receptionnaire || 'N/A'} {colis.prenom_receptionnaire || ''}</p>
        <p><strong>Contact:</strong> {colis.contact_receptionnaire || 'N/A'}</p>
        <p><strong>Adresse de livraison:</strong> {colis.adresse_livraison || 'N/A'}</p>
      </div>

      {/* DÉTAILS COLIS */}
      <div style={styles.card}>
        <h2>📮 Détails du Colis</h2>
        <p><strong>De:</strong> {colis.de}</p>
        <p><strong>À:</strong> {colis.a}</p>
        <p><strong>Prix:</strong> {colis.prix} XOF</p>
        {colis.description_colis && (
          <p><strong>Description:</strong> {colis.description_colis}</p>
        )}
      </div>

      {/* LIVREUR */}
      {colis.livreur && (
        <div style={styles.card}>
          <h2>🚚 Livreur Assigné</h2>
          <p><strong>Livreur ID:</strong> {colis.livreur}</p>
          <p><strong>Statut:</strong> En cours de livraison</p>
        </div>
      )}

      {/* PHOTO */}
      {colis.photo_colis && (
        <div style={styles.card}>
          <h2>📸 Photo du Colis</h2>
          <img src={colis.photo_colis} alt="Photo du colis" style={{maxWidth: '100%', height: 'auto', borderRadius: '5px'}} />
        </div>
      )}

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>Pour toute question, contactez le service client</p>
        <button onClick={() => window.location.href = '/'} style={styles.button}>
          ← Retour à la plateforme
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
    padding: '8px 16px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: 'bold',
    display: 'inline-block'
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
    borderRadius: '8px'
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