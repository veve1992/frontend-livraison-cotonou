import React, { useState, useEffect } from 'react';

function TrackingPage({ parcelId }) {
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://saas-livraison-cotonou.vercel.app';

  useEffect(() => {
    fetchParcelData();
  }, [parcelId]);

  const fetchParcelData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/parcels/${parcelId}`);
      
      if (response.ok) {
        const data = await response.json();
        setParcel(data);
      } else {
        setError('Colis non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tracking-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement du suivi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-page">
        <div className="error-message">
          <p>❌ {error}</p>
          <p>Veuillez vérifier votre numéro de colis</p>
        </div>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="tracking-page">
        <div className="error-message">
          <p>❌ Colis non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <h1>📦 Suivi de votre colis</h1>
        <p className="tracking-id">#{parcel.id}</p>
      </div>

      <div className="tracking-content">
        {/* Statut Principal */}
        <div className="status-card">
          <div className={`status-badge ${parcel.status.toLowerCase()}`}>
            {parcel.status === 'Livré' && '✅'}
            {parcel.status === 'En cours' && '🚚'}
            {parcel.status === 'En attente' && '⏳'}
            {parcel.status}
          </div>
          
          <div className="route-info">
            <div className="location">
              <p className="label">De :</p>
              <p className="value">{parcel.de}</p>
            </div>
            <div className="arrow">→</div>
            <div className="location">
              <p className="label">À :</p>
              <p className="value">{parcel.a}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          <div className={`timeline-item ${parcel.status !== 'En attente' ? 'completed' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Commande créée</h4>
              <p>Votre colis a été enregistré</p>
            </div>
          </div>

          <div className={`timeline-item ${parcel.status === 'En cours' || parcel.status === 'Livré' ? 'completed' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>En route</h4>
              <p>Votre colis est en cours de livraison</p>
              {parcel.livreur && <p className="driver">Livreur: {parcel.livreur}</p>}
            </div>
          </div>

          <div className={`timeline-item ${parcel.status === 'Livré' ? 'completed' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Livré</h4>
              <p>Votre colis a été livré avec succès</p>
            </div>
          </div>
        </div>

        {/* Détails */}
        <div className="details-card">
          <h3>📋 Détails du colis</h3>
          <div className="detail-row">
            <span className="label">Numéro :</span>
            <span className="value">#{parcel.id}</span>
          </div>
          <div className="detail-row">
            <span className="label">Statut :</span>
            <span className={`value status-badge-small ${parcel.status.toLowerCase()}`}>
              {parcel.status}
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Tarif :</span>
            <span className="value">{parcel.prix} XOF</span>
          </div>
          {parcel.livreur && (
            <div className="detail-row">
              <span className="label">Livreur :</span>
              <span className="value">{parcel.livreur}</span>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="contact-card">
          <h3>📞 Besoin d'aide ?</h3>
          <p>Contactez-nous si vous avez des questions</p>
          <button className="btn-contact">Contacter le support</button>
        </div>
      </div>
    </div>
  );
}

export default TrackingPage;
