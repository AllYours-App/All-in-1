# All-in-1

Application golf mobile-first : parcours, putting, wedging, stats, gym, profil. Tout est en HTML/CSS/JS vanilla, sans framework ni étape de build. Déployée sur Vercel (`all-in-1-delta.vercel.app`).

Il n'y a aucun backend : toutes les données vivent dans le `localStorage` du navigateur.

## Guide fonctionnel

Cette partie décrit l'application du point de vue de l'utilisateur, sans vocabulaire technique. La documentation technique commence à la section "Architecture".

All-in-1 est un carnet d'entraînement et de jeu pour golfeur, utilisable sur téléphone. On s'y connecte, on arrive sur un accueil qui propose six parties de travail, et chacune se concentre sur un aspect du jeu. Les données sont enregistrées sur l'appareil.

### Connexion et création de compte
Écran de départ tant qu'on n'est pas connecté. On saisit son adresse e-mail et son mot de passe (8 caractères minimum à la création du compte). On peut afficher ou masquer le mot de passe. Une fois connecté, on retombe directement sur l'accueil aux ouvertures suivantes. La déconnexion se fait depuis le Menu.

### Accueil
Message de bienvenue avec le prénom du joueur et fond d'écran qui change selon l'heure (matin, midi, soir, nuit). Six boutons mènent aux parties : Putting, Stats, Gym, Parcours, Vitesse, Wedging. Un petit panneau résume l'activité : objectif de séances de la semaine, distance moyenne, index et date de la dernière séance. Un bouton de profil ouvre le Menu.

### Menu (profil et réglages)
C'est ici que le joueur renseigne ses informations personnelles, utilisées ensuite dans le reste de l'application :
- **Profil** : prénom et index de golf.
- **Réglages** : température, altitude, unités (distance en mètres ou en yards, unités de vitesse et de radar).
- **Radars** : un ou plusieurs radars de mesure, avec leurs décalages de mesure pour le club et pour la balle. On choisit un radar par défaut.
- **Mon sac de golf** : cocher les clubs que l'on possède.
- **Mes distances** : saisir la distance de chaque club. Les wedges peuvent avoir plusieurs distances (par exemple un coup plein et un trois-quarts).
- **Driver** : longueur et poids.
- **Aide** et **Déconnexion**.

### Parcours (sur le terrain)
Outils à utiliser pendant une partie :
- **Fairway** : sur un schéma de fairway, on touche l'endroit où chaque départ est tombé, trou par trou (18 trous). On peut zoomer avec deux doigts, corriger un trou ou le passer.
- **Green** : même principe pour les approches, avec le point d'arrivée de la balle autour du green.
- **Vent** : donne la distance à jouer et la déviation à prévoir selon la distance du coup, la force du vent et sa direction (face, dos, travers), réglée sur une boussole.
- **Dénivelé** : mesure la différence de hauteur entre soi et la cible en visant avec le téléphone, puis en indiquant la distance.
- **Distance** ("Mes distances") : affiche les distances de chaque club du sac sous forme de barres, classées de la plus longue à la plus courte.
- **Historique** : bilan de la partie en cours (pourcentage de fairways touchés, de greens touchés, tendance dominante des erreurs : gauche, droite, court, long).

### Putting
Entraînement et suivi du putting :
- **Exercices** : enchaînements de putts à différentes distances (appelés combinés). On peut créer les siens ou lancer une série rapide, saisir le résultat de chaque putt, puis consulter un récapitulatif et revoir la session.
- **À reprendre** : une session interrompue peut être reprise là où elle s'était arrêtée.
- **Performance** : analyses par distance et par pente, comparaisons entre périodes ou entre parcours, avec des filtres. Indicateurs principaux : Strokes Gained putting et pourcentage de 1 putt.
- **Parcours** : saisie des putts d'une partie réelle, avec historique et détail de chaque partie.
- **Activité récente** : dernières sessions.

### Wedging (jeu court, 50 à 105 m)
- **Parcours** : après chaque coup d'approche, on note la distance qu'il fallait faire, puis la distance restante et la zone d'arrivée par rapport au drapeau (huit directions autour du trou, ou "coup rentré"). Un historique garde tous les coups.
- **Analyses** : dispersion (où tombent les balles pour chaque distance), distance (distance moyenne restante au drapeau pour chaque palier de distance à faire) et Strokes Gained.
- **Exercices** : exercices d'approche à créer, à jouer en séance, avec récapitulatif et revue.

### Stats
Tableau de bord des performances, rempli à partir des parties que le joueur saisit lui-même :
- **Tableau de bord** : Strokes Gained global et par catégorie (Driving, A.G., Wedging, Approches, Putting), et indicateurs clés (fairways touchés, greens touchés, putts par tour, birdies par tour).
- **Par club** et **par distance** : graphiques filtrables par période, parcours et position de la balle.
- **Statistiques** : trois présentations (aperçu multi-critères, statistiques traditionnelles, Strokes Gained).
- **Historique des tours** : liste des parties, avec recherche par nom de parcours.
- **Performance putting** : évolution du nombre de putts moyen par partie.
- **Saisie d'une partie** : soit rapide (score, fairway, green en régulation, putts, trou par trou), soit détaillée (chaque coup avec le club, la position, la distance restante, la pénalité et le résultat). On peut chercher le golf joué parmi les parcours proches de soi.

### Gym
Préparation physique du golfeur :
- **Programmes** : choisir ou créer un programme (endurance, force, hypertrophie, vitesse) composé de séances.
- **Exercices** : bibliothèque d'exercices, et création de ses propres séances.
- **Séance active** : déroulement d'une séance avec séries, répétitions et repos, suivi en temps réel, puis récapitulatif.
- **Progression**, **Historique** et **Objectifs** : suivi de l'évolution, des séances passées et des objectifs fixés.

### Vitesse
Pas encore disponible : l'écran annonce "Fonctionnalités à venir".

## Architecture

Une seule page, `index.html`. Chaque partie de l'app est un bloc `<div id="page-xxx" class="app-page">`, et un seul bloc porte la classe `active` à la fois.

La navigation passe par `showPage(id)` (`app-shell.js`), qui bascule la classe `active`. Le shell n'utilise jamais `location.hash`, car ce hash appartient au routeur interne de Wedging.

Tous les scripts sont des scripts classiques (pas de modules ES). Ils partagent donc le scope global : une fonction ou une constante déclarée au niveau racine est visible de tous les fichiers chargés après elle, et peut écraser une déclaration homonyme.

### Pages

| Page (`id`) | Conteneur | JS | CSS | Origine du HTML |
|---|---|---|---|---|
| `page-login`, `page-signup` | dans `index.html` | `auth.js` | `auth.css` | `index.html` |
| `page-home` | dans `index.html` | `HomePage.js` | `HomePage.css` | `index.html` |
| `page-parcours` | dans `index.html` | `parcours-ui.js` | `parcours-ui.css` | `index.html` |
| `page-stats` | dans `index.html` | `stats.js` | `stats.css` | `index.html` |
| `page-wedging` | `#app` | `wedging.js` | `wedging.css` | généré par JS |
| `page-gym` | `#app-root-gym` | `gym.js` | `gym.css` | injecté par JS au chargement |
| `page-putting` | `#app-root` | `putting.js` | `putting.css` | généré par `renderPuttingTab()` |
| `page-vitesse` | `#app-root-vitesse` | `vitesse.js` | `vitesse.css` | généré par `renderVitesseTab()` |
| `page-menu` | `#root` | `menu.js` | `menu.css` | généré par `renderMenuTab()` |

### Ordre de chargement des scripts

Cet ordre compte, car les fichiers se parlent par le scope global.

```
Chart.js 4.5.0 (CDN)
app-shell.js        -> showPage()
commun.js           -> appKeypad()
sg-data.js          -> SG_BASELINES
strokes-gained.js   -> sgExpected(), sgShot()   (dépend de sg-data.js)
HomePage.js
parcours-ui.js      (?v=6)
wedging.js
gym.js
putting.js
vitesse.js
stats.js            (?v=14)
menu.js             (redéfinit des fonctions de putting.js, voir "Points d'attention")
auth.js             (dernier : choisit la page de départ)
```

Les CSS sont chargés dans l'ordre `base`, `commun`, `HomePage`, `parcours-ui`, `wedging`, `gym`, `putting`, `vitesse`, `stats`, `menu`, `auth`. Seuls `parcours-ui` (`?v=6`) et `stats` (`?v=14`) ont un numéro de version manuel pour le cache.

### Dépendances externes

- Chart.js 4.5.0 via cdnjs (graphiques de `stats.js`).
- API publique `https://api.flyawaygolf.com/v2` : recherche de golfs par géolocalisation et profil de golf, appelée uniquement depuis `stats.js` (popup "Nouveau parcours").

## Fichiers partagés

### `index.html` (1239 lignes)
Contient le HTML de Home, Parcours, Stats, Menu, Login et Signup, les conteneurs vides de Wedging, Gym, Putting et Vitesse, un script inline (bloque le swipe-retour iOS depuis les bords et le zoom au pincement) et la liste des scripts. Un script en `<head>` ajoute la classe `has-session` sur `<html>` si `golfSession` existe, pour éviter le flash de la page de connexion.

### `app-shell.js`
`showPage(id)` : active la page demandée et masque les autres. Ignore un id inconnu. Resynchronise `body.no-scroll` (Parcours le pilote lui-même) et retire `gym-home-locked` / `gym-view-fit` en quittant Gym. Expose `window.showPage`.

### `commun.js`
`appKeypad(pressFn, backspaceFn, clearFn, extraKey)` : génère le HTML d'un pavé numérique. Les boutons appellent par nom des fonctions globales via `onclick`. Utilisé par `menu.js`, `parcours-ui.js`, `putting.js` et `wedging.js`. Gym a son propre pavé.

### `base.css`, `commun.css`
`base.css` : reset, tokens `:root` (dont les couleurs `--wg-*` partagées par tous les modules), règles globales. `commun.css` : composants partagés (`.app-keypad`, `.app-keypad-value`, en-têtes de page, etc.).

### `sg-data.js` et `strokes-gained.js`
Moteur Strokes Gained partagé. `sg-data.js` contient les tables de référence `SG_BASELINES` (lies `tee`, `fairway`, `rough`, `sand`, `recovery`, `green` ; yards sauf `green` en pieds), extraites du dépôt `dgtaillie/python_strokes_gained`. `strokes-gained.js` convertit les mètres, interpole (`sgExpected`) et calcule le SG d'un coup (`sgShot`). Aucune dépendance au DOM.
Seul `putting.js` l'appelle aujourd'hui (`sgShot('green', ...)`).

## Modules

### `HomePage.js` / `HomePage.css`
Page d'accueil : fond selon l'heure (`getBackgroundByHour`, images `images/FondEcranHomePage*.png`), prénom du profil (lu dans `golfAppState`), panneau de stats via `[data-stat="..."]` (`renderGolfStats(data)`, anneau de progression `setProgressRing`). Expose `window.renderHomeGreeting` (rappelée par `menu.js`) et `window.renderGolfStats`.

### `auth.js` / `auth.css`
Connexion et création de compte. La session est uniquement la clé `golfSession` du `localStorage` (`{ email, createdAt }`) : aucun serveur, la validation ne vérifie que le format de l'e-mail et la longueur du mot de passe (8 caractères minimum à l'inscription). Choisit la page de départ (`home` si session, sinon `login`), expose `window.authLogout` (appelée par le bouton de déconnexion de `menu.js`). Réutilise `getBackgroundByHour()` de `HomePage.js`.

### `menu.js` / `menu.css`
Profil et réglages. Gère l'état global persisté dans `golfAppState` : `userProfile`, `settings` (température, altitude, unités), `radars`, `golfBag`, `driverSettings`, `personalDistances`, `wedgeDistances`. Écrans : menu principal, sac de golf (`golfClubCatalog`), distances par club, aide. Contient son propre pavé numérique (`openMenuKeypad`...) construit sur `appKeypad`. Expose `window.renderMenuTab`.
Ses variables globales (`golfBag`, `golfClubCatalog`, `personalDistances`, `wedgeDistances`, `settings`) sont lues directement par `parcours-ui.js` et `stats.js`.

### `parcours-ui.js` / `parcours-ui.css`
Suivi pendant le parcours : Fairway (mises en jeu sur 18 trous), Green (attaques de green), Historique (bilan du parcours en cours), calculateur de vent, calculateur de dénivelé (capteurs d'orientation de l'appareil), calculateur "Mes distances" (lit `golfBag` et les distances de `menu.js`). Les fonctions sont globales car appelées depuis des `onclick` générés. Unités m/yd.

### `putting.js` / `putting.css`
Module le plus transversal. Combinés d'exercices (créatifs ou rapides), sessions de putting, reprise de session, analyses (distance, pente, performance, comparaisons), et saisie d'un "Nouveau parcours" avec historique et détail. Calcule le Strokes Gained des putts via `strokes-gained.js`. Remplit aussi les encadrés `[data-stat]` de l'accueil via `renderGolfHome()`. Expose `window.renderPuttingTab` et `window.renderGolfHome`.

### `wedging.js` / `wedging.css`
SPA autonome (7 sections : constantes, `Storage`, `Analytics`, `UI`, état `Wedge`, vues, routeur). Journal Parcours (cases par distance de 50 à 105 m, zones de dispersion à 9 directions), exercices créatifs, analyses de dispersion, de distance et de SG. Possède son propre routeur par hash (`#parcours`, `#exercices`, `#sg-analysis`...) rendu dans `#app`. Calcule son SG avec ses propres tables (rough et putts), sans passer par `strokes-gained.js`.

### `gym.js` / `gym.css`
Le plus gros fichier (6071 lignes). Injecte tout son HTML dans `#app-root-gym`, puis : bibliothèque d'icônes, données mockées (`GYM_DATA`), routeur interne, générateurs de composants et vues (Accueil, Programmes, Détail programme, Créer programme, Créer séance, Exercices, Séance active, Progression, Historique, Récap, Objectifs). Pavé numérique propre au module.

### `stats.js` / `stats.css`
IIFE unique. Composants (sparkline, KPI, filtres, graphiques Chart.js), écrans Dashboard / Par club / Par distance / Statistiques (Multi, Traditionnel, SG), saisie de parties (rapide trou par trou, ou détaillée coup par coup), calcul de toutes les stats à partir des parties enregistrées. Navigation interne via `data-goto`, exposée par `window.showStatsScreen`. Se rafraîchit au retour sur la page via un `MutationObserver`.

### `vitesse.js` / `vitesse.css`
Placeholder : affiche "Fonctionnalités à venir".

### `images/`
Fonds d'accueil (matin, midi, soir, nuit), fonds de boutons, illustrations de putts (`GreenPutt*.png`), programmes de gym, popup de reprise.

## Données persistées (`localStorage`)

| Clé | Écrite par | Contenu |
|---|---|---|
| `golfSession` | `auth.js` | e-mail et date de session |
| `golfAppState` | `menu.js` | profil, réglages, radars, sac, distances |
| `parcours-settings`, `parcours-fairway-unit` | `parcours-ui.js` | unités |
| `parcours-fairway-round`, `parcours-green-round` | `parcours-ui.js` | tour en cours (Fairway, Green) |
| `parcours-captures` | `parcours-ui.js` | captures de l'historique |
| `putting_combines`, `putting_sessions`, `putting_rounds`, `putting_resume` | `putting.js` | combinés, sessions, parties, session à reprendre |
| `wedgingShots`, `wedgingExercises`, `wedgingInProgressSessions` | `wedging.js` | coups, exercices, sessions en cours |
| `gym-programs-saved`, `gym-history`, `gym-goals`, `gym-active-program-id` | `gym.js` | programmes, historique, objectifs, programme actif |
| `golfStatsRounds` | `stats.js` | parties saisies dans Stats |

## Points d'attention pour la révision

Constats faits en lisant le code, classés par gravité. À confirmer en conditions réelles.

1. **Conflit de noms entre `putting.js` et `menu.js`.** Les deux déclarent `saveStateToLocalStorage()` et `loadStateFromLocalStorage()` au niveau global. `menu.js` étant chargé après `putting.js`, ses versions remplacent celles de Putting. Après le chargement, les appels de `putting.js` (une dizaine, par ex. lignes 1843, 2412, 2490) exécutent la version du menu : ils écrivent `golfAppState` au lieu de `putting_combines` / `putting_sessions` / `putting_rounds`, et `refreshAllAnalytics()` n'est plus appelée. À tester en priorité : une session de putting survit-elle à un rechargement ?
2. **Deux écrivains sur les encadrés de l'accueil.** `putting.js` appelle `renderGolfHome()` dès son chargement, puis `HomePage.js` appelle `renderGolfStats()` sans données au `DOMContentLoaded`, ce qui remet tous les `[data-stat]` à "_" et l'anneau à 0.
3. **Authentification factice.** Tout e-mail valide et tout mot de passe de 8 caractères ou plus ouvre une session (`TODO` dans `auth.js`). Aucune donnée n'est liée à un compte : deux utilisateurs sur le même navigateur partagent tout.
4. **Stats déconnecté des autres modules.** `stats.js` lit uniquement `golfStatsRounds` (ses propres parties) et le sac de `menu.js`. Il ne lit ni `putting_*`, ni `parcours-*`, ni `wedging*`. Les valeurs du Dashboard (`strokesGained`, `kpiCards`) sont mockées à `null`.
5. **Deux saisies de "Nouveau parcours".** `putting.js` (`putting_rounds`) et `stats.js` (`golfStatsRounds`) ont chacun leur popup, leur format et leur stockage.
6. **Strokes Gained dupliqué.** `wedging.js` embarque sa propre table rough et sa propre interpolation, `stats.js` calcule aussi du SG. `strokes-gained.js` n'est utilisé que par `putting.js`.
7. **Couplage par `typeof` sur des globales de `menu.js`.** `parcours-ui.js` et `stats.js` testent `typeof golfBag` / `golfClubCatalog` / `personalDistances`. Cela fonctionne tant que le scope global est partagé, mais casse silencieusement si une variable est renommée.
8. **Noms globaux génériques.** `root` (`putting.js`), `Storage` (`wedging.js`, masque l'interface Web `Storage`), `Analytics`, `Router`, `UI`, `Views` (`wedging.js`), `backBtn`, `headerTitle`, `STORAGE_KEY` (`menu.js`). Risque de collision à chaque nouveau fichier.
9. **Commentaires périmés.** `auth.js` dit que `app-shell.js` "peut se charger après ce fichier", alors qu'il est chargé en premier. L'événement `parcours:ready` est émis par `parcours-ui.js` mais personne ne l'écoute.
10. **Cache.** Seuls `parcours-ui` et `stats` ont un paramètre de version. Les autres fichiers peuvent rester en cache après un déploiement.
11. **Taille des fichiers.** `gym.js` (6071 lignes, 408 Ko), `stats.js` (3672), `putting.js` (3732), `gym.css`, `stats.css` et `putting.css` (3000 à 3600 lignes chacun) : tout est chargé au démarrage, y compris les parties jamais ouvertes.
