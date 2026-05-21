# SKILL — eBloodSys / Blood-Connect
## Projet de Fin d'Études — HECM Filière SIL 2025-2026
### Digitalisation de la gestion des dons de sang en République du Bénin

---

## 0. IDENTITÉ DU PROJET

| Champ | Valeur |
|---|---|
| Nom application | **eBloodSys** (officiel mémoire) / Blood-Connect (interne) |
| Établissement | Haute École de Commerce et de Management (HECM), Abomey-Calavi |
| Filière | Systèmes Informatiques et Logiciels (SIL) |
| Année | 2025-2026 |
| Auteurs | ADAM SOULE Bilal · EKPINSE Aïssi Prince |
| Maître de mémoire | Dr Amadou Tidjani SANDA MAHAMA |
| Entreprise de stage | PixelliumPlus, Carrefour Gninin, Akassato, Abomey-Calavi |
| Directeur PixelliumPlus | M. Fabrice AZEMAHOUSSONOU |
| Langue du projet | **Français** (code, commentaires, variables, attributs, routes) |

---

## 1. CONTEXTE ET PROBLÉMATIQUE

### 1.1 Problème terrain (enquête CHUZ Abomey-Calavi)

Le Centre Hospitalier Universitaire de la Mère et de l'Enfant Lagune (CHUMEL) d'Abomey-Calavi, principal centre transfusionnel du Littoral et de l'Atlantique au Bénin, fonctionne avec :

- Enregistrement des donneurs sur fiches papier uniquement
- Aucune base de données centralisée des donneurs
- Suivi des stocks sanguins par registres physiques, non mis à jour en temps réel
- Communication inter-établissements par téléphone ou messagers physiques
- Usage informel et non structuré de WhatsApp/Facebook pour les urgences
- Résultats de tests biologiques transmis sous enveloppe papier sans archivage numérique
- Registre PSL (Produits Sanguins Labiles) uniquement papier

### 1.2 Données terrain clés

- **OML** = CHUMEL = Centre équivalent CNTS pour Littoral/Atlantique
- **Deux types de poches** : DCL et PCL
- **Bon de demande de sang** : délivré uniquement par le médecin
- **Frais administratifs** : 2 500 FCFA (pas une vente de sang)
- **Tests biologiques obligatoires** : VIH, Hépatite B (HBS), Hépatite C, TPHA, VDL
- **Délai entre deux dons** : 90 jours minimum
- **Durée de validité d'une poche** : 42 jours
- **Déficit national** : ~70 000 poches de sang/an
- **Objectif OMS** : 1% de la population comme donneurs réguliers

### 1.3 Question de recherche

Comment concevoir et mettre en œuvre une solution numérique capable de digitaliser et d'optimiser le processus de gestion des dons de sang en République du Bénin ?

---

## 2. STACK TECHNIQUE

| Couche | Technologie | Version |
|---|---|---|
| Frontend web | Next.js + React.js | 16+ |
| Frontend mobile | React Native | — |
| UI Components | HeroUI v3 | 3.0.0-rc.1 |
| CSS | TailwindCSS | 4 |
| Icônes | iconsax-reactjs | — |
| QR Code | qrcode.react | — |
| Cartes | react-leaflet | — |
| Backend | AdonisJS | 6+ |
| Base de données | MySQL | 8+ |
| Auth | JWT (Access Tokens AdonisJS) | — |
| Monorepo | Turborepo | — |
| Langue code | TypeScript | — |

### 2.1 Structure du monorepo

```
bc-web/
  apps/
    frontend/          ← Next.js (web)
    backend/           ← AdonisJS (API)
  packages/
    shared/            ← types partagés
```

---

## 3. RÈGLES GÉNÉRALES DE CODE

### 3.1 Langue

- **Tout est en français** : noms de variables, attributs, colonnes BDD, commentaires, messages d'erreur, routes API
- Exception : noms de frameworks et librairies (camelCase anglais si imposé par la lib)
- Les `enum` utilisent des valeurs françaises : `en_attente`, `valide`, `rejete`, `planifie`, `confirme`, `annule`, `effectue`
- Les types de rôles utilisateur : `donneur`, `infirmier`, `medecin`, `admin_hopital`, `super_admin`

### 3.2 HeroUI v3 — Règles strictes

HeroUI v3 est une rupture avec NextUI et HeroUI v2. **Ces règles sont non-négociables** :

#### Boutons
```tsx
// ✅ CORRECT — variants v3
<Button variant="primary">Valider</Button>
<Button variant="secondary">Annuler</Button>
<Button variant="tertiary">Voir</Button>
<Button variant="outline">Filtrer</Button>
<Button variant="ghost">Ignorer</Button>
<Button variant="danger">Supprimer</Button>

// ✅ Props correctes
<Button onPress={() => {}} isPending={chargement} fullWidth size="sm">
  Confirmer
</Button>

// ❌ INTERDIT — n'existe pas en v3
<Button variant="solid">...</Button>      // → primary
<Button variant="flat">...</Button>       // → secondary
<Button variant="bordered">...</Button>   // → outline
<Button onClick={() => {}}>...</Button>   // → onPress
<Button color="danger">...</Button>       // → variant="danger"
```

#### Alert — Syntaxe dot notation obligatoire
```tsx
// ✅ CORRECT — dot notation v3
<Alert status="danger">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Titre de l'alerte</Alert.Title>
    <Alert.Description>Description détaillée</Alert.Description>
  </Alert.Content>
</Alert>

// Statuts disponibles : "default" | "accent" | "success" | "warning" | "danger"

// ❌ INTERDIT — ancienne API
<Alert color="danger" title="..." description="..." />
```

#### Chip
```tsx
// ✅ CORRECT
<Chip color="success">Validé</Chip>
<Chip color="warning">En attente</Chip>
<Chip color="danger">Rejeté</Chip>
<Chip color="default">Inactif</Chip>
<Chip size="sm" color="warning">Planifié</Chip>
```

#### Select — Dot notation
```tsx
<Select>
  <Select.Trigger>
    <Select.Value placeholder="Choisir..." />
    <Select.Indicator />
  </Select.Trigger>
  <Select.Popover>
    <ListBox>
      <ListBox.Item id="val">
        <ListBox.ItemIndicator />
        Libellé
      </ListBox.Item>
    </ListBox>
  </Select.Popover>
</Select>
```

### 3.3 Patterns frontend récurrents

#### Panneau de détail latéral (pattern universel)
```tsx
// Toujours à droite, width 288px (w-72), self-start
// Bouton × pour fermer
// Sections : badge identité + infos + actions
```

#### Tableau avec filtre
```tsx
// Barre de recherche (icône SearchNormal1 d'iconsax) + boutons filtres HeroUI
// En-tête gris bg-gray-50
// Lignes avec hover:bg-gray-50
// Clic sur ligne → ouvre panneau détail
```

#### Feedback Alert
```tsx
// Toujours Alert status="success" ou "danger" après action
// setTimeout 3000ms pour effacer
// setLastAction(null) après délai
```

---

## 4. ACTEURS DU SYSTÈME

### 4.1 Acteurs primaires

| Acteur | Rôle BDD | Espace frontend |
|---|---|---|
| **Donneur** | `donneur` | `app/donor/` |
| **Infirmier / Agent de collecte** | `infirmier` | `app/hospital/` |
| **Médecin** | `medecin` | `app/hospital/` |
| **Admin Hôpital** | `admin_hopital` | `app/hospital/` |
| **Super Admin CNTS** | `super_admin` | `app/console/` |

### 4.2 Acteurs secondaires

| Acteur | Rôle |
|---|---|
| **Système de notifications** | Rappels 90j, alertes stock, confirmations |

### 4.3 Règle importante : le patient

Le patient **n'est pas un utilisateur** de l'application. Il est une entité dans la table `bons_demande` (nom + groupe sanguin). Seul le médecin crée le bon en son nom.

---

## 5. CAS D'UTILISATION PAR ACTEUR

### Donneur (6 UC)
1. S'inscrire et se connecter
2. Consulter sa carte digitale avec QR code
3. Consulter l'historique des dons et badges
4. Localiser les centres de collecte
5. Recevoir un rappel automatique de don (90 jours)
6. Prendre un rendez-vous + modifier son profil

### Infirmier / Agent de collecte (6 UC)
1. Se connecter
2. Scanner le QR code et vérifier l'éligibilité du donneur
3. Enregistrer un don (volume, type de poche DCL/PCL)
4. Saisir les résultats des tests biologiques (VIH, HBS, Hépatite C, TPHA, VDL)
5. Valider ou rejeter une poche
6. Consulter et mettre à jour les stocks + RDV attribués

### Médecin (5 UC)
1. Se connecter
2. Consulter la disponibilité du sang
3. Créer un bon de demande de sang
4. Enregistrer une demande non satisfaite (registre PSL)
5. Tracer le transfert + consulter les RDV

### Admin Hôpital (5 UC)
1. Se connecter
2. Gérer les informations de l'établissement
3. Gérer les membres et demandes d'accès
4. Consulter et mettre à jour les stocks
5. Consulter et résoudre les alertes

### Super Admin CNTS (5 UC)
1. Se connecter
2. Gérer les établissements
3. Approuver ou rejeter les demandes d'accès membres
4. Consulter les stocks nationaux
5. Gérer les comptes donneurs

### Système notifications (3 UC)
1. Envoyer rappel automatique de don (90 jours après le dernier don)
2. Envoyer alerte de stock critique
3. Envoyer confirmation de don au donneur

---

## 6. MODÈLE DE DONNÉES COMPLET

> **RAPPEL** : Tous les attributs sont en **français** dans la BDD et dans les modèles.

### 6.1 Table `utilisateurs`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `nom_complet` | VARCHAR(150) | nullable |
| `email` | VARCHAR(191) | unique, obligatoire |
| `prenom` | VARCHAR(80) | obligatoire |
| `nom` | VARCHAR(80) | obligatoire |
| `date_naissance` | DATE | nullable |
| `telephone` | VARCHAR(20) | nullable |
| `commune` | VARCHAR(100) | nullable |
| `departement` | VARCHAR(80) | nullable |
| `mot_de_passe` | VARCHAR(255) | obligatoire, hashé bcrypt |
| `role` | ENUM | donneur, infirmier, medecin, admin_hopital, super_admin |
| `telephone` | VARCHAR(20) | nullable |
| `est_actif` | BOOLEAN | défaut: true |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.2 Table `donneurs` heritage de users

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `utilisateur_id` | UUID | FK → utilisateurs, nullable |
| `code_donneur` | VARCHAR(20) | unique, format BC-AAAA-NNNNN |
| `groupe_sanguin` | ENUM | A+, A-, B+, B-, AB+, AB-, O+, O- |
| `total_dons` | INTEGER | défaut: 0 |
| `date_dernier_don` | DATE | nullable |
| `date_eligibilite_suivante` | DATE | calculée auto (dernier don + 90j) |
| `niveau_badge` | ENUM | aucun, bronze, argent, or, platine |
| `donnees_qr_code` | TEXT | nullable, généré auto |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

**Règle badge** :
- bronze : 1-3 dons
- argent : 4-9 dons
- or : 10-24 dons
- platine : 25 dons et plus

### 6.3 Table `hopitaux`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `nom` | VARCHAR(150) | obligatoire |
| `type` | ENUM | cnts, chu, antenne, hopital, centre, mobile |
| `adresse` | VARCHAR(255) | nullable |
| `commune` | VARCHAR(100) | nullable |
| `departement` | VARCHAR(80) | nullable |
| `telephone` | VARCHAR(20) | nullable |
| `email` | VARCHAR(150) | nullable |
| `latitude` | FLOAT | nullable |
| `longitude` | FLOAT | nullable |
| `est_actif` | BOOLEAN | défaut: false (activé par super admin) |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.4 Table `membres_hopital`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `utilisateur_id` | UUID | FK → utilisateurs, CASCADE |
| `hopital_id` | UUID | FK → hopitaux, CASCADE |
| `prenom` | VARCHAR(80) | nullable |
| `nom` | VARCHAR(80) | nullable |
| `role_membre` | ENUM | medecin, infirmier |
| `est_actif` | BOOLEAN | défaut: true |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.5 Table `stocks_sanguins`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `hopital_id` | UUID | FK → hopitaux, CASCADE |
| `groupe_sanguin` | ENUM | A+, A-, B+, B-, AB+, AB-, O+, O- |
| `quantite` | INTEGER | défaut: 0, valeur positive ou nulle |
| `seuil_faible` | INTEGER | configurable par admin hopital, défaut: 10 |
| `seuil_critique` | INTEGER | configurable par admin hopital, défaut: 5 |
| `mis_a_jour_le` | DATETIME | nullable |
| `cree_le` | DATETIME | auto |

**Règle statut stock** :
- `ok` : quantite > seuil_faible
- `faible` : quantite <= seuil_faible ET quantite > seuil_critique
- `critique` : quantite <= seuil_critique

### 6.6 Table `dons`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `donneur_id` | UUID | FK → donneurs, CASCADE |
| `hopital_id` | UUID | FK → hopitaux, CASCADE |
| `agent_id` | UUID | FK → utilisateurs, CASCADE |
| `date_don` | DATETIME | obligatoire |
| `type_poche` | ENUM | DCL, PCL |
| `volume` | INTEGER | entre 250 et 500 ml |
| `statut` | ENUM | en_attente, valide, rejete |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.7 Table `poches_sang`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `don_id` | UUID | FK → dons, CASCADE (1 don = 1 poche) |
| `groupe_sanguin` | ENUM | A+, A-, B+, B-, AB+, AB-, O+, O- |
| `volume` | INTEGER | en ml |
| `type_poche` | ENUM | DCL, PCL |
| `date_expiration` | DATE | don + 42 jours |
| `statut` | ENUM | disponible, utilisee, expiree, detruite |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.8 Table `resultats_tests`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `don_id` | UUID | FK → dons, CASCADE (1 don = 1 résultat) |
| `vih` | BOOLEAN | true = positif → poche rejetée |
| `hepatite_b` | BOOLEAN | true = positif → poche rejetée |
| `hepatite_c` | BOOLEAN | true = positif → poche rejetée |
| `tpha` | BOOLEAN | true = positif → poche rejetée |
| `vdl` | BOOLEAN | true = positif → poche rejetée |
| `groupe_sanguin_confirme` | VARCHAR(5) | nullable |
| `teste_le` | DATETIME | nullable |
| `teste_par` | UUID | nullable, FK → utilisateurs |
| `cree_le` | DATETIME | auto |

**Règle conformité** : une poche est conforme si et seulement si tous les 5 tests sont `false`.

### 6.9 Table `bons_demande`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `medecin_id` | UUID | FK → utilisateurs (role=medecin), CASCADE |
| `hopital_id` | UUID | FK → hopitaux, CASCADE |
| `nom_patient` | VARCHAR(150) | obligatoire |
| `groupe_sanguin_patient` | ENUM | A+, A-, B+, B-, AB+, AB-, O+, O- |
| `quantite_necessaire` | INTEGER | défaut: 1, valeur positive |
| `statut` | ENUM | en_attente, satisfait, non_satisfait |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.10 Table `registre_psl`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `bon_demande_id` | UUID | FK → bons_demande, CASCADE |
| `motif` | TEXT | nullable |
| `transfere_vers` | VARCHAR(150) | établissement de transfert, nullable |
| `trace_le` | DATETIME | nullable |
| `retour_le` | DATETIME | nullable |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.11 Table `alertes`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `hopital_id` | UUID | FK → hopitaux, CASCADE |
| `groupe_sanguin` | ENUM | nullable (alerte peut être globale) |
| `type` | ENUM | critique, faible, expiration |
| `message` | TEXT | obligatoire |
| `est_resolue` | BOOLEAN | défaut: false |
| `declenchee_le` | DATETIME | nullable |
| `resolue_le` | DATETIME | nullable |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.12 Table `notifications`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `utilisateur_id` | UUID | FK → utilisateurs, CASCADE |
| `type` | ENUM | rappel, alerte, confirmation, urgence |
| `titre` | VARCHAR(150) | obligatoire |
| `message` | TEXT | obligatoire |
| `est_lue` | BOOLEAN | défaut: false |
| `envoyee_le` | DATETIME | nullable |
| `cree_le` | DATETIME | auto |

### 6.13 Table `badges`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `donneur_id` | UUID | FK → donneurs, CASCADE |
| `niveau` | ENUM | bronze, argent, or, platine |
| `debloque_le` | DATETIME | nullable |
| `cree_le` | DATETIME | auto |

### 6.14 Table `rendez_vous`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `donneur_id` | UUID | FK → donneurs, CASCADE |
| `membre_id` | UUID | FK → utilisateurs, nullable (assigné après) |
| `hopital_id` | UUID | FK → hopitaux, CASCADE |
| `date_rdv` | DATETIME | obligatoire, date future |
| `statut` | ENUM | planifie, confirme, annule, effectue |
| `note` | TEXT | nullable |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

### 6.15 Table `demandes_acces`

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | UUID | PK, auto |
| `hopital_id` | UUID | FK → hopitaux, CASCADE |
| `nom_demandeur` | VARCHAR(150) | obligatoire |
| `email_demandeur` | VARCHAR(150) | obligatoire |
| `role_demande` | ENUM | medecin, infirmier |
| `message` | TEXT | nullable |
| `statut` | ENUM | en_attente, approuvee, rejetee |
| `cree_le` | DATETIME | auto |
| `mis_a_jour_le` | DATETIME | auto |

---

## 7. RELATIONS ENTRE ENTITÉS

```
Utilisateur (1) ──────── (0..1) Donneur
Utilisateur (1) ──────── (n) Notifications
Utilisateur (1) ──────── (n) Dons [agent_id]
Utilisateur (1) ──────── (n) BonsDemande [medecin_id]

Donneur (1) ──────── (n) Dons
Donneur (1) ──────── (n) Badges        [composition]
Donneur (1) ──────── (n) RendezVous

Hopital (1) ──────── (n) StocksSanguins  [composition]
Hopital (1) ──────── (n) Alertes         [composition]
Hopital (1) ──────── (n) Dons
Hopital (1) ──────── (n) RendezVous
Hopital (1) ──────── (n) DemandesAcces
Hopital (1) ──────── (n) BonsDemande

Don (1) ──────── (1) PocheSang      [composition]
Don (1) ──────── (1) ResultatTest   [composition]

BonDemande (1) ──────── (0..1) RegistrePSL
```

---

## 8. ROUTES API COMPLÈTES

> Base URL : `/api/v1`
> Authentification : Bearer Token JWT sur toutes les routes sauf `POST /auth/connexion`, `POST /auth/inscription`, `GET /centres`

### 8.1 Authentification

| Méthode | Route | Description |
|---|---|---|
| POST | `/auth/inscription` | Inscription donneur |
| POST | `/auth/connexion` | Connexion universelle (retourne rôle + token) |
| POST | `/auth/deconnexion` | Déconnexion |
| POST | `/auth/mot-de-passe-oublie` | Demande reset mot de passe |
| POST | `/auth/reinitialiser-mot-de-passe` | Reset mot de passe |

### 8.2 Compte utilisateur

| Méthode | Route | Description |
|---|---|---|
| GET | `/compte/profil` | Voir son profil |
| PUT | `/compte/profil` | Modifier son profil |
| PUT | `/compte/mot-de-passe` | Changer mot de passe |

### 8.3 Donneurs

| Méthode | Route | Description |
|---|---|---|
| GET | `/donneurs` | Liste tous les donneurs (super admin) |
| GET | `/donneurs/:id` | Profil complet d'un donneur |
| PUT | `/donneurs/:id` | Modifier son profil |
| PATCH | `/donneurs/:id/statut` | Suspendre / réactiver (super admin) |
| GET | `/donneurs/:id/dons` | Historique des dons |
| GET | `/donneurs/:id/badges` | Badges d'un donneur |
| GET | `/donneurs/:id/carte` | Données carte QR code |

### 8.4 Hôpitaux

| Méthode | Route | Description |
|---|---|---|
| GET | `/hopitaux` | Liste tous les établissements |
| POST | `/hopitaux` | Créer un établissement (super admin) |
| GET | `/hopitaux/:id` | Détail d'un établissement |
| PUT | `/hopitaux/:id` | Modifier un établissement |
| PATCH | `/hopitaux/:id/statut` | Activer / suspendre |
| GET | `/hopitaux/:id/membres` | Membres d'un établissement |
| GET | `/hopitaux/:id/stocks` | Stocks d'un établissement |
| GET | `/hopitaux/:id/dons` | Dons d'un établissement |

### 8.5 Stocks

| Méthode | Route | Description |
|---|---|---|
| GET | `/stocks` | Stocks nationaux (super admin) |
| GET | `/stocks/resume-national` | Résumé par département |
| GET | `/stocks/alertes` | Groupes sous seuil |
| GET | `/stocks/:hopitalId` | Stocks d'un établissement |
| PUT | `/stocks/:hopitalId` | Mise à jour manuelle |

### 8.6 Dons

| Méthode | Route | Description |
|---|---|---|
| GET | `/dons` | Liste toutes les poches |
| POST | `/dons` | Enregistrer un nouveau don |
| GET | `/dons/statistiques` | Stats globales |
| GET | `/dons/:id` | Détail d'un don |
| PATCH | `/dons/:id/valider` | Valider un don |
| PATCH | `/dons/:id/rejeter` | Rejeter un don |

### 8.7 Bons de demande

| Méthode | Route | Description |
|---|---|---|
| GET | `/bons-demande` | Liste des bons de demande |
| POST | `/bons-demande` | Créer un bon (médecin) |
| GET | `/bons-demande/:id` | Détail d'un bon |
| PATCH | `/bons-demande/:id/satisfaire` | Marquer satisfait |
| PATCH | `/bons-demande/:id/non-satisfaire` | Marquer non satisfait |
| POST | `/bons-demande/:id/psl` | Enregistrer dans registre PSL |

### 8.8 Alertes

| Méthode | Route | Description |
|---|---|---|
| GET | `/alertes` | Alertes d'un établissement |
| POST | `/alertes` | Créer alerte manuelle |
| GET | `/alertes/nationales` | Toutes les alertes (super admin) |
| PATCH | `/alertes/:id/resoudre` | Marquer alerte résolue |

### 8.9 Demandes d'accès membres

| Méthode | Route | Description |
|---|---|---|
| GET | `/membres/demandes` | Liste demandes d'accès |
| POST | `/membres/demandes` | Soumettre une demande |
| PATCH | `/membres/demandes/:id/approuver` | Approuver |
| PATCH | `/membres/demandes/:id/rejeter` | Rejeter |
| DELETE | `/membres/:id` | Retirer un membre |

### 8.10 Notifications

| Méthode | Route | Description |
|---|---|---|
| GET | `/notifications` | Notifications de l'utilisateur connecté |
| PATCH | `/notifications/:id/lire` | Marquer comme lue |
| PATCH | `/notifications/tout-lire` | Tout marquer comme lu |
| PUT | `/notifications/preferences` | Préférences notifications |

### 8.11 Centres de collecte

| Méthode | Route | Description |
|---|---|---|
| GET | `/centres` | Tous les centres avec coords |
| GET | `/centres/proches` | Centres proches (lat/lng en query) |
| GET | `/centres/:id` | Détail d'un centre |

### 8.12 Rendez-vous

| Méthode | Route | Description |
|---|---|---|
| GET | `/rendez-vous` | Liste des RDV |
| POST | `/rendez-vous` | Créer un RDV (donneur) |
| GET | `/rendez-vous/:id` | Détail d'un RDV |
| PATCH | `/rendez-vous/:id/assigner` | Assigner un agent |
| PATCH | `/rendez-vous/:id/confirmer` | Confirmer |
| PATCH | `/rendez-vous/:id/annuler` | Annuler |
| PATCH | `/rendez-vous/:id/effectue` | Marquer effectué |

### 8.13 Rapports (super admin)

| Méthode | Route | Description |
|---|---|---|
| GET | `/rapports/dons` | Export dons (query: periode, format) |
| GET | `/rapports/donneurs` | Export donneurs |
| GET | `/rapports/stocks` | Export stocks |
| GET | `/rapports/hopitaux` | Export établissements |
| GET | `/rapports/performance` | KPIs nationaux |

---

## 9. PAGES FRONTEND COMPLÈTES

### 9.1 Espace Donneur (`app/donor/`)

| Fichier | Description | Composants clés |
|---|---|---|
| `page.tsx` | Carte digitale QR code + stats éligibilité + WhatsApp share | qrcode.react |
| `history/page.tsx` | Timeline dons + badges grid (obtenus/verrouillés) | — |
| `centers/page.tsx` | Carte Leaflet + liste filtrée + itinéraire Google Maps | react-leaflet |
| `notifications/page.tsx` | Liste filtrée par type, marquer lu | — |
| `settings/page.tsx` | Profil, toggles notifs, sécurité, zone danger | — |
| `appointments/page.tsx` | Prise RDV 3 étapes (Centre → Date → Créneau) + liste RDV | — |

### 9.2 Espace Hôpital (`app/hospital/`)

| Fichier | Description | Composants clés |
|---|---|---|
| `page.tsx` | Dashboard : stats, alertes, stocks overview, dons récents | — |
| `stocks/page.tsx` | Tableau stocks détaillé + historique mouvements (graphe barres) | — |
| `donations/page.tsx` | Tableau dons + panneau détail + valider/rejeter | — |
| `alerts/page.tsx` | Liste alertes filtrées + résolution | — |
| `settings/page.tsx` | Profil établissement, seuils alerte, membres, sécurité | — |
| `appointments/page.tsx` | Calendrier 7 jours + liste + assigner agent | — |

### 9.3 Console CNTS (`app/console/`)

| Fichier | Description | Composants clés |
|---|---|---|
| `page.tsx` | Dashboard national : 6 stats, stocks par département, activité | — |
| `hospitals/page.tsx` | Liste établissements + panneau détail + filtres type | — |
| `members/page.tsx` | Demandes d'accès : approuver/rejeter avec Alert HeroUI v3 | — |
| `stocks/page.tsx` | Stocks 12 départements + tableau expandable + CriticalStocksBanner | — |
| `donors/page.tsx` | Gestion donneurs + Chip statut + suspendre/réactiver | — |
| `donations/page.tsx` | Gestion poches + double filtre statut+département | — |
| `reports/page.tsx` | KPIs, 4 graphiques, exporteur 3 étapes | — |

### 9.4 Auth (`app/auth/`)

| Fichier | Description |
|---|---|
| `signin/page.tsx` | Login universel avec note hôpitaux |
| `signup/page.tsx` | Inscription donneur 3 étapes |

---

## 10. COMPOSANTS HÉROUI V3 UTILISÉS PAR PAGE

### Règle universelle
Avant tout composant interactif, chercher dans HeroUI v3 si un composant natif existe. Ne jamais recréer ce qui existe dans la librairie.

### Composants utilisés dans le projet

| Composant | Usage |
|---|---|
| `Button` | Toutes les actions. Variants : primary, secondary, tertiary, outline, ghost, danger |
| `Alert` | Feedback après actions. Toujours dot notation |
| `Chip` | Statuts (validé, rejeté, en attente, actif, suspendu) |
| `Select` | Filtres et formulaires. Toujours dot notation |
| `Badge` | Compteurs sur icônes/boutons |
| `Spinner` | États de chargement |
| `Modal` | Confirmations importantes |

---

## 11. BACKEND ADONISJS — CONVENTIONS

### 11.1 Structure des fichiers

```
apps/backend/
  app/
    controllers/           ← un fichier par ressource
    models/                ← un fichier par table
    services/              ← logique métier complexe
    validators/            ← validation des requêtes
    middleware/            ← auth, rôles, etc.
    transformers/          ← formatage des réponses
  database/
    migrations/            ← une migration par table
    seeders/               ← données de test
  start/
    routes.ts              ← toutes les routes
    kernel.ts              ← middleware global
```

### 11.2 Conventions de nommage (FRANÇAIS)

```ts
// Modèle : PascalCase français
class BonDemande extends BaseModel {}
class RendezVous extends BaseModel {}
class StockSanguin extends BaseModel {}

// Colonne BDD : snake_case français
@column() declare dateNaissance: string    // → date_naissance en BDD
@column() declare groupeSanguin: string    // → groupe_sanguin en BDD
@column() declare hopitalId: string        // → hopital_id en BDD

// Route : kebab-case français
router.post('/bons-demande')
router.get('/rendez-vous/:id/confirmer')
router.patch('/donneurs/:id/statut')
```

### 11.3 Réponse API standard

```ts
// Succès
return response.ok({
  succes: true,
  donnees: { ... },
  message: 'Opération réussie'
})

// Erreur
return response.badRequest({
  succes: false,
  erreur: 'Message d\'erreur en français',
  code: 'CODE_ERREUR'
})
```

### 11.4 Middleware d'authentification

```ts
// Toutes les routes protégées utilisent :
.use(middleware.auth())

// Vérification du rôle dans le contrôleur :
if (auth.user?.role !== 'super_admin') {
  return response.forbidden({ erreur: 'Accès non autorisé' })
}
```

---

## 12. WORKFLOWS MÉTIER CRITIQUES

### 12.1 Enregistrement d'un don (scénario principal)

```
1. Infirmier scanne QR code du donneur
2. Système vérifie éligibilité (date_eligibilite_suivante <= aujourd'hui)
3. Si non éligible → message "Donneur non éligible, prochain don le XX/XX/XXXX"
4. Infirmier enregistre le don (type_poche DCL/PCL, volume)
5. Infirmier saisit résultats des 5 tests (vih, hepatite_b, hepatite_c, tpha, vdl)
6. Si tous les tests = false → poche validée automatiquement
7. Si au moins 1 test = true → poche rejetée
8. Si validée → création entrée dans poches_sang + mise à jour stock + mise à jour total_dons donneur
9. Calcul date_eligibilite_suivante = date_don + 90 jours
10. Calcul niveau_badge selon total_dons
11. Envoi notification confirmation au donneur
```

### 12.2 Bon de demande non satisfait (registre PSL)

```
1. Médecin crée bon de demande (nom_patient, groupe_sanguin_patient, quantite_necessaire)
2. Système vérifie stock disponible
3. Si stock insuffisant → médecin enregistre dans registre PSL
4. registre_psl.transfere_vers = nom de l'établissement vers lequel le patient est envoyé
5. registre_psl.trace_le = maintenant
6. Bon de demande → statut = non_satisfait
7. Quand le patient revient → registre_psl.retour_le = maintenant
```

### 12.3 Déclenchement automatique des alertes

```
1. À chaque mise à jour d'un stock_sanguin :
   - Si quantite <= seuil_critique → créer alerte type='critique'
   - Si quantite <= seuil_faible ET quantite > seuil_critique → créer alerte type='faible'
2. À chaque validation d'une poche :
   - Si date_expiration - aujourd'hui <= 7 jours → créer alerte type='expiration'
3. Alerte envoyée en notification aux membres de l'hôpital concerné
```

### 12.4 Rappel automatique de don (90 jours)

```
1. Tâche cron quotidienne à 8h00
2. Chercher tous les donneurs où date_eligibilite_suivante = aujourd'hui
3. Pour chaque donneur : créer notification type='rappel'
4. Titre : "Vous êtes éligible pour donner à nouveau !"
5. Message : "Votre délai de 90 jours est écoulé. Vous pouvez donner votre sang aujourd'hui."
```

---

## 13. DÉPARTEMENTS DU BÉNIN (données de référence)

Les 12 départements avec leurs capitales, utilisés dans les stocks nationaux :

| Département | Capitale |
|---|---|
| Littoral | Cotonou |
| Atlantique | Abomey-Calavi |
| Borgou | Parakou |
| Ouémé | Porto-Novo |
| Zou | Abomey |
| Atacora | Natitingou |
| Collines | Savalou |
| Mono | Lokossa |
| Couffo | Aplahoué |
| Donga | Djougou |
| Alibori | Kandi |
| Plateau | Pobè |

---

## 14. DESIGN SYSTEM

### 14.1 Couleurs principales

```css
/* Rouge sang — couleur principale de l'application */
--rouge-principal: #dc2626;   /* red-600 Tailwind */
--rouge-sombre: #b91c1c;      /* red-700 */
--rouge-clair: #fee2e2;       /* red-100 */

/* Statuts */
--vert-succes: #059669;       /* emerald-600 */
--ambre-avertissement: #d97706; /* amber-600 */
--rouge-erreur: #dc2626;      /* red-600 */
--gris-inactif: #6b7280;      /* gray-500 */
```

### 14.2 Couleurs par espace

| Espace | Couleur principale | Usage |
|---|---|---|
| Console CNTS | Rouge `#dc2626` | Sidebar sombre gris anthracite |
| Hôpital | Blanc / gris clair | Interface médicale propre |
| Donneur | Rouge + violet | Gamification badges |

### 14.3 Arrondis et espacements

```css
/* Cards et panels */
border-radius: rounded-2xl (16px)

/* Boutons petits */
border-radius: rounded-xl (12px)

/* Badges et chips */
border-radius: rounded-full

/* Espacements inter-sections */
gap: space-y-8 (32px)
```

### 14.4 Typographie

- Polices système + Tailwind
- Taille normale : `text-sm` (14px) pour le contenu
- Titres de page : `text-2xl font-bold`
- Étiquettes : `text-xs font-medium uppercase tracking-wider`
- Valeurs importantes : `font-black` (900)

---

## 15. FICHIERS CLÉS BACKEND EXISTANTS

### 15.1 Ce qui existait au démarrage

```
app/controllers/access_token_controller.ts  ← login/logout ✅
app/controllers/new_account_controller.ts   ← inscription ✅
app/controllers/donors_controller.ts        ← CRUD donneur basique ✅
app/controllers/profile_controller.ts       ← profil ✅
app/models/user.ts                          ← modèle utilisateur ✅
app/models/donor.ts                         ← modèle donneur basique ✅
database/migrations/create_users_table.ts   ← table users ✅
database/migrations/create_donors_table.ts  ← table donors basique ✅
start/routes.ts                             ← routes auth + donneurs ✅
```

### 15.2 Configuration .env

```env
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development
LOG_LEVEL=info
APP_KEY=R6hujlkzUzciie7O_t_pqdrbjXD4Yup1
APP_URL=http://${HOST}:${PORT}
SESSION_DRIVER=cookie
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=blood_connect
```

---

## 16. ERREURS FRÉQUENTES À ÉVITER

### 16.1 HeroUI v3
- ❌ `variant="solid"` → ✅ `variant="primary"`
- ❌ `variant="flat"` → ✅ `variant="secondary"`
- ❌ `variant="bordered"` → ✅ `variant="outline"`
- ❌ `onClick` sur Button → ✅ `onPress`
- ❌ `<Alert title="..." />` → ✅ dot notation `<Alert><Alert.Title>...</Alert.Title></Alert>`
- ❌ `color="danger"` sur Alert → ✅ `status="danger"`

### 16.2 Modèles AdonisJS
- ❌ Noms de colonnes en anglais → ✅ Noms en français
- ❌ `@column() declare userId` sans mapping → ✅ AdonisJS mappe automatiquement camelCase → snake_case
- ❌ Oublier `@beforeCreate() static assignUuid()` → ✅ UUID auto sur tous les modèles

### 16.3 Routes
- ❌ Routes en anglais `/api/v1/donors` → ✅ `/api/v1/donneurs`
- ❌ Routes sans préfixe `/api/v1` → ✅ Toujours grouper sous `/api/v1`
- ❌ Routes publiques sans restriction → ✅ Seules `/auth/*` et `GET /centres` sont publiques

### 16.4 Logique métier
- ❌ Oublier de calculer `date_eligibilite_suivante` après un don → ✅ Toujours mettre à jour
- ❌ Valider une poche sans vérifier les tests → ✅ Tous les 5 tests doivent être `false`
- ❌ Calculer l'expiration sans les 42 jours → ✅ `date_don + 42 jours`
- ❌ Oublier de mettre à jour le badge après un don → ✅ Recalculer `niveau_badge` à chaque don validé

---

## 17. GLOSSAIRE PROJET

| Terme | Définition dans le contexte eBloodSys |
|---|---|
| DCL | Type de poche de sang utilisé au Bénin (Don de Concentré de Leucocytes) |
| PCL | Type de poche de sang utilisé au Bénin |
| PSL | Produits Sanguins Labiles — composants du sang (enregistrement des demandes non satisfaites) |
| CNTS | Centre National de Transfusion Sanguine |
| CHUMEL | Centre Hospitalier Universitaire de la Mère et de l'Enfant Lagune — équivalent CNTS pour Littoral/Atlantique |
| OML | Nom local du CHUMEL |
| Éligibilité | Capacité d'un donneur à faire un nouveau don (délai de 90 jours) |
| Bon de demande | Document créé par le médecin pour demander du sang pour un patient |
| Registre PSL | Registre papier (désormais numérique) des demandes non satisfaites |
| Frais administratifs | 2 500 FCFA payés par le patient (pas une vente de sang) |
| Groupe sanguin | Classification ABO avec facteur Rhésus : A+, A-, B+, B-, AB+, AB-, O+, O- |
