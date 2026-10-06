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

### Wedging (jeu court, 30 à 110 m compris)
- **Parcours** : après chaque coup d'approche, on note la distance qu'il fallait faire, puis la distance restante et la zone d'arrivée par rapport au drapeau (huit directions autour du trou, ou "coup rentré"). Un historique garde tous les coups.
- **Analyses** : dispersion (où tombent les balles pour chaque distance), distance (distance moyenne restante au drapeau pour chaque palier de distance à faire) et Strokes Gained.
- **Exercices** : exercices d'approche à créer, à jouer en séance, avec récapitulatif et revue.

### Stats
Tableau de bord des performances, rempli à partir des parties que le joueur saisit lui-même :
- **Tableau de bord** : Strokes Gained global et par catégorie (Driving, A.G., Wedging, Approches, Putting), et indicateurs clés (fairways touchés, greens touchés, putts par tour, birdies par tour).
- **Par club** et **par distance** : graphiques filtrables par période, parcours et position de la balle.
- **Statistiques** : trois présentations (aperçu multi-critères : Score, Fairway, Attaque de green, Approches, Putts ; statistiques traditionnelles ; Strokes Gained). L'aperçu se filtre par période et par parcours.
- **Historique des tours** : liste des parties, avec recherche par nom de parcours.
- **Performance putting** : évolution du nombre de putts moyen par partie.
- **Saisie d'une partie** : soit rapide (score, fairway, green en régulation, putts, trou par trou), soit détaillée (chaque coup avec le club, la position, la distance restante, la pénalité et le résultat). On peut chercher le golf joué parmi les parcours proches de soi.
  En saisie détaillée, l'encadré du trou affiche six espaces : le détail du trou (numéro, par, distance, handicap) avec le score total de la partie juste dessous, par rapport au par (+1, -2, ou E à égalité ; trous rentrés dont le par est connu), puis FIR, GIR, putts et SG total. L'encadré Strokes Gained en bas à droite (Driving, A.G., App., Putts) cumule les SG de tous les trous depuis le début de la partie.
  Catégories SG : Driving = départ des par 4 et 5 ; A.G. (attaque de green) = longs coups, à partir de 30 m du drapeau ; App. (approches) = petits coups autour du green, à moins de 30 m ; Putts = coups joués sur le green. Dans le tableau de bord, Wedging isole les coups de 30 m à 110 m compris : A.G. n'y compte alors que les coups de plus de 110 m.
  Une partie saisie en détaillé alimente aussi Wedging (coups à faire entre 30 et 110 m compris, rangés par paliers de 5 m : 33 m devient 30-34 m ; le dernier palier va de 105 à 110 m) et Putting (un parcours en mode Détaillée, un trou = son premier putt). La saisie rapide n'envoie rien : elle ne contient pas ces détails.

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
parcours-ui.js
wedging.js
gym.js
putting.js
vitesse.js
stats.js
menu.js
auth.js             (dernier : choisit la page de départ)
```

Les CSS sont chargés dans l'ordre `base`, `commun`, `HomePage`, `parcours-ui`, `wedging`, `gym`, `putting`, `vitesse`, `stats`, `menu`, `auth`. Tous les CSS et JS locaux portent le même paramètre de version dans `index.html` (`?v=26`), à incrémenter partout à chaque déploiement qui modifie un fichier (remplacer `?v=26` par le numéro suivant dans toutes les balises).

### Dépendances externes

- Chart.js 4.5.0 via cdnjs (graphiques de `stats.js`).
- API publique `https://api.flyawaygolf.com/v2` : recherche de golfs par géolocalisation et profil de golf, appelée uniquement depuis `stats.js` (popup "Nouveau parcours").

## Fichiers partagés

### `index.html` (1241 lignes)
Contient le HTML de Home, Parcours, Stats, Menu, Login et Signup, les conteneurs vides de Wedging, Gym, Putting et Vitesse, un script inline (bloque le swipe-retour iOS depuis les bords et le zoom au pincement) et la liste des scripts. Un script en `<head>` ajoute la classe `has-session` sur `<html>` si `golfSession` existe, pour éviter le flash de la page de connexion.

### `app-shell.js`
`showPage(id)` : active la page demandée et masque les autres. Ignore un id inconnu. Resynchronise `body.no-scroll` (Parcours le pilote lui-même) et retire `gym-home-locked` / `gym-view-fit` en quittant Gym. Expose `window.showPage`.

### `commun.js`
`appKeypad(pressFn, backspaceFn, clearFn, extraKey)` : génère le HTML d'un pavé numérique. Les boutons appellent par nom des fonctions globales via `onclick`. Utilisé par `menu.js`, `parcours-ui.js`, `putting.js`, `wedging.js` et `stats.js` (popup distance restante / pénalité de la saisie détaillée, fonctions globales préfixées `statsSd`). Gym a son propre pavé.

### `base.css`, `commun.css`
`base.css` : reset, tokens `:root` (dont les couleurs `--wg-*` partagées par tous les modules), règles globales. `commun.css` : composants partagés (`.app-keypad`, `.app-keypad-value`, en-têtes de page, etc.).

**Marges des pages (modèle : Putting).** Deux variables dans `base.css` : `--app-padding-x` (20 px, 16 px sous 360 px) pour la marge horizontale, et `--app-page-top` (56 px + safe-area + 16 px) pour le début du contenu sous le header fixe. Toute nouvelle page ou tout nouveau bloc de page les utilise, sans valeur en dur. Exceptions volontaires : les écrans de Gym et de Parcours verrouillés à la hauteur de l'écran (accueil Gym, création de programme, accueil Parcours) gardent un décalage vertical plus serré. `.screen` de `parcours-ui.css` est limité à `#page-parcours` (via `:where()`, spécificité inchangée) : il s'appliquait aussi à Stats et doublait sa marge.

### `sg-data.js` et `strokes-gained.js`
Moteur Strokes Gained partagé. `sg-data.js` contient les tables de référence `SG_BASELINES` (lies `tee`, `fairway`, `rough`, `sand`, `recovery`, `green` ; yards sauf `green` en pieds), extraites du dépôt `dgtaillie/python_strokes_gained`. `strokes-gained.js` convertit les mètres, interpole (`sgExpected`) et calcule le SG d'un coup (`sgShot`). Aucune dépendance au DOM. C'est le seul endroit où vivent des tables SG : `putting.js`, `wedging.js` et `stats.js` l'appellent. Sous 10 yd (9,1 m), les tables fairway / rough / sand sont plafonnées à leur valeur à 10 yd (la source n'a pas de points plus courts).

## Modules

### `HomePage.js` / `HomePage.css`
Page d'accueil : fond selon l'heure (`getBackgroundByHour`, images `images/FondEcranHomePage*.webp`), prénom du profil (lu dans `golfAppState`), panneau de stats via `[data-stat="..."]` (`renderGolfStats(data)`, anneau de progression `setProgressRing`). Expose `window.renderHomeGreeting` (rappelée par `menu.js`) et `window.renderGolfStats`.

### `auth.js` / `auth.css`
Connexion et création de compte. La session est uniquement la clé `golfSession` du `localStorage` (`{ email, createdAt }`) : aucun serveur, la validation ne vérifie que le format de l'e-mail et la longueur du mot de passe (8 caractères minimum à l'inscription). Choisit la page de départ (`home` si session, sinon `login`), expose `window.authLogout` (appelée par le bouton de déconnexion de `menu.js`). Réutilise `getBackgroundByHour()` de `HomePage.js`.

### `menu.js` / `menu.css`
Profil et réglages. Gère l'état global persisté dans `golfAppState` : `userProfile`, `settings` (température, altitude, unités), `radars`, `golfBag`, `driverSettings`, `personalDistances`, `wedgeDistances`. Écrans : menu principal, sac de golf (`golfClubCatalog`), distances par club, aide. Contient son propre pavé numérique (`openMenuKeypad`...) construit sur `appKeypad`. Expose `window.renderMenuTab`.
Ses variables globales (`golfBag`, `golfClubCatalog`, `personalDistances`, `wedgeDistances`, `settings`) sont lues directement par `parcours-ui.js` et `stats.js`.
Ses fonctions de sauvegarde sont `saveMenuState()` / `loadMenuState()` (préfixées pour ne pas entrer en collision avec celles de `putting.js`).

### `parcours-ui.js` / `parcours-ui.css`
Suivi pendant le parcours : Fairway (mises en jeu sur 18 trous), Green (attaques de green), Historique (bilan du parcours en cours), calculateur de vent, calculateur de dénivelé (capteurs d'orientation de l'appareil), calculateur "Mes distances" (lit `golfBag` et les distances de `menu.js`). Les fonctions sont globales car appelées depuis des `onclick` générés. Unités m/yd.

### `putting.js` / `putting.css`
Module le plus transversal. Combinés d'exercices (créatifs ou rapides), sessions de putting, reprise de session, analyses (distance, pente, performance, comparaisons), et saisie d'un "Nouveau parcours" avec historique et détail. Calcule le Strokes Gained des putts via `strokes-gained.js`. Remplit aussi les encadrés `[data-stat]` de l'accueil via `renderGolfHome()`. Expose `window.renderPuttingTab` et `window.renderGolfHome`.
Sauvegarde : `savePuttingState()` / `loadPuttingState()`. `importPuttingRoundFromStats(data)` (exposée sur `window`) crée une partie `source: 'stats'` à partir d'une partie saisie en détaillé dans `stats.js` ; elle est dédoublonnée par `statsKey`.

### `wedging.js` / `wedging.css`
SPA autonome (7 sections : constantes, `WedgeStorage`, `Analytics`, `UI`, état `Wedge`, vues, routeur). Journal Parcours (cases par distance de 30 à 110 m compris, zones de dispersion à 9 directions), exercices créatifs, analyses de dispersion, de distance et de SG. Possède son propre routeur par hash (`#parcours`, `#exercices`, `#sg-analysis`...) rendu dans `#app`. Calcule son SG avec `sgExpected('rough' | 'green', m)` de `strokes-gained.js`.
Les limites d'un coup de wedge sont les constantes `WEDGE_MIN_DISTANCE` (30 m, comprise) et `WEDGE_MAX_DISTANCE` (110 m, comprise) : elles construisent `WEDGE_BUCKETS` (16 paliers de 30-34m à 105-110m, le dernier prenant la limite haute, libellés par `wedgeBucketLabel`) et les chips de distance des exercices (de 30 à 110 m, par 5 m), et `stats.js` les lit pour classer ses coups. `normalizeWedgeRounds` range dans le dernier palier les coups enregistrés avec l'ancien palier "110m". `importWedgeShotsFromStats(list)` (exposée sur `window`) ajoute au Journal les coups venant de Stats (`source: 'stats'`, dédoublonnés par `statsKey`).

### `gym.js` / `gym.css`
Le plus gros fichier (6074 lignes). Injecte tout son HTML dans `#app-root-gym`, puis : bibliothèque d'icônes (`ICONS`, silhouette partagée `GYM_BODY` pour les zones du corps), données mockées (`GYM_DATA`), routeur interne, générateurs de composants et vues (Accueil, Programmes, Détail programme, Créer programme, Créer séance, Exercices, Séance active, Progression, Historique, Récap, Objectifs). Pavé numérique propre au module.

### `stats.js` / `stats.css`
IIFE unique. Composants (sparkline, KPI, filtres, graphiques Chart.js), écrans Dashboard / Par club / Par distance / Statistiques (Multi, Traditionnel, SG), saisie de parties (rapide trou par trou, ou détaillée coup par coup), calcul de toutes les stats à partir des parties enregistrées. Navigation interne via `data-goto`, exposée par `window.showStatsScreen`. Se rafraîchit au retour sur la page via un `MutationObserver`.
À la fin d'une partie, `saveFinishedRound` appelle `syncRoundToModules` : pour une partie saisie en détaillé, les coups à faire entre `WEDGE_MIN_DISTANCE` et `WEDGE_MAX_DISTANCE` m (compris) vont dans le Journal Wedging, et les premiers putts forment un parcours Putting. Sont ignorés : coups avec pénalité, sans zone d'arrivée exploitable (ou arrivée "Centre" sans secteur), trous rentrés sans putt. Un échec de synchro n'empêche jamais l'enregistrement dans Stats. Un coup est classé "wedging" dans Stats de `WEDGE_MIN_DISTANCE` (30 m) à `WEDGE_MAX_DISTANCE` compris : même plage que le Journal Wedging, sans trou entre les deux. Les coups de 30 à 50 m des parties saisies avant ce changement ne sont pas rétro-importés.
Groupes SG : `sgGroup(S)` range chaque coup dans `driving`, `green` (A.G., au-delà de `WEDGING_MAX`), `wedging`, `approches` (APP., moins de `WEDGING_MIN` = 30 m) ou `putting`. `liveHoleSG` (encadré de la saisie détaillée) fusionne `wedging` dans `green`, car cet encadré n'a pas de case Wedging, et `renderStats` cumule le résultat sur tous les trous de la partie.

### `vitesse.js` / `vitesse.css`
Placeholder : affiche "Fonctionnalités à venir".

### `images/`
`images/icon.png` (1024 px, carré plein sans coins arrondis) : icône de l'appli pour l'onglet et l'écran d'accueil du téléphone, déclarée par deux `<link>` dans `index.html`.
Fonds d'accueil (matin, midi, soir, nuit), fonds de boutons, illustrations de putts (`GreenPutt*`), programmes de gym, popup de reprise. Tous les fichiers sont en WebP et le code ne lit plus que des `.webp` : `HomePage.js`, `gym.js`, `gym.css`, `putting.js` (`QUICK_PUTT_IMAGE_EXT`) et `stats.js` (`IMAGE_EXT`). Les `.png` ne sont plus utilisés.
Non référencés dans le code (à confirmer avant suppression) : `FondEcranBoutonDenivele`, `FondEcranBoutonDistance`, `FondEcranBoutonVent`, `popupareprendre`.

## Données persistées (`localStorage`)

| Clé | Écrite par | Contenu |
|---|---|---|
| `golfSession` | `auth.js` | e-mail et date de session |
| `golfAppState` | `menu.js` | profil, réglages, radars, sac, distances |
| `parcours-settings`, `parcours-fairway-unit` | `parcours-ui.js` | unités |
| `parcours-fairway-round`, `parcours-green-round` | `parcours-ui.js` | tour en cours (Fairway, Green) |
| `parcours-captures` | `parcours-ui.js` | captures de l'historique |
| `putting_combines`, `putting_sessions`, `putting_rounds`, `putting_resume` | `putting.js` | combinés, sessions, parties (dont celles importées de Stats : `source: 'stats'`, `statsKey`), session à reprendre |
| `wedgingShots`, `wedgingExercises`, `wedgingInProgressSessions` | `wedging.js` | coups (dont ceux importés de Stats : `source: 'stats'`, `statsKey`), exercices, sessions en cours |
| `gym-programs-saved`, `gym-history`, `gym-goals`, `gym-active-program-id` | `gym.js` | programmes, historique, objectifs, programme actif |
| `golfStatsRounds` | `stats.js` | parties saisies dans Stats |

## Points d'attention pour la révision

Constats faits en lisant le code, classés par gravité. À confirmer en conditions réelles.

1. **Authentification factice.** Tout e-mail valide et tout mot de passe de 8 caractères ou plus ouvre une session (`TODO` dans `auth.js`). Aucune donnée n'est liée à un compte : deux utilisateurs sur le même navigateur partagent tout.
2. **Stats peu relié aux autres modules.** `stats.js` lit uniquement `golfStatsRounds` (ses propres parties) et le sac de `menu.js` ; il ne lit ni `putting_*`, ni `parcours-*`, ni `wedging*`. Il écrit dans Wedging et Putting, mais dans un seul sens : un coup supprimé dans Wedging ou Putting reste dans Stats, et les parties saisies avant cette fonctionnalité ne sont pas rétro-importées.
3. **Deux saisies de "Nouveau parcours".** `putting.js` (`putting_rounds`) et `stats.js` (`golfStatsRounds`) ont chacun leur popup, leur format et leur stockage. Une partie détaillée de Stats est copiée dans `putting_rounds`, mais les deux saisies restent distinctes.
4. **Couplage par `typeof` sur des globales de `menu.js`.** `parcours-ui.js` et `stats.js` testent `typeof golfBag` / `golfClubCatalog` / `personalDistances`. Cela fonctionne tant que le scope global est partagé, mais casse silencieusement si une variable est renommée.
5. **Noms globaux génériques.** `root` (`putting.js`), `Analytics`, `Router`, `UI`, `Views` (`wedging.js`), `backBtn`, `headerTitle`, `STORAGE_KEY` (`menu.js`). Aucune collision aujourd'hui, mais le risque reste à chaque nouveau fichier : préfixer les nouveaux noms globaux. Un `id="headerRightBtn"` est présent dans `putting.js` et `wedging.js` : aucun code ne le lit, sans effet.
6. **Page Parcours vide.** `#page-parcours .screen-view[data-screen="home"]` n'a jamais la classe `active` et reste en `display: none`. Le routeur d'écrans (`goToScreen`) a disparu de `parcours-ui.js` au commit `679b585`, et `app-shell.js` ne fait que lire cette classe. Les écrans `distances` et `add-shot` du même fichier sont des maquettes sans lien. À corriger : réactiver `home` à l'ouverture de la page.
7. **Taille des fichiers.** Images : les 27 PNG pesaient environ 54 Mo (1,5 à 3,2 Mo chacun), elles sont passées en WebP. Les `.webp` doivent être présents dans `images/` au même nom (sinon les fonds ne s'affichent plus). JS / CSS, toujours à traiter : `gym.js` (6071 lignes, 408 Ko), `stats.js` (3708), `putting.js` (3779), `gym.css`, `stats.css` et `putting.css` (3000 à 3600 lignes chacun) sont chargés au démarrage, y compris les parties jamais ouvertes.

### Bugs résolus

- **Icônes difformes ou sans rapport avec leur sens.** Revue complète des SVG : Gym (`ICONS` dans `gym.js` : muscle, running, tempo, sliders, legs, torso, abs, backMuscle, shoulders, arms, glutes, mobility, functional, equipment, layers). Les icônes de zones du corps partagent la silhouette `GYM_BODY` avec la zone travaillée en plein. Stats (`ICONS` et `LIE_ICON` dans `stats.js` : club, wedge, putter, bird, bag, bowl, arc, sliders, Fairway, Rough, Bunker). Accueil et Parcours (`index.html` : Wedging, Dénivelé, Historique, Bunker, Rough). Putting (`putting.js`, onglet Analyse distance). Les 9 boutons de fermeture `✕` de `parcours-ui.js` (caractère dépendant de la police) deviennent un SVG, dimensionné par `.icon-btn svg` dans `parcours-ui.css`. Convention : SVG inline 24×24, `stroke="currentColor"`, aucun emoji ni caractère Unicode comme icône.
- **Stats : filtre "Lie" de l'aperçu (Multi) supprimé.** Il ne servait pas, et `computeOverview` n'a plus de paramètre `lie`. Les filtres Lie de "Par club" et "Par distance" restent : ils sont lus par `computeClubInsights` et `computeDistanceInsights`.
- **Stats : boutons "⋯" sans action.** Les huit en-têtes de la page Stats (dont "Performance putting") avaient un bouton rond sans aucun gestionnaire. Retirés de `index.html`, ainsi que leurs règles dans `commun.css` et `stats.css` (le titre reste centré : la grille de l'en-tête a trois colonnes).
- **Saisie détaillée : score total en coups au lieu de l'écart au par.** Il affiche maintenant +1, -2 ou E.
- **Wedging : trou de 30 à 50 m et dernier palier.** Stats classait en wedging les coups à partir de 30 m, mais le Journal Wedging commençait à 50 m : les coups de 30 à 50 m n'allaient nulle part. Les paliers (boutons de saisie, filtres, graphes de dispersion, de distance et de SG) commencent maintenant à 30 m, comme les distances proposées pour les exercices (30 à 110 m). Le dernier palier affichait "105-109m" puis "110m" seul ; il devient "105-110m".
- **Strokes Gained : A.G. et APP. inversés** (saisie détaillée, tableau de bord, onglet SG des Statistiques). A.G. affichait les petits coups autour du green et APP. les longs coups. `sgGroup` (`stats.js`) corrigé : A.G. = attaque de green (longs coups), APP. = autour du green (moins de 30 m). La constante `AG_MAX` est supprimée au profit de `WEDGING_MIN`, son nom prêtait à confusion.
- **Encadré SG de la saisie détaillée** : il n'affichait que le SG du trou en cours. Il cumule maintenant tous les trous depuis le début de la partie, comme le SG total du haut.
- **Pavé numérique Gym disproportionné** (création de programme, objectifs, poids). L'icône Effacer est un SVG sans taille : elle s'étirait sur toute la touche. Fixé par une règle sur `#keypad-grid button svg` dans `gym.css`.
- **Clavier natif dans Stats (saisie détaillée).** Les champs Distance restante et Pénalité ouvraient le clavier du téléphone. Ils ouvrent maintenant le pavé de l'appli (`appKeypad`), et `#page-stats` a été ajouté à la liste `:is(...)` du pavé dans `commun.css`.
- **Clavier natif dans Gym (objectifs).** Le champ "Cible" du popup "Nouvel objectif" ouvre maintenant le pavé de Gym.
- **Stats > Multi : valeurs non alignées.** Chaque tableau calculait sa propre largeur de colonne. Les lignes de résumé et les tableaux à 2 colonnes partagent maintenant `--multi-label-col` (60 %), dans `stats.css`.
- **Stats > Multi : faux boutons.** Le chevron après le titre et le menu "Toutes distances" n'avaient aucune action. Supprimés de `statBlockHeader` (`stats.js`) et de `stats.css`.
- **Stats > Multi : photo du fairway hors écran.** `min-height` + `aspect-ratio` donnaient à la grille `.field-map-layout` une largeur minimale supérieure à l'écran. Colonne `minmax(0, 1fr)` et `min-width: 0` sur les enfants.
- **Stats > Multi : termes anglais.** Approach → Attaque de green, Penalty → Pénalités, Eagle → Aigle, Up & Down / U&D → Sauvetages (balle rentrée en 2 coups depuis un green raté), S. Bunker → Bunker, Vs par → Écart au par, GIR → Greens en régulation. Les autres écrans de Stats gardent leurs libellés.
- **Stats > Multi : espaces vides.** Score : 5 tuiles en 3 + 2 (`.stat-block__metrics--5`). Green : pleine largeur au lieu d'une hauteur fixe de 240 px. Graphique de distance : masqué sans données, plus de points pour une tranche à 0 %, échelle ajustée.
- **Écran "Remets ton téléphone en mode portrait" affiché partout.** `.orientation-lock_component` (`index.html`) n'avait aucune règle CSS : il s'affichait en clair sur toutes les pages. Règles ajoutées à la fin de `base.css` : masqué par défaut, visible seulement en mode installé (`display-mode: standalone`), en paysage et sur une hauteur de téléphone (500 px max). `index.html` référençait aussi `manifest.webmanifest`, absent du dépôt : ajouté, avec `"orientation": "portrait"` (verrouille la rotation sur Android à l'installation ; iOS ignore ce réglage et l'écran de secours prend le relais).
