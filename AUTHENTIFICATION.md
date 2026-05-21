# 🔐 Système d'Authentification eBloodSys

## Vue d'ensemble

L'authentification de Blood Connect est basée sur **JWT (JSON Web Tokens)** avec **rôles d'accès** pour contrôler les permissions à différents niveaux.

### Rôles disponibles

- **donneur** : Utilisateur qui donne du sang
- **infirmier** : Personnel de collecte de sang
- **medecin** : Personnel médical pour validation
- **admin_hopital** : Administrateur de l'établissement
- **super_admin** : Administrateur système

---

## Backend (AdonisJS)

### Architecture

#### 1. Contrôleurs d'authentification

**[apps/backend/app/controllers/access_token_controller.ts](apps/backend/app/controllers/access_token_controller.ts)**

- `store()` : Connexion et génération de JWT
- `destroy()` : Déconnexion et invalidation du token
- `verifier()` : Vérification du token actuel

**[apps/backend/app/controllers/new_account_controller.ts](apps/backend/app/controllers/new_account_controller.ts)**

- `store()` : Inscription avec sélection du rôle

#### 2. Middleware

**[apps/backend/app/middleware/auth_middleware.ts](apps/backend/app/middleware/auth_middleware.ts)**

- Vérifie qu'un token JWT valide est présent

**[apps/backend/app/middleware/verifier_role_middleware.ts](apps/backend/app/middleware/verifier_role_middleware.ts)**

- Vérifie que l'utilisateur a un des rôles autorisés
- Usage : `.use(middleware.verifierRole(['admin_hopital', 'super_admin']))`

#### 3. Modèle

**[apps/backend/app/models/user.ts](apps/backend/app/models/user.ts)**

- Champs : `id`, `nomComplet`, `email`, `motDePasse`, `role`, `telephone`, `estActif`
- Intégration JWT avec `DbAccessTokensProvider`

#### 4. Routes protégées

**[apps/backend/start/routes.ts](apps/backend/start/routes.ts)**

```
POST   /api/v1/auth/inscription          → Créer un compte
POST   /api/v1/auth/connexion            → Se connecter (JWT)
POST   /api/v1/auth/deconnexion          → Se déconnecter
GET    /api/v1/auth/verifier             → Vérifier l'authentification

GET    /api/v1/compte/profil             → Voir le profil (auth)

GET    /api/v1/donneurs                  → Public
POST   /api/v1/donneurs                  → auth + infirmier/admin_hopital

POST   /api/v1/dons                      → auth + donneur/infirmier
PATCH  /api/v1/dons/:id/valider          → auth + infirmier/medecin
PATCH  /api/v1/dons/:id/rejeter          → auth + medecin/admin_hopital

GET    /api/v1/stocks                    → auth
PUT    /api/v1/stocks/:id                → auth + admin_hopital

GET    /api/v1/alertes                   → auth
PATCH  /api/v1/alertes/:id/resoudre      → auth + admin_hopital
```

---

## Frontend (Next.js)

### Architecture

#### 1. Configuration API

**[apps/frontend/config/api.ts](apps/frontend/config/api.ts)**

- Définit l'URL de base (`NEXT_PUBLIC_API_URL`)
- Exporte les interfaces TypeScript (`User`, `AuthResponse`, etc.)

#### 2. Contexte et Hook d'authentification

**[apps/frontend/app/providers/auth-provider.tsx](apps/frontend/app/providers/auth-provider.tsx)**

**Contexte :**

```tsx
useAuth() → {
  user,                    // Utilisateur actuellement connecté
  token,                   // JWT token
  isLoading,               // État de chargement
  isAuthenticated,         // Boolean
  inscription(),           // (data: SignupData) => Promise
  connexion(),             // (data: LoginData) => Promise
  deconnexion(),           // () => Promise
  verifierAuth(),          // () => boolean
  chargerProfil(),         // () => Promise
  peutAcceder(),           // (roles: string[]) => boolean
  estConnecte(),           // () => boolean
}
```

**Hooks :**

```tsx
useAuth()           // Accès complet au contexte
useAuthRole(...)    // Vérifier les rôles rapidement
```

#### 3. Composants de protection

**[apps/frontend/components/auth/protected-route.tsx](apps/frontend/components/auth/protected-route.tsx)**

```tsx
<ProtectedRoute allowedRoles={['donneur']}>
  {/* Contenu visible uniquement par les donneurs */}
</ProtectedRoute>

<RoleBasedContent allowedRoles={['admin_hopital']}>
  {/* Visible uniquement pour admin_hopital */}
</RoleBasedContent>
```

#### 4. Pages d'authentification

- **[apps/frontend/app/auth/connexion/page.tsx](apps/frontend/app/auth/connexion/page.tsx)** : Formulaire de connexion
- **[apps/frontend/app/auth/inscription/page.tsx](apps/frontend/app/auth/inscription/page.tsx)** : Inscription avec choix du rôle

#### 5. Pages de redirection par rôle

- **[apps/frontend/app/console/page.tsx](apps/frontend/app/console/page.tsx)** : Redirection automatique selon le rôle
- **[apps/frontend/app/donor/tableau-de-bord/page.tsx](apps/frontend/app/donor/tableau-de-bord/page.tsx)** : Dashboard donneur
- **[apps/frontend/app/hospital/page.tsx](apps/frontend/app/hospital/page.tsx)** : Dashboard personnel hôpital
  - [collecte/page.tsx](apps/frontend/app/hospital/collecte/page.tsx) → Infirmier
  - [validations/page.tsx](apps/frontend/app/hospital/validations/page.tsx) → Médecin
  - [stocks/page.tsx](apps/frontend/app/hospital/stocks/page.tsx) → Admin hôpital

---

## Flux d'authentification

### Inscription

1. Utilisateur remplit le formulaire (nom, email, mot de passe, rôle)
2. Frontend valide les données
3. `POST /auth/inscription` → Backend crée l'utilisateur et génère un JWT
4. Frontend stocke le token dans `localStorage` avec clé `auth_token`
5. Redirection automatique vers `/console` qui redirige selon le rôle

### Connexion

1. Utilisateur entre email + mot de passe
2. `POST /auth/connexion` → Backend valide et génère JWT
3. Frontend stocke le token et redirige vers `/console`

### Vérification (au démarrage)

1. Si `localStorage` contient `auth_token`
2. `GET /auth/verifier` avec le token dans les headers
3. Si valide → charger les données utilisateur
4. Si invalide → nettoyer et rediriger vers `/auth/connexion`

### Déconnexion

1. `POST /auth/deconnexion` avec le token
2. Supprimer le token du `localStorage`
3. Rediriger vers `/auth/connexion`

---

## Stockage du Token

Le token JWT est stocké dans **localStorage** :

```javascript
localStorage.setItem('auth_token', token)
localStorage.removeItem('auth_token')
```

> ⚠️ **Note** : Dans une application en production, considérez HttpOnly cookies pour plus de sécurité.

---

## Variables d'environnement

### Frontend

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
```

### Backend

```bash
# .env
NODE_ENV=development
APP_KEY=<clé chiffrée>
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=blood_connect
```

---

## Tests

### 1. Inscription

```bash
curl -X POST http://localhost:3333/api/v1/auth/inscription \
  -H "Content-Type: application/json" \
  -d '{
    "nomComplet": "Jean Dupont",
    "email": "jean@exemple.com",
    "motDePasse": "password123",
    "motDePasseConfirmation": "password123",
    "role": "donneur",
    "telephone": "+229 XXXXXXXX"
  }'
```

### 2. Connexion

```bash
curl -X POST http://localhost:3333/api/v1/auth/connexion \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@exemple.com",
    "motDePasse": "password123"
  }'
```

### 3. Vérifier l'authentification

```bash
curl -X GET http://localhost:3333/api/v1/auth/verifier \
  -H "Authorization: Bearer <token>"
```

---

## Sécurité

✅ **Implémenté :**

- JWT tokens (AdonisJS)
- Validation des rôles par middleware
- Hachage des mots de passe (bcrypt)
- Vérification CSRF (AdonisJS Shield)
- CORS configuré

⚠️ **À améliorer en production :**

- Utiliser HttpOnly Cookies au lieu de localStorage
- Ajouter rate limiting sur les endpoints d'auth
- Implémenter refresh tokens
- HTTPS obligatoire
- Ajouter 2FA pour les admin

---

## Checklist d'intégration

- [x] Backend : Middleware d'authentification
- [x] Backend : Middleware de vérification des rôles
- [x] Backend : Routes protégées par rôle
- [x] Backend : Contrôleurs auth améliorés
- [x] Frontend : Context d'authentification
- [x] Frontend : Composants de protection de routes
- [x] Frontend : Pages d'authentification
- [x] Frontend : Redirection par rôle
- [ ] Backend : Tests unitaires
- [ ] Frontend : Tests E2E
- [ ] Documentation Postman/API
