import React, { useState, useEffect } from 'react';

export default function LivreurDashboard({ livreur, entreprise }) {
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  const fetchMesColis = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/livreur/mes-colis/${livreur.id}?enterprise_id=${entreprise.id}&page=${currentPage}`
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

  const handleConfirmerLivraison = async (coliId) => {
    if (!window.confirm('Confirmer la livraison de ce colis ?')) return;

    try {
      const response = await fetch(`${API_URL}/parcels/${coliId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Livré',
          enterprise_id: entreprise.id
        })
      });

      if (response.ok) {
        alert('✅ Colis marqué comme livré !');
        fetchMesColis();
      } else {
        alert('❌ Erreur');
      }
    } catch (error) {
      alert('❌ Erreur: ' + error.message);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
      margin: '0 0 10px 0'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666',
      margin: '5px 0'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    statCard: {
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#007bff'
    },
    colisTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    tableHeader: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px',
      textAlign: 'left',
      fontWeight: 'bold'
    },
    tableRow: {
      borderBottom: '1px solid #ddd',
      padding: '12px'
    },
    statusBadge: (status) => ({
      display: 'inline-block',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: 
        status === 'Livré' ? '#28a745' :
        status === 'Pris' ? '#ffc107' :
        status === 'En route' ? '#17a2b8' :
        '#6c757d',
      color: status === 'Livré' || status === 'En route' ? 'white' : 
             status === 'Pris' ? '#333' : 'white'
    }),
    button: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      backgroundColor: '#28a745',
      color: 'white',
      fontWeight: 'bold'
    },
    pagination: {
      marginTop: '20px',
      textAlign: 'center'
    },
    pageButton: (active) => ({
      padding: '8px 12px',
      margin: '0 5px',
      border: 'none',
      borderRadius: '4px',
      cursor: active ? 'default' : 'pointer',
      backgroundColor: active ? '#007bff' : '#e9ecef',
      color: active ? 'white' : '#333',
      fontWeight: active ? 'bold' : 'normal'
    })
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👋 Bienvenue, {livreur.nom}</h1>
        <p style={styles.subtitle}>📍 {entreprise.nom_entreprise} ({entreprise.country})</p>
        <p style={styles.subtitle}>📧 {livreur.email}</p>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Colis Livrés</div>
          <div style={styles.statValue}>{getColisLivres()}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Colis En Instance</div>
          <div style={styles.statValue}>{getColisEnInstance()}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Revenu Total</div>
          <div style={styles.statValue}>{getRevenuTotal()} XOF</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Rating</div>
          <div style={styles.statValue}>⭐ {livreur.rating || 5.0}</div>
        </div>
      </div>

      <h2>📦 Mes Colis</h2>

      {loading ? (
        <p>⏳ Chargement...</p>
      ) : colis.length === 0 ? (
        <p>Aucun colis assigné pour le moment</p>
      ) : (
        <>
          <table style={styles.colisTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>De</th>
                <th style={styles.tableHeader}>À</th>
                <th style={styles.tableHeader}>Prix</th>
                <th style={styles.tableHeader}>Client</th>
                <th style={styles.tableHeader}>Contact</th>
                <th style={styles.tableHeader}>Statut</th>
                <th style={styles.tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              {colis.map(c => (
                <tr key={c.id} style={styles.tableRow}>
                  <td style={{padding: '12px'}}>{c.id}</td>
                  <td style={{padding: '12px'}}>{c.de}</td>
                  <td style={{padding: '12px'}}>{c.a}</td>
                  <td style={{padding: '12px'}}>{c.prix} XOF</td>
                  <td style={{padding: '12px'}}>
                    {c.prenom_receptionnaire} {c.nom_receptionnaire}
                  </td>
                  <td style={{padding: '12px'}}>{c.contact_receptionnaire}</td>
                  <td style={{padding: '12px'}}>
                    <span style={styles.statusBadge(c.status)}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{padding: '12px'}}>
                    {c.status === 'Pris' || c.status === 'En route' ? (
                      <button 
                        style={styles.button}
                        onClick={() => handleConfirmerLivraison(c.id)}
                      >
                        ✅ Livré
                      </button>
                    ) : (
                      <span style={{color: '#999', fontSize: '12px'}}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                style={styles.pageButton(page === currentPage)}
                onClick={() => setCurrentPage(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}