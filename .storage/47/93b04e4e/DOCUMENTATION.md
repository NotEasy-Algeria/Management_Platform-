# 🏫 Plateforme de Gestion de Crèche - Documentation Complète

## 📋 Table des Matières
1. [Vue d'ensemble](#vue-densemble)
2. [Fonctionnalités](#fonctionnalités)
3. [Architecture technique](#architecture-technique)
4. [Installation et déploiement](#installation-et-déploiement)
5. [Guide d'utilisation](#guide-dutilisation)
6. [API et données](#api-et-données)
7. [Sécurité](#sécurité)
8. [Maintenance](#maintenance)

---

## 🎯 Vue d'ensemble

### Description
La **Plateforme de Gestion de Crèche** est une application web complète conçue pour faciliter la gestion quotidienne d'une crèche en Algérie. Elle offre des interfaces distinctes pour les administrateurs, éducateurs et parents, permettant une communication fluide et une gestion efficace des enfants, activités, paiements et documents.

### Objectifs
- **Simplifier la gestion administrative** des crèches
- **Améliorer la communication** entre parents et éducateurs
- **Centraliser les informations** sur les enfants et leurs activités
- **Automatiser le suivi** des paiements et présences
- **Digitaliser la documentation** médicale et administrative

### Public cible
- **Directeurs de crèche** et administrateurs
- **Éducateurs** et personnel pédagogique
- **Parents** d'enfants inscrits
- **Personnel administratif**

---

## 🚀 Fonctionnalités

### 👨‍💼 Espace Administrateur

#### 📊 Tableau de bord
- **Vue d'ensemble** avec statistiques en temps réel
- **Graphiques interactifs** des inscriptions et revenus
- **Alertes** pour les paiements en retard
- **Indicateurs de performance** de la crèche

#### 👶 Gestion des enfants
- **CRUD complet** : Créer, lire, modifier, supprimer
- **Profils détaillés** : informations personnelles, médicales, contacts d'urgence
- **Groupes d'âge** : Petit (6m-2ans), Moyen (2-3ans), Grand (3-5ans)
- **Statuts** : Actif, Inactif, En attente
- **Recherche et filtrage** avancés
- **Export de données** au format PDF/Excel

#### 👩‍🏫 Gestion des éducateurs
- **Profils du personnel** avec spécialités et expérience
- **Affectation aux groupes** d'enfants
- **Suivi des formations** et certifications
- **Évaluation des performances**
- **Planning des congés** et remplacements

#### 📚 Gestion des cours et activités
- **Création d'activités** par tranche d'âge
- **Planification hebdomadaire** avec calendrier interactif
- **Suivi des participants** par activité
- **Évaluation des compétences** développées
- **Ressources pédagogiques** associées

#### 📅 Planning et horaires
- **Vue calendrier** hebdomadaire et mensuelle
- **Gestion des créneaux** par groupe et éducateur
- **Conflits de planning** automatiquement détectés
- **Notifications** de changements
- **Impression des plannings**

#### 💰 Gestion financière
- **Suivi des paiements** mensuels
- **Facturation automatique** avec numérotation
- **Relances automatiques** pour impayés
- **Rapports financiers** détaillés
- **Gestion des remises** et tarifs préférentiels

#### 💸 Gestion des dépenses
- **Catégorisation** : Salaires, fournitures, services, maintenance
- **Suivi budgétaire** avec alertes de dépassement
- **Validation** à plusieurs niveaux
- **Rapports de dépenses** par période
- **Intégration comptable**

#### 📄 Gestion documentaire
- **Upload de fichiers** sécurisé
- **Catégorisation** : Médical, administratif, photos
- **Validation** et approbation des documents
- **Archivage automatique** avec horodatage
- **Recherche full-text** dans les documents

### 👨‍👩‍👧‍👦 Espace Parent

#### 🏠 Tableau de bord personnel
- **Résumé des activités** de l'enfant
- **Notifications importantes** en temps réel
- **Prochains événements** et rendez-vous
- **Statistiques de présence** et développement

#### 👶 Profil de l'enfant
- **Informations complètes** : personnelles, médicales, contacts
- **Historique des activités** avec photos et commentaires
- **Suivi du développement** : moteur, cognitif, social
- **Présences et absences** détaillées
- **Évolution des compétences** avec jalons

#### 💳 Gestion des paiements
- **Historique complet** des factures
- **Paiement en ligne** sécurisé (à venir)
- **Téléchargement des reçus** PDF
- **Alertes d'échéances** par email/SMS
- **Suivi des soldes** et arriérés

#### 💬 Communication
- **Messagerie directe** avec les éducateurs
- **Notifications push** pour messages urgents
- **Signalement d'absences** en ligne
- **Demandes de rendez-vous**
- **Feedback** sur les activités

### 👩‍🏫 Espace Éducateur

#### 📝 Suivi quotidien
- **Saisie des activités** réalisées
- **Notes comportementales** et développement
- **Incidents** et observations médicales
- **Photos** et vidéos des activités
- **Communication** avec les parents

#### 👥 Gestion de groupe
- **Liste des enfants** assignés
- **Planning des activités** du jour
- **Présences** et retards
- **Besoins spéciaux** et allergies
- **Contacts d'urgence** rapides

---

## 🏗️ Architecture Technique

### Stack Technologique

#### Frontend
- **React 18** avec TypeScript pour la robustesse
- **Vite** comme bundler pour des performances optimales
- **Tailwind CSS** pour un design responsive et moderne
- **Shadcn/ui** pour des composants UI cohérents
- **React Router** pour la navigation SPA
- **React Hook Form** pour la gestion des formulaires
- **Zod** pour la validation des données
- **Lucide React** pour les icônes
- **Sonner** pour les notifications toast

#### Backend (Architecture prévue)
- **Node.js** avec Express.js
- **PostgreSQL** comme base de données principale
- **Supabase** pour l'authentification et API temps réel
- **JWT** pour l'authentification sécurisée
- **Multer** pour l'upload de fichiers
- **Nodemailer** pour les notifications email

#### Infrastructure
- **Docker** pour la containerisation
- **Nginx** comme reverse proxy
- **Redis** pour le cache et sessions
- **Cloudflare** pour le CDN et sécurité
- **PM2** pour la gestion des processus Node.js

### Structure du Projet

```
creche-platform/
├── public/                     # Fichiers statiques
│   ├── assets/                # Images, icônes, documents
│   └── index.html             # Point d'entrée HTML
├── src/
│   ├── components/            # Composants réutilisables
│   │   ├── ui/               # Composants UI de base (Shadcn)
│   │   ├── AdminLayout.tsx   # Layout pour l'admin
│   │   ├── ParentLayout.tsx  # Layout pour les parents
│   │   └── ProtectedRoute.tsx # Protection des routes
│   ├── contexts/             # Contextes React
│   │   └── AuthContext.tsx   # Gestion de l'authentification
│   ├── hooks/                # Hooks personnalisés
│   │   └── useApi.ts         # Hooks pour les appels API
│   ├── lib/                  # Utilitaires et configuration
│   │   ├── api.ts           # Configuration API et types
│   │   └── utils.ts         # Fonctions utilitaires
│   ├── pages/               # Pages de l'application
│   │   ├── admin/           # Pages administrateur
│   │   ├── parent/          # Pages parent
│   │   └── *.tsx           # Pages publiques
│   ├── styles/              # Styles globaux
│   └── main.tsx            # Point d'entrée React
├── package.json            # Dépendances et scripts
├── tailwind.config.js     # Configuration Tailwind
├── vite.config.ts         # Configuration Vite
└── tsconfig.json         # Configuration TypeScript
```

---

## 🚀 Installation et Déploiement

### Prérequis

#### Développement Local
```bash
# Versions requises
Node.js >= 18.0.0
npm >= 8.0.0 ou pnpm >= 7.0.0
Git >= 2.30.0
```

#### Production
```bash
# Serveur Linux (Ubuntu 22.04 LTS recommandé)
CPU: 2 vCPU minimum (4 vCPU recommandé)
RAM: 4 GB minimum (8 GB recommandé)
Stockage: 50 GB SSD minimum
Bande passante: 100 Mbps
```

### Installation Locale

#### 1. Clonage du projet
```bash
# Cloner le repository
git clone https://github.com/votre-org/creche-platform.git
cd creche-platform

# Installer les dépendances
pnpm install
```

#### 2. Configuration de l'environnement
```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer les variables d'environnement
nano .env.local
```

Variables d'environnement requises :
```env
# Application
VITE_APP_NAME="Ma Crèche"
VITE_APP_URL="http://localhost:5173"

# API
VITE_API_URL="http://localhost:3000/api"
VITE_API_VERSION="v1"

# Supabase (optionnel pour le développement)
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Upload de fichiers
VITE_MAX_FILE_SIZE="5242880" # 5MB
VITE_ALLOWED_FILE_TYPES="pdf,jpg,jpeg,png,doc,docx"
```

#### 3. Lancement en développement
```bash
# Démarrer le serveur de développement
pnpm dev

# L'application sera accessible sur http://localhost:5173
```

#### 4. Build de production
```bash
# Construire l'application
pnpm build

# Prévisualiser le build
pnpm preview
```

### Déploiement sur VPS

#### 1. Préparation du serveur
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# Installation de Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de pnpm
npm install -g pnpm pm2
```

#### 2. Configuration de la base de données
```bash
# Installation de PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Configuration de PostgreSQL
sudo -u postgres psql
CREATE DATABASE creche_db;
CREATE USER creche_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE creche_db TO creche_user;
\q
```

#### 3. Déploiement de l'application
```bash
# Créer un utilisateur pour l'application
sudo adduser --system --group --home /var/www/creche creche

# Cloner le projet
sudo -u creche git clone https://github.com/votre-org/creche-platform.git /var/www/creche/app
cd /var/www/creche/app

# Installation des dépendances
sudo -u creche pnpm install

# Configuration de l'environnement
sudo -u creche cp .env.example .env.production
sudo -u creche nano .env.production

# Build de production
sudo -u creche pnpm build
```

#### 4. Configuration Nginx
```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/creche-platform
```

Configuration Nginx :
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    root /var/www/creche/app/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy (si backend séparé)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. Activation et SSL
```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/creche-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtenir un certificat SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

### Déploiement avec Docker

#### 1. Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - database
    restart: unless-stopped

  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: creche_db
      POSTGRES_USER: creche_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## 📖 Guide d'Utilisation

### Première Configuration

#### 1. Compte Administrateur par défaut
```
Email: admin@macreche.dz
Mot de passe: Admin123!
```

#### 2. Configuration initiale
1. **Profil de la crèche** : Nom, adresse, téléphone, email
2. **Paramètres généraux** : Horaires, tarifs, groupes d'âge
3. **Création des éducateurs** : Profils du personnel
4. **Définition des activités** : Cours et programmes pédagogiques

### Workflow Quotidien

#### Pour les Administrateurs
1. **Matin** : Vérification du tableau de bord et alertes
2. **Inscription** : Traitement des nouvelles demandes
3. **Suivi** : Contrôle des présences et activités
4. **Soir** : Validation des rapports quotidiens

#### Pour les Éducateurs
1. **Arrivée** : Pointage et vérification du planning
2. **Activités** : Saisie en temps réel des observations
3. **Communication** : Messages aux parents si nécessaire
4. **Fin de journée** : Bilan et préparation du lendemain

#### Pour les Parents
1. **Consultation** : Vérification des activités de l'enfant
2. **Communication** : Lecture des messages des éducateurs
3. **Paiements** : Suivi des échéances et règlements
4. **Feedback** : Retours sur les activités

---

## 🔧 API et Données

### Structure de la Base de Données

#### Tables Principales
```sql
-- Utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'educator', 'parent')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enfants
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    parent_id UUID REFERENCES users(id),
    group_name VARCHAR(50),
    enrollment_date DATE NOT NULL,
    medical_info TEXT,
    allergies TEXT,
    emergency_contact VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Éducateurs
CREATE TABLE educators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    specialties TEXT[],
    experience VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Activités
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    age_group VARCHAR(50),
    educator_id UUID REFERENCES educators(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_participants INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Paiements
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES children(id),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    invoice_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

#### Authentification
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/profile
```

#### Gestion des enfants
```
GET    /api/children              # Liste des enfants
POST   /api/children              # Créer un enfant
GET    /api/children/:id          # Détails d'un enfant
PUT    /api/children/:id          # Modifier un enfant
DELETE /api/children/:id          # Supprimer un enfant
```

#### Gestion des éducateurs
```
GET    /api/educators             # Liste des éducateurs
POST   /api/educators             # Créer un éducateur
PUT    /api/educators/:id         # Modifier un éducateur
DELETE /api/educators/:id         # Supprimer un éducateur
```

#### Activités et planning
```
GET    /api/activities            # Liste des activités
POST   /api/activities            # Créer une activité
GET    /api/activities/schedule   # Planning hebdomadaire
PUT    /api/activities/:id        # Modifier une activité
```

#### Paiements
```
GET    /api/payments              # Liste des paiements
POST   /api/payments              # Créer un paiement
PUT    /api/payments/:id          # Modifier un paiement
GET    /api/payments/invoices/:id # Télécharger facture
```

---

## 🔒 Sécurité

### Authentification et Autorisation

#### JWT (JSON Web Tokens)
- **Durée de vie** : 15 minutes pour l'access token
- **Refresh token** : 7 jours
- **Algorithme** : RS256 avec clés publique/privée
- **Claims personnalisés** : rôle, permissions, crèche_id

#### Contrôle d'accès basé sur les rôles (RBAC)
```typescript
// Définition des rôles
enum UserRole {
  ADMIN = 'admin',
  EDUCATOR = 'educator',
  PARENT = 'parent'
}

// Permissions par rôle
const PERMISSIONS = {
  admin: ['*'], // Toutes les permissions
  educator: [
    'children:read',
    'activities:create',
    'activities:update',
    'messages:send'
  ],
  parent: [
    'child:read:own',
    'payments:read:own',
    'messages:read:own',
    'messages:send'
  ]
}
```

### Protection des Données

#### Chiffrement
- **En transit** : TLS 1.3 obligatoire
- **Au repos** : AES-256 pour les données sensibles
- **Mots de passe** : bcrypt avec salt rounds = 12
- **Données personnelles** : Chiffrement au niveau application

#### Validation et Sanitisation
```typescript
// Exemple de validation avec Zod
const childSchema = z.object({
  firstName: z.string().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s-]+$/),
  lastName: z.string().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s-]+$/),
  birthDate: z.string().datetime(),
  medicalInfo: z.string().max(1000).optional(),
  allergies: z.string().max(500).optional()
});
```

---

## 🔧 Maintenance

### Monitoring et Logs

#### Métriques Système
- **Temps de réponse** des API
- **Taux d'erreur** par endpoint
- **Utilisation des ressources** (CPU, RAM, disque)
- **Nombre d'utilisateurs** actifs
- **Performance de la base de données**

#### Logs Structurés
```javascript
// Configuration Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Sauvegardes

#### Base de Données
```bash
#!/bin/bash
# Script de sauvegarde automatique

DB_NAME="creche_db"
BACKUP_DIR="/var/backups/creche"
DATE=$(date +%Y%m%d_%H%M%S)

# Sauvegarde complète
pg_dump -h localhost -U creche_user -d $DB_NAME | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Nettoyage des anciennes sauvegardes (garde 30 jours)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

### Mises à Jour

#### Processus de Déploiement
```bash
#!/bin/bash
# Script de déploiement automatisé

set -e

echo "🚀 Début du déploiement..."

# 1. Sauvegarde avant mise à jour
./backup.sh

# 2. Récupération du code
git pull origin main

# 3. Installation des dépendances
pnpm install --frozen-lockfile

# 4. Build de production
pnpm run build

# 5. Test de santé
curl -f http://localhost/health || exit 1

# 6. Redémarrage des services
pm2 reload ecosystem.config.js

echo "✅ Déploiement terminé avec succès!"
```

---

## 📞 Support et Contact

### Équipe de Développement
- **Développeur Principal** : Alex (Engineer)
- **Email** : support@macreche.dz
- **Téléphone** : +213 XXX XXX XXX

### Niveaux de Support
1. **Niveau 1** : Support utilisateur (formation, questions)
2. **Niveau 2** : Support technique (bugs, configurations)
3. **Niveau 3** : Support expert (architecture, optimisations)

### SLA (Service Level Agreement)
- **Disponibilité** : 99.9% (8h45 d'arrêt max par an)
- **Temps de réponse** : < 2 secondes (95e percentile)
- **Support critique** : < 1 heure
- **Support standard** : < 24 heures

---

## 📝 Changelog

### Version 1.0.0 (Janvier 2024)
- ✅ Interface d'administration complète
- ✅ Espace parent avec suivi enfant
- ✅ Gestion des paiements et factures
- ✅ Système de messagerie
- ✅ Gestion documentaire
- ✅ Planning et activités

### Roadmap Future
- 🔄 Intégration paiement en ligne
- 🔄 Application mobile (React Native)
- 🔄 Notifications push
- 🔄 Rapports avancés avec BI
- 🔄 Intégration caméras de surveillance
- 🔄 Module de nutrition