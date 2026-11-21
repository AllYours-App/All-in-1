# Statut : compte Appli

Projet : application de golf GolfEvolution (HTML/CSS/JS vanilla, Supabase, Cloudflare, mode hors ligne). Repo : AllYours-App/All-in-1.

Fait :
- Lecture complète du dépôt le 2026-11-21 (README, arborescence, core/, modules/, sw.js, Suivi-des-bugs.docx), relue après le commit b270e8f.
- tasks.json restructuré : 5 tâches Appli, APPLI-TESTS (19 tests) et APPLI-DECISIONS (20 points) pour toi.
- Vérifié : core/diag.js et docs/ n'existent plus ; plus aucun champ [À COMPLÉTER] dans MENU_LEGAL ; « settings is not defined » déjà gardé par typeof dans golfWeeklyGoal().
- APPLI-04 : README audité contre le code (377 identifiants, fichiers cités, chiffres), ~45 corrections poussées.
- APPLI-01 (partie Gym) : carte APP_SCREEN_PARENTS + appBack(module, écran, contexte) dans core/app-shell.js ; tous les retours de Gym passent par elle (commits f158bd3, 89cdede). Testé en jsdom : 15 cas identiques au comportement d'origine, chargement de index.html sans erreur. Bouton Accueil validé par toi.

En cours :
- Rien en cours côté code.

Bloqué :
- APPLI-01 (reste) : retours internes de Wedging, Stats, Putting (+ Menu) à brancher. wedging.js, stats.js et putting.js vont être remplacés par leurs .js.txt (APPLI-05) : modifier les .js maintenant serait perdu. Attend ta décision n°17 (APPLI-DECISIONS).
- APPLI-05 : attend ta confirmation que les .js.txt sont les versions à garder.
- Côté Moi : APPLI-TESTS et APPLI-DECISIONS.
- Écart à signaler : data/done.json n'existe pas dans le dépôt Central (seul data/inbox.json y est), aucune tâche à Moi n'a pu être marquée faite par ce biais.

Prochaine étape :
- APPLI-03 (images inutilisées : déjà hors de sw.js, il reste à les supprimer), puis APPLI-02 (données d'un autre appareil).
- APPLI-05 puis le reste d'APPLI-01 dès ta confirmation.

Mis à jour le : 2026-11-21
Rythme : 1 tâche terminée sur la dernière fenêtre de 5 h.
