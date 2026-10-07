# All-in-1

Application golf mobile-first : parcours, putting, wedging, stats, gym, profil. Tout est en HTML/CSS/JS vanilla, sans framework ni étape de build. Déployée provisoirement sur Vercel (`all-in-1-delta.vercel.app`) : le plan gratuit de Vercel exclut l'usage commercial, l'hébergeur devra changer avant la mise en ligne publique (voir "Mise en ligne et conformité").

Il n'y a aucun backend dans le code actuel : toutes les données vivent dans le `localStorage` du navigateur. La cible est Supabase (authentification et base de données) : les textes légaux sont déjà rédigés dans cette hypothèse.

## Guide fonctionnel

Cette partie décrit l'application du point de vue de l'utilisateur, sans vocabulaire technique. La documentation technique commence à la section "Architecture".

All-in-1 est un carnet d'entraînement et de jeu pour golfeur, utilisable sur téléphone. On s'y connecte, on arrive sur un accueil qui propose six parties de travail, et chacune se concentre sur un aspect du jeu. Les données sont enregistrées sur l'appareil.

### Connexion et création de compte
Écran de départ tant qu'on n'est pas connecté. On saisit son adresse e-mail et son mot de passe (8 caractères minimum à la création du compte). On peut afficher ou masquer le mot de passe. Une fois connecté, on retombe directement sur l'accueil aux ouvertures suivantes. La déconnexion se fait depuis le Menu. Sous les formulaires, les liens "conditions d'utilisation" et "politique de confidentialité" ouvrent les textes correspondants sans qu'il faille être connecté.

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
- **Aide & support** : FAQ (questions regroupées par thème), contact, textes légaux (conditions d'utilisation, politique de confidentialité, mentions légales), gestion des données personnelles et page À propos (version, crédits).
- **Déconnexion**.

#### Aide & support
- **FAQ** : réponses aux questions fréquentes (stockage des données, position et capteurs, statistiques, Strokes Gained, usage en compétition, gym, gratuité).
- **Contacter le support** : on choisit un sujet (question, problème technique, suggestion, données personnelles, autre) et on écrit son message. Le bouton Envoyer ouvre l'application e-mail du téléphone avec le message prêt à partir ; la version de l'appli et le type d'appareil sont ajoutés au message.
- **Conditions d'utilisation, Politique de confidentialité, Mentions légales** : textes lisibles dans l'appli, avec leur date de mise à jour.
- **Mes données** : exporter une copie de toutes ses données (fichier JSON, via la feuille de partage du téléphone ou en téléchargement), ou supprimer son compte et toutes ses données, après confirmation. La suppression est immédiate et irréversible (côté serveur aussi une fois Supabase branché).
- **À propos** : nom, version et crédits.

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
- **Tableau de bord** : carte Strokes Gained (SG total à gauche, catégories Driving, A.G., Wedging, Approches, Putting à droite avec une barre de progression verte ou rouge), puis "Mes indicateurs", "Analyser mon jeu" (accès à Par club, Par distance, Statistiques) et "Mes parcours" (6 derniers tours, lien "Voir tout" vers l'historique). "Mes indicateurs" affiche par défaut fairways touchés, greens touchés, putts par tour et birdies par tour ; le bouton "Modifier" ouvre la liste de tous les indicateurs (Score, Driving, Approche, Petit jeu, Putting, Strokes gained, dont les tentatives de birdie à 7 m et à 3 m) pour en afficher autant que souhaité.
- **Par club** et **par distance** : graphiques filtrables par période, parcours et position de la balle.
- **Statistiques** : trois présentations (aperçu multi-critères : Score, Fairway, Attaque de green, Approches, Putts ; statistiques traditionnelles ; Strokes Gained). L'aperçu se filtre par période et par parcours.
- **Historique des tours** : liste des parties, avec recherche par nom de parcours. S'ouvre depuis "Voir tout" ou un tour de "Mes parcours".
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

Les CSS sont chargés dans l'ordre `base`, `commun`, `HomePage`, `parcours-ui`, `wedging`, `gym`, `putting`, `vitesse`, `stats`, `menu`, `auth`. Tous les CSS et JS locaux portent le même paramètre de version dans `index.html` (`?v=31`), à incrémenter partout à chaque déploiement qui modifie un fichier (remplacer `?v=31` par le numéro suivant dans toutes les balises).

### Dépendances externes

- Chart.js 4.5.0 via cdnjs (graphiques de `stats.js`).
- API publique `https://api.flyawaygolf.com/v2` : recherche de golfs par géolocalisation et profil de golf, appelée uniquement depuis `stats.js` (popup "Nouveau parcours"). Elle reçoit la position de l'appareil : elle est citée dans la politique de confidentialité, comme Supabase, l'hébergeur et cdnjs (Chart.js).

### Règles de cloisonnement entre modules

Tous les modules vivent dans le même document et le même scope global. Pour qu'un module n'agisse jamais dans une page qui n'est pas la sienne :

- **Sélecteurs limités à la page.** Un `document.querySelector(...)` ou `querySelectorAll(...)` sur une classe ou un attribut générique (`data-header`, `.bottom-nav`, `.screen`, `.sheet`...) est préfixé par l'id de la page du module (`#page-putting ...`). `putting.js` le fait via `puttingQuery` / `puttingQueryAll`. Les seules requêtes qui visent volontairement une autre page sont celles de `renderGolfHome()` (`putting.js`), qui écrit dans `#page-home`.
- **Écouteurs globaux gardés.** Un écouteur posé sur `window` ou `document` (`hashchange`, `popstate`, `error`, `resize`, `click`, `keydown`) commence par vérifier que la page du module est affichée (`#page-xxx.active`) ou que la cible est dans la page. Cas particulier : `location.hash` est partagé entre Wedging (routeur) et Gym (`pushState`), aucun des deux ne doit réagir quand l'autre est affiché.
- **Attributs et ids uniques.** Pas de `data-xxx` ni d'`id` identique dans deux modules (`data-header` de Vitesse s'appelle `vitesse`, celui de Putting `main`).
- **État sur `body`.** Une classe ou un style posé sur `body` (`no-scroll`, `gym-home-locked`, `gym-view-fit`, `is-stats-screen`, `overflow`) est retiré par le module qui l'a posé quand il est quitté. Voir les points 37 et 38 pour ce qui reste à faire.

## Mise en ligne et conformité

### Statut de l'éditeur : non professionnel
L'appli est éditée à titre non professionnel (projet personnel, distinct de l'activité d'auto-entrepreneur de Pierre-Antton Ducoin). Les textes légaux en tiennent compte : pas d'adresse postale, de SIRET ni de médiateur affichés, et une identité complète communiquée à l'hébergeur. Cette position n'est tenable que tant que l'appli reste **gratuite, sans publicité ni abonnement** ; à confirmer auprès de la CFE ou d'un comptable.

Passage en professionnel, dès la première pub ou le premier abonnement :
- `menu.js` : réintroduire dans `MENU_LEGAL` l'adresse (ou une adresse de domiciliation), le SIRET, le directeur de la publication et le médiateur de la consommation ; changer `editorStatus` ; mettre à jour `MENU_DOCS` (mentions légales : éditeur complet ; CGU : section 4 "Gratuité" remplacée par les conditions de vente, clause de médiation ; confidentialité : paiements, publicité) ; changer `updatedAt` ;
- choisir un médiateur dans la liste officielle de la CECMC et y adhérer ;
- Google Play Console : passer du statut non-trader à trader (nom, adresse, e-mail et téléphone vérifiés affichés sur la fiche) ;
- App Store (plus tard) : achats via l'achat intégré d'Apple obligatoire pour les abonnements.

### Champs à compléter (`MENU_LEGAL` dans `menu.js`)
Tout champ au format `[À COMPLÉTER : ...]` s'affiche tel quel dans l'appli et est listé dans la console au chargement. Déjà renseignés : éditeur (Pierre-Antton Ducoin, non professionnel), e-mail de contact (`contactgolfevolution@gmail.com`), Supabase comme prestataire.

| Clé | À renseigner |
|---|---|
| `backendRegion` | Région du projet Supabase. Choisir une région de l'Union européenne à la création du projet (elle ne se change pas ensuite). |
| `hostName`, `hostAddress`, `hostUrl` | Nom, adresse et site de l'hébergeur de l'appli. |
| `appVersion`, `updatedAt` | Version affichée dans À propos, et date des textes légaux à changer à chaque modification de `MENU_DOCS`. |

### Remplacer Vercel
Le plan gratuit de Vercel (Hobby) est limité à un usage non commercial. Tant que l'appli reste gratuite et sans pub, il peut convenir (à vérifier dans leurs conditions) ; il ne conviendra plus dès la monétisation, et l'hébergeur doit alors changer. Si l'hébergeur change dès maintenant :
- renseigner `hostName`, `hostAddress` et `hostUrl` dans `MENU_LEGAL` (alimentent les mentions légales et la politique de confidentialité, rubrique "Prestataires") ;
- remplacer l'URL `all-in-1-delta.vercel.app` dans ce README et partout où elle est utilisée (fiche Google Play, configuration de l'appli Android) ;
- si l'appli est publiée sur Google Play en TWA, mettre à jour l'URL de départ et le fichier `/.well-known/assetlinks.json` sur le nouveau domaine ;
- vérifier dans la politique de confidentialité, rubrique "Transferts hors Union européenne", que le texte reste exact (hébergeur dans ou hors UE) ;
- reconfigurer les éventuels réglages propres à Vercel (en-têtes, redirections) chez le nouvel hébergeur.

### Brancher Supabase
- `auth.js` : remplacer la session `localStorage` (`TODO : appel backend`) par Supabase Auth, y compris le mot de passe oublié (`forgot-password`) et les boutons Apple et Google si conservés.
- `menu.js` : `deleteMenuData()` doit appeler une Edge Function qui supprime l'utilisateur et ses lignes, puis effacer en local. `exportMenuData()` doit inclure les données du serveur si elles ne sont plus toutes en local.
- Données : les textes supposent que le profil, les réglages et les données de jeu sont enregistrés côté serveur et retrouvés sur un autre appareil (FAQ, CGU, confidentialité). Adapter les textes si la synchronisation est partielle.
- Politique de confidentialité : si des services Supabase supplémentaires (stockage de fichiers, analytics) sont utilisés, les ajouter dans `MENU_DOCS.confidentialite`.
- **RLS (Row Level Security) obligatoire** sur toutes les tables, avec une règle du type "un utilisateur ne lit et n'écrit que les lignes dont `user_id = auth.uid()`". La clé publique (`anon`) est visible par tous dans le code : c'est la RLS qui protège les données. Sans elle, n'importe qui peut lire les données de tous les utilisateurs. Ne jamais mettre la clé `service_role` dans le code client.
- **Schéma de données à définir avant de coder** : une table par type de donnée (profil et réglages, parties, trous, coups, sessions et combinés de putting, coups et exercices de wedging, programmes, historique et objectifs de gym), chacune avec `user_id`, `id`, `created_at`, `updated_at`. Les clés du tableau "Données persistées" en donnent la liste.
- **Un seul module d'accès aux données.** Aujourd'hui chaque fichier lit et écrit son propre `localStorage` (`saveMenuState`, `savePuttingState`, `WedgeStorage`, etc.). Créer un fichier unique (par exemple `data.js`, chargé avant les modules) qui expose lecture, écriture et synchronisation, et y rediriger les modules un par un. Sinon la migration se fera en 8 endroits différents avec 8 comportements différents.
- **Hors-ligne.** Sur un parcours, le réseau est souvent mauvais. La saisie doit toujours écrire d'abord en local, puis une file d'attente envoie les données à Supabase quand le réseau revient (avec gestion des conflits : la dernière modification gagne, via `updated_at`). Sinon la saisie plante en plein trou.
- **Migration des données existantes** : prévoir à la première connexion l'envoi du contenu actuel du `localStorage` vers le compte, pour que les utilisateurs actuels ne perdent rien.
- **Connexion Apple** : exige un compte Apple Developer payant. Google et e-mail n'ont pas cette contrainte.
- Calculs (Strokes Gained, indicateurs de `stats.js`) : peuvent rester côté client dans un premier temps. Ne pas les déplacer côté serveur sans besoin.

### Publication
- Google Play Console : politique de confidentialité = `<url>/?legal=confidentialite` ; suppression de compte = `<url>/?legal=donnees` (compléter le formulaire "Sécurité des données" avec les données listées dans la politique).
- App Store (plus tard) : mêmes URL, plus suppression de compte dans l'appli.
- Fiche Google Play : se déclarer non-trader tant que l'appli est gratuite, sans pub ni abonnement. Google peut demander des justificatifs.

## Fichiers partagés

### `index.html` (1261 lignes)
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
Page d'accueil : fond selon l'heure (`getBackgroundByHour`, images `images/FondEcranHomePage*.webp`), prénom du profil (lu dans `golfAppState`), panneau de stats via `[data-stat="..."]` (`renderGolfStats(data)`, anneau de progression `setProgressRing`). Expose `window.renderHomeGreeting` (rappelée par `menu.js`) et `window.renderGolfStats`. Toutes ses requêtes DOM sont limitées à `#page-home`.

### `auth.js` / `auth.css`
Connexion et création de compte. La session est uniquement la clé `golfSession` du `localStorage` (`{ email, createdAt }`) : aucun serveur, la validation ne vérifie que le format de l'e-mail et la longueur du mot de passe (8 caractères minimum à l'inscription). Choisit la page de départ (`home` si session, sinon `login`), expose `window.authLogout` (appelée par le bouton de déconnexion de `menu.js`). Réutilise `getBackgroundByHour()` de `HomePage.js`. Les liens légaux sous les formulaires (dans `index.html`) appellent `openHelpPage('cgu' | 'confidentialite', 'login' | 'signup')` de `menu.js` : le texte s'ouvre dans la page Menu et le bouton retour ramène à l'écran d'origine.

### `menu.js` / `menu.css`
Profil et réglages. Gère l'état global persisté dans `golfAppState` : `userProfile`, `settings` (température, altitude, unités), `radars`, `golfBag`, `driverSettings`, `personalDistances`, `wedgeDistances`. Écrans : menu principal, sac de golf (`golfClubCatalog`), distances par club, et le groupe Aide & support (voir ci-dessous). Contient son propre pavé numérique (`openMenuKeypad`...) construit sur `appKeypad`. Expose `window.renderMenuTab`.
Ses variables globales (`golfBag`, `golfClubCatalog`, `personalDistances`, `wedgeDistances`, `settings`) sont lues directement par `parcours-ui.js` et `stats.js`.
Ses fonctions de sauvegarde sont `saveMenuState()` / `loadMenuState()` (préfixées pour ne pas entrer en collision avec celles de `putting.js`).

**Aide & support (`menu.js`, styles `faq_*`, `legal_*`, `contact_*`, `data_*` dans `menu.css`).**
- `MENU_LEGAL` : constantes éditeur (nom, statut, e-mail de contact), prestataire Supabase (nom, région), hébergeur, version et date de mise à jour. Les textes légaux lisent ces valeurs via des jetons `{{clé}}`. Tout champ encore au format `[À COMPLÉTER : ...]` est signalé dans la console au chargement. Pour mettre à jour un texte, changer `updatedAt`.
- `MENU_DOCS` : contenu des CGU, de la politique de confidentialité et des mentions légales (`{ title, heading, sections: [{ h, p, ul }] }`), rendu par `renderLegalDoc(id)`. `MENU_FAQ` : questions de la FAQ (accordéon natif `<details>`).
- `openHelpPage(id, from)` (exposée sur `window`) : routeur des écrans d'aide (`faq`, `contact`, `cgu`, `confidentialite`, `mentions`, `donnees`, `apropos`). `from` (`'login'` ou `'signup'`) fait revenir le bouton retour à cette page, pour les liens des écrans de connexion. `enterScreen()` accepte un 4e paramètre : le libellé du bouton retour.
- Contact : pas de serveur, `menuSendContactMessage()` ouvre un `mailto:` pré-rempli.
- Mes données : `exportMenuData()` (JSON de tout le `localStorage`) et `deleteMenuData()` (vide le `localStorage` puis recharge la page). Tant que Supabase n'est pas branché, la suppression ne touche que l'appareil : le `TODO Supabase` dans `deleteMenuData()` décrit ce qui manque.
- Liens directs publics : `?legal=cgu`, `?legal=confidentialite`, `?legal=mentions`, `?legal=donnees` ouvrent le texte sans compte. Ce sont les URL à renseigner dans Google Play Console (politique de confidentialité, suppression de compte) puis dans App Store Connect.
- À maintenir : toute nouvelle donnée collectée, tout nouveau service tiers (analytics, backend, paiement, connexion Apple/Google) ou changement de l'offre (abonnements) doit être reflété dans `MENU_DOCS.confidentialite` et `MENU_DOCS.cgu`, avec une nouvelle date `updatedAt`.

### `parcours-ui.js` / `parcours-ui.css`
Suivi pendant le parcours : Fairway (mises en jeu sur 18 trous), Green (attaques de green), Historique (bilan du parcours en cours), calculateur de vent, calculateur de dénivelé (capteurs d'orientation de l'appareil), calculateur "Mes distances" (lit `golfBag` et les distances de `menu.js`). Les fonctions sont globales car appelées depuis des `onclick` générés. Unités m/yd.

### `putting.js` / `putting.css`
Module le plus transversal. Combinés d'exercices (créatifs ou rapides), sessions de putting, reprise de session, analyses (distance, pente, performance, comparaisons), et saisie d'un "Nouveau parcours" avec historique et détail. Calcule le Strokes Gained des putts via `strokes-gained.js`. Remplit aussi les encadrés `[data-stat]` de l'accueil via `renderGolfHome()`. Expose `window.renderPuttingTab` et `window.renderGolfHome`. Ses requêtes DOM passent par `puttingQuery` / `puttingQueryAll` (limitées à `#page-putting`), sauf celles de `renderGolfHome()` qui visent `#page-home`. `renderPuttingTab()` retire `is-stats-screen` de `body` : ce drapeau reste sinon en place quand on quitte Putting depuis son écran Stats.
Sauvegarde : `savePuttingState()` / `loadPuttingState()`. `importPuttingRoundFromStats(data)` (exposée sur `window`) crée une partie `source: 'stats'` à partir d'une partie saisie en détaillé dans `stats.js` ; elle est dédoublonnée par `statsKey`.

### `wedging.js` / `wedging.css`
SPA autonome (7 sections : constantes, `WedgeStorage`, `Analytics`, `UI`, état `Wedge`, vues, routeur). Journal Parcours (cases par distance de 30 à 110 m compris, zones de dispersion à 9 directions), exercices créatifs, analyses de dispersion, de distance et de SG. Possède son propre routeur par hash (`#parcours`, `#exercices`, `#sg-analysis`...) rendu dans `#app`. Le routeur n'agit que si `#page-wedging` est affichée : `hashchange` est ignoré sinon, `body` et le scroll ne sont touchés que dans ce cas, et un hash étranger (Gym écrit aussi dans `location.hash`) laisse Wedging sur sa dernière route (variable `current`) au lieu de le renvoyer sur Parcours. Le toast "Erreur JS" ne répond qu'aux erreurs levées par `wedging.js` pendant que Wedging est affiché. Calcule son SG avec `sgExpected('rough' | 'green', m)` de `strokes-gained.js`.
Les limites d'un coup de wedge sont les constantes `WEDGE_MIN_DISTANCE` (30 m, comprise) et `WEDGE_MAX_DISTANCE` (110 m, comprise) : elles construisent `WEDGE_BUCKETS` (16 paliers de 30-34m à 105-110m, le dernier prenant la limite haute, libellés par `wedgeBucketLabel`) et les chips de distance des exercices (de 30 à 110 m, par 5 m), et `stats.js` les lit pour classer ses coups. `normalizeWedgeRounds` range dans le dernier palier les coups enregistrés avec l'ancien palier "110m". `importWedgeShotsFromStats(list)` (exposée sur `window`) ajoute au Journal les coups venant de Stats (`source: 'stats'`, dédoublonnés par `statsKey`).

### `gym.js` / `gym.css`
Le plus gros fichier (6074 lignes). Injecte tout son HTML dans `#app-root-gym`, puis : bibliothèque d'icônes (`ICONS`, silhouette partagée `GYM_BODY` pour les zones du corps), données mockées (`GYM_DATA`), routeur interne, générateurs de composants et vues (Accueil, Programmes, Détail programme, Créer programme, Créer séance, Exercices, Séance active, Progression, Historique, Récap, Objectifs). Pavé numérique propre au module. Son écouteur `popstate` ne réagit que si `#page-gym` est affichée.

### `stats.js` / `stats.css`
IIFE unique. Composants (sparkline, KPI, filtres, graphiques Chart.js), écrans Dashboard / Par club / Par distance / Statistiques (Multi, Traditionnel, SG), saisie de parties (rapide trou par trou, ou détaillée coup par coup), calcul de toutes les stats à partir des parties enregistrées. Navigation interne via `data-goto`, exposée par `window.showStatsScreen`. Se rafraîchit au retour sur la page via un `MutationObserver`.
À la fin d'une partie, `saveFinishedRound` appelle `syncRoundToModules` : pour une partie saisie en détaillé, les coups à faire entre `WEDGE_MIN_DISTANCE` et `WEDGE_MAX_DISTANCE` m (compris) vont dans le Journal Wedging, et les premiers putts forment un parcours Putting. Sont ignorés : coups avec pénalité, sans zone d'arrivée exploitable (ou arrivée "Centre" sans secteur), trous rentrés sans putt. Un échec de synchro n'empêche jamais l'enregistrement dans Stats. Un coup est classé "wedging" dans Stats de `WEDGE_MIN_DISTANCE` (30 m) à `WEDGE_MAX_DISTANCE` compris : même plage que le Journal Wedging, sans trou entre les deux. Les coups de 30 à 50 m des parties saisies avant ce changement ne sont pas rétro-importés.
Groupes SG : `sgGroup(S)` range chaque coup dans `driving`, `green` (A.G., au-delà de `WEDGING_MAX`), `wedging`, `approches` (APP., moins de `WEDGING_MIN` = 30 m) ou `putting`. `liveHoleSG` (encadré de la saisie détaillée) fusionne `wedging` dans `green`, car cet encadré n'a pas de case Wedging, et `renderStats` cumule le résultat sur tous les trous de la partie.
Indicateurs du dashboard : `kpiCatalog` liste tous les indicateurs (clé, groupe, titre, unité, icône, signe) et `DEFAULT_KPI_KEYS` les 4 affichés par défaut. `computeKpiValues` calcule la valeur de chacun sur les 20 dernières parties. Tentative de birdie à X m = 1er putt tenté en régulation (green touché) à X m ou moins, ramené à 18 trous saisis en détail. Le choix du joueur est enregistré dans `golfStatsKpis`.

### `vitesse.js` / `vitesse.css`
Placeholder : affiche "Fonctionnalités à venir". Son en-tête porte `data-header="vitesse"` (et non `main`, attribut utilisé par Putting).

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
| `golfStatsKpis` | `stats.js` | clés des indicateurs affichés dans "Mes indicateurs" (ordre d'affichage) |

## Points d'attention pour la révision

Constats faits en lisant le code, classés par gravité. À confirmer en conditions réelles.

1. **Authentification factice.** Tout e-mail valide et tout mot de passe de 8 caractères ou plus ouvre une session (`TODO` dans `auth.js`). Aucune donnée n'est liée à un compte : deux utilisateurs sur le même navigateur partagent tout.
2. **Stats peu relié aux autres modules.** `stats.js` lit uniquement `golfStatsRounds` (ses propres parties) et le sac de `menu.js` ; il ne lit ni `putting_*`, ni `parcours-*`, ni `wedging*`. Il écrit dans Wedging et Putting, mais dans un seul sens : un coup supprimé dans Wedging ou Putting reste dans Stats, et les parties saisies avant cette fonctionnalité ne sont pas rétro-importées.
3. **Deux saisies de "Nouveau parcours".** `putting.js` (`putting_rounds`) et `stats.js` (`golfStatsRounds`) ont chacun leur popup, leur format et leur stockage. Une partie détaillée de Stats est copiée dans `putting_rounds`, mais les deux saisies restent distinctes.
4. **Couplage par `typeof` sur des globales de `menu.js`.** `parcours-ui.js` et `stats.js` testent `typeof golfBag` / `golfClubCatalog` / `personalDistances`. Cela fonctionne tant que le scope global est partagé, mais casse silencieusement si une variable est renommée.
5. **Noms globaux génériques.** `root` (`putting.js`), `Analytics`, `Router`, `UI`, `Views` (`wedging.js`), `backBtn`, `headerTitle`, `STORAGE_KEY` (`menu.js`). Aucune collision aujourd'hui, mais le risque reste à chaque nouveau fichier : préfixer les nouveaux noms globaux. Un `id="headerRightBtn"` est présent dans `putting.js` et `wedging.js` : aucun code ne le lit, sans effet.
6. **Page Parcours vide.** `#page-parcours .screen-view[data-screen="home"]` n'a jamais la classe `active` et reste en `display: none`. Le routeur d'écrans (`goToScreen`) a disparu de `parcours-ui.js` au commit `679b585`, et `app-shell.js` ne fait que lire cette classe. Les écrans `distances` et `add-shot` du même fichier sont des maquettes sans lien. À corriger : réactiver `home` à l'ouverture de la page.
7. **Taille des fichiers.** Images : les 27 PNG pesaient environ 54 Mo (1,5 à 3,2 Mo chacun), elles sont passées en WebP. Les `.webp` doivent être présents dans `images/` au même nom (sinon les fonds ne s'affichent plus). JS / CSS, toujours à traiter : `gym.js` (6071 lignes, 408 Ko), `stats.js` (3708), `putting.js` (3779), `gym.css`, `stats.css` et `putting.css` (3000 à 3600 lignes chacun) sont chargés au démarrage, y compris les parties jamais ouvertes.

8. **Textes légaux non publiables en l'état.** Ils décrivent la cible (comptes et données sur Supabase) alors que le code est encore local : ne publier l'appli qu'une fois Supabase branché, et après avoir complété les champs listés dans "Mise en ligne et conformité". À faire relire par un juriste.
9. **Session forgeable.** `golfSession` n'est qu'un drapeau dans le `localStorage` : n'importe qui peut l'écrire depuis la console du navigateur pour passer l'écran de connexion. Sans backend, aucune donnée n'est protégée. Voir "Brancher Supabase" (Auth et RLS).
10. **Données uniquement locales.** Tout est dans le `localStorage` de l'appareil : vider le cache, changer de téléphone ou désinstaller l'appli efface tout, sans récupération possible. Le `localStorage` est aussi limité à environ 5 Mo par domaine : `gym-history`, `putting_sessions` et `golfStatsRounds` grossissent à chaque séance et finiront par atteindre la limite. Les écritures sont bien entourées d'un `try/catch`, mais l'erreur (`QuotaExceededError`) est ignorée sans prévenir l'utilisateur (voir point 20).
11. **Pas de gestion d'erreurs ni de validation.** Pas d'états de chargement ni d'échec réseau (appel à `api.flyawaygolf.com` dans `stats.js`, future synchro Supabase). Les saisies numériques (distance restante, pénalité, putts, poids, distances de clubs) doivent être bornées et validées avant d'être enregistrées. Aucun suivi des erreurs en production : ajouter un outil comme Sentry avant la mise en ligne publique, et le déclarer dans la politique de confidentialité.
12. **Pas de service worker.** Le manifest est présent, mais aucun fichier de service worker n'est documenté : l'appli ne se charge pas sans réseau et n'est pas réellement installable hors-ligne. À ajouter avec la synchro hors-ligne (voir "Brancher Supabase").
13. **Aucun outillage de contrôle.** Pas de `package.json`, de lint, de tests ni d'étape de build. Le numéro de version `?v=31` se change à la main dans toutes les balises, et un oubli laisse des fichiers en cache périmés chez les utilisateurs. Recommandé : ESLint avec les règles `no-undef`, `no-redeclare` et `no-unused-vars`, qui détectent automatiquement les collisions de noms globaux (points 4 et 5), les fonctions jamais appelées (code mort) et les noms mal écrits. Plus tard, un build (Vite) pour regrouper, minifier et versionner les fichiers sans intervention manuelle, ce qui règle aussi le poids des gros fichiers (point 7).
14. **Chart.js sans SRI.** `index.html` charge Chart.js depuis cdnjs sans attribut `integrity` ni `crossorigin` : si le CDN est compromis, le code s'exécute dans l'appli. Ajouter le hash SRI, ou héberger le fichier soi-même (ce qui retire aussi cdnjs de la politique de confidentialité).
15. **Panneau de statistiques de l'accueil : à moitié mort (vérifié dans le code).** Le panneau du bas de l'accueil a quatre colonnes, deux vivantes et deux mortes.
    - **Vivantes** : "Objectif semaine" et "Dernière séance" sont alimentées par `renderGolfHome()` (`putting.js`, ligne 1276), à partir de `putting_sessions` et `putting_rounds` uniquement. Elles ignorent donc le Gym, le Wedging, la Vitesse et les parties de Stats (sauf celles copiées dans `putting_rounds`). L'objectif de 5 séances par semaine est la constante `GOLF_WEEKLY_GOAL`, non modifiable par l'utilisateur.
    - **Mortes** : "Distance moyenne" et "Index" ne sont alimentées par aucun code. Les valeurs écrites en dur dans `index.html` (247 m, +8 m, 12.4, +0,3) ne s'affichent jamais : `renderGolfStats()` est appelée sans argument au chargement (`HomePage.js`, ligne 96) et les remplace par "_". Le commentaire de `putting.js` le dit : "Distance moyenne et Index ne dépendent pas du putting : non touchés ici".
    - **Ordre fragile** : `HomePage.js` remet tout à "_" au chargement (`renderGolfStats()`), puis rappelle `renderGolfHome()` pour tout remplir (ligne 100). Si l'ordre de chargement des scripts ou ce rappel change, le panneau reste vide. `putting.js` appelle aussi `renderGolfHome()` à son chargement (ligne 3780), dans `refreshAllAnalytics()` (ligne 1481) et au retour vers l'accueil (ligne 3095).
    - **Index** : la valeur existe déjà dans le profil (`golfAppState.userProfile`, saisie dans le Menu) mais n'est pas lue par l'accueil.

    À supprimer si tu retires les deux colonnes mortes (Distance moyenne et Index) ou tout le panneau. Termes à chercher dans tous les fichiers :
    - `index.html` : colonnes `.bottom-panel_column.is-distance` et `.is-index` (lignes 162 à 189), ou tout le bloc `.bottom-panel_wrapper` (ligne 143) ; attributs `data-stat="distance-value"`, `"distance-variation"`, `"index-value"`, `"index-variation"`.
    - `HomePage.js` : `renderGolfStats`, `setStat`, `setProgressRing`, `window.renderGolfStats`, l'appel `renderGolfStats()` de `DOMContentLoaded` et le rappel de `renderGolfHome` qui le suit (deviennent inutiles si `renderGolfStats` disparaît). Retirer les deux ensemble.
    - `putting.js` : `renderGolfHome`, `GOLF_WEEKLY_GOAL`, `RING_CIRCUMFERENCE`, `allActivityDates`, `relativeDayLabel`, ses 3 appels et `window.renderGolfHome`. À ne supprimer que si tout le panneau part.
    - `HomePage.css` : `bottom-panel_*`, `column_*` (lignes 215 à 315 environ), `progress-ring_*` et `goal_progress-*` (lignes 268 à 350 environ).

    Précautions anti-collision : (1) `data-progress` est aussi utilisé par `gym.js` (lignes 3770, 3933, 4075, 5966) sur `.progress-fill` : ne pas le supprimer globalement, seulement dans `index.html` et `putting.js` ; (2) `setStat`, `GOLF_WEEKLY_GOAL`, `RING_CIRCUMFERENCE`, `allActivityDates` et `relativeDayLabel` ne sont utilisés dans aucun autre fichier : suppression sans risque de collision ; (3) retirer `renderGolfHome` avec tous ses appels en même temps, sinon `is not defined` bloque les scripts suivants ; (4) vérifier la mise en page de l'accueil après suppression, car `HomePage.css` peut positionner les boutons orbitaux par rapport à ce panneau. Une fois fait, mettre à jour ce README : la phrase "Un petit panneau résume l'activité..." de l'Accueil (guide fonctionnel), la description de `HomePage.js` et celle de `putting.js`, puis déplacer ce point dans "Bugs résolus".

### Analyse approfondie du code (bugs et améliorations)

Faite en lisant les fichiers et avec ESLint (`no-undef`, `no-redeclare`, `no-unused-vars`) sur les 13 scripts concaténés dans l'ordre de `index.html`. Une partie des constats a été confirmée en exécutant l'appli dans un navigateur simulé (jsdom, mentionné quand c'est le cas). Aucun test n'a été fait sur un vrai téléphone : les points marqués "à tester" sont déduits du code.

**Bugs confirmés dans le code**

16. **Image Force cassée.** `gym.js:4104-4106` construit `images/Programme${Goal}.webp`, soit `ProgrammeForce.webp`. Le fichier du dépôt s'appelle `ProgrammeForce-1.webp` : la photo d'en-tête des programmes Force renvoie une 404. Corriger en renommant le fichier en `ProgrammeForce.webp`.
17. **Boutons morts à la connexion.** `data-auth-provider="apple"` et `"google"` n'ont aucun gestionnaire dans `auth.js`. "Mot de passe oublié" porte `data-auth-goto="forgot-password"`, une page qui n'existe pas : le clic est ignoré. Les trois boutons ne font rien, sans message. À brancher avec Supabase Auth, ou à masquer d'ici là.
18. **Variable jamais déclarée.** `resumableSession` (`putting.js:1681` à `1789`, 16 usages) n'a ni `let` ni `var`. Elle fonctionne comme variable globale implicite, car `putting.js` n'est pas en mode strict. Elle casserait avec un build (Vite) ou le mode strict, et une lecture avant `loadPuttingState()` lèverait `ReferenceError`. Correction : `let resumableSession = null;` près des autres états de `putting.js` (vers la ligne 636).
19. **Textes saisis injectés sans échappement.** `gym.js` et `wedging.js` n'appellent aucune fonction d'échappement HTML (contre 17 appels dans `menu.js`, 11 dans `putting.js`, 10 dans `stats.js`). Conséquences :
    - le titre d'un exercice Wedging est injecté dans `value="${f.name}"` et la description dans le `<textarea>` (`wedging.js:717-718`) : un titre contenant `"` est tronqué dans le champ, `</textarea>` casse la description. Même problème pour les noms affichés en `wedging.js:646`, `771`, `825`, `911`, `948`, `1092` ;
    - noms de programmes, d'exercices et titres d'objectifs de Gym : `gym.js:3691`, `3785`, `3855`, `3927`, `4111`, `4360`, `4540`, `4763`, `5573`, `5814`, entre autres ;
    - aujourd'hui seul l'utilisateur lui-même est touché (données locales). Ça devient un risque de sécurité (XSS stockée) dès que des données viendront d'un serveur ou d'un import.
    - Un helper d'échappement existe déjà en trois exemplaires (`escapeHtml` dans `menu.js`, `escHtml` dans `putting.js`, `esc` dans `stats.js`) : en garder un seul, chargé dans `commun.js`, et l'utiliser dans `gym.js` et `wedging.js`. Pour un attribut `value="..."`, échapper aussi `"`.
20. **Pertes de données silencieuses.** Quand `localStorage` est plein ou indisponible, `gym.js:2442-2474` (`gymWriteSavedPrograms`, `gymWriteList`) ignore l'erreur ("Stockage indisponible : on ignore"). L'utilisateur croit avoir enregistré sa séance. Même schéma confirmé ailleurs : `stats.js:1168` (`persistRounds` : la partie reste en mémoire mais n'est pas enregistrée, un simple `console.warn`), `putting.js:1663` (`savePuttingState`) et `menu.js:46` (`saveMenuState`). Correction : une seule fonction d'écriture qui prévient l'utilisateur en cas d'échec (voir "Brancher Supabase", module d'accès unique).
21. **Résolu.** Le toast "Erreur JS" de Wedging ne répond plus qu'aux erreurs de `wedging.js` quand Wedging est affiché (voir "Bugs résolus").

**Conflits d'interface (points 21 et 22 résolus, point 23 à tester sur téléphone)**

22. **Résolu.** Le routeur de Wedging et le `popstate` de Gym n'agissent plus quand leur page n'est pas affichée : le verrouillage de l'accueil Gym est conservé après un Retour (voir "Bugs résolus").
23. **Zones de bord inactives.** Le script inline de `index.html` (lignes 1231 à 1236) fait `preventDefault()` sur tout `touchstart` à moins de 16 px des bords gauche et droit, avec `passive: false`. Un bouton, un slider ou un doigt de zoom du Fairway qui commence dans cette zone est ignoré, et le défilement perd en fluidité sur tous les écrans. À tester sur les éléments proches des bords (slider de distance, pavé numérique, zoom du Fairway).

**Code mort vérifié**

ESLint signale 236 variables non utilisées, mais la plupart sont appelées par des `onclick` générés dans des templates, que ESLint ne voit pas. Chaque nom a donc été recherché dans tous les fichiers (JS, HTML, CSS). 13 noms ne sont référencés nulle part ailleurs que dans leur définition :
24. `wedging.js:1080` `setWedgeExercisesSort`, `wedging.js:1189` `setWedgeExReviewLimit` ; `gym.js:3346` `gymOnReady` ; `putting.js:802` `DISTANCE_BUCKET_LABELS`, `putting.js:1078` `svgColumnChart`, `putting.js:3148` `setParcoursRowPutts`, `putting.js:3185` `setParcoursRowClock` ; `stats.js:92` `statsOverview`, `stats.js:135` `trendRounds`, `stats.js:139` `clubInsights`, `stats.js:152` `distanceInsights`, `stats.js:159` `puttingPerformance`, `stats.js:309` `createSparkline`. À supprimer un par un, après une recherche globale du nom. Cette liste s'ajoute au point 15 (colonnes Distance moyenne et Index de l'accueil).

**Améliorations**

25. **Accessibilité : zoom bloqué.** La balise viewport contient `maximum-scale=1, user-scalable=no`, et `gesturestart` est bloqué par le script inline : impossible d'agrandir l'écran, ce qui pose problème aux utilisateurs malvoyants. Retirer ces blocages globaux et ne garder le blocage du pincement que sur les zones qui gèrent leur propre zoom (Fairway).
26. **Poids du dépôt.** `images/` pèse 61 Mo : 28 PNG (55 Mo) ne sont plus utilisés par le code, auxquels s'ajoutent les orphelines `FondEcranBoutonDenivele`, `FondEcranBoutonDistance`, `FondEcranBoutonVent`, `popupareprendre` (en `.png` et `.webp`) et `ProgrammeForce-1.webp` (à renommer, voir point 16). Supprimer les PNG et les orphelines du dépôt allège le clone et le déploiement.
27. **Dialogues natifs.** `confirm()`, `alert()` et `prompt()` sont utilisés 17 fois (`putting.js` 11, `gym.js` 4, `parcours-ui.js` 2). Ils jurent avec le design et s'affichent mal dans une appli installée. Les remplacer par une popup de l'appli (comme `deleteMenuData` dans `menu.js`).
28. **Un seul helper d'échappement et un seul module d'écriture.** Voir points 19 et 20 : ces deux briques partagées règlent la majorité des bugs de saisie et de perte de données.

**Deuxième passe : logique de `stats.js`, `gym.js`, `menu.js` et test d'exécution (jsdom)**

29. **Partie en cours jamais sauvegardée (critique).** Pendant la saisie d'une partie (rapide ou détaillée), `round`, `entries` et les coups saisis ne vivent qu'en mémoire : `stats.js` n'écrit dans `localStorage` que `golfStatsRounds` (parties terminées) et `golfStatsKpis` (lignes 1163 à 1168 et 1459 à 1465). Si l'appli est rechargée, fermée ou que le téléphone la décharge de la mémoire (fréquent sur iOS après quelques minutes en arrière-plan, et une partie dure 4 heures), toute la partie en cours est perdue. À corriger en priorité : enregistrer l'état de la saisie (partie, trou courant, coups) à chaque changement, et proposer "Reprendre la partie" au lancement. `putting.js` (`resumableSession`) a déjà ce mécanisme, à reprendre comme modèle.
30. **Impossible de terminer une partie incomplète.** Sur le dernier trou, le bouton de fin est masqué (`is-hidden`) tant que tous les trous ne sont pas complets (saisie rapide : `allComplete`, `stats.js:3038` et `3045`) ou tous rentrés (saisie détaillée : `allHoled`, `stats.js:3647` et `3652`), et `go()` ignore l'appui (`stats.js:3193` et `3864`). Une partie arrêtée au trou 12 (pluie, nuit, blessure) ne peut jamais être enregistrée, même avec 12 trous parfaitement saisis. À ajouter : "Terminer la partie ici", qui enregistre les trous joués (`holeCount` = nombre de trous joués).
31. **Aucune suppression ni modification d'une partie enregistrée.** `savedRounds` n'est jamais filtrée ni modifiée après l'ajout (`stats.js:1170` et `1257`). Une partie de test ou mal saisie fausse définitivement toutes les statistiques, et elle est aussi copiée dans Putting (`putting_rounds`, champ `statsKey`) et Wedging. Quand la suppression sera ajoutée, supprimer aussi dans Putting les parties dont `statsKey` vaut l'identifiant de la partie, et dans Wedging les coups dont `statsKey` commence par `${id}:`.
32. **Score brut qui mélange parties de 9 et 18 trous.** Le choix 9 ou 18 trous existe (`stats.js:185`), mais le meilleur score, le pire score et le score brut moyen comparent les totaux bruts sans tenir compte du nombre de trous : `computeRoundsSummary` (`bestScore`, `avgGrossScore`, `stats.js:1657`), `computeOverview` (`score.avgGross`, `best`, `worst`, `stats.js:1699`) et `computeKpiValues` (`scoreGross`, `bestScore`, `stats.js:1520`). Un 42 sur 9 trous devient le "meilleur score" devant un 85 sur 18. Les autres indicateurs (birdies, putts, SG) sont déjà ramenés à 18 trous. Correction : ne comparer que les parties de 18 trous, ou ramener le brut à 18 trous.
33. **Fairways : trous sans par comptés.** `roundTotals` (`stats.js:1410`), `computeKpiValues` (`stats.js:1491`) et `computeOverview` (`stats.js:1722`) retiennent les trous dont `par !== 3`, donc ceux dont le par est inconnu (parcours saisi à la main) comptent comme des trous de fairway, y compris des par 3. Le pourcentage de fairways touchés est alors sous-estimé. Correction : exiger `h.par === 4 || h.par === 5`.
34. **Dates calculées au chargement de la page.** `const GYM_TODAY = new Date()` (`gym.js:1028`) est figé une fois au chargement. Il sert à dater les séances d'un programme (`gym.js:3106`) et à fixer l'échéance par défaut d'un objectif à "aujourd'hui + 30 jours" (`gym.js:3326` puis `6037`). Dans une appli installée qui reste ouverte ou en arrière-plan plusieurs jours, les dates sont celles du chargement et non celles de la création. Remplacer par une fonction `gymToday()` qui renvoie `new Date()` à chaque appel. Le commentaire du fichier ("la démo reste cohérente") montre que ce code vient d'une version de démonstration.
35. **Polices Google non déclarées.** `base.css:1` charge Oswald, IBM Plex Mono et Inter depuis `fonts.googleapis.com` par `@import` : à chaque ouverture, l'adresse IP de l'utilisateur est transmise à Google, ce qui n'est cité ni dans "Dépendances externes" ni dans la politique de confidentialité (`menu.js:877` à `880` cite FlyAway Golf, cdnjs, Google/Apple et Google Play, pas Google Fonts). En plus, `@import` bloque l'affichage tant que la feuille n'est pas téléchargée. Oswald et IBM Plex Mono ne sont utilisées que dans `putting.css`, et Inter vient après `-apple-system` dans la pile de `base.css:150`, donc rarement affichée. Correction : héberger les polices (fichiers `woff2` dans le dépôt, `@font-face`) ou les retirer, puis ne rien ajouter à la politique de confidentialité.

36. **Séance de Gym en cours jamais sauvegardée.** Comme pour les parties de Stats (point 29), l'état d'une séance en cours (poids, répétitions, séries validées, exercice courant) n'existe que dans l'objet `state` en mémoire de `gym.js` (`gym.js:4839` à `4849`). Les seules clés écrites sont `gym-programs-saved`, `gym-history`, `gym-goals` et `gym-active-program-id`. Si l'appli est rechargée ou déchargée par le téléphone pendant une séance d'une heure, tout est perdu et il faut recommencer. Enregistrer l'état de `state` à chaque série validée, et le proposer à la reprise (comme `resumableSession` dans Putting et `saveCurrentSessionAsInProgress` dans Wedging).

**Cloisonnement entre modules (troisième passe, voir aussi "Règles de cloisonnement entre modules")**

37. **Fuites CSS globales restantes.** `parcours-ui.css` : `body.no-scroll .app`, `.screen-view.active` et `.screen` ne sont pas limités à `#page-parcours` (sans effet tant que `no-scroll` n'est posé que pendant que Parcours est affiché) ; `input[type="range"]` est stylé pour toute l'app (seul l'écran mort `add-shot` en utilise un). `stats.css` : `html { scroll-behavior: smooth; }` s'applique à toute l'appli et anime les `window.scrollTo(0, 0)` de Gym, Wedging et Putting (`showPage` force `instant`).
38. **Verrous de scroll sans propriétaire unique.** `no-scroll` est posé par `parcours-ui.js` (`MutationObserver`) et retiré par `showPage` ; `gym-home-locked` / `gym-view-fit` sont posés par `gym.js` et retirés par `app-shell.js` : le shell connaît donc Gym et Parcours. `stats.js` pose `body.style.overflow` dans trois popups (nouvelle partie, pavé de score, indicateurs). Tout nouveau module qui verrouille le scroll doit se retirer lui-même en quittant sa page, comme Parcours et Stats.
39. **Écrans morts de Parcours.** `distances` et `add-shot` (`index.html`) contiennent des liens `href="#home"`, `#distances`, `#add-shot` et `data-goto` qu'aucun code ne traite (Stats ne traite `data-goto` que dans `#page-stats`) : un clic change seulement `location.hash`, désormais ignoré par Wedging tant qu'il n'est pas affiché. À supprimer ou à brancher avec le point 6.
40. **Sélecteurs encore non préfixés par page.** `gym.js` : `.gym-view`, `.sheet.is-open`, `.sheet-overlay.is-open` et des ids génériques (`sheet-overlay`, `sheet-close`, `keypad-sheet-close`...). `wedging.js` : `#app`, `.wg-toast`. `menu.js` : `#backBtn`, `#headerTitle`, `.nav_back-label`. Aucune collision aujourd'hui (Parcours utilise `.modal-sheet`, pas `.sheet`), mais un nouveau module qui réutilise ces noms les casserait.

**Quatrième passe : gabarits HTML de `putting.js` et `gym.js`, `sg-data.js`, CSS**

Les gabarits ont été contrôlés par script (IDs, balises, `onclick`) et à l'œil pour les parties non répétitives. Les CSS l'ont été uniquement par scripts (accolades, validité des déclarations, variables, sélecteurs, `@keyframes`, `z-index`, classes), pas ligne à ligne.

41. **Deux boutons « ⋯ » morts dans Putting.** `putting.js:17` (`#headerRightBtn`) et `putting.js:26` n'ont aucun gestionnaire. Même défaut que celui déjà corrigé dans Stats.
42. **Dix boutons d'en-tête morts dans Gym.** Les `.gym-header__action` « Options » et « Réglages » n'ont aucun gestionnaire (`gym.js:18, 173, 205, 234, 329, 427, 565, 618, 659, 703`).
43. **« Voir tous » des objectifs ramène à l'accueil Gym (à tester sur téléphone).** Le lien `href="#objectifs-grid"` (`gym.js:731`) change le hash et déclenche `popstate`. `gymActivateView('objectifs-grid')` ne connaît pas cette vue et retombe sur `gym-home`.
44. **Messages de validation Wedging invisibles dans la modale.** `.wg-toast` est à `z-index: 100` (`wedging.css:564`) et `.wg-modal-overlay` à `200` (`wedging.css:636`). Dans la modale de création d'exercice, les messages de `wedging.js:576-578` (titre manquant, aucune distance, moins de 2 distances pour l'ascenseur) passent derrière l'overlay : rien ne s'affiche. Correction : `z-index` du toast au-dessus de 200.
45. **`@keyframes fadeUp` défini deux fois.** Version complète dans `parcours-ui.css:1276`, version sans `from` dans `stats.css:792`. Stats est chargé après Parcours (`index.html` lignes 14 et 19) : la version incomplète gagne, et l'animation d'apparition de `.screen, .top-bar, .page-header` (`parcours-ui.css:1272`) n'a plus d'effet visible. Si le doublon de Stats est supprimé, cette règle non scopée animera tous les en-têtes de toutes les pages : la scoper en même temps.
46. **Connexion : séparateur « OU » et boutons Apple / Google sans style.** `.auth_divider`, `.auth_divider-line`, `.auth_divider-text`, `.auth_social` et `.auth_button.is-social` n'ont aucune règle CSS (`index.html:1090-1104` et le bloc équivalent de l'inscription). Ces boutons sont aussi sans action (point 17).
47. **Règles globales dans `gym.css` (lignes 22 à 62).** `img { display: block }`, `ul, ol { list-style: none }`, `h1…p { margin: 0 }`, contour `:focus-visible` à l'accent Gym sur `input`, `button`, `select` et `[tabindex]`, scrollbar : tout s'applique à l'appli entière. `parcours-ui.css:1290` définit aussi `a:focus-visible` et `button:focus-visible` avec une autre couleur : `gym.css` est chargé après `parcours-ui.css` (`index.html`, lignes 14 et 16), donc le contour Gym l'emporte sur les boutons de tout le monde. Les puces des textes légaux sont préservées par `menu.css:563`.
48. **Marges en dur au lieu de `--app-page-top` et `--app-padding-x`.** `putting.css` (107, 115, 799, 807, 1349, 1357), `stats.css` (167, 173) et `vitesse.css` (30, 35) répètent `calc(56px + env(safe-area-inset-top) + 16px)` et une media query à la main, contre la règle de "Marges des pages".
49. **Gym : `.sheet` sans safe-area.** Le bas de `.sheet__body` est à 24 px fixes (`gym.css:1646`) : sur iPhone avec barre d'accueil, le dernier élément colle à l'indicateur.
50. **Détails de gabarits.** `</div>` orphelin à `gym.js:747` (reste du wrapper retiré d'`index.html`, sans effet). Libellé anglais "All" dans les graphiques de Putting (`putting.js:135, 171, 215`). Registre mélangé : vouvoiement ("Vos objectifs", "Développez votre", "Suivez… votre performance") et tutoiement ("Configure ta séance", "t'affiner") dans la même appli, parfois le même écran.
51. **CSS mort (candidats).** 168 classes ne sont référencées nulle part dans le JS ou le HTML : `wedging.css` 65, `putting.css` 46, `stats.css` 30, `gym.css` 21, `parcours-ui.css` 5, `base.css` 1 (`wg-container`). À vérifier par recherche globale avant suppression, car certains noms sont construits dynamiquement.
52. **Classes utilisées sans aucune règle CSS.** Hors écrans morts de Parcours (point 39) : `filter-chip-wrap` (`stats.js:403`), `insights_chart` (`stats.js:868`), `quick-entry_top` (`putting.js:3404`), `wg-insight-card-body` (`wedging.js:1247`), `session-actions__finish` et `session-actions__next` (`gym.js:541, 545`), `recap-set-pill__value` (`gym.js:5803`). À styler ou à retirer.

53. **Champs de saisie sous 16 px : zoom automatique d'iOS au focus (à tester sur iPhone).** `auth.css` fixe déjà `font-size: 1rem` avec un commentaire sur ce point, mais les autres champs qui ouvrent le clavier natif sont plus petits : Gym (`.field input` 13 à 15 px, `.search-bar input` 14,5 px), Wedging (`.wg-input`, `.wg-textarea`, `.wg-select` 15 px), Putting (`.exercise-modal_input` 15 px, `.quick-session_bar-input` 13 px, `.quick-entry_infoinput` 14 px), Stats (`#hist-search`, 13 px via `--fs-sm`, style inline à `index.html:619`) et Menu (`.field-list input`, 14 px, dans `commun.css`). `user-scalable=no` est ignoré par iOS Safari : la page zoome au focus et reste zoomée. Correction : 16 px minimum sur ces champs.
54. **Textes de 8 à 10 px.** 56 déclarations (`gym.css` 18, `putting.css` 12, `wedging.css` 11, `HomePage.css` 5, `parcours-ui.css` 5, `stats.css` 3, `commun.css` 2), dont des étiquettes à 8 et 9 px (`gym.css:2333`, `2838`, `HomePage.css:261`, `292`, `309`, `parcours-ui.css:1138`, `1245`). Illisible pour beaucoup d'utilisateurs, surtout avec le zoom bloqué (point 25).
55. **Menu : en-tête sans safe-area (à tester en mode installé).** `#page-menu .nav_component` (`menu.css`) est collant avec `padding: 24px 0 20px` et ne tient pas compte de `env(safe-area-inset-top)`, contrairement aux en-têtes de `commun.css:36`. Avec `viewport-fit=cover`, le bouton retour peut passer sous l'encoche selon le style de barre d'état d'iOS.
56. **Pas de balises iOS dans `<head>`.** Ni `theme-color` ni `apple-mobile-web-app-status-bar-style` : la couleur de barre d'état ne suit que le manifest (Android), et le comportement de la barre d'état sur iOS reste celui par défaut.

**Vérifié sans problème**

- Les 13 scripts concaténés dans l'ordre de `index.html` passent la syntaxe : aucune collision `let`, `const` ou `class` entre fichiers.
- Aucune collision de noms globaux (fonctions, `const`, `let`) ni de clé `localStorage` entre fichiers ; les écouteurs globaux de `stats.js` (clics, `keydown`) et de `menu.js` sont filtrés par la page ou retirés à la fermeture des popups ; `importPuttingRoundFromStats` ne plante pas si Putting n'a jamais été ouvert.
- Aucun ID dupliqué dans `index.html`, et tous les `onclick` du HTML pointent vers des fonctions existantes.
- Les graphiques Chart.js sont détruits avant d'être recréés et gardés par `typeof Chart` (appli utilisable si le CDN tombe).
- Les écouteurs ajoutés par `stats.js` et `parcours-ui.js` sont retirés, de même que les `setInterval` de Gym.
- Le texte renvoyé par l'API de golfs est échappé dans `stats.js`.
- Aucun `console.log` oublié.
- **Test d'exécution (jsdom)** : l'appli se charge et les 10 pages (accueil, parcours, stats, gym, vitesse, wedging, putting, menu, connexion, inscription) s'ouvrent sans erreur JavaScript. Seul avertissement : les champs `MENU_LEGAL` à compléter (voir "Champs à compléter").
- **Fin de partie détaillée** : une partie de test envoyée par `stats:round-finished` est bien enregistrée dans Stats, copiée dans Putting avec les bonnes distances de premier putt, et un deuxième envoi du même objet n'est pas enregistré en double (`round._saved`).
- **Tables Strokes Gained** (`sg-data.js`) : distances croissantes dans les 6 tables, conversion mètres vers yards et pieds correcte, valeurs cohérentes (putt de 1 m = 1,08 coup, putt de 0 m = 1,00). Quelques valeurs de la source baissent de 0,01 à 0,02 coup entre deux paliers voisins : c'est dans les données d'origine, sans effet sensible.
- **Calculs de `putting.js`, `wedging.js` et `gym.js`** : toutes les divisions par un nombre de coups, de trous ou de séries sont protégées contre zéro. Les chronomètres de Gym (`state.timerStart`, `hold.startedAt`) utilisent `Date.now()` et restent justes si l'appli passe en arrière-plan.
- **Passerelles Stats vers Wedging et Putting** : `importWedgeShotsFromStats` et `importPuttingRoundFromStats` ignorent les doublons (clé `statsKey`), valident chaque coup (palier, zone, distance) et génèrent des identifiants uniques. Les bornes 30 et 110 m sont cohérentes entre `stats.js` (`WEDGING_MIN`, `WEDGING_MAX`) et `wedging.js` (paliers de 30 à 105).
- **Capteurs** : `parcours-ui.js` demande bien la permission d'orientation sur iOS (`DeviceOrientationEvent.requestPermission`) et retire son écouteur.
- **Gabarits de `putting.js` (30-634) et `gym.js` (9-870)** : IDs uniques, `div` équilibrés (hors le `</div>` du point 50), tous les `onclick` pointent vers des fonctions existantes, aucun ID commun avec `index.html` ni avec les autres modules. Les paliers de distance du gabarit Putting (0-2, >2-3, >3-5, >5-9, >9 m) correspondent à `distanceBucketIndex`. Les lignes 870 à 985 de `gym.js` sont la bibliothèque `ICONS`, pas du gabarit.
- **`sg-data.js`** (lu en entier) : 6 tables triées par distance croissante, aucune erreur de structure. Deux précisions sur les données : la table `green` est plafonnée à 2,382 coup au-delà de 100 ft (30,5 m), donc tous les putts plus longs valent pareil ; elle fait un saut de 0,015 entre 30 et 31 ft puis reste plate à 32 ft (1,978, 1,993, 1,993). Ces deux points viennent de la source.
- **`menu.css` lu en entier, fin de `parcours-ui.css` (lignes 1000 à 1297) lue**, aucun défaut en plus de ceux listés (point 55 mis à part). Contrôles par script supplémentaires : aucun ID CSS sans élément correspondant, aucune règle vide, aucune propriété dupliquée dans une règle, aucune classe d'état (`classList`) sans règle CSS hormis les drapeaux JS (`is-stats-screen`).
- **CSS (11 fichiers)** : accolades équilibrées, aucune déclaration invalide (validateur css-tree), toutes les variables `var(--…)` définies (seule `--fill` de `parcours-ui.css` s'appuie sur un repli), un seul `@keyframes` en doublon (point 45), `100dvh` utilisé avec repli `100vh` partout où la hauteur est verrouillée.

### Bugs résolus

- **Wedging : le routeur agissait sur toute l'appli (points 21 et 22).** `hashchange` re-rendait Wedging même masqué et retirait `no-scroll`, `gym-home-locked` et `gym-view-fit` de `body` : un Retour/Avant du navigateur dans Gym faisait sauter le verrou de scroll de l'accueil Gym, et un import depuis Stats retirait `no-scroll` pendant Parcours. Le routeur ne touche plus à `body` ni au scroll hors de sa page. Un hash étranger ne le renvoie plus sur Parcours : un `rerender()` reste sur la vue en cours. Le toast "Erreur JS" apparaissait pour n'importe quelle erreur de n'importe quel module ; il ne répond plus qu'à `wedging.js`, Wedging affiché.
- **Gym : `popstate` actif hors de Gym.** Un retour navigateur pendant un autre module re-rendait l'accueil Gym (via `gymRenderHomeNextSession`, qui peut faire avancer et sauvegarder un programme terminé) et faisait défiler la page. Il est ignoré si Gym n'est pas affiché.
- **Putting et Vitesse : `data-header="main"` en double.** Putting cherchait son en-tête avec `document.querySelector` : après avoir ouvert Vitesse, il tombait sur l'en-tête de Vitesse et son propre en-tête ne se masquait plus. L'attribut de Vitesse devient `vitesse`, et toutes les requêtes de Putting (environ 70 sites d'appel) sont limitées à `#page-putting`.
- **Putting : `is-stats-screen` resté sur `body`.** Quitter Putting depuis son écran Stats laissait ce drapeau, lu ensuite comme "on vient de Stats" au lancement d'un exercice. `renderPuttingTab()` le retire.
- **Accueil : requêtes limitées à `#page-home`** (`HomePage.js` et `renderGolfHome()` de `putting.js`).
- Vérifié en simulation (jsdom, hors dépôt) : routeur Wedging avec hash étranger, Retour/Avant dans Gym, ouverture de Vitesse puis de Putting, exercice, nouveau parcours et retour depuis l'écran Stats de Putting, import Stats vers Wedging pendant Parcours. Pas de test sur téléphone.
- **Stats : "Mes indicateurs" modifiable.** Bouton "Modifier" ouvrant un popup avec 35 indicateurs classés par groupe (Score, Driving, Approche, Petit jeu, Putting, Strokes gained), dont "Tentatives de birdie à 7 m" et "à 3 m". Sélection libre, enregistrée dans `golfStatsKpis`. Valeurs par défaut inchangées.
- **Stats : accueil réorganisé.** Carte SG en deux colonnes avec barres de progression par catégorie, section "Mes indicateurs" (pastille à gauche, valeur à droite), "Analyser mon jeu" en liste de cartes pleine largeur avec description (la bulle "i" est supprimée), "Mes parcours" en cartes individuelles avec lien "Voir tout". Titres de section avec icône SVG (`.section__title--icon`). Calculs et valeurs inchangés.
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
