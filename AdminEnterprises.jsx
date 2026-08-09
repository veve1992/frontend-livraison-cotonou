import React, { useState, useEffect } from 'react';

export default function AdminEnterprises() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  const handleLogin = (e) => {
    e.preventDefault();
    
    const adminPassword = '[TON MOT DE PASSE ADMIN]'; // À remplacer
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      fetchEnterprises();
    } else {
      alert('❌ Mot de passe incorrect');
      setPassword('');
    }
  };

  const fetchEnterprises = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/enterprises`);
      const data = await response.json();
      setEnterprises(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur fetch:', error);
      alert('❌ Erreur chargement entreprises');
      setLoading(false);
    }
  };

  const handleBlockEnterprise = async (enterpriseId, companyCode) => {
    const confirm = window.confirm(`Bloquer ${companyCode} ?`);
    if (!confirm) return;

    try {
      const adminPassword = '[TON MOT DE PASSE ADMIN]';
      
      const response = await fetch(`${API_URL}/api/admin/enterprise/${enterpriseId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          admin_password: adminPassword,
          action: 'block'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`🔒 ${companyCode} bloquée`);
        fetchEnterprises(); // Rafraîchir la liste
      } else {
        alert('❌ Erreur: ' + data.error);
      }
    } catch (error) {
      alert('❌ Erreur de connexion');
      console.error(error);
    }
  };

  const handleUnblockEnterprise = async (enterpriseId, companyCode) => {
    const confirm = window.confirm(`Débloquer ${companyCode} pour 30j ?`);
    if (!confirm) return;

    try {
      const adminPassword = '[TON MOT DE PASSE ADMIN]';
      
      const response = await fetch(`${API_URL}/api/admin/enterprise/${enterpriseId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          admin_password: adminPassword,
          action: 'unblock'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`🔓 ${companyCode} débloquée pour 30j`);
        fetchEnterprises(); // Rafraîchir la liste
      } else {
        alert('❌ Erreur: ' + data.error);
      }
    } catch (error) {
      alert('❌ Erreur de connexion');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h1>🔐 Admin - Gestion Entreprises</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Connexion
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🏢 Gestion des Entreprises</h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={styles.logoutBtn}
        >
          🚪 Déconnexion
        </button>
      </div>

      {loading ? (
        <p style={styles.loading}>Chargement...</p>
      ) : enterprises.length === 0 ? (
        <p style={styles.emptyState}>✅ Aucune entreprise</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Entreprise</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Plan</th>
                <th style={styles.th}>Expire</th>
                <th style={styles.th}>Jours</th>
                <th style={styles.th}>État</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {enterprises.map(e => (
                <tr key={e.id} style={{...styles.row, backgroundColor: e.isExpired ? '#ffe6e6' : '#f9f9f9'}}>
                  <td style={styles.td}>{e.nom_entreprise}</td>
                  <td style={styles.td}><strong>{e.company_code}</strong></td>
                  <td style={styles.td}>{e.email}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{e.plan.toUpperCase()}</span>
                  </td>
                  <td style={styles.td}>{new Date(e.plan_expiry).toLocaleDateString('fr-FR')}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.daysLeft,
                      color: e.isExpired ? '#dc3545' : '#28a745'
                    }}>
                      {e.daysLeft}j
                    </span>
                  </td>
                  <td style={styles.td}>
                    {e.isExpired ? (
                      <span style={styles.expired}>🔴 EXPIRÉ</span>
                    ) : (
                      <span style={styles.active}>🟢 ACTIF</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    {e.isExpired ? (
                      <button
                        onClick={() => handleUnblockEnterprise(e.id, e.company_code)}
                        style={styles.unblockBtn}
                      >
                        🔓 Débloquer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockEnterprise(e.id, e.company_code)}
                        style={styles.blockBtn}
                      >
                        🔒 Bloquer
                      </button>
                    )}
                  </td>
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
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  loginBox: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  tableWrapper: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  headerRow: {
    backgroundColor: '#2c3e50',
    color: 'white'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd'
  },
  row: {
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '12px 15px'
  },
  badge: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  daysLeft: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  active: {
    color: '#28a745',
    fontWeight: 'bold'
  },
  expired: {
    color: '#dc3545',
    fontWeight: 'bold'
  },
  blockBtn: {
    padding: '8px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  unblockBtn: {
    padding: '8px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px'
  }
};