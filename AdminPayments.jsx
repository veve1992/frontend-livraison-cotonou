import React, { useState, useEffect } from 'react';

export default function AdminPayments() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saas-livraison-cotonou-backend.onrender.com';

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Récupérer le mot de passe depuis localStorage (ou prompt)
    const adminPassword = '[TON MOT DE PASSE ADMIN]'; // À remplacer
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      fetchDemands();
    } else {
      alert('❌ Mot de passe incorrect');
      setPassword('');
    }
  };

 const fetchDemands = async () => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/admin/payments`);
    const data = await response.json();
    setDemands(data);
    setLoading(false);
  } catch (error) {
    console.error('Erreur fetch:', error);
    alert('❌ Erreur chargement demandes');
    setLoading(false);
  }
};
  const handleApproveDemand = async (reference) => {
    try {
      const adminPassword = '[TON MOT DE PASSE ADMIN]';
      
      const response = await fetch(`${API_URL}/api/admin/approve-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reference: reference,
          admin_password: adminPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Paiement approuvé !\nExpiration: ${data.expiry_date}`);
        // Retirer de la liste
        setDemands(demands.filter(d => d.reference !== reference));
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
          <h1>🔐 Admin Panel</h1>
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
      <h1>💳 Gestion des paiements</h1>
      
      <button
        onClick={() => setIsAuthenticated(false)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        🚪 Déconnexion
      </button>

      {loading ? (
        <p>Chargement...</p>
      ) : demands.length === 0 ? (
        <p style={styles.emptyState}>✅ Aucune demande en attente</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Montant</th>
              <th>Référence</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {demands.map(demand => (
              <tr key={demand.id}>
                <td>{demand.company_code}</td>
                <td>{demand.email}</td>
                <td>{demand.plan}</td>
                <td>{demand.amount} XOF</td>
                <td>{demand.reference}</td>
                <td>{new Date(demand.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button
                    onClick={() => handleApproveDemand(demand.reference)}
                    style={styles.approveBtn}
                  >
                    ✅ Approuver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  loginBox: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '40px',
    backgroundColor: '#f5f5f5',
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  approveBtn: {
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
  }
};