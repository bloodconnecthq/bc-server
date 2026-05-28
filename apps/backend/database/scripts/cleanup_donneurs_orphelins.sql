-- ============================================================
-- NETTOYAGE DES DONNEURS ORPHELINS
-- Supprime les lignes de `donneurs` sans user correspondant
-- dans la table `users` (utilisateur_id NULL ou inexistant)
--
-- CASCADE automatique : badges et dons liés seront supprimés
-- automatiquement grâce aux FK ON DELETE CASCADE.
--
-- UTILISATION :
--   1. Lancer la section "AUDIT" pour voir ce qui sera supprimé
--   2. Vérifier que c'est correct
--   3. Lancer la section "NETTOYAGE" (COMMIT à la fin)
--   4. En cas de doute : garder ROLLBACK à la place du COMMIT
-- ============================================================

-- ============================================================
-- ÉTAPE 1 — AUDIT (DRY RUN, ne modifie rien)
-- ============================================================

-- 1a. Vue d'ensemble
SELECT
  (SELECT COUNT(*) FROM users)    AS total_users,
  (SELECT COUNT(*) FROM donneurs) AS total_donneurs,
  (
    SELECT COUNT(*) FROM donneurs
    WHERE utilisateur_id IS NULL
       OR utilisateur_id NOT IN (SELECT id FROM users)
  ) AS donneurs_orphelins_a_supprimer,
  (
    SELECT COUNT(*) FROM donneurs
    WHERE utilisateur_id IS NOT NULL
      AND utilisateur_id IN (SELECT id FROM users)
  ) AS donneurs_valides_a_conserver;

-- 1b. Détail des donneurs qui seront supprimés
SELECT
  d.id                AS donneur_id,
  d.code_donneur,
  d.utilisateur_id,
  CASE
    WHEN d.utilisateur_id IS NULL
    THEN 'utilisateur_id NULL'
    ELSE 'utilisateur introuvable dans users'
  END                 AS raison,
  d.total_dons,
  d.niveau_badge,
  d.created_at,
  (SELECT COUNT(*) FROM dons    WHERE donneur_id = d.id) AS nb_dons_lies,
  (SELECT COUNT(*) FROM badges  WHERE donneur_id = d.id) AS nb_badges_lies
FROM donneurs d
WHERE d.utilisateur_id IS NULL
   OR d.utilisateur_id NOT IN (SELECT id FROM users)
ORDER BY d.created_at;

-- ============================================================
-- ÉTAPE 2 — NETTOYAGE (exécuter SEULEMENT après audit)
-- ============================================================

START TRANSACTION;

  -- Identifier les IDs orphelins dans une table temporaire
  -- (évite les sous-requêtes imbriquées instables)
  CREATE TEMPORARY TABLE _orphelins_ids AS
    SELECT id
    FROM donneurs
    WHERE utilisateur_id IS NULL
       OR utilisateur_id NOT IN (SELECT id FROM users);

  -- Sécurité : afficher le nombre avant suppression
  SELECT CONCAT(
    'Suppression de ',
    COUNT(*),
    ' donneurs orphelins (badges et dons liés supprimés en cascade)'
  ) AS info
  FROM _orphelins_ids;

  -- Suppression des donneurs orphelins
  -- Les badges (ON DELETE CASCADE) et dons (ON DELETE CASCADE)
  -- seront supprimés automatiquement par MySQL
  DELETE FROM donneurs
  WHERE id IN (SELECT id FROM _orphelins_ids);

  -- Nettoyer la table temporaire
  DROP TEMPORARY TABLE _orphelins_ids;

  -- Vérification finale
  SELECT
    (SELECT COUNT(*) FROM users)    AS total_users,
    (SELECT COUNT(*) FROM donneurs) AS total_donneurs_apres,
    (SELECT COUNT(*) FROM dons)     AS total_dons_apres,
    (SELECT COUNT(*) FROM badges)   AS total_badges_apres;

-- ⚠️  Choisir UNE seule ligne ci-dessous :
COMMIT;    -- ✅ Valider les suppressions
-- ROLLBACK; -- 🔄 Annuler tout (décommenter pour tester sans risque)
