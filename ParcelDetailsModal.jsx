// ====================================
// COMPOSANT : DÉTAILS COLIS + ACTIONS
// ====================================

import React, { useState, useEffect } from 'react';
import SignatureComponent from './SignatureComponent';

export function ParcelDetailsModal({ parcel, livreurs, onClose, onRefresh }) {
  const [selectedLivreur, setSelectedLivreur] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  // ====================================
  // LIVREUR PREND LE COLIS (SMS)
  // ====================================

  const handlePickup = async () => {
    if (!selectedLivreur) {
      setError('⚠️ Veuillez sélectionner un livreur');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/parcels/${parcel.id}/pickup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          livreur_id: selectedLivreur
        })
      });

      if (response.ok) {
        alert('✅ Colis pris! SMS envoyé au client.');
        onRefresh();
        onClose();
      } else {
        setError('❌ Erreur lors de la prise du colis');
      }
    } catch (err) {
      setError(`❌ Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        <h2>📦 Détails du Colis #{parcel.id}</h2>

        {/* INFOS COLIS */}
        <div style={styles.section}>
          <h3>Informations</h3>
          <div style={styles.info}>
            <p><strong>De:</strong> {parcel.de}</p>
            <p><strong>À:</strong> {parcel.a}</p>
            <p><strong>Prix:</strong> {parcel.prix} XOF</p>
            <p><strong>Statut:</strong> <span style={styles.badge}>{parcel.status}</span></p>
            <p><strong>Livreur:</strong> {parcel.livreur || 'Non assigné'}</p>
          </div>
        </div>

        {/* ASSIGNER LIVREUR */}
        {parcel.status === 'En attente' && (
          <div style={styles.section}>
            <h3>Assigner un livreur</h3>
            <select
              value={selectedLivreur}
              onChange={(e) => setSelectedLivreur(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Sélectionner un livreur --</option>
              {livreurs.map(livreur => (
                <option key={livreur.id} value={livreur.id}>
                  {livreur.nom} ({livreur.phone})
                </option>
              ))}
            </select>

            {error && <div style={styles.error}>{error}</div>}

            <button
              onClick={handlePickup}
              disabled={loading || !selectedLivreur}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: loading || !selectedLivreur ? 0.6 : 1
              }}
            >
              {loading ? '⏳ En cours...' : '🚚 Livreur prend le colis (SMS)'}
            </button>
          </div>
        )}
{/* ENREGISTRER POSITION GPS */}
{parcel.status === 'En route' && (
  <div style={styles.section}>
    <h3>📍 Enregistrer Position GPS (Test)</h3>
    <div style={styles.info}>
      <p><strong>Colis:</strong> #{parcel.id}</p>
      <p><strong>Statut:</strong> {parcel.status}</p>
    </div>
    <div style={{marginBottom: '15px'}}>
      <label style={{display: 'block', marginBottom: '8px'}}>Latitude</label>
      <input
        type="number"
        step="0.0001"
        placeholder="6.5"
        defaultValue="6.4969"
        id="latitude"
        style={styles.input}
      />
    </div>
    <div style={{marginBottom: '15px'}}>
      <label style={{display: 'block', marginBottom: '8px'}}>Longitude</label>
      <input
        type="number"
        step="0.0001"
        placeholder="2.6289"
        defaultValue="2.6289"
        id="longitude"
        style={styles.input}
      />
    </div>
    <div style={{marginBottom: '15px'}}>
      <label style={{display: 'block', marginBottom: '8px'}}>Adresse</label>
      <input
        type="text"
        placeholder="Ex: Rue de la Paix, Cotonou"
        defaultValue="Cotonou, Bénin"
        id="adresse"
        style={styles.input}
      />
    </div>
    <button
      onClick={async () => {
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        const adresse = document.getElementById('adresse').value;

        if (!latitude || !longitude) {
          alert('⚠️ Veuillez entrer latitude et longitude');
          return;
        }

        try {
          const response = await fetch(`${API_URL}/tracking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              colis_id: parcel.id,
              livreur_id: selectedLivreur || 1,
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              adresse: adresse
            })
          });

          if (response.ok) {
            alert('✅ Position GPS enregistrée!\n📍 ' + latitude + ', ' + longitude);
          } else {
            alert('❌ Erreur lors de l\'enregistrement');
          }
        } catch (err) {
          alert('❌ Erreur: ' + err.message);
        }
      }}
      style={{...styles.button, ...styles.primaryButton}}
    >
      📍 Enregistrer Position GPS
    </button>
  </div>
)}
        {/* SIGNER LIVRAISON */}
        {parcel.status === 'En route' && (
          <div style={styles.section}>
            {!showSignature ? (
              <button
                onClick={() => setShowSignature(true)}
                style={{...styles.button, ...styles.successButton}}
              >
                ✍️ Signer la livraison
              </button>
            ) : (
              <SignatureComponent
                colis_id={parcel.id}
                onSuccess={() => {
                  alert('✅ Colis livré et signé!');
                  onRefresh();
                  onClose();
                }}
              />
            )}
          </div>
        )}

        {/* STATUT LIVRÉ */}
        {parcel.status === 'Livré' && (
          <div style={styles.successBox}>
            <h3>✅ Colis livré avec succès</h3>
            <p>Le client a signé la réception.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ====================================
// STYLES
// ====================================

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },

  modal: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    position: 'relative'
  },

  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#e74c3c'
  },

  section: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '1px solid #ecf0f1'
  },

  info: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '14px'
  },

  badge: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px'
  },

  select: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #bdc3c7',
    borderRadius: '8px',
    marginBottom: '15px'
  },

  error: {
    backgroundColor: '#ffe6e6',
    color: '#c0392b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: 'bold'
  },

  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },

  primaryButton: {
    backgroundColor: '#3498db',
    color: 'white'
  },

  successButton: {
    backgroundColor: '#27ae60',
    color: 'white'
  },

  successBox: {
    backgroundColor: '#d5f4e6',
    border: '2px solid #27ae60',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center'
  }
};

export default ParcelDetailsModal;