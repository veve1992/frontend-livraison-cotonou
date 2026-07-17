import React, { useState, useEffect } from 'react';
import SignaturePad from './SignaturePad';

function LivreurDashboard() {
  const [livreurs, setLivreurs] = useState([]);
  const [selectedLivreur, setSelectedLivreur] = useState(null);
  const [assignedParcels, setAssignedParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  const API_URL = 'https://saas-livraison-cotonou.vercel.app';

  useEffect(() => {
    fetchLivreurs();
  }, []);

  const fetchLivreurs = async () => {
    try {
      const response = await fetch(`${API_URL}/livreurs`);
      if (response.ok) {
        const data = await response.json();
        setLivreurs(data);
        if (data.length > 0) {
          selectLivreur(data[0]);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectLivreur = (livreur) => {
    setSelectedLivreur(livreur);
    fetchAssignedParcels(livreur.id);
  };

  const fetchAssignedParcels = async (livreurId) => {
    try {
      const response = await fetch(`${API_URL}/parcels`);
      if (response.ok) {
        const data = await response.json();
        const filtered = data.filter(p => p.livreur === livreurId || p.status === 'En attente');
        setAssignedParcels(filtered);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const updateParcelStatus = async (parcelId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/parcels/${parcelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAssignedParcels(selectedLivreur.id);
        alert('✅ Statut mis à jour !');
      }
    } catch (error) {
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  const handleSignatureClick = (parcel) => {
    setSelectedParcel(parcel);
    setShowSignaturePad(true);
  };

  if (loading) {
    return (
      <div className="livreur-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="livreur-dashboard">
      <div className="dashboard-header">
        <h1>🚚 Dashboard Livreur</h1>
        <p>Gérez vos livraisons et confirmez les arrivées</p>
      </div>

      <div className="dashboard-content">
        {/* Sélection Livreur */}
        <div className="livreur-selector">
          <h3>👤 Sélectionnez un livreur</h3>
          <div className="livreur-list">
            {livreurs.map(livreur => (
              <button
                key={livreur.id}
                className={`livreur-btn ${selectedLivreur?.id === livreur.id ? 'active' : ''}`}
                onClick={() => selectLivreur(livreur)}
              >
                <span className="name">{livreur.nom}</span>
                <span className="stats">
                  {livreur.colis_livres} colis | {livreur.revenus} XOF
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedLivreur && (
          <>
            {/* Infos Livreur */}
            <div className="livreur-info">
              <h3>{selectedLivreur.nom}</h3>
              <div className="info-grid">
                <div>
                  <strong>Téléphone</strong>
                  <p>{selectedLivreur.phone}</p>
                </div>
                <div>
                  <strong>Colis livrés</strong>
                  <p>{selectedLivreur.colis_livres}</p>
                </div>
                <div>
                  <strong>Revenus</strong>
                  <p>{selectedLivreur.revenus} XOF</p>
                </div>
                <div>
                  <strong>Rating</strong>
                  <p>⭐ {selectedLivreur.rating || '—'}</p>
                </div>
              </div>
            </div>

            {/* Colis à livrer */}
            <div className="parcels-section">
              <h3>📦 Colis à livrer ({assignedParcels.length})</h3>

              {assignedParcels.length > 0 ? (
                <div className="parcels-grid">
                  {assignedParcels.map(parcel => (
                    <div key={parcel.id} className="parcel-card">
                      <div className="parcel-header">
                        <h4>Colis #{parcel.id}</h4>
                        <span className={`status-badge ${parcel.status.toLowerCase()}`}>
                          {parcel.status}
                        </span>
                      </div>

                      <div className="parcel-details">
                        <div className="route">
                          <p><strong>De:</strong> {parcel.de}</p>
                          <p><strong>À:</strong> {parcel.a}</p>
                        </div>
                        <p className="price"><strong>Tarif:</strong> {parcel.prix} XOF</p>
                      </div>

                      <div className="parcel-actions">
                        {parcel.status === 'En attente' && (
                          <button
                            className="btn-action btn-start"
                            onClick={() => updateParcelStatus(parcel.id, 'En cours')}
                          >
                            🚚 Commencer livraison
                          </button>
                        )}

                        {parcel.status === 'En cours' && (
                          <button
                            className="btn-action btn-sign"
                            onClick={() => handleSignatureClick(parcel)}
                          >
                            ✍️ Confirmer livraison
                          </button>
                        )}

                        {parcel.status === 'Livré' && (
                          <div className="delivered-badge">
                            ✅ Livré
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty">Aucun colis à livrer</p>
              )}
            </div>

            {/* Signature Pad */}
            {showSignaturePad && selectedParcel && (
              <div className="signature-modal">
                <div className="modal-content">
                  <button className="close-btn" onClick={() => setShowSignaturePad(false)}>✕</button>
                  <SignaturePad
                    parcelId={selectedParcel.id}
                    onSignatureCapture={() => {
                      setShowSignaturePad(false);
                      fetchAssignedParcels(selectedLivreur.id);
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LivreurDashboard;
