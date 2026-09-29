# Trafiq Sourcing — Agent de Sourcing & Scoring IA

Plateforme SaaS intelligente de prospection B2B développée dans le cadre du projet de soutenance ENI. **Trafiq Sourcing** automatise la détection, le scoring via Machine Learning et le suivi des opportunités commerciales.

---

## 🛠️ Stack Technique

### Backend
- **Framework :** Python 3 / Django 5 & Django REST Framework (DRF)
- **Documentation API :** Swagger UI / OpenAPI (`drf-spectacular` / `drf-yasg`)
- **Authentification :** JWT (`rest_framework_simplejwt`)
- **Base de données :** MySQL (ou SQLite en environnement dev local)
- **Modélisation ML :** Suivi des versions de modèles de scoring (`ProspectScore`, `model_version`)

### Frontend
- **Framework :** React 18 (Vite) + React Router v6
- **Styles :** Tailwind CSS + Lucide React (icônes)
- **HTTP Client :** Axios avec intercepteurs pour l'injection du token JWT

### DevOps & Containerisation
- **Docker & Docker Compose :** Orchestration multi-conteneurs (Frontend, Backend, BDD, phpMyadmin)

---

## 📁 Architecture du Projet

```text
trafiq-sourcing/
├── backend/                  # Application Django REST
│   ├── core/                 # Configuration globale Django (settings, urls, wsgi/asgi)
│   ├── sourcing/             # App principale (models, views, api/serializers, migrations)
│   ├── templates/ & static/  # Surcharges et styles personnalisés de l'admin Django
│   ├── requirements.txt      # Dépendances Python
│   └── Dockerfile            # Image Docker Backend
├── frontend/                 # Application React SPA (Vite)
│   ├── src/
│   │   ├── api/              # Instance Axios configurée
│   │   ├── components/       # Composants réutilisables (Navbar, ProtectedRoute, Layout)
│   │   ├── pages/            # Vues de l'application
│   │   └── routes/           # Configuration du routage client (AppRoutes)
│   ├── package.json          # Dépendances Node.js
│   └── Dockerfile            # Image Docker Frontend
├── docker-compose.yml        # Orchestration globale du projet
└── README.md
```

---

## 🖥️ Vues & Fonctionnalités Clés (`frontend/src/pages/`)

- **`Login.jsx` (Authentification) :** Formulaire de connexion sécurisé via JWT. Stocks les jetons d'accès et l'objet utilisateur dans le stockage local.
- **`Dashboard.jsx` (Vue d'ensemble) :** Tableau de bord principal affichant les indicateurs clés (total prospects, score moyen, signaux détectés) et la liste des meilleurs prospects repérés.
- **`ProspectDetail.jsx` (Fiche Prospect) :** Vue détaillée d'une entreprise présentant ses informations générales (secteur, effectif, site web), ses contacts clés, ses signaux récents et son analyse de scoring IA.
- **`SourcingProfiles.jsx` (Profils de Sourcing) :** Configuration et paramétrage des critères de ciblage et de la pondération des critères de scoring.
- **`ImportProspects.jsx` (Importation) :** Interface permettant d'importer de nouveaux fichiers de prospects (CSV/Excel) dans la base de données.
- **`Campaigns.jsx` (Gestion des Campagnes) :** Liste et suivi de l'état d'avancement des différentes campagnes de prospection lancées.
- **`CreateCampaign.jsx` (Création de Campagne) :** Formulaire de configuration et de lancement d'une nouvelle campagne basée sur un profil de sourcing.
- **`CampaignDetail.jsx` (Détail d'une Campagne) :** Analyse approfondie des résultats et de la liste des prospects ciblés par une campagne spécifique.
- **`AuditML.jsx` (Audit & Modèles ML) :** Dashboard technique dédié au suivi des performances des modèles de Machine Learning et à la traçabilité des versions de scoring.
- **Documentation API dynamique :** Interface Swagger intégrée (`/swagger/`) permettant de tester l'ensemble des endpoints REST du backend.

---

## 🚀 Installation et Lancement Rapide (Docker)

### 1. Démarrer l'application

```bash
# Cloner le dépôt
git clone <URL_DU_DEPOT_GIT>
cd trafiq-sourcing

# Démarrer tous les services en arrière-plan
docker compose up -d --build
```

### 2. Accéder aux services

- **Frontend React :** `http://localhost:5173`
- **API Backend Django :** `http://localhost:8000/api/`
- **Documentation Swagger UI :** `http://localhost:8000/docs/`
- **Back-office Admin Django :** `http://localhost:8000/admin/`

---

## 🐳 Commandes Usuelles Docker Compose

### Gestion des services

```bash
# Voir l'état des conteneurs
docker compose ps

# Voir les logs en direct
docker compose logs -f

# Voir les logs du backend uniquement
docker compose logs -f backend

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (réinitialisation de la BDD)
docker compose down -v
```

### Base de données & Migrations Django

```bash
# Exécuter les migrations Django
docker compose exec backend python manage.py migrate

# Créer une nouvelle migration
docker compose exec backend python manage.py makemigrations

# Charger le jeu de données de démonstration (fixtures)
docker compose exec backend python manage.py loaddata sourcing/fixtures/prospects.json

# Créer un superutilisateur Admin
docker compose exec backend python manage.py createsuperuser
```

### Accès aux conteneurs

```bash
# Ouvrir un terminal Bash dans le conteneur Backend
docker compose exec backend bash

# Shell Python Django
docker compose exec backend python manage.py shell
```

---

## 💻 Alternative : Lancement Local (Sans Docker)



### 1. Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata sourcing/fixtures/prospects.json
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

</details>