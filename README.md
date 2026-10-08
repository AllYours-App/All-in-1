# All-in-1

Application golf mobile-first : parcours, putting, wedging, stats, gym, profil. Tout est en HTML/CSS/JS vanilla, sans framework ni étape de build. Déployée provisoirement sur Vercel (`all-in-1-delta.vercel.app`) : le plan gratuit de Vercel exclut l'usage commercial, l'hébergeur devra changer avant la mise en ligne publique (voir "Mise en ligne et conformité").

Il n'y a aucun backend dans le code actuel : toutes les données vivent dans le `localStorage` du navigateur. La cible est Supabase (authentification et base de données) : les textes légaux sont déjà rédigés dans cette hypothèse.

## Guide fonctionnel

Cette partie décrit l'application du point de vue de l'utilisateur, sans vocabulaire technique. La documentation technique commence à la section "Architecture".

All-in-1 est un carnet d'entraînement et de jeu pour golfeur, utilisable sur téléphone. On s'y connecte, on arrive sur un accueil qui propose six parties de travail, et chacune se concentre sur un aspect du jeu. Les données sont enregistrées sur l'appareil.

### Connexion et création de compte
Écran de départ tant qu'on n'est pas connecté. On saisit son adresse e-mail et son mot de passe (8 caractères minimum à la création du compte). On peut afficher ou masquer le mot de passe. Une fois connecté, on retombe directement sur l'accueil aux ouvertures suivantes. La déconnexion se fait depuis le Menu. Sous les formulaires, les liens "conditions d'utilisation" et "politique de confidentialité" ouvrent les textes correspondants sans qu'il faille être connecté.

### Accueil
Message de bienvenue avec le prénom du joueur et fond d'écran qui change selon l'heure (matin, midi, soir, nuit). Six boutons mènent aux parties : Putting, Stats, Gym, Parcours, Vitesse, Wedging. Un petit panneau résume l'activité : objectif de séances de la semaine et date de la dernière séance. Un bouton de profil ouvre le Menu.

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
Chart.js 4.5.0 (`vendor/chart.umd.min.js`)
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

- Chart.js 4.5.0, hébergé dans `vendor/chart.umd.min.js` (graphiques de `stats.js`) : plus aucun CDN tiers.
- API publique `https://api.flyawaygolf.com/v2` : recherche de golfs par géolocalisation et profil de golf, appelée uniquement depuis `stats.js` (popup "Nouveau parcours"). Elle reçoit la position de l'appareil : elle est citée dans la politique de confidentialité, comme Supabase et l'hébergeur.

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

### `index.html` (1073 lignes)
Contient le HTML de Home, Parcours, Stats, Menu, Login et Signup, les conteneurs vides de Wedging, Gym, Putting et Vitesse, un script inline (bloque le swipe-retour iOS depuis les bords et le zoom au pincement) et la liste des scripts. Un script en `<head>` ajoute la classe `has-session` sur `<html>` si `golfSession` existe, pour éviter le flash de la page de connexion.

### `app-shell.js`
`showPage(id)` : active la page demandée et masque les autres. Ignore un id inconnu. Resynchronise `body.no-scroll` (Parcours le pilote lui-même) et retire `gym-home-locked` / `gym-view-fit` en quittant Gym. Expose `window.showPage`.

### `commun.js`
`appKeypad(pressFn, backspaceFn, clearFn, extraKey)` : génère le HTML d'un pavé numérique. Les boutons appellent par nom des fonctions globales via `onclick`. Utilisé par `menu.js`, `parcours-ui.js`, `putting.js`, `wedging.js` et `stats.js` (popup distance restante / pénalité de la saisie détaillée, fonctions globales préfixées `statsSd`). Gym a son propre pavé.

### `base.css`, `commun.css`
`base.css` : reset, tokens `:root` (dont les couleurs `--wg-*` partagées par tous les modules), règles globales. `commun.css` : composants partagés (`.app-keypad`, `.app-keypad-value`, en-têtes de page, etc.).

**Marges des pages (modèle : Putting).** Deux variables dans `base.css` : `--app-padding-x` (20 px, 16 px sous 360 px) pour la marge horizontale, et `--app-page-top` (56 px + safe-area + 16 px) pour le début du contenu sous le header fixe. Toute nouvelle page ou tout nouveau bloc de page les utilise, sans valeur en dur. Exceptions volontaires : les écrans de Gym et de Parcours verrouillés à la hauteur de l'écran (accueil Gym, création de programme, accueil Parcours) gardent un décalage vertical plus serré. `.screen` de `parcours-ui.css` est limité à `#page-parcours` (via `:where()`, spécificité inchangée) : il s'appliquait aussi à Stats et doublait sa marge.

### `vendor/chart.umd.min.js`
Chart.js 4.5.0 (licence MIT) : copie du fichier officiel `chart.umd.min.js` publié sur npm, chargée par `index.html` avec `?v=31`. Pour changer de version, remplacer ce fichier par celui de la nouvelle version (`npm pack chart.js@X.Y.Z`, dossier `dist/`).

### `sg-data.js` et `strokes-gained.js`
Moteur Strokes Gained partagé. `sg-data.js` contient les tables de référence `SG_BASELINES` (lies `tee`, `fairway`, `rough`, `sand`, `recovery`, `green` ; yards sauf `green` en pieds), extraites du dépôt `dgtaillie/python_strokes_gained`. `strokes-gained.js` convertit les mètres, interpole (`sgExpected`) et calcule le SG d'un coup (`sgShot`). Aucune dépendance au DOM. C'est le seul endroit où vivent des tables SG : `putting.js`, `wedging.js` et `stats.js` l'appellent. Sous 10 yd (9,1 m), les tables fairway / rough / sand sont plafonnées à leur valeur à 10 yd (la source n'a pas de points plus courts).

## Modules

### `HomePage.js` / `HomePage.css`
Page d'accueil : fond selon l'heure (`getBackgroundByHour`, images `images/FondEcranHomePage*.webp`), prénom du profil (lu dans `golfAppState`), Expose `window.renderHomeGreeting` (rappelée par `menu.js`). Le panneau du bas de l'accueil (objectif de la semaine, dernière séance) est rempli par `renderGolfHome()` dans `putting.js`. Toutes ses requêtes DOM sont limitées à `#page-home`.

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
Module le plus transversal. Combinés d'exercices (créatifs ou rapides), sessions de putting, reprise de session, analyses (distance, pente, performance, comparaisons), et saisie d'un "Nouveau parcours" avec historique et détail. Calcule le Strokes Gained des putts via `strokes-gained.js`. Remplit aussi le panneau de l'accueil (objectif de la semaine, dernière séance, `[data-stat]`) via `renderGolfHome()`, seule source de ce panneau. Expose `window.renderPuttingTab` et `window.renderGolfHome`. Ses requêtes DOM passent par `puttingQuery` / `puttingQueryAll` (limitées à `#page-putting`), sauf celles de `renderGolfHome()` qui visent `#page-home`. `renderPuttingTab()` retire `is-stats-screen` de `body` : ce drapeau reste sinon en place quand on quitte Putting depuis son écran Stats.
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
6. **Résolu.** L'écran `home` de Parcours porte la classe `active` dans `index.html` (le routeur `goToScreen` n'existe plus). À vérifier à l'écran (**T**) : ouverture de Parcours et verrou de défilement (`body.no-scroll`, posé par `showPage` à l'entrée) (voir "Bugs résolus").

7. **Taille des fichiers.** Images : les 27 PNG pesaient environ 54 Mo (1,5 à 3,2 Mo chacun), elles sont passées en WebP. Les `.webp` doivent être présents dans `images/` au même nom (sinon les fonds ne s'affichent plus). JS / CSS, toujours à traiter : `gym.js` (6071 lignes, 408 Ko), `stats.js` (3708), `putting.js` (3779), `gym.css`, `stats.css` et `putting.css` (3000 à 3600 lignes chacun) sont chargés au démarrage, y compris les parties jamais ouvertes.

8. **Textes légaux non publiables en l'état.** Ils décrivent la cible (comptes et données sur Supabase) alors que le code est encore local : ne publier l'appli qu'une fois Supabase branché, et après avoir complété les champs listés dans "Mise en ligne et conformité". À faire relire par un juriste.
9. **Session forgeable.** `golfSession` n'est qu'un drapeau dans le `localStorage` : n'importe qui peut l'écrire depuis la console du navigateur pour passer l'écran de connexion. Sans backend, aucune donnée n'est protégée. Voir "Brancher Supabase" (Auth et RLS).
10. **Données uniquement locales.** Tout est dans le `localStorage` de l'appareil : vider le cache, changer de téléphone ou désinstaller l'appli efface tout, sans récupération possible. Le `localStorage` est aussi limité à environ 5 Mo par domaine : `gym-history`, `putting_sessions` et `golfStatsRounds` grossissent à chaque séance et finiront par atteindre la limite. Les écritures sont bien entourées d'un `try/catch`, mais l'erreur (`QuotaExceededError`) est ignorée sans prévenir l'utilisateur (voir point 20).
11. **Pas de gestion d'erreurs ni de validation.** Pas d'états de chargement ni d'échec réseau (appel à `api.flyawaygolf.com` dans `stats.js`, future synchro Supabase). Les saisies numériques (distance restante, pénalité, putts, poids, distances de clubs) doivent être bornées et validées avant d'être enregistrées. Aucun suivi des erreurs en production : ajouter un outil comme Sentry avant la mise en ligne publique, et le déclarer dans la politique de confidentialité.
12. **Pas de service worker.** Le manifest est présent, mais aucun fichier de service worker n'est documenté : l'appli ne se charge pas sans réseau et n'est pas réellement installable hors-ligne. À ajouter avec la synchro hors-ligne (voir "Brancher Supabase").
13. **Aucun outillage de contrôle.** Pas de `package.json`, de lint, de tests ni d'étape de build. Le numéro de version `?v=31` se change à la main dans toutes les balises, et un oubli laisse des fichiers en cache périmés chez les utilisateurs. Recommandé : ESLint avec les règles `no-undef`, `no-redeclare` et `no-unused-vars`, qui détectent automatiquement les collisions de noms globaux (points 4 et 5), les fonctions jamais appelées (code mort) et les noms mal écrits. Plus tard, un build (Vite) pour regrouper, minifier et versionner les fichiers sans intervention manuelle, ce qui règle aussi le poids des gros fichiers (point 7).
14. **Résolu.** Chart.js 4.5.0 est hébergé avec l'appli (`vendor/chart.umd.min.js`) : plus de CDN tiers, donc plus besoin de SRI (voir "Bugs résolus").

15. **Résolu.** Colonnes mortes Distance moyenne et Index retirées de l'accueil, remise à "_" au chargement supprimée (voir "Bugs résolus").

### Plan de correction par fichier

Chaque ligne est un fichier à ouvrir une seule fois : tous les points qui le concernent se corrigent dans la même lecture. Ne lire que les lignes citées : `gym.js` (409 Ko), `stats.js` (202 Ko) et `putting.js` (177 Ko) ne se lisent jamais en entier (`grep -n` puis `sed -n 'a,bp'`). Ordre conseillé : du moins coûteux au plus coûteux, les CSS d'abord. **T** = à vérifier sur téléphone après correction.

| N° | Fichier (taille) | Points à corriger dans ce fichier |
|---|---|---|
| 1 | `wedging.css` (30 Ko) | Fait (voir "Bugs résolus"). |
| 2 | `vitesse.css`, `base.css`, `commun.css`, `HomePage.css`, `auth.css` | Fait (voir "Bugs résolus"). Reste le point 35 : héberger Inter. |
| 3 | `parcours-ui.css` (27 Ko) | Fait (voir "Bugs résolus"). |
| 4 | `menu.css` (15 Ko) | Fait (voir "Bugs résolus"), à tester : 55. |
| 5 | `stats.css` (96 Ko) | Fait (voir "Bugs résolus"). Reste : retirer `boxShadow: var(--shadow-card-hover)` dans `stats.js:430` (jeton supprimé, sans effet visible). |
| 6 | `putting.css` (60 Ko) | Fait (voir "Bugs résolus"). Reste : 53 pour Wedging (voir `wedging.css`). |
| 7 | `gym.css` (69 Ko) | Fait (voir "Bugs résolus"). |
| 8 | `index.html` | Fait : 6, 14, 15, 39, 53, 56. Reste : 17 et 46 (**décision** boutons morts), 23 (**T**), 25 (**décision**). |
| 9 | `auth.js` (6 Ko) | 17 (câbler ou retirer Apple, Google et « Mot de passe oublié »). Voir aussi les décisions 1 et 9 |
| 10 | `HomePage.js` (4 Ko) | Fait (point 15). |
| 11 | `stats.js` (202 Ko) | **29, 30, 31, 32, 33** (données, critiques), 11, 24 (`stats.js:92, 135, 139, 152, 159, 309`), 52 (l. 403, 868) |
| 12 | `putting.js` (177 Ko) | 18 (l. 1681-1789), 41 (l. 17 et 26), 50 (l. 135, 171, 215), 27 (11 dialogues), 24 (l. 802, 1078, 3148, 3185), 52 (l. 3404), 5, 3 |
| 13 | `wedging.js` (99 Ko) | 19 (échappement), 40, 24 (l. 1080, 1189), 52 (l. 1247), 5 |
| 14 | `gym.js` (409 Ko) | 16 (l. 4104-4106), 19, 20 (l. 2442-2474), 34 (l. 1028, 3106), 36, 42 (l. 18, 173, 205, 234, 329, 427, 565, 618, 659, 703), 43 (l. 731, **T**), 50 (l. 747), 27 (4 dialogues), 24 (l. 3346), 40, 52 (l. 541, 545, 5803) |
| 15 | `parcours-ui.js` (61 Ko) | 6, 38, 39, 27 (2 dialogues), 4 |
| 16 | `menu.js` (57 Ko) | 4, 5, 8 (`MENU_LEGAL`, voir décisions) |

**Corriger ensemble (dépendances entre points)**
- **19 et 20** : créer d'abord un helper d'échappement HTML et un module d'écriture sécurisée dans `commun.js` (1 Ko, à ouvrir avant `gym.js` et `wedging.js`).
- **29 et 36** : même mécanisme de brouillon dans le `localStorage` pour les parties de Stats et les séances de Gym.
- **41, 42 et 17** : une seule décision pour tous les boutons morts (les câbler ou les retirer), puis une correction par fichier (`putting.js`, `gym.js`, `auth.js`).
- **45, 37 et 57** : supprimer le `fadeUp` de Stats, scoper la règle d'animation de `parcours-ui.css` et préfixer les classes génériques dans le même passage, sinon tous les en-têtes se mettent à glisser.
- **57 avant 37** : écrire les `.btn` du Menu dans `menu.css` avant de scoper `parcours-ui.css`.
- **51, 52 et 24** : nettoyage du code mort, à faire en dernier, fichier par fichier, avec une recherche globale du nom avant suppression.

**Décisions du propriétaire avant toute modification** : 1 et 9 (authentification et session, dépendent de Supabase), 2 et 3 (une seule saisie de parties, un seul stockage), 7 et 26 (poids des images, suppression des PNG), 8 (textes légaux), 10 (sauvegarde des données), 12 (service worker), 13 (outillage et version `?v=31`), 25 (zoom autorisé ou non), 28 (briques partagées).

**À vérifier à l'écran après correction (T)** : 6, 15, 23, 43, 44, 45, 49, 53, 54, 55, 59, 60.

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
35. **Polices Google non déclarées.** **Partiellement résolu** : Oswald et IBM Plex Mono ne sont plus chargées (voir \"Bugs résolus\"). Reste Inter, toujours chargée depuis Google Fonts : à héberger en `woff2` (non faisable depuis l'environnement de correction, domaines bloqués). Constat d'origine : `base.css:1` charge Oswald, IBM Plex Mono et Inter depuis `fonts.googleapis.com` par `@import` : à chaque ouverture, l'adresse IP de l'utilisateur est transmise à Google, ce qui n'est cité ni dans "Dépendances externes" ni dans la politique de confidentialité (`menu.js:877` à `880` cite FlyAway Golf, cdnjs, Google/Apple et Google Play, pas Google Fonts). En plus, `@import` bloque l'affichage tant que la feuille n'est pas téléchargée. Oswald et IBM Plex Mono ne sont utilisées nulle part : seules les variables `--font-display` et `--font-mono` (`putting.css:27-28`) les déclarent et aucune règle ne les lit. Inter n'est lue que par Gym (`--gym-font`) et vient après `-apple-system` dans la pile de `base.css:150`, donc rarement affichée ailleurs. Le chargement échoue aussi hors connexion (point 12). Correction : héberger les polices (fichiers `woff2` dans le dépôt, `@font-face`) ou les retirer, puis ne rien ajouter à la politique de confidentialité.

36. **Séance de Gym en cours jamais sauvegardée.** Comme pour les parties de Stats (point 29), l'état d'une séance en cours (poids, répétitions, séries validées, exercice courant) n'existe que dans l'objet `state` en mémoire de `gym.js` (`gym.js:4839` à `4849`). Les seules clés écrites sont `gym-programs-saved`, `gym-history`, `gym-goals` et `gym-active-program-id`. Si l'appli est rechargée ou déchargée par le téléphone pendant une séance d'une heure, tout est perdu et il faut recommencer. Enregistrer l'état de `state` à chaque série validée, et le proposer à la reprise (comme `resumableSession` dans Putting et `saveCurrentSessionAsInProgress` dans Wedging).

**Cloisonnement entre modules (troisième passe, voir aussi "Règles de cloisonnement entre modules")**

37. **Fuites CSS globales restantes.** `parcours-ui.css` : `body.no-scroll .app`, `.screen-view.active` et `.screen` ne sont pas limités à `#page-parcours` (sans effet tant que `no-scroll` n'est posé que pendant que Parcours est affiché) ; `input[type="range"]` est stylé pour toute l'app (seul l'écran mort `add-shot` en utilise un). `stats.css` : `html { scroll-behavior: smooth; }` s'applique à toute l'appli et anime les `window.scrollTo(0, 0)` de Gym, Wedging et Putting (`showPage` force `instant`).
38. **Verrous de scroll sans propriétaire unique.** `no-scroll` est posé par `parcours-ui.js` (`MutationObserver`) et retiré par `showPage` ; `gym-home-locked` / `gym-view-fit` sont posés par `gym.js` et retirés par `app-shell.js` : le shell connaît donc Gym et Parcours. `stats.js` pose `body.style.overflow` dans trois popups (nouvelle partie, pavé de score, indicateurs). Tout nouveau module qui verrouille le scroll doit se retirer lui-même en quittant sa page, comme Parcours et Stats.
39. **Résolu.** Écrans `distances` et `add-shot` retirés d'`index.html` (164 lignes) ; aucun script ne les référençait. Le CSS propre à ces écrans, s'il en reste dans `parcours-ui.css`, n'a pas été recherché (voir "Bugs résolus").

40. **Sélecteurs encore non préfixés par page.** `gym.js` : `.gym-view`, `.sheet.is-open`, `.sheet-overlay.is-open` et des ids génériques (`sheet-overlay`, `sheet-close`, `keypad-sheet-close`...). `wedging.js` : `#app`, `.wg-toast`. `menu.js` : `#backBtn`, `#headerTitle`, `.nav_back-label`. Aucune collision aujourd'hui (Parcours utilise `.modal-sheet`, pas `.sheet`), mais un nouveau module qui réutilise ces noms les casserait.

**Quatrième passe : gabarits HTML de `putting.js` et `gym.js`, `sg-data.js`, CSS**

Les gabarits ont été contrôlés par script (IDs, balises, `onclick`) et à l'œil pour les parties non répétitives. Les CSS l'ont été uniquement par scripts (accolades, validité des déclarations, variables, sélecteurs, `@keyframes`, `z-index`, classes), pas ligne à ligne.

41. **Deux boutons « ⋯ » morts dans Putting.** `putting.js:17` (`#headerRightBtn`) et `putting.js:26` n'ont aucun gestionnaire. Même défaut que celui déjà corrigé dans Stats.
42. **Dix boutons d'en-tête morts dans Gym.** Les `.gym-header__action` « Options » et « Réglages » n'ont aucun gestionnaire (`gym.js:18, 173, 205, 234, 329, 427, 565, 618, 659, 703`).
43. **« Voir tous » des objectifs ramène à l'accueil Gym (à tester sur téléphone).** Le lien `href="#objectifs-grid"` (`gym.js:731`) change le hash et déclenche `popstate`. `gymActivateView('objectifs-grid')` ne connaît pas cette vue et retombe sur `gym-home`.
44. **Résolu.** Messages de validation Wedging visibles dans la modale (voir "Bugs résolus", à vérifier sur téléphone).
45. **Résolu.** Plus de doublon `fadeUp` : seul celui de `parcours-ui.css` reste. À vérifier à l'écran (**T**) : les en-têtes ne doivent pas glisser (voir "Bugs résolus").

46. **Résolu.** Séparateur « OU » et boutons Apple / Google stylés (voir "Bugs résolus"). Les boutons restent sans action : point 17.
47. **Résolu.** Les règles globales de `gym.css` sont limitées à `#page-gym` via `:where()` (même spécificité qu'avant) (voir "Bugs résolus").

48. **Résolu.** `putting.css` (6 emplacements) et `stats.css` (2) utilisent `--app-page-top` et `--app-padding-x`, media queries à la main retirées. Les écrans verrouillés de Gym gardent leur décalage vertical plus serré (exceptions déjà décrites dans "Marges des pages") (voir "Bugs résolus").

49. **Résolu.** Le bas de `.sheet__body` ajoute `env(safe-area-inset-bottom)`. À vérifier sur iPhone (**T**) (voir "Bugs résolus").

50. **Détails de gabarits.** `</div>` orphelin à `gym.js:747` (reste du wrapper retiré d'`index.html`, sans effet). Libellé anglais "All" dans les graphiques de Putting (`putting.js:135, 171, 215`). Registre mélangé : vouvoiement ("Vos objectifs", "Développez votre", "Suivez… votre performance") et tutoiement ("Configure ta séance", "t'affiner") dans la même appli, parfois le même écran.
51. **Partiellement résolu.** Classes supprimées après recherche dans tous les scripts et dans `index.html` : `stats.css` 34, `putting.css` 47, `gym.css` 16. Gardées car construites par concaténation : `is-iron` (Stats), `chart-line--*` et `chart-readout__item--*` (Gym). Reste : `base.css` `wg-container` (à vérifier), le code JS mort (points 24 et 52) et `parcours-ui.css`.

52. **Classes utilisées sans aucune règle CSS.** Hors écrans morts de Parcours (point 39) : `filter-chip-wrap` (`stats.js:403`), `insights_chart` (`stats.js:868`), `quick-entry_top` (`putting.js:3404`), `wg-insight-card-body` (`wedging.js:1247`), `session-actions__finish` et `session-actions__next` (`gym.js:541, 545`), `recap-set-pill__value` (`gym.js:5803`). À styler ou à retirer.

53. **Partiellement résolu.** À 16 px : Menu (`.field-list input`), Gym (`.field input`, `.search-bar input`, `#view-creer-programme`, `.set-card__weight-input`), Putting (`.exercise-modal_input`, `.quick-session_bar-input` ; `.quick-entry_infoinput` n'est plus dans le JS) et Stats (`#hist-search`). Reste : Wedging (`.wg-input`, `.wg-textarea`, `.wg-select` à 15 px dans `wedging.css`). À tester sur iPhone (**T**), surtout l'écran verrouillé de création de programme Gym. `user-scalable=no` reste ignoré par iOS Safari.

54. **Partiellement résolu.** `gym.css` et `putting.css` n'ont plus aucun texte sous 11 px (les réductions de Gym sous 400 et 360 px ne descendent plus sous 11 px). Reste, en déclarations de 8 à 10 px : `wedging.css` 7, `parcours-ui.css` 5, `HomePage.css` 3, `commun.css` 2, `stats.css` 1. À vérifier à l'écran (**T**) : les étiquettes de Gym et de Putting, plus larges.

55. **Menu : en-tête sans safe-area (à tester en mode installé).** `#page-menu .nav_component` (`menu.css`) est collant avec `padding: 24px 0 20px` et ne tient pas compte de `env(safe-area-inset-top)`, contrairement aux en-têtes de `commun.css:36`. Avec `viewport-fit=cover`, le bouton retour peut passer sous l'encoche selon le style de barre d'état d'iOS.
56. **Résolu.** `theme-color` (`#050505`, comme le manifest), `mobile-web-app-capable`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` (`black-translucent`) et `apple-mobile-web-app-title` ajoutés dans `<head>` (voir "Bugs résolus").

57. **`parcours-ui.css` : classes génériques non scopées, utilisées par d'autres modules.** `.btn`, `.btn-primary`, `.icon-btn`, `.card`, `.stat-card`, `.history-item` (avec `:hover` et `:active`), `.progress-track`, `.progress-fill`, `.page-subtitle` et `.kpi-card` s'appliquent à toute l'appli (complète le point 37).
    - **Menu dépend de Parcours.** `menu.js:208, 487, 521` utilise `class="btn btn-primary"` et `menu.css` n'a aucune règle `.btn` : les boutons Valider et Enregistrer du Menu ne tiennent que grâce à `parcours-ui.css`. Retirer ou modifier ce fichier les casse.
    - **Fuites dans les autres modules.** `putting.js` utilise `.stat-card`, `.history-item` et `.page-subtitle`, `gym.js` `.progress-track`, `.progress-fill`, `.icon-btn` et `.btn`, `stats.js` `.card` et `.kpi-card`. Les règles scopées de ces modules l'emportent sur les conflits, mais les propriétés qu'elles ne redéfinissent pas viennent de Parcours : bordure et `transition` des barres de progression de Gym, `transform: scale(0.99)` au toucher et bordure au survol des lignes d'historique de Putting.
    - **Correction.** Préfixer ces règles par `#page-parcours`, et créer pour Menu ses propres règles de bouton (ou les déplacer dans `commun.css`).
58. **Résolu.** Les règles `.card` (media queries), `.card--interactive` et `.chart-card__head` de `gym.css` sont limitées à `.gym-app` via `:where()`. `.kpi-card__value` n'était plus utilisé par Gym : supprimé (voir "Bugs résolus").

59. **Résolu.** Les `:hover` restants de `stats.css` (4), `putting.css` (1) et `gym.css` (1) sont dans `@media (hover: hover)`. Le `:focus-visible` de `.new-round_result` est séparé de son `:hover` (voir "Bugs résolus").

60. **Partiellement résolu.** Zone d'appui de 44 px ajoutée par `::after`, visuel inchangé : Stats (`.saisie-detaillee_delete`, `.saisie-detaillee_holed`, `.saisie-detaillee_popup-close`), Putting (`.exercise-card_actions button` avec écart porté à 22 px, steppers, croix de modales, `.quick-session_info-btn`, `.session-holes-nav_item`, `.session-attempt`), Gym (`.session-header__back`, `.session-header__pause`, `.session-exercise-hero__arrow`, `.set-card__timer-btn`, `.icon-btn--sm`, `.exercise-row__duration-clear`, `.set-card__validate`). `.chart-card__info-btn` et `.exercises-filter_button` étaient inutilisés : supprimés. Reste : les lignes empilées de la saisie détaillée de Stats (`.saisie-detaillee_field`, `_lie`, `_group`, `_shot-button`, 30 px : les agrandir demande de revoir une mise en page verrouillée sans défilement, **décision de design**), `.quick-action-info` et `.track-reset-btn`, `.mode-btn` (Parcours), `.keypad-sign-btn`, `.keypad-close` (Menu). À vérifier à l'écran (**T**) : pas de chevauchement entre boutons voisins.

61. **Résolu.** `.sheet` (Gym) et `.exercise-modal` (Putting) ont un repli `dvh` (voir "Bugs résolus").

62. **Résolu.** Utilitaires `.mt-*` de Wedging renommés selon leur valeur (voir "Bugs résolus").

63. **Fusionné dans le point 35.**

64. **Résolu.** `--color-bg-card-hover` vaut `#1a221d` (`.round-row:hover` et `.new-round_result:hover` ont un effet). Supprimés : `--color-accent-dim`, `--glass-*`, `--shadow-*`, les deux `box-shadow: none` sur pseudo-éléments et `.analysis-card--disabled:hover`. `--color-border-strong` est gardé (alias utilisé comme bordure). `stats.js:430` lit encore `--shadow-card-hover` (sans effet, voir `stats.js`) (voir "Bugs résolus").

65. **Résolu.** Le dégradé radial de `.hero-photo::before` (règle vide retirée) et le `backdrop-filter` de `.sheet-overlay` sont supprimés de `gym.css` (voir "Bugs résolus").

**Vérifié sans problème**

- Les 13 scripts concaténés dans l'ordre de `index.html` passent la syntaxe : aucune collision `let`, `const` ou `class` entre fichiers.
- Aucune collision de noms globaux (fonctions, `const`, `let`) ni de clé `localStorage` entre fichiers ; les écouteurs globaux de `stats.js` (clics, `keydown`) et de `menu.js` sont filtrés par la page ou retirés à la fermeture des popups ; `importPuttingRoundFromStats` ne plante pas si Putting n'a jamais été ouvert.
- Aucun ID dupliqué dans `index.html`, et tous les `onclick` du HTML pointent vers des fonctions existantes.
- Les graphiques Chart.js sont détruits avant d'être recréés et gardés par `typeof Chart`.
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
- **`wedging.css` lu en entier.** Variables `--wg-max-width` et `--wg-transition` définies dans `base.css:76-77`, roue du green dimensionnée par `#page-wedging svg.wg-wheel` (la règle `#page-wedging svg { 20px }` ne l'écrase pas), aucun autre défaut en plus des points 44, 59, 60, 61 et 62 (tous corrigés).
- **`putting.css` lu en entier.** Aucun défaut en plus des points 35, 48, 53, 59, 60 et 61. Les modales Putting tiennent compte de la safe-area basse (`padding-bottom: calc(24px + env(safe-area-inset-bottom))`), contrairement aux bottom sheets de Gym (point 49).
- **`stats.css` lu en entier.** Aucun défaut en plus des points 45, 48, 53, 58, 59, 60 et 64. Les modales de Stats utilisent déjà `font-size: 16px` sur leurs champs (`.new-round_field-input`, `.new-round_field-select`, `.saisie-detaillee_field-select`) : `#hist-search` (point 53) est l'exception.
- **`gym.css` lu en entier.** Défauts relevés : points 43 (lien « Voir tous »), 47, 48, 49, 53, 54, 58, 59, 60, 61 et 65. Le gabarit `#view-creer-programme` utilise une mise en page à `clamp()` selon la hauteur d'écran qui tient sans défilement entre 480 et 800 px de haut ; je ne l'ai pas rendue à l'écran. Les sheets de Gym sont placées hors des vues animées (`gym.js:750`), donc les animations `forwards` de `.gym-anim-in` n'affectent pas leur `position: fixed`.
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
- **Wedging : `wedging.css` (points 44, 59, 60, 61, 62, 51).** `.wg-toast` passe à `z-index: 300` (au-dessus de `.wg-modal-overlay` à 200) : les messages de validation de la modale de création d'exercice s'affichent. Les utilitaires `.mt-*` portent maintenant leur vraie valeur (`.mt-6` = 6 px, `.mt-8` = 8 px, scopés par `:where(#page-wedging)`) ; `.mt-8`, `.mt-10` et `.mt-12` de `wedging.js` ont été renommés en `mt-6` / `mt-8` sans changement d'affichage. `.wg-modal` a un repli `88dvh`. Les 7 règles `:hover` restantes sont dans `@media (hover:hover)`. Zones d'appui portées à 44 px (pseudo-élément `::after`) sur `.wg-exercise-actions button` (écart de 22 px entre boutons), `.wg-stepper-controls button` et `.wg-modal-close`. 82 règles CSS mortes supprimées (65 classes sans référence dans le JS ni le HTML, aucune construction dynamique de nom trouvée) et le `@keyframes wgFadeIn` devenu orphelin. À vérifier sur téléphone : toast dans la modale (44), appui sur les boutons modifier / dupliquer / supprimer (60), `Wedging` complet pour s'assurer qu'aucun style n'a disparu (51).
- **Petits CSS partagés (points 46, 48, 53, 65, 35 en partie).** `auth.css` : règles ajoutées pour `.auth_divider*`, `.auth_social` et `.auth_button.is-social` (séparateur « OU » et boutons Apple / Google, repris des jetons `--auth-*`). `vitesse.css` : marges via `--app-page-top` et `--app-padding-x`, media query supprimée. `commun.css` : champs `.field-list` du Menu et de Stats à 16 px (plus de zoom iOS au focus, à tester sur iPhone). `HomePage.css` : halo coloré des `.orbit-button` et variables `--glow` retirés. `base.css` : `@import` ne charge plus que Inter (Oswald et IBM Plex Mono n'étaient lues par aucune règle ; les variables `--font-display` et `--font-mono` de `putting.css:27-28` restent, sans effet).
- **Parcours et Menu : `parcours-ui.css` et `menu.css` (points 37, 45, 55, 57, 59, 61, 65, 51 en partie).** `menu.css` : règles `.btn` et `.btn-primary` écrites pour `#page-menu` (Valider du pavé, Enregistrer, Envoyer ne dépendent plus de Parcours), en-tête avec `env(safe-area-inset-top)`, 2 `:hover` dans `@media (hover: hover)`. `parcours-ui.css` : `.btn`, `.btn-primary`, `.icon-btn`, `.card`, `.stat-card`, `.history-item`, `.progress-*`, `.page-subtitle`, `.kpi-card`, `.screen-view`, `input[type="range"]` et les règles `body.no-scroll` sont limités à `#page-parcours` par `:where()` (spécificité inchangée). L'animation `fadeUp` de `.screen, .top-bar, .page-header` est limitée à Parcours et le doublon de `stats.css` est supprimé : Parcours garde l'animation complète, les autres pages n'animent pas leurs en-têtes. 7 `:hover` dans `@media (hover: hover)`, repli `88dvh` sur `.modal-sheet`, 4 `backdrop-filter` supprimés, 5 classes sans référence retirées (`btn-row`, `fw-hole-number`, `kpi-value`, `quick-action-disabled`, `stat-icon`) avec leurs règles. À vérifier sur téléphone : animation d'ouverture de Parcours, boutons du Menu (pavé numérique, Enregistrer, Envoyer au support), cartes Stats et lignes d'historique Putting (plus de bordure ni de `scale(0.99)` hérités de Parcours), en-tête du Menu en mode installé.
- **`commun.css` écrasé par une copie de `base.css` (dernier commit `075fe64`).** Les deux fichiers faisaient 7 136 octets, identiques : `.app-keypad`, `.app-keypad-value`, les en-têtes de page partagés et `.field-list` avaient disparu (pavé numérique et champs du Menu et de Stats sans style). Restauré depuis le commit `e921d90`, avec les champs `.field-list` à 16 px (correction du point 53 qui devait être dans ce commit). À surveiller : un fichier déposé par erreur à la place d'un autre ne se voit pas à l'écran avant la page concernée.
- **Stats : `stats.css` (points 45, 48, 59, 60 en partie, 64, 51 en partie).** Marges de page par variables, jeton de survol réel, jetons morts retirés, 4 survols dans `@media (hover: hover)`, zones d'appui de 44 px sur les contrôles isolés de la saisie détaillée, 34 classes mortes supprimées (environ 250 lignes).
- **Putting : `putting.css` (points 48, 53, 54, 59, 60 en partie, 61, 51 en partie).** Marges par variables, champs à 16 px, textes à 11 px minimum, survol tactile, zones d'appui de 44 px, repli `dvh` sur `.exercise-modal`, 47 classes mortes supprimées (dont les écrans de saisie rapide par trou qui n'existent plus dans `putting.js`).
- **Gym : `gym.css` (points 47, 49, 53, 54, 58, 59, 60 en partie, 61, 65, 51 en partie).** Règles globales limitées à `#page-gym`, règles de cartes limitées à `.gym-app` (Stats ne reçoit plus le survol ni l'animation de `.card--interactive`), safe-area du bas des sheets, champs à 16 px, textes à 11 px minimum, dégradé radial et flou d'arrière-plan retirés, zones d'appui de 44 px, repli `dvh`, 16 classes mortes supprimées.
- **`index.html`, `HomePage.js`, `HomePage.css`, `menu.js`, `vendor/` (points 6, 14, 15, 39, 53, 56).** Chart.js hébergé dans `vendor/chart.umd.min.js` (le paragraphe cdnjs de la politique de confidentialité de `menu.js` est retiré) ; panneau de l'accueil réduit à ses deux colonnes vivantes (grille à 2 colonnes, valeurs de départ neutres 0/5, 0 séance, "--") et `renderGolfStats` / `setStat` / `setProgressRing` supprimés de `HomePage.js` ; écran `home` de Parcours actif ; écrans `distances` et `add-shot` retirés ; balises iOS et `theme-color` ; champ de recherche de l'historique à 16 px.
