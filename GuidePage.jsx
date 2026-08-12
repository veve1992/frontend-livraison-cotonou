import React, { useState } from 'react';

export default function GuidePage() {
  const [expandedSection, setExpandedSection] = useState('gestionnaire');

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      borderBottom: '2px solid #ddd',
      flexWrap: 'wrap'
    },
    tab: {
      padding: '12px 20px',
      background: '#f0f0f0',
      border: 'none',
      borderRadius: '5px 5px 0 0',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    tabActive: {
      background: '#0066cc',
      color: 'white'
    },
    section: {
      marginBottom: '30px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '2px solid #0066cc'
    },
    stepTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#0066cc',
      marginTop: '20px',
      marginBottom: '10px'
    },
    stepContent: {
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.8',
      marginBottom: '15px',
      paddingLeft: '20px',
      borderLeft: '3px solid #0066cc'
    },
    code: {
      background: '#f5f5f5',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      marginTop: '10px',
      overflow: 'auto'
    },
    warning: {
      background: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: '5px',
      padding: '15px',
      marginTop: '15px',
      color: '#856404'
    },
    success: {
      background: '#d4edda',
      border: '1px solid #28a745',
      borderRadius: '5px',
      padding: '15px',
      marginTop: '15px',
      color: '#155724'
    }
  };

  const renderGestionnaireGuide = () => (
    <div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>1️⃣ INSCRIPTION</h3>
        <div style={styles.stepContent}>
          <strong>Étapes :</strong>
          <ol>
            <li>Allez sur https://deliverhub-africa.com</li>
            <li>Cliquez sur "S'INSCRIRE"</li>
            <li>Remplissez le formulaire avec :
              <ul>
                <li>📧 Email professionnel</li>
                <li>🔐 Mot de passe sécurisé</li>
                <li>🏪 Nom de l'entreprise</li>
                <li>📍 Code entreprise (unique)</li>
                <li>🌍 Pays : Bénin</li>
                <li>📱 Préfixe : +229</li>
              </ul>
            </li>
            <li>Cliquez "S'INSCRIRE"</li>
          </ol>
        </div>
        <div style={styles.success}>
          ✅ Vous avez 7 jours gratuits !<br/>
          • 10 colis par mois<br/>
          • 2 livreurs maximum
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>2️⃣ SE CONNECTER</h3>
        <div style={styles.stepContent}>
          <strong>Étapes :</strong>
          <ol>
            <li>Allez sur https://deliverhub-africa.com</li>
            <li>Cliquez "CONNEXION GESTIONNAIRE"</li>
            <li>Entrez email et mot de passe</li>
            <li>Cliquez "SE CONNECTER"</li>
          </ol>
        </div>
        <div style={styles.warning}>
          ⚠️ IMPORTANT :<br/>
          • Gardez votre mot de passe secret<br/>
          • Déconnectez-vous toujours avant de fermer
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>3️⃣ AJOUTER UN COLIS</h3>
        <div style={styles.stepContent}>
          <strong>Étapes :</strong>
          <ol>
            <li>Dans le dashboard, cliquez "➕ AJOUTER UN COLIS"</li>
            <li>Remplissez :
              <ul>
                <li>De : lieu de départ</li>
                <li>À : lieu de destination</li>
                <li>Prix : montant en XOF</li>
                <li>Client : nom, prénom, contact</li>
                <li>Description du colis</li>
                <li>Adresse de livraison</li>
              </ul>
            </li>
            <li>Cliquez "📦 AJOUTER LE COLIS"</li>
          </ol>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>4️⃣ AJOUTER UN LIVREUR</h3>
        <div style={styles.stepContent}>
          <strong>Les livreurs S'INSCRIVENT EUX-MÊMES :</strong>
          <ol>
            <li>Donnez votre CODE ENTREPRISE au livreur</li>
            <li>Le livreur va sur https://deliverhub-africa.com</li>
            <li>Le livreur clique "INSCRIPTION LIVREUR"</li>
            <li>Le livreur entre le code entreprise</li>
            <li>Le livreur crée son compte</li>
          </ol>
        </div>
        <div style={styles.success}>
          ✅ Le livreur apparaît automatiquement dans votre liste !
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>5️⃣ ASSIGNER UN LIVREUR</h3>
        <div style={styles.stepContent}>
          <strong>Étapes :</strong>
          <ol>
            <li>Trouvez le colis "En attente" dans le tableau</li>
            <li>Cliquez "👁️ VOIR DÉTAILS"</li>
            <li>Sélectionnez un livreur dans le menu</li>
            <li>Cliquez "🚚 LIVREUR PREND LE COLIS"</li>
          </ol>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>6️⃣ S'ABONNER PRO/ENTERPRISE</h3>
        <div style={styles.stepContent}>
          <strong>Avant expiration (7 jours) :</strong>
          <ol>
            <li>Cliquez "💳 S'ABONNER"</li>
            <li>Choisissez PRO (26,950 XOF) ou ENTERPRISE (54,450 XOF)</li>
            <li>Suivez les instructions de paiement</li>
            <li>⏳ Attendez l'approbation (24-48h)</li>
          </ol>
        </div>
        <div style={styles.warning}>
          ⚠️ APRÈS APPROBATION :<br/>
          1. Déconnectez-vous<br/>
          2. Reconnectez-vous<br/>
          3. Appuyez Shift+F5 (important !)
        </div>
      </div>
    </div>
  );

  const renderLivreurGuide = () => (
    <div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>1️⃣ S'INSCRIRE</h3>
        <div style={styles.stepContent}>
          <strong>Vous avez besoin de :</strong>
          <ul>
            <li>Votre email personnel</li>
            <li>Un mot de passe</li>
            <li>Votre numéro de téléphone</li>
            <li>🔑 CODE ENTREPRISE (demandez à votre patron)</li>
          </ul>
          <strong style={{ marginTop: '15px', display: 'block' }}>Étapes :</strong>
          <ol>
            <li>Allez sur https://deliverhub-africa.com</li>
            <li>Cliquez "INSCRIPTION LIVREUR"</li>
            <li>Remplissez le formulaire</li>
            <li>Entrez le CODE ENTREPRISE</li>
            <li>Cliquez "S'INSCRIRE"</li>
          </ol>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>2️⃣ SE CONNECTER</h3>
        <div style={styles.stepContent}>
          <strong>Étapes :</strong>
          <ol>
            <li>Allez sur https://deliverhub-africa.com</li>
            <li>Cliquez "CONNEXION LIVREUR"</li>
            <li>Entrez email et mot de passe</li>
            <li>Cliquez "SE CONNECTER"</li>
          </ol>
        </div>
        <div style={styles.warning}>
          ⚠️ APRÈS CONNEXION :<br/>
          Appuyez Shift+F5 pour charger vos colis !
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>3️⃣ VOIR MES COLIS</h3>
        <div style={styles.stepContent}>
          <strong>Votre dashboard affiche :</strong>
          <ul>
            <li>Tous vos colis assignés</li>
            <li>Statut actuel (Pris, En route, Livré)</li>
            <li>Détails du client et de la livraison</li>
            <li>Revenus totaux</li>
          </ul>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>4️⃣ CONFIRMER LA LIVRAISON</h3>
        <div style={styles.stepContent}>
          <strong>Étapes :</strong>
          <ol>
            <li>Trouvez le colis dans votre liste</li>
            <li>Cliquez "👁️ VOIR DÉTAILS"</li>
            <li>Cherchez "✍️ CONFIRMER LA RÉCEPTION"</li>
            <li>Cliquez "📍 CAPTURER LA POSITION GPS"</li>
            <li>Cochez "Je confirme la réception"</li>
            <li>Le statut passe à "Livré"</li>
          </ol>
        </div>
        <div style={styles.success}>
          ✅ GPS et heure de livraison enregistrés !<br/>
          Le client peut voir exactement où vous êtes
        </div>
      </div>
    </div>
  );

  const renderClientGuide = () => (
    <div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🎯 SUIVRE VOTRE COLIS</h3>
        <div style={styles.stepContent}>
          <strong>Vous n'avez pas besoin de compte !</strong>
          <ol>
            <li>Demandez le lien de suivi à votre vendeur</li>
            <li>Cliquez sur le lien</li>
            <li>Vous voyez :
              <ul>
                <li>Statut du colis</li>
                <li>Lieu de départ et destination</li>
                <li>Position GPS du livreur EN TEMPS RÉEL</li>
                <li>Heure de livraison</li>
                <li>Détails du livreur</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 STATUTS POSSIBLES</h3>
        <div style={styles.stepContent}>
          <ul>
            <li><strong>🔵 EN ATTENTE</strong> - Pas encore assigné à un livreur</li>
            <li><strong>🟠 PRIS</strong> - Le livreur a pris votre colis</li>
            <li><strong>🟡 EN ROUTE</strong> - Le livreur le livre maintenant</li>
            <li><strong>🟢 LIVRÉ</strong> - Colis livré ! ✅</li>
          </ul>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📍 POSITION GPS</h3>
        <div style={styles.stepContent}>
          Vous pouvez voir exactement où se trouve le livreur en temps réel.
          <br/>
          Le GPS est enregistré à chaque livraison pour plus de transparence.
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 GUIDE D'UTILISATION DELIVERHUB</h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Instructions complètes pour gestionnaires, livreurs et clients
        </p>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(expandedSection === 'gestionnaire' && styles.tabActive)
          }}
          onClick={() => setExpandedSection('gestionnaire')}
        >
          🏢 GESTIONNAIRES
        </button>
        <button
          style={{
            ...styles.tab,
            ...(expandedSection === 'livreur' && styles.tabActive)
          }}
          onClick={() => setExpandedSection('livreur')}
        >
          👨‍💼 LIVREURS
        </button>
        <button
          style={{
            ...styles.tab,
            ...(expandedSection === 'client' && styles.tabActive)
          }}
          onClick={() => setExpandedSection('client')}
        >
          📦 CLIENTS
        </button>
      </div>

      {expandedSection === 'gestionnaire' && renderGestionnaireGuide()}
      {expandedSection === 'livreur' && renderLivreurGuide()}
      {expandedSection === 'client' && renderClientGuide()}

      <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
        <p>Besoin d'aide ? Contactez le support : <strong>bienhagla@gmail.com</strong></p>
        <p style={{ fontSize: '12px' }}>© 2026 DeliverHub - Tous droits réservés</p>
      </div>
    </div>
  );
}