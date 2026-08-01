import React, { useState, useEffect, useRef } from 'react';

const LivreurDashboard = ({ livreur, entreprise }) => {
  const API_URL = 'https://saas-livraison-cotonou-backend.onrender.com';
  
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // GPS & Signature
  const [selectedColis, setSelectedColis] = useState(null);
  const [gps, setGps] = useState({ latitude: null, longitude: null });
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const fetchMesColis = async () => {
    try {
      setLoading(true);
      
      const saved = localStorage.getItem('currentUser');
      const token = saved ? JSON.parse(saved).token : '';
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(
        `${API_URL}/livreur/mes-colis/${livreur.id}?enterprise_id=${entreprise.id}&page=${currentPage}`,
        { headers }
      );
      const data = await response.json();
      
      if (response.ok) {
        setColis(data.data);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (livreur && entreprise) {
      fetchMesColis();
    }
  }, [currentPage, livreur, entreprise]);

  const getColisLivres = () => {
    return colis.filter(c => c.status === 'Livré').length;
  };

  const getColisEnInstance = () => {
    return colis.filter(c => c.status === 'Pris' || c.status === 'En route').length;
  };

  const getRevenuTotal = () => {
    return colis
      .filter(c => c.status === 'Livré')
      .reduce((sum, c) => sum + parseInt(c.prix), 0);
  };

  // ✅ CAPTURER GPS
  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert('❌ Géolocalisation non supportée');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGps({ latitude, longitude });
        alert(`✅ Position capturée:\n📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        alert('❌ Impossible de capturer la position: ' + error.message);
      }
    );
  };

  // ✅ SIGNATURE CANVAS
  useEffect(() => {
    if (showSignatureModal && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
    }
  }, [showSignatureModal]);

  const handleCanvasMouseDown = () => setIsDrawing(true);
  const handleCanvasMouseUp = () => setIsDrawing(false);
  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getSignatureData = () => {
    return canvasRef.current.toDataURL('image/png');
  };

  // ✅ CONFIRMER LIVRAISON AVEC GPS + SIGNATURE
  const handleConfirmerLivraison = async () => {
    if (!selectedColis) {
      alert('❌ Aucun colis sélectionné');
      return;
    }

    if (!gps.latitude || !gps.longitude) {
      alert('❌ Veuillez d\'abord capturer la position GPS');
      return;
    }

    const signature = getSignatureData();

    if (!window.confirm('Confirmer la livraison de ce colis ?')) return;

    try {
      const saved = localStorage.getItem('currentUser');
      const token = saved ? JSON.parse(saved).token : '';
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`${API_URL}/parcels/${selectedColis.id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          status: 'Livré',
          enterprise_id: entreprise.id,
          latitude: gps.latitude,
          longitude: gps.longitude,
          signature: signature
        })
      });

      if (response.ok) {
        alert('✅ Colis marqué comme livré avec GPS + Signature !');
        setGps({ latitude: null, longitude: null });
        setShowSignatureModal(false);
        setSelectedColis(null);
        fetchMesColis();
      } else {
        const error = await response.json();
        alert('❌ Erreur: ' + (error.error || 'Impossible de confirmer'));
      }
    } catch (error) {
      alert('❌ Erreur: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>👋 Bienvenue, {livreur.nom}</h1>
      <p>📍 Entreprise {entreprise.nom_entreprise} ({entreprise.country})</p>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>✅ Colis Livrés</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getColisLivres()}</p>
        </div>
        <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>🚚 Colis En Instance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getColisEnInstance()}</p>
        </div>
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>💰 Revenu Total</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{getRevenuTotal()} XOF</p>
        </div>
      </div>

      {/* TABLEAU COLIS */}
      <h2>📦 Mes Colis</h2>
      {loading ? (
        <p>⏳ Chargement...</p>
      ) : colis.length === 0 ? (
        <p>❌ Aucun colis assigné</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>De</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>À</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Prix</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Client</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Contact</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Statut</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {colis.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>#{c.id}</td>
                <td style={{ padding: '10px' }}>{c.de}</td>
                <td style={{ padding: '10px' }}>{c.a}</td>
                <td style={{ padding: '10px' }}>{c.prix} XOF</td>
                <td style={{ padding: '10px' }}>{c.nom_receptionnaire || '—'}</td>
                <td style={{ padding: '10px' }}>{c.contact_receptionnaire || '—'}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    background: c.status === 'Livré' ? '#4caf50' : c.status === 'Pris' ? '#ff9800' : '#2196f3',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '4px'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  {c.status !== 'Livré' && (
                    <button
                      onClick={() => {
                        setSelectedColis(c);
                        captureGPS();
                        setTimeout(() => setShowSignatureModal(true), 500);
                      }}
                      style={{
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Livrer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* PAGINATION */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{ marginRight: '10px', padding: '8px 12px' }}
        >
          ⬅️ Précédent
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{ marginLeft: '10px', padding: '8px 12px' }}
        >
          Suivant ➡️
        </button>
      </div>

      {/* SIGNATURE MODAL */}
      {showSignatureModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>✍️ Signature de Réception</h2>
            <p>📍 Position GPS : {gps.latitude?.toFixed(6)}, {gps.longitude?.toFixed(6)}</p>

            <p style={{ fontSize: '14px', color: '#666' }}>Signez dans la zone ci-dessous :</p>
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              onMouseDown={handleCanvasMouseDown}
              onMouseUp={handleCanvasMouseUp}
              onMouseMove={handleCanvasMouseMove}
              style={{
                border: '2px solid #ccc',
                borderRadius: '4px',
                cursor: 'crosshair',
                display: 'block',
                margin: '10px auto',
                background: 'white'
              }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={clearSignature}
                style={{
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🔄 Effacer
              </button>
              <button
                onClick={handleConfirmerLivraison}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✅ Confirmer Livraison
              </button>
              <button
                onClick={() => setShowSignatureModal(false)}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivreurDashboard;