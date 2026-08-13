\# 🚚 DeliverHub Frontend



\*\*Interface React pour la gestion des livraisons\*\*



\## 🚀 Démarrage rapide



\### Installation



```bash

npm install

```



\### Démarrage développement



```bash

npm run dev

```



L'app démarre sur : `http://localhost:5173`



\### Build production



```bash

npm run build

```



\## 📁 Structure des fichiers

src/

├── App.jsx # App principale

├── LandingPageMarketing.jsx # Page d'accueil marketing

├── LandingPage.jsx # Suivi public + accès

├── LoginPage.jsx # Connexion

├── RegisterGestionnaire.jsx # Inscription gestionnaire

├── RegisterLivreur.jsx # Inscription livreur

├── App2.jsx # Dashboard gestionnaire

├── LivreurDashboard.jsx # Dashboard livreur

├── ParcelDetailsModal.jsx # Détails du colis

├── AdminPayments.jsx # Admin - Approuver paiements

├── AdminEnterprises.jsx # Admin - Gérer entreprises

├── SupportPage.jsx # Page support

├── GuidePage.jsx # Guide d'utilisation

└── TrackingPublic.jsx # Suivi public détaillé

\## 🎨 Pages principales



\### LandingPageMarketing

\- Page d'accueil avec pricing

\- 3 boutons : S'inscrire, Connexion, Suivi

\- Lien vers Support \& Guide



\### LandingPage

\- Suivi public du colis

\- Accès gestionnaire (→ LoginPage)

\- Accès livreur (→ LoginPage)



\### Dashboard Gestionnaire

\- Ajouter colis

\- Lister colis

\- Assigner livreur

\- Voir revenus

\- S'abonner PRO/ENTERPRISE



\### Dashboard Livreur

\- Voir ses colis

\- Confirmer livraison

\- Capturer GPS

\- Voir revenus



\### Admin

\- Approuver paiements

\- Bloquer/débloquer entreprises

\- Lister demandes



\## 🌐 Routes



| Route | Description |

|-------|-------------|

| `/#/` | Landing page marketing |

| `/#/landing` | Suivi public + accès |

| `/#/tracking` | Suivi public |

| `/#/login` | Connexion |

| `/#/register-gestionnaire` | Inscription gestionnaire |

| `/#/register-livreur` | Inscription livreur |

| `/#/dashboard` | Dashboard (selon rôle) |

| `/#/admin` | Approuver paiements |

| `/#/admin-enterprises` | Gérer entreprises |

| `/#/support` | Support contact |

| `/#/guide` | Guide d'utilisation |



\## 🔐 Authentification



JWT via localStorage

\- Token stocké dans `currentUser`

\- Vérifié à chaque requête

\- Déconnexion = suppression du localStorage



\## 🌐 Déploiement



Render.com

\- Frontend : https://frontend-livraison-cotonou.onrender.com

\- Domaine : https://deliverhub-africa.com



\## 📧 Support



Email : bienhagla@gmail.com

WhatsApp : +229 95 90 46 78



\## 📝 Version



v1.0 - MVP Complete (Août 2026)



