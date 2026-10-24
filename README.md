# All-in-1

Application golf mobile-first : parcours, putting, wedging, stats, gym, profil. Tout est en HTML/CSS/JS vanilla, sans framework ni étape de build. Hébergée sur Cloudflare (`all-in-1.ducoin-co.workers.dev`), qui remplace Vercel : le plan gratuit de Vercel excluait l'usage commercial. À revérifier dans les conditions de Cloudflare avant la mise en ligne publique (voir "Mise en ligne et conformité").

La connexion passe par Supabase Auth (e-mail et mot de passe ; pas de connexion Apple ni Google). Les données de jeu, de profil et de réglages appartiennent au compte : `core/data.js` les synchronise avec les tables Supabase, le `localStorage` n'en est qu'une copie de travail (voir "Brancher Supabase" et la section `core/data.js`). Un mode hors ligne permet d'ouvrir et d'utiliser l'appli sans réseau : un service worker (`sw.js`) garde une copie de l'appli, et `core/data.js` met les saisies en file d'attente puis les envoie au retour de la connexion (voir "Mode hors ligne" et les sections `sw.js`, `core/offline.js`).

## Guide fonctionnel

Cette partie décrit l'application du point de vue de l'utilisateur, sans vocabulaire technique. La documentation technique commence à la section "Architecture".

All-in-1 est un carnet d'entraînement et de jeu pour golfeur, utilisable sur téléphone. On s'y connecte, on arrive sur un accueil qui propose six parties de travail, et chacune se concentre sur un aspect du jeu. Les données sont enregistrées sur l'appareil puis envoyées au compte ; sans réseau, l'appli reste utilisable (voir "Mode hors ligne").

### Connexion et création de compte
Écran de départ tant qu'on n'est pas connecté. On saisit son adresse e-mail et son mot de passe (8 caractères minimum à la création du compte). On peut afficher ou masquer le mot de passe. À la création du compte, un e-mail de confirmation est envoyé : on ouvre son lien, puis on se connecte. "Mot de passe oublié ?" envoie un lien par e-mail ; il ouvre l'écran "Nouveau mot de passe". Une fois connecté, on retombe directement sur l'accueil aux ouvertures suivantes. La déconnexion se fait depuis le Menu. Sous les formulaires, les liens "conditions d'utilisation" et "politique de confidentialité" ouvrent les textes correspondants sans qu'il faille être connecté.

### Mode hors ligne
Sur un parcours, le réseau est souvent mauvais ou absent. Une fois l'appli ouverte une première fois avec du réseau, elle s'ouvre et s'utilise ensuite sans connexion : Putting, Wedging, Parcours, Gym et Stats fonctionnent comme d'habitude, et les saisies sont gardées sur le téléphone. Au retour du réseau, elles sont envoyées automatiquement au compte, même si l'appli a été fermée entre-temps.

Si la connexion tombe pendant qu'on utilise l'appli, rien ne s'interrompt et il n'y a rien à relancer : un message en bas de l'écran prévient (« Hors ligne… ») quelques secondes, sur n'importe quelle page, puis disparaît. Seule la page d'accueil garde en plus une petite pastille « Hors ligne » en haut de l'écran tant que le réseau manque (elle est masquée sur toutes les autres pages). Rien ne capte les appuis. Au retour du réseau, un message annonce la reconnexion puis « Données synchronisées ». Si une autre installation (un autre téléphone) a ajouté des données entre-temps, un message propose « Actualiser » (il reste affiché sur l'accueil, 10 secondes ailleurs puis revient au retour à l'accueil) : c'est toujours au choix de la personne, la page n'est jamais rechargée d'elle-même en cours d'utilisation.

Ce qui demande du réseau : se connecter, créer un compte, mot de passe oublié, la recherche de parcours dans Stats (la saisie manuelle reste possible) et la suppression des données du compte. Se déconnecter alors que des saisies n'ont pas encore été envoyées demande une confirmation, car la déconnexion vide la copie de l'appareil.

### Accueil
Message de bienvenue avec le prénom du joueur et fond d'écran qui change selon l'heure (matin, midi, soir, nuit). Six boutons mènent aux parties : Putting, Stats, Gym, Parcours, Vitesse, Wedging. Un petit panneau résume l'activité : objectif de séances de la semaine (réglé dans le Menu, de 1 à 14 séances, 5 par défaut) et dernière séance (date et type d'entraînement sur la même ligne, un seul type : celui de l'activité la plus récente). Un bouton de profil ouvre le Menu.

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
- **Mes données** : exporter une copie de toutes ses données (fichier JSON, via la feuille de partage du téléphone ou en téléchargement), ou programmer la suppression de son compte et de toutes ses données, après confirmation. La personne est déconnectée tout de suite et la copie de l'appareil est effacée ; le serveur garde le compte 30 jours. En se reconnectant avant la date indiquée, une fenêtre propose d'annuler la suppression (« Annuler la suppression » ou « Se déconnecter »). Passé ce délai, le compte et toutes ses données sont effacés définitivement.
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
- **À reprendre** : une session interrompue peut être reprise là où elle s'était arrêtée. L'onglet Exercices et l'onglet Parcours ont chacun leur carte : un exercice créé interrompu apparaît dans Exercices, un exercice rapide interrompu dans Parcours, et les deux peuvent exister en même temps.
- **Performance** : analyses par distance et par pente, comparaisons entre périodes ou entre parcours, avec des filtres. Indicateurs principaux : Strokes Gained putting et pourcentage de 1 putt.
- **Parcours** : saisie des putts d'une partie réelle, avec historique et détail de chaque partie.
- **Activité récente** : dernières sessions.

### Wedging (jeu court, 30 à 110 m compris)
- **Parcours** : après chaque coup d'approche, on note la distance qu'il fallait faire, puis la distance restante et la zone d'arrivée par rapport au drapeau (huit directions autour du trou, ou "coup rentré"). L'historique garde tous les coups, regroupés par jour (Aujourd'hui, Hier, puis la date) avec le nombre de coups du jour.
- **Analyses** : dispersion (où tombent les balles pour chaque distance), distance (distance moyenne restante au drapeau pour chaque palier de distance à faire) et Strokes Gained. On y accède par le bouton 3 points du header ("Voir mes analyses"), qui ouvre la vue choisie par défaut ; les paliers peuvent être regroupés par 5 ou 10 m.
- **Exercices** : exercices d'approche à créer, à jouer en séance, avec récapitulatif et revue. Dans le récapitulatif et dans le détail d'une session de l'historique, les tirs sont alignés en colonnes (pastille verte ou rouge, numéro, distance, résultat) et les mots « Réussi » et « Raté » ne s'affichent plus : la pastille suffit. Une session interrompue se reprend depuis la carte « À reprendre » en haut de la liste (une carte par session) ou depuis le badge « En cours » de l'exercice.

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

### Menu 3 points des headers (Putting, Wedging, Parcours, Gym)
Le bouton à 3 points en haut à droite ouvre une feuille de réglages d'affichage propre au module (la feuille monte du bas de l'écran ; Échap, un appui sur le fond ou "Fermer" la referment). Les réglages sont enregistrés sur l'appareil et appliqués tout de suite.
- **Putting** : afficher ou masquer "Activité récente" (écran principal ; la carte "À reprendre" est toujours affichée), et chacune des trois cartes de Performance (SG par round, taux de réussite et mètres, 1 putt et 3 putts) ; période par défaut des filtres (5, 10, 15, 20 sessions ou toutes).
- **Wedging** : accès aux analyses, vue d'analyse par défaut (Dispersion, Distance ou SG), pas des paliers des analyses (5 ou 10 m).
- **Parcours** : ordre et visibilité du Green et du Fairway, puis de Vent, Dénivelé, Distance et Historique ; unité m ou yd (schémas et calculs ensemble) ; texte plus grand ; contraste renforcé.
- **Gym** : unité de poids kg ou lb (saisie et affichage), temps de repos par défaut, choix du programme en cours. Les boutons à engrenage ("Réglages") des écrans de création et des objectifs ouvrent le même menu.

### Vitesse
Pas encore disponible : l'écran annonce "Fonctionnalités à venir".

## Structure du dépôt

```
index.html                 point d'entrée unique (HTML des pages + balises <link>/<script>)
manifest.webmanifest       manifeste PWA
sw.js                      service worker : copie de l'appli pour l'utiliser sans réseau (doit rester à la racine)
README.md
core/                      socle commun à tous les modules
  base.css                 reset, tokens :root, règles globales
  commun.css               composants partagés (pavé numérique, en-têtes, popups, boutons ronds, bottom sheet)
  theme-light.css          thème clair (activé par <html data-theme="light">)
  app-shell.js             showPage()
  supabase-client.js       client Supabase unique (window.appSupabase)
  commun.js                appKeypad(), popups, appPrefGet/Set(), appSheet(), applyAppTheme()
  data.js                  synchronisation des données du compte avec Supabase (window.appData), file d'attente hors ligne
  offline.js               enregistre sw.js, messages de connexion (window.appNet)
  sg-data.js               tables Strokes Gained
  strokes-gained.js        calculs Strokes Gained
vendor/
  chart.umd.min.js         Chart.js 4.5.0
  supabase.umd.min.js      supabase-js 2.117.2
modules/                   une page = un dossier (CSS + JS)
  home/  auth/  parcours/  putting/  wedging/  gym/  stats/  vitesse/  menu/
images/                    fonds, illustrations, icône
supabase/
  schema.sql               script SQL à coller dans Supabase (tables, RLS, déclencheurs)
  suppression-compte.sql   script SQL à coller dans Supabase (suppression des comptes après 30 jours, nettoyage des lignes "supprimées")
docs/
  Suivi-des-bugs.docx      suivi des bugs et des corrections
```

Les chemins des images (`images/...`) sont relatifs à `index.html`, sauf dans `modules/gym/gym.css` où les `url()` sont relatifs au fichier CSS (`../../images/...`).

## Architecture

Une seule page, `index.html`. Chaque partie de l'app est un bloc `<div id="page-xxx" class="app-page">`, et un seul bloc porte la classe `active` à la fois.

La navigation passe par `showPage(id)` (`core/app-shell.js`), qui bascule la classe `active`. Le shell n'utilise jamais `location.hash`, car ce hash appartient au routeur interne de Wedging.

Tous les scripts sont des scripts classiques (pas de modules ES). Ils partagent donc le scope global : une fonction ou une constante déclarée au niveau racine est visible de tous les fichiers chargés après elle, et peut écraser une déclaration homonyme.

### Pages

| Page (`id`) | Conteneur | JS | CSS | Origine du HTML |
|---|---|---|---|---|
| `page-login`, `page-signup`, `page-forgot-password`, `page-reset-password` | dans `index.html` | `modules/auth/auth.js` | `modules/auth/auth.css` | `index.html` |
| `page-home` | dans `index.html` | `modules/home/HomePage.js` | `modules/home/HomePage.css` | `index.html` |
| `page-parcours` | dans `index.html` | `modules/parcours/parcours-ui.js` | `modules/parcours/parcours-ui.css` | `index.html` |
| `page-stats` | dans `index.html` | `modules/stats/stats.js` | `modules/stats/stats.css` | `index.html` |
| `page-wedging` | `#wedging-app` | `modules/wedging/wedging.js` | `modules/wedging/wedging.css` | généré par JS |
| `page-gym` | `#app-root-gym` | `modules/gym/gym.js` | `modules/gym/gym.css` | injecté par JS au chargement |
| `page-putting` | `#app-root` | `modules/putting/putting.js` | `modules/putting/putting.css` | généré par `renderPuttingTab()` |
| `page-vitesse` | `#app-root-vitesse` | `modules/vitesse/vitesse.js` | `modules/vitesse/vitesse.css` | généré par `renderVitesseTab()` |
| `page-menu` | `#root` | `modules/menu/menu.js` | `modules/menu/menu.css` | généré par `renderMenuTab()` |

### Ordre de chargement des scripts

Cet ordre compte, car les fichiers se parlent par le scope global.

```
Chart.js 4.5.0 (vendor/chart.umd.min.js)
supabase-js 2.117.2 (vendor/supabase.umd.min.js)   -> global `supabase`
core/app-shell.js            -> showPage()
core/supabase-client.js      -> window.appSupabase, window.APP_SESSION_KEY
core/data.js                 -> window.appData (start, flush, onWrite, clearLocal, requestDeletion, cancelDeletion, deletionRequestedAt, status, isReady, hasPending)
core/offline.js              -> enregistre sw.js, window.appNet, messages hors ligne (écoute 'appdata:status')
core/commun.js               -> appKeypad(), appPrefGet/Set(), appSheet(), applyAppTheme()
core/sg-data.js              -> SG_BASELINES
core/strokes-gained.js       -> sgExpected(), sgShot()   (dépend de sg-data.js)
modules/home/HomePage.js
modules/parcours/parcours-ui.js
modules/wedging/wedging.js
modules/gym/gym.js
modules/putting/putting.js
modules/vitesse/vitesse.js
modules/stats/stats.js
modules/menu/menu.js
modules/auth/auth.js         (dernier : choisit la page de départ)
```

Les CSS sont chargés dans l'ordre `base`, `commun`, `HomePage`, `parcours-ui`, `wedging`, `gym`, `putting`, `vitesse`, `stats`, `menu`, `auth`, puis `theme-light` en dernier (il doit passer après les autres pour les surcharger). Chaque CSS et JS local porte un paramètre de version dans `index.html` (`?v=NN`), à incrémenter pour chaque fichier modifié à chaque déploiement. Les numéros ne sont plus identiques d'un fichier à l'autre (de `?v=54` à `?v=57` au 19/10/2026) : ne pas faire de remplacement global.

### Dépendances externes

- Chart.js 4.5.0, hébergé dans `vendor/` (`vendor/chart.umd.min.js`, graphiques de `stats.js`) : plus aucun CDN tiers.
- supabase-js 2.117.2, hébergé dans `vendor/` (`vendor/supabase.umd.min.js`) : client Supabase. Il appelle `https://kszmszroxzunhmlfuite.supabase.co` (authentification et données). La clé publique (`sb_publishable_...`) est dans `core/supabase-client.js` : elle est faite pour être visible, la protection vient des règles RLS.
- API publique `https://api.flyawaygolf.com/v2` : recherche de golfs par géolocalisation et profil de golf, appelée uniquement depuis `stats.js` (popup "Nouveau parcours"). Elle reçoit la position de l'appareil : elle est citée dans la politique de confidentialité, comme Supabase et l'hébergeur.

### Règles de cloisonnement entre modules

Tous les modules vivent dans le même document et le même scope global. Pour qu'un module n'agisse jamais dans une page qui n'est pas la sienne :

- **Sélecteurs limités à la page.** Un `document.querySelector(...)` ou `querySelectorAll(...)` sur une classe ou un attribut générique (`data-header`, `.bottom-nav`, `.screen`, `.sheet`...) est préfixé par l'id de la page du module (`#page-putting ...`). `putting.js` le fait via `puttingQuery` / `puttingQueryAll`. Les seules requêtes qui visent volontairement une autre page sont celles de `renderGolfHome()` (`putting.js`), qui écrit dans `#page-home`.
- **Écouteurs globaux gardés.** Un écouteur posé sur `window` ou `document` (`hashchange`, `popstate`, `error`, `resize`, `click`, `keydown`) commence par vérifier que la page du module est affichée (`#page-xxx.active`) ou que la cible est dans la page. Cas particulier : `location.hash` est partagé entre Wedging (routeur) et Gym (`pushState`), aucun des deux ne doit réagir quand l'autre est affiché.
- **Attributs et ids uniques.** Pas de `data-xxx` ni d'`id` identique dans deux modules (`data-header` de Vitesse s'appelle `vitesse`, celui de Putting `main`). Les ids de Gym sont préfixés `gym-` (`gym-sheet-overlay`, `gym-view-programmes`...), ceux de Menu `menu-` (`menu-root`, `menu-back-btn`...), le conteneur de Wedging est `#wedging-app`, les boutons de menu 3 points `#puttingMenuBtn` et `#wedgingMenuBtn`. Les noms globaux de `wedging.js` sont préfixés `Wedge` (`WedgeStorage`, `WedgeAnalytics`, `WedgeUI`, `WedgeViews`, `WedgeRouter`) et le conteneur de `putting.js` s'appelle `puttingRoot`. Dans Gym, les requêtes sur une classe générique (`.gym-view`, `.sheet`, `.sheet-overlay`) sont préfixées par `#page-gym`.
- **État sur `body`.** Une classe ou un style posé sur `body` (`no-scroll`, `gym-home-locked`, `gym-view-fit`, `is-stats-screen`, `overflow`) est retiré par le module qui l'a posé quand il est quitté. Accueil (`html.home-locked`) et connexion (`html.login-locked`) posent leur propre classe sur `html` de la même façon. Parcours (`no-scroll`) et Gym (`gym-home-locked`, `gym-view-fit`, via `gymSyncBodyLocks`) suivent l'activation de leur page avec un `MutationObserver` sur sa classe `active` ; `showPage()` et Wedging ne touchent plus aux verrous des autres modules. Stats passe par un verrou partagé (`lockScroll` / `unlockScroll`) qui restitue la valeur d'origine.

## Mise en ligne et conformité

### Statut de l'éditeur : non professionnel
L'appli est éditée à titre non professionnel (projet personnel, distinct de l'activité d'auto-entrepreneur de Pierre-Antton Ducoin). Les textes légaux en tiennent compte : pas d'adresse postale, de SIRET ni de médiateur affichés, et une identité complète communiquée à l'hébergeur. Cette position n'est tenable que tant que l'appli reste **gratuite, sans publicité ni abonnement** ; à confirmer auprès de la CFE ou d'un comptable.

Passage en professionnel, dès la première pub ou le premier abonnement :
- `menu.js` : réintroduire dans `MENU_LEGAL` l'adresse (ou une adresse de domiciliation), le SIRET, le directeur de la publication et le médiateur de la consommation ; changer `editorStatus` ; mettre à jour `MENU_DOCS` (mentions légales : éditeur complet ; CGU : section 4 "Gratuité" remplacée par les conditions de vente, clause de médiation ; confidentialité : paiements, publicité) ; changer `updatedAt` ;
- choisir un médiateur dans la liste officielle de la CECMC et y adhérer ;
- Google Play Console : passer du statut non-trader à trader (nom, adresse, e-mail et téléphone vérifiés affichés sur la fiche) ;
- App Store (plus tard) : achats via l'achat intégré d'Apple obligatoire pour les abonnements.

### Champs à compléter (`MENU_LEGAL` dans `menu.js`)
Tout champ au format `[À COMPLÉTER : ...]` s'affiche tel quel dans l'appli et est listé dans la console au chargement. Déjà renseignés : éditeur (Pierre-Antton Ducoin, non professionnel), e-mail de contact (`contactgolfevolution@gmail.com`), Supabase comme prestataire (`backendRegion` : Irlande, Union européenne, soit la région `eu-west-1` du projet), Cloudflare comme hébergeur (`hostName`, `hostAddress`, `hostUrl`).

| Clé | À renseigner |
|---|---|
| `appVersion`, `updatedAt` | Version affichée dans À propos, et date des textes légaux à changer à chaque modification de `MENU_DOCS`. |

### Hébergement (Cloudflare, ancien Vercel)
L'appli est déployée sur Cloudflare (Workers, adresse `all-in-1.ducoin-co.workers.dev`), depuis le dépôt GitHub. Les textes légaux (`MENU_LEGAL`) citent Cloudflare, Inc. comme hébergeur. Les comparatifs consultés indiquent que l'offre gratuite de Cloudflare n'interdit pas l'usage commercial, contrairement à Vercel Hobby ; à relire dans les conditions de Cloudflare avant la mise en ligne publique. Reste à faire :
- si un nom de domaine propre est ajouté : l'ajouter aussi dans Supabase (Authentication > URL Configuration : Site URL et Redirect URLs), sinon les liens reçus par e-mail renvoient vers l'ancienne adresse ;
- remplacer l'URL `all-in-1-delta.vercel.app` partout où elle est encore utilisée (fiche Google Play, configuration de l'appli Android) ;
- si l'appli est publiée sur Google Play en TWA, mettre à jour l'URL de départ et le fichier `/.well-known/assetlinks.json` sur le nouveau domaine ;
- la politique de confidentialité (rubrique "Transferts hors Union européenne") reste exacte : Cloudflare est établi aux États-Unis.

### Brancher Supabase
- **Fait (20/10/2026) : connexion.** `auth.js` utilise Supabase Auth : inscription avec e-mail de confirmation, connexion, déconnexion, mot de passe oublié (pages `forgot-password` et `reset-password`), liens reçus par e-mail. Pas de connexion Apple ni Google (décision du 20/10/2026).
- **Fait : tables.** Les 11 tables et leurs règles RLS existent dans Supabase (vérifié le 23/10/2026 : colonnes et policies `*_own`). Le fichier `supabase/schema.sql` cité plus bas n'est pas versionné dans le dépôt.
- **Fait (23/10/2026) : données.** `core/data.js` lit et écrit les données dans les tables, rattachées au compte (voir la section `core/data.js`). Les données ne sont plus liées à l'appareil.
- `menu.js` : `deleteMenuData()` programme la suppression du compte (`appData.requestDeletion()`, 30 jours pour changer d'avis), affiche la date de suppression définitive, puis déconnecte l'appareil (`authLogout({ force: true })`, copie locale vidée). Voir "Suppression du compte" ci-dessous. `exportMenuData()` exporte la copie locale, qui est à jour du serveur après chaque ouverture.
- Données : les textes supposent que le profil, les réglages et les données de jeu sont enregistrés côté serveur et retrouvés sur un autre appareil (FAQ, CGU, confidentialité). Adapter les textes si la synchronisation est partielle.
- Politique de confidentialité : si des services Supabase supplémentaires (stockage de fichiers, analytics) sont utilisés, les ajouter dans `MENU_DOCS.confidentialite`.
- **RLS (Row Level Security) obligatoire** sur toutes les tables, avec une règle du type "un utilisateur ne lit et n'écrit que les lignes dont `user_id = auth.uid()`". La clé publique (`anon`) est visible par tous dans le code : c'est la RLS qui protège les données. Sans elle, n'importe qui peut lire les données de tous les utilisateurs. Ne jamais mettre la clé `service_role` dans le code client.
- **Schéma de données** : tableau ci-dessous. Les tables sont créées dans Supabase.
- **Un seul module d'accès aux données : fait.** `core/data.js` se branche sur `appSafeSetItem` : les modules gardent leur code de lecture et d'écriture du `localStorage`, rien à y changer. Toute nouvelle clé à synchroniser s'ajoute dans `LISTS` (liste d'éléments) ou `PROFILE` (réglage) de `data.js`, et doit être écrite avec `appSafeSetItem`, jamais avec `localStorage.setItem` direct.
- **Hors-ligne : fait (23/10/2026).** Voir "Mode hors ligne" ci-dessous, la section `core/data.js` (file d'attente, fusion) et les sections `sw.js` et `core/offline.js`. Les saisies faites sans réseau sont gardées dans le `localStorage`, notées dans `golfSyncPending`, envoyées au retour du réseau (même après une fermeture de l'appli) et fusionnées avec le serveur sans perte. Limites connues : voir "Anomalies relevées (mode hors ligne, 23/10/2026)".
- **Migration des données existantes** : sans objet, l'appli est en test et aucune donnée n'est conservée. Au premier démarrage avec la synchronisation, la copie locale d'avant est vidée.
- **Connexion Apple et Google** : retirées. Si elles reviennent un jour, Apple exige un compte Apple Developer payant.
- Calculs (Strokes Gained, indicateurs de `stats.js`) : peuvent rester côté client dans un premier temps. Ne pas les déplacer côté serveur sans besoin.

#### Schéma de données (`supabase/schema.sql`)

Script à coller dans Supabase (SQL Editor > New query > Run). Il peut être relancé sans risque. Il crée 11 tables, toutes protégées par RLS (`user_id = auth.uid()`, aucun accès pour `anon`), et un déclencheur qui crée la ligne `profiles` à l'inscription. Validé sur un Postgres local avec un schéma `auth` simulé (isolation entre deux comptes, refus pour `anon`, relance sans erreur) ; pas encore lancé sur un vrai projet Supabase.

| Table | Remplace la clé `localStorage` |
|---|---|
| `profiles` (une ligne par personne) | `golfAppState`, `golfModulePrefs`, `parcours-settings`, `parcours-fairway-unit`, `golfStatsKpis`, `gym-active-program-id` |
| `stats_rounds` | `golfStatsRounds` |
| `parcours_captures` | `parcours-captures` |
| `putting_combines`, `putting_sessions`, `putting_rounds` | `putting_combines`, `putting_sessions`, `putting_rounds` |
| `wedging_shots`, `wedging_exercises` | `wedgingShots`, `wedgingExercises` |
| `gym_programs`, `gym_history`, `gym_goals` | `gym-programs-saved`, `gym-history`, `gym-goals` |

Les dix tables de liste ont les mêmes colonnes : `user_id`, `id` (texte), `occurred_at` (date de l'élément, pour trier), `data` (jsonb : l'objet complet tel qu'il est aujourd'hui dans le `localStorage`), `created_at`, `updated_at` (posé par le serveur à chaque écriture) et `deleted_at` (ancienne suppression douce, plus utilisée : depuis le 24/10/2026 les lignes sont effacées pour de bon ; `supabase/suppression-compte.sql` efface celles qui seraient encore marquées, et la lecture ignore toute ligne où cette colonne est renseignée). Clé primaire : `(user_id, id)`. Une ligne de `data` est limitée à 1 Mo.

Restent sur l'appareil : les brouillons et parties à reprendre (`gym-session-draft`, `putting_resume`, `putting_resume_quick`, `golfStatsRoundDraft`, `parcours-fairway-round`, `parcours-green-round`, `wedgingInProgressSessions`).

Points de vigilance pour le module d'accès aux données (non résolus, à traiter en le codant) :
- **Relire l'objet depuis `data`, jamais depuis la colonne `id`.** Plusieurs `id` sont des nombres (`Date.now()` dans Putting et Wedging) alors que la colonne est du texte ; le code compare ces ids avec `===`. L'objet complet reste dans `data` avec son type d'origine.
- **Suppression = effacement réel de la ligne (`delete`), depuis le 24/10/2026.** La suppression douce (`deleted_at`) a été abandonnée : aucune donnée de l'appli n'est sensible au point de ne pas pouvoir être ressaisie, et elle gardait indéfiniment des données que la personne croyait effacées. Les autres appareils apprennent la suppression à leur prochaine lecture : un élément connu de l'appareil (présent dans `golfSyncBase`), inchangé ici et absent du serveur est supprimé aussi ici (voir "Fusion" dans `core/data.js`). Contrepartie : une suppression faite par erreur n'est plus récupérable.
- **Compte différent sur le même appareil (traité par `core/data.js`).** La copie locale porte le marqueur `golfAccountUserId`. Si le compte connecté n'est pas celui du marqueur, elle est vidée avant que les modules la lisent, puis remplie depuis le serveur et la page est rechargée une fois. À la déconnexion, la copie locale est vidée. Rien n'est conservé sur l'appareil, rien n'est partagé entre comptes. Les anciennes clés `golfStash_*` ne sont plus utilisées (elles sont supprimées avec le reste au premier démarrage).
- **Anciens utilisateurs.** L'ancienne session locale (`golfSession`) est supprimée au chargement : ils doivent créer un vrai compte. Leurs données locales restent sur l'appareil ; la migration vers le compte est à écrire.
- **Lien reçu par e-mail sur iPhone avec l'appli installée.** Le lien s'ouvre dans Safari, qui a son propre stockage : la confirmation ou le nouveau mot de passe sont pris en compte (le compte existe), mais la personne doit ensuite se connecter dans l'appli installée. Le flux "implicit" de supabase-js (`core/supabase-client.js`) a été choisi pour cela : le flux "pkce" échouerait dans ce cas.
- **Hash de l'URL.** `index.html` met de côté le hash des liens e-mail (`window.__authHash`) puis le vide avant le chargement de Gym et Wedging, qui lisent `location.hash`. Tout nouveau code qui lit `location.hash` au chargement doit en tenir compte.
- **Réglages Supabase à vérifier** (Authentication > URL Configuration) : Site URL = `https://all-in-1.ducoin-co.workers.dev` ; Redirect URLs = cette adresse avec et sans `/**` (le lien de confirmation renvoie vers `https://all-in-1.ducoin-co.workers.dev/`). Une adresse absente de la liste fait afficher `{"error":"requested path is invalid"}` au clic sur le lien de l'e-mail, alors que le compte est bien confirmé ; confirmation d'e-mail activée ; longueur minimale du mot de passe réglée à 8 comme dans l'appli (Supabase accepte 6 par défaut, l'appli en exige 8).
- **Envoi des e-mails.** Le service d'envoi fourni par Supabase est limité et prévu pour les essais : brancher un service SMTP propre (Authentication > SMTP Settings) avant la mise en ligne publique.
- **Tests.** Les flux de connexion ont été testés avec la vraie bibliothèque et un réseau simulé (connexion, erreurs, inscription, e-mail déjà utilisé, mot de passe oublié, lien de récupération, lien expiré, réseau coupé). Pas encore testés avec de vrais e-mails ni sur téléphone.
- **Parties Stats, copies dans Putting et Wedging** : les éléments `source: 'stats'` (`statsKey`) sont des copies. Ils seront synchronisés comme les autres ; la suppression d'une partie doit continuer à retirer ses copies (`removePuttingRoundFromStats`, Wedging) puis marquer chaque ligne `deleted_at`.
- **Suppression du compte (24/10/2026) : faite dans le code, à installer et à tester dans Supabase.** Aucune Edge Function n'est nécessaire. Sur « Supprimer mon compte et mes données » : (1) `appData.requestDeletion()` envoie ce qui reste à envoyer puis inscrit la date dans `profiles.deletion_requested_at` (réseau obligatoire, sinon rien n'est modifié) ; (2) l'appareil est déconnecté et sa copie locale effacée ; (3) le serveur garde le compte et les données 30 jours ; (4) chaque nuit à 03h17 UTC, la tâche `pg_cron` `purge-deleted-accounts` exécute `public.purge_deleted_accounts()`, qui efface, pour les demandes de plus de 30 jours, les lignes des 11 tables puis le compte (`auth.users`). La fonction est réservée à la base (`revoke` sur `anon` et `authenticated`) : elle ne peut pas être appelée depuis l'appli. Pendant les 30 jours, se reconnecter (sur n'importe quel appareil, y compris un appareil resté connecté au prochain lancement) affiche la fenêtre « La suppression de votre compte est programmée pour le… » : « Annuler la suppression » remet la colonne à `null` (`appData.cancelDeletion()`, tout est conservé), « Se déconnecter » ferme la session. La fenêtre reste affichée tant que la personne n'a pas choisi ; si l'annulation échoue (réseau), elle est reproposée. Détails dans `core/data.js` (section « Suppression du compte »), `modules/auth/auth.js` (écoute de `appdata:account`) et `modules/menu/menu.js`. **À faire dans Supabase** : coller `supabase/suppression-compte.sql` dans SQL Editor > New query > Run (il ajoute la colonne, efface les anciennes lignes marquées `deleted_at`, crée la fonction et planifie la tâche ; si `create extension pg_cron` échoue, activer pg_cron dans Database > Extensions puis relancer), puis faire l'essai avec un compte de test décrit en bas du fichier.

### Mode hors ligne

Trois pièces, qui ne se parlent que par des événements et par le `localStorage` :

| Pièce | Rôle |
|---|---|
| `sw.js` | Garde une copie des fichiers de l'appli : la page, les CSS, les JS, `vendor/`, le manifeste et les 28 images. L'appli s'ouvre sans réseau. Ne touche jamais aux appels vers Supabase ni vers l'API FlyAway. |
| `core/data.js` | Les écritures de chaque clé synchronisée sont notées dans `golfSyncPending` (clé -> date de la dernière écriture) même sans réseau ou avant la lecture du serveur. Au retour du réseau, ce qui est en attente est envoyé et fusionné avec le serveur. |
| `core/offline.js` | Enregistre `sw.js` et affiche l'état : message à la perte et au retour de la connexion, pastille « Hors ligne », « Données synchronisées », proposition « Actualiser ». |

**Pourquoi aucun redémarrage n'est demandé quand la connexion tombe.** L'appli est une page unique : au moment où le réseau disparaît, tous les fichiers sont déjà chargés en mémoire, et les saisies passent par le `localStorage`, pas par le réseau. Il n'y a donc rien à relancer ; la personne n'est pas interrompue (les messages ne captent aucun appui). Le seul message qui propose de recharger la page (« Actualiser ») apparaît quand le serveur a des données plus récentes que celles affichées, et il est toujours au choix de la personne : les brouillons et parties en cours (`gym-session-draft`, `putting_resume*`, etc.) n'existent que sur l'appareil, un rechargement en pleine séance n'est donc jamais imposé.

**Condition de départ.** L'appli doit avoir été ouverte au moins une fois avec du réseau, le temps que le service worker copie les fichiers (environ 8 Mo, dont 7 Mo d'images, surtout les fonds). Sur un appareil où ce n'est pas fait, une ouverture sans réseau affiche une erreur du navigateur. Se connecter ou créer un compte demande toujours du réseau ; ensuite, la session (`golfSupabaseAuth`) reste valable hors ligne : `auth.js` choisit la page de départ d'après le `localStorage`, et supabase-js ne déconnecte pas sur une simple erreur réseau.

**Scénarios gérés par `core/data.js`** (testés avec un faux serveur, voir plus bas) :
- appli ouverte sans réseau, saisies, retour du réseau sans fermer l'appli : tout part sur le serveur, aucun rechargement ;
- saisies sans réseau, appli fermée, rouverte plus tard avec réseau : la file d'attente est relue, les saisies sont fusionnées avec le serveur (y compris ce qu'un autre appareil a ajouté) puis envoyées ;
- élément supprimé hors ligne : la ligne est effacée du serveur au retour du réseau ;
- même élément modifié ici et sur le serveur : la dernière modification gagne (date de la dernière écriture locale de la clé contre `updated_at` du serveur) ;
- « réseau présent mais inutilisable » (`navigator.onLine` vrai, requêtes en échec) : les saisies restent en attente, nouvel essai à 5 s puis 10, 20, 40 et 60 s ; la même relance vaut pour la lecture des données du serveur qui a échoué (par exemple quand supabase-js refuse un moment de renouveler la session juste après un retour du réseau) ;
- changement de compte : la file d'attente et la base de synchronisation sont vidées avec le reste.

**Tests.** `core/data.js` et `sw.js` ont été exécutés dans un faux navigateur (faux `localStorage`, faux `caches`, faux client Supabase qui simule le réseau coupé) : 16 scénarios pour `data.js` (envoi en ligne, écriture avant la fin de la lecture, démarrage hors ligne puis retour du réseau, fermeture entre-temps, suppression hors ligne, données plus récentes sur le serveur pendant l'utilisation, conflits dans les deux sens, profil et compte neuf, échec d'envoi puis reprise, lecture refusée puis relancée seule, coupures répétées, autre compte) et 16 vérifications pour `sw.js` (installation, page et fichiers servis sans réseau, Supabase et requêtes POST jamais interceptés, remplacement d'un `?v=`, 404 non gardé, anciens caches supprimés). Ces tests ne sont pas dans le dépôt. Pas encore testé sur un vrai téléphone ni sur le vrai Supabase (voir les anomalies).

### Publication
- Google Play Console : politique de confidentialité = `<url>/?legal=confidentialite` ; suppression de compte = `<url>/?legal=donnees` (compléter le formulaire "Sécurité des données" avec les données listées dans la politique).
- App Store (plus tard) : mêmes URL, plus suppression de compte dans l'appli.
- Fiche Google Play : se déclarer non-trader tant que l'appli est gratuite, sans pub ni abonnement. Google peut demander des justificatifs.

## Fichiers partagés

### `index.html` (1150 lignes)
Contient le HTML de Home, Parcours, Stats, Menu, Login, Signup, Mot de passe oublié et Nouveau mot de passe, les conteneurs vides de Wedging, Gym, Putting et Vitesse, un script inline (bloque le swipe-retour iOS depuis les bords et le zoom au pincement) et la liste des scripts. Deux scripts en `<head>` : le premier met de côté le hash d'un lien reçu par e-mail (`window.__authHash`) puis le vide ; le second ajoute la classe `has-session` sur `<html>` si la session Supabase (`golfSupabaseAuth`) existe ou si un lien e-mail est en cours de traitement, pour éviter le flash de la page de connexion.

### `core/app-shell.js`
`showPage(id)` : active la page demandée et masque les autres, puis remonte en haut de page. Ignore un id inconnu. Ne touche à aucune classe de `body` : chaque module retire lui-même son verrou de défilement en quittant sa page. Expose `window.showPage`.

### `core/commun.js`
`appKeypad(pressFn, backspaceFn, clearFn, extraKey)` : génère le HTML d'un pavé numérique. Les boutons appellent par nom des fonctions globales via `onclick`. Utilisé par `menu.js`, `parcours-ui.js`, `putting.js`, `wedging.js` et `stats.js` (popup distance restante / pénalité de la saisie détaillée, fonctions globales préfixées `statsSd`). Gym a son propre pavé.

`appConfirm(message, { confirmLabel, cancelLabel, danger })`, `appAlert(message)` et `appPrompt(label, valeurInitiale, { multiline })` : popups de l'appli qui remplacent `confirm()`, `alert()` et `prompt()` natifs. Elles renvoient une Promise (`true` / `false`, rien, texte / `null`) : à attendre avec `await` dans une fonction `async`. Le message passe par `textContent` (aucun HTML interprété). Échap et un appui sur le fond annulent. Styles `.app-dialog_*` dans `commun.css` (z-index 9000). Plus aucun dialogue natif dans le code.

`appEscapeHtml(valeur)` : échappe `& < > " '` ; à utiliser pour tout texte saisi par la personne avant de l'injecter dans un gabarit HTML (y compris dans un attribut `value="..."` ou un `<textarea>`). `appSafeSetItem(clé, valeur)` : écrit dans le `localStorage` et renvoie `true` ou `false` ; en cas d'échec (stockage plein ou indisponible), elle affiche une alerte à l'écran (au plus une toutes les 8 secondes) au lieu d'ignorer l'erreur. Les modules l'utilisent à la place des `try { localStorage.setItem(...) } catch {}` : `gym.js`, `putting.js`, `wedging.js` (`WedgeStorage`) et `parcours-ui.js` (Fairway, Green, captures). `menu.js` (`saveMenuState`) y passe désormais. `stats.js` y passe aussi (`persistRounds`, indicateurs, brouillon) et utilise `appEscapeHtml` : son ancien helper `esc` est supprimé.

`appPrefGet(module, clé, défaut)` et `appPrefSet(module, clé, valeur)` : préférences d'affichage par module, dans la clé unique `golfModulePrefs` (`{ putting: {...}, wedging: {...}, parcours: {...}, gym: {...} }`). Elles sont volontairement séparées de `golfAppState`, que `menu.js` réécrit en entier depuis sa copie en mémoire. L'écriture passe par `appSafeSetItem`.

`appSheet({ title, sections: [{ title, items }] })` : bottom sheet partagée par les menus 3 points (renvoie la fonction `close()`). Types d'entrées : `toggle` (`value`, `onChange`), `segment` (`options`, `value`, `onChange`), `action` (`onClick`, `selected`, `danger`, `keepOpen`) et `reorder` (liste `[{ key, label, visible }]` avec oeil et flèches haut / bas, `onChange` reçoit la liste dans le nouvel ordre). Tous les textes passent par `textContent`. Une seule feuille à la fois ; `Échap`, un appui sur le fond ou "Fermer" la referment ; une action la ferme avant d'appeler `onClick` (sauf `keepOpen`). Chaque module fournit ses entrées dans sa fonction `open…Menu()` et applique ses préférences au chargement.

### `core/supabase-client.js`
Crée le client Supabase unique (`window.appSupabase`, ou `null` si `vendor/supabase.umd.min.js` n'a pas chargé) et expose `window.APP_SESSION_KEY` (`'golfSupabaseAuth'`, clé `localStorage` de la session). Contient l'URL du projet et la clé publique. Options : session gardée et renouvelée automatiquement, `detectSessionInUrl: false` (les liens e-mail sont lus par `auth.js`), flux `implicit`. Le futur module d'accès aux données (`data.js`) utilisera ce même client.

### `core/data.js`
Synchronise les données du compte avec Supabase. Expose `window.appData`. Chargé après `commun.js`, avant les modules. Le serveur est la référence ; le `localStorage` est une copie de travail que les modules continuent de lire et d'écrire comme avant. Fonctionne aussi sans réseau (voir "Mode hors ligne").

- **Écriture** : `appSafeSetItem` (commun.js) appelle `appData.onWrite(clé)`. La clé est notée dans `golfSyncPending` (en mémoire et dans le `localStorage`, donc conservée si l'appli est fermée), même sans réseau ou avant la lecture du serveur. Dès que le réseau et les données du serveur sont là, après 200 ms, `data.js` compare chaque élément à ce que le serveur contenait (`golfSyncBase`) et n'envoie que les éléments nouveaux ou modifiés (`upsert` sur `user_id,id`, par paquets de 50). Un élément retiré de la liste est effacé du serveur (`delete` réel de la ligne) ; une ligne encore marquée par l'ancienne suppression douce redevient visible si l'élément est ré-ajouté (`deleted_at: null`). Seuls les éléments connus de l'appareil (la base) peuvent être supprimés : un élément arrivé d'un autre appareil et pas encore affiché ici n'est jamais supprimé par erreur. Une clé n'est retirée de la file que si elle n'a pas été réécrite pendant l'envoi. Envoi aussi à la mise en arrière-plan (`visibilitychange`) et à `pagehide`. Échec : état `error`, nouvel essai avec délai doublé (5 s à 60 s, `scheduleRetry`) ; sans réseau (`navigator.onLine` faux), pas de nouvel essai avant l'événement `online`.
- **Lecture** : `start(userId, opts)` vide la copie locale si elle appartient à un autre compte (`golfAccountUserId`), lit les 10 tables (hors lignes `deleted_at`, avec `updated_at`) et le profil. Une clé sans modification en attente est remplacée par la version du serveur si elle diffère ; la page est alors rechargée une fois (garde-fou `golfSyncReload` en `sessionStorage`) car les modules gardent leurs données en mémoire. Une clé avec modifications en attente est fusionnée (ci-dessous). Au chargement avec une session, `data.js` démarre seul (`lateAfterMs: 4000`) ; après une connexion, une inscription ou un lien e-mail, c'est `auth.js` (`loadAccountData`, sans option). Hors ligne, la lecture échoue : l'appli démarre sur la copie locale, `isReady()` reste faux, et `start` est relancé à l'événement `online` ou au retour au premier plan.
- **Fusion** (clé avec modifications en attente), par élément et sur trois versions : la base (`golfSyncBase` : empreinte de chaque élément tel que le serveur le contenait à la dernière synchronisation), la version locale et la version du serveur. Modifié ici seulement : la version locale part. Modifié sur le serveur seulement : celle du serveur est reprise. Modifié des deux côtés : la dernière modification gagne, `updated_at` du serveur contre la date de la dernière écriture locale de la clé. Pour le profil (une ligne, plusieurs colonnes) le principe est le même par colonne ; si la base est inconnue, la valeur du serveur n'est jamais remplacée, sauf si elle est vide et que la valeur locale ne l'est pas. L'ordre de la liste fusionnée est celui du serveur ; les éléments créés ici s'ajoutent à la fin (ou au début pour `newestFirst`).
- **Mode "late"** (`opts.late`, ou `opts.lateAfterMs` dépassé) : les données du serveur arrivent alors que la personne utilise déjà l'appli (retour du réseau après un démarrage hors ligne, réponse très lente au chargement). La copie locale n'est PAS remplacée : les modules gardent leurs données en mémoire et les réécriraient par-dessus, ce qui supprimerait sur le serveur ce qu'ils ne connaissent pas. Seules les modifications locales partent ; en cas de conflit, la version locale gagne (rien n'est perdu de ce qui a été saisi hors ligne). Si le serveur a des données plus récentes, `status().reload` passe à vrai et `offline.js` propose « Actualiser ». Rien n'est rechargé automatiquement.
- **Correspondance clés -> tables** (`LISTS`) : `golfStatsRounds` -> `stats_rounds`, `parcours-captures` -> `parcours_captures`, `putting_combines`, `putting_sessions`, `putting_rounds`, `wedgingShots` -> `wedging_shots`, `wedgingExercises` -> `wedging_exercises`, `gym-programs-saved` -> `gym_programs`, `gym-history` -> `gym_history`, `gym-goals` -> `gym_goals`. Chaque élément du tableau devient une ligne : `id` = `item.id`, sinon `statsKey`, sinon `date` (les captures Parcours n'ont pas d'id) ; `occurred_at` = sa date (`dateISO`, `date`, `createdAt`...) ou, pour un id créé par `Date.now()`, cet horodatage ; sinon un horodatage croissant conservé. `data` = l'élément entier. Relecture triée par `occurred_at` (décroissant pour `gym-history` et `gym-goals`, rangés du plus récent au plus ancien).
- **Profil** (`PROFILE`, table `profiles`, une ligne par personne) : `golfAppState` -> `app_state` (profil, réglages, radars, sac, `driverSettings`, `personalDistances`, `wedgeDistances`), `golfModulePrefs` -> `module_prefs`, `parcours-settings` -> `parcours_settings`, `parcours-fairway-unit` -> `parcours_fairway_unit`, `golfStatsKpis` -> `stats_kpis`, `gym-active-program-id` -> `gym_active_program_id`.
- **Hors synchronisation** (restent sur l'appareil) : brouillons et parties en cours (`golfStatsRoundDraft`, `gym-session-draft`, `putting_resume`, `putting_resume_quick`, `wedgingInProgressSessions`, `parcours-fairway-round`, `parcours-green-round`).
- **Suppression du compte** : `requestDeletion()` (réseau obligatoire) envoie d'abord ce qui reste à envoyer, puis inscrit `profiles.deletion_requested_at` ; `cancelDeletion()` la remet à `null`. À chaque lecture du profil (et après une annulation), `data.js` publie l'événement `appdata:account` (`detail: { deletionRequestedAt, purgeAt }`, `purgeAt` = demande + `DELETION_DELAY_DAYS` = 30 jours, `null` s'il n'y a pas de demande) ; `auth.js` l'écoute et affiche la fenêtre d'annulation. La suppression réelle est faite par la base (`supabase/suppression-compte.sql`, voir "Suppression du compte" plus haut).
- **API** : `start(uid, opts)`, `flush()` (promesse, se termine quand l'envoi est fini), `onWrite(clé)`, `clearLocal()` (déconnexion, vide la copie locale, la file d'attente et la base), `requestDeletion()` (programme la suppression du compte, renvoie la date de suppression définitive ; utilisé par `deleteMenuData()`), `cancelDeletion()`, `deletionRequestedAt()`, `status()` (`{ pending, syncing, ready, reload, online }`), `isReady()`, `hasPending()` (utilisé par `authLogout`).
- **Événement `appdata:status`** sur `window` (`detail: { state, pending, reload }`) : `pending` (modifications à envoyer), `syncing`, `error` (envoi impossible, nouvel essai automatique), `idle` (tout est envoyé), `reload` (données plus récentes sur le serveur). C'est ce qu'écoute `offline.js`. `data.js` n'affiche plus lui-même de message d'erreur.
- **Vérifications côté Supabase** : clé primaire `(user_id, id)` sur les 10 tables de listes et `user_id` sur `profiles` (nécessaires aux `upsert`) ; colonne `updated_at` mise à jour par un déclencheur sur chaque table (la lecture la demande : si elle manquait, la lecture échouerait).

### `sw.js`
Service worker, à la racine du site (il ne contrôle que les pages situées dans son dossier ; ne pas le déplacer dans `core/`). Enregistré par `core/offline.js` après l'événement `load`.

- **Installation** : récupère la page, lit ses balises `<link href>`, `<script src>` et `<img src>` et copie chaque fichier avec son `?v=` exact (rien à tenir à jour à la main pour les CSS et JS), puis le manifeste, puis les 28 images de la liste `IMAGES` (au mieux : une image manquante ne bloque pas l'installation). Si la page ou un CSS / JS échoue, l'installation est réessayée plus tard.
- **Page** : réseau d'abord, copie gardée si le réseau est absent ou si la réponse dépasse 4 s (`NAV_TIMEOUT_MS`) ; la requête lente continue en arrière-plan et met la copie à jour. La page est gardée sous l'adresse racine, quelle que soit la requête (`/?legal=...` par exemple).
- **CSS et JS de l'appli** : copie servie tout de suite, rafraîchie en arrière-plan. Le `?v=` sert toujours à forcer la récupération d'un fichier modifié ; l'ancienne version du même fichier est retirée du cache.
- **Images et `vendor/`** : copie d'abord, réseau seulement si elle manque.
- **Jamais interceptés** : les autres origines (Supabase, FlyAway), les requêtes autres que GET et `sw.js` lui-même. Les réponses en erreur (404...) et les redirections ne sont pas gardées.
- **Ajouter une image** (par exemple `images/NouveauFond.webp` ajoutée au dépôt) : dans `sw.js`, ajouter son chemin dans la liste `IMAGES` (même forme que les autres, sans `/` au début : `'images/NouveauFond.webp',`, avec une virgule) et changer `VERSION` (`'golf-v1'` devient `'golf-v2'`). Le téléphone détecte alors un `sw.js` différent, le réinstalle, recopie tous les fichiers (images comprises) et supprime l'ancienne copie. Sans cela, l'image s'affiche quand même avec du réseau (et est gardée à ce moment-là), mais pas avant. Renommer ou supprimer une image : même chose. Modifier le contenu d'une image en gardant son nom : changer `VERSION` aussi. Les CSS et JS n'ont pas besoin de ça (le `?v=` suffit). Pas d'attente de l'ancienne version : `skipWaiting` et `clients.claim`.
- **Cloudflare** : les fichiers du dépôt sont servis tels quels, aucun en-tête n'est configuré. À vérifier après la mise en ligne : que `sw.js` ne soit pas servi avec un cache long (le navigateur redemande de toute façon `sw.js` au plus tard toutes les 24 h), et que `/` renvoie bien la page sans redirection (une réponse redirigée ne peut pas être servie hors ligne).

### `core/offline.js`
Enregistre `sw.js` (HTTPS ou `localhost` seulement) et affiche l'état de la connexion. Expose `window.appNet.isOnline()`. Injecte ses propres styles (`.app-net_pill`, `.app-net_toast`) : pas de fichier CSS. Aucun élément n'intercepte les appuis (`pointer-events: none`), sauf le bouton « Actualiser ».
- **Pastille** `.app-net_pill` (haut de l'écran, sous la zone de sécurité, z-index 8000, sous les feuilles et popups) : « Hors ligne », « Hors ligne · à envoyer », « Synchronisation… » ou « Envoi en attente ». Masquée quand tout va bien, et **affichée uniquement sur la page d'accueil** (`#page-home` avec la classe `active`) : un `MutationObserver` suit les changements de page faits par `showPage`, sans modifier `app-shell.js`. Sur les autres pages, seuls les messages temporaires apparaissent.
- **Message** `.app-net_toast` (bas de l'écran, z-index 10000) : à la perte du réseau (7 s), au retour (« Connexion rétablie »), après un envoi qui avait été en attente (« Données synchronisées »), et « Des données plus récentes sont disponibles » avec le bouton « Actualiser » (envoie ce qui reste à envoyer, attend au plus 4 s, puis recharge). Ce dernier reste affiché sur l'accueil ; ailleurs il disparaît après 10 s (une seule fois), et il réapparaît au retour à l'accueil. Un seul message à la fois ; celui d'actualisation n'est pas remplacé par les autres.

### `core/base.css`, `core/commun.css`
`base.css` : reset, tokens `:root` (dont les couleurs `--wg-*` partagées par tous les modules), règles globales. `commun.css` : composants partagés (`.app-keypad`, `.app-keypad-value`, en-têtes de page, etc.). Les styles de la bottom sheet (`.app-sheet_*`) sont à la fin de `commun.css` (z-index 8900, sous les popups `.app-dialog` à 9000 : une confirmation ouverte depuis une entrée passe au-dessus). Ils n'utilisent que des jetons de `:root`, donc le thème clair s'applique sans règle dédiée.

**Marges des pages (modèle : Putting).** Deux variables dans `base.css` : `--app-padding-x` (20 px, 16 px sous 360 px) pour la marge horizontale, et `--app-page-top` (56 px + safe-area + 16 px) pour le début du contenu sous le header fixe. Toute nouvelle page ou tout nouveau bloc de page les utilise, sans valeur en dur. Exceptions volontaires : les écrans de Gym et de Parcours verrouillés à la hauteur de l'écran (accueil Gym, création de programme, accueil Parcours) gardent un décalage vertical plus serré. `.screen` de `parcours-ui.css` est limité à `#page-parcours` (via `:where()`, spécificité inchangée) : il s'appliquait aussi à Stats et doublait sa marge.

### `vendor/chart.umd.min.js`
Chart.js 4.5.0 (licence MIT) : copie du fichier officiel `chart.umd.min.js` publié sur npm, chargée par `index.html` avec `?v=54`. Pour changer de version, remplacer ce fichier par celui de la nouvelle version (`npm pack chart.js@X.Y.Z`, dossier `dist/`).

### `vendor/supabase.umd.min.js`
supabase-js 2.117.2 (licence MIT) : copie du fichier `dist/umd/supabase.js` publié sur npm (`@supabase/supabase-js`), chargée par `index.html` avec `?v=1` ; expose le global `supabase`. Pour changer de version, remplacer ce fichier par celui de la nouvelle version (une version publiée depuis plus de deux semaines) et incrémenter `?v=`.

### `core/theme-light.css`
Thème clair, actif quand `<html data-theme="light">`. Il redéfinit les jetons de couleur de chaque module (`:root`, `#page-stats`, `#page-putting`, `#page-wedging`, Gym, Menu) puis adapte les couleurs codées en dur. Choix dans Menu > Apparence > Thème (switch Clair / Sombre ; réglage `settings.theme`, `"dark"` ou `"light"`, dans `golfAppState`) ; `applyAppTheme()` (`core/commun.js`) pose l'attribut et la couleur de la barre du navigateur, et un petit script du `<head>` d'`index.html` l'applique avant le premier affichage. Restent sombres en mode clair : la photo et la carte de l'accueil, la carte de Parcours, l'écran de connexion. Ajouter un jeton de couleur dans un module oblige à lui donner sa valeur claire ici. Palette revue le 19/10/2026 : fond ivoire verdâtre `#f1f3ea`, cartes blanc cassé `#fbfbf6`, texte vert très sombre `#1e2a20` (plus de noir ni de blanc purs), secondaire `#55615a`, discret `#66726a`, bordures `#d9dfcf` ; Gym, qui était bleu-gris, suit la même famille. Pour que les images ne tranchent plus sur l'interface : les boutons et le panneau de l'accueil sont en verre dépoli (`backdrop-filter`), le voile des cartes Gym est teinté, et les vignettes et photos d'en-tête de Gym sont éclaircies (`.thumb`, `.hero-photo`). Contrastes mesurés : texte et secondaire au-dessus de 5,7:1, discret 4,5:1 ; le vert d'accent `#3f8a0f` en texte sur les cartes reste à 4,2:1 (valeur d'origine, non modifiée).

### `core/sg-data.js` et `core/strokes-gained.js`
Moteur Strokes Gained partagé. `sg-data.js` contient les tables de référence `SG_BASELINES` (lies `tee`, `fairway`, `rough`, `sand`, `recovery`, `green` ; yards sauf `green` en pieds), extraites du dépôt `dgtaillie/python_strokes_gained`. `strokes-gained.js` convertit les mètres, interpole (`sgExpected`) et calcule le SG d'un coup (`sgShot`). Aucune dépendance au DOM. C'est le seul endroit où vivent des tables SG : `putting.js`, `wedging.js` et `stats.js` l'appellent. Sous 10 yd (9,1 m), les tables fairway / rough / sand sont plafonnées à leur valeur à 10 yd (la source n'a pas de points plus courts).

## Modules

### `modules/home/HomePage.js` / `HomePage.css`
Page d'accueil : fond selon l'heure (`getBackgroundByHour`, images `images/FondEcranHomePage*.webp`), prénom du profil (lu dans `golfAppState`), Expose `window.renderHomeGreeting` (rappelée par `menu.js`). Le panneau du bas de l'accueil (objectif de la semaine, dernière séance) est rempli par `renderGolfHome()` dans `putting.js`. L'objectif de la semaine se règle dans le Menu (section Entraînement, bouton « Objectif semaine » ouvrant le pavé numérique) : la valeur est stockée dans `settings.weeklyGoal` et lue par `golfWeeklyGoal()`. Le type de la dernière séance est celui de l'activité la plus récente (Putting, ou Parcours pour une partie venue de Stats). Les symboles des deux encadrés ont la même boîte de 22 px (`.column_icon`), ce qui aligne les titres ; la date et le type de la dernière séance sont dans `.column_line`. Toutes ses requêtes DOM sont limitées à `#page-home`. Un `MutationObserver` sur `#page-home` pose `html.home-locked` tant que l'accueil est affiché (et la retire en le quittant) : `overscroll-behavior-y: none` (pas de rebond ; sans risque ici car l'accueil ne défile jamais), `user-select: none` et `-webkit-touch-callout: none` (pas de menu Copier / Chercher à l'appui long). Sous 600 px de large, `.page-wrapper` est en `position: fixed; inset: 0` et la photo prend tout l'écran ; au-dessus, l'accueil reste une carte centrée de 430 × 852 px (les iPhone les plus larges font 440 px : un seuil à 430 px les laissait en mode carte, avec du vide en haut et en bas). **Sous 600 px, le document dépasse volontairement l'écran de 2 px** (`body { min-height: calc(100lvh + 2px) }`, `overflow: visible`, `height: auto`) : sur iPhone en appli installée, un document qui ne défile pas n'obtient que 762 pt sur 812 (innerHeight, `100dvh`, bas d'un élément `fixed`) et la photo s'arrêtait 50 pt avant le bas ; dès qu'il peut défiler, iOS donne les 812 pt. Cette règle ne doit pas être supprimée sans retester sur iPhone. Le thème clair n'a aucune bande sous la barre d'état : sombre et clair ne diffèrent que par les couleurs. Le diagnostic temporaire du viewport (`core/diag.js` et son script du `<head>`) a été retiré le 19/10/2026.

### `modules/auth/auth.js` / `auth.css`
Connexion, création de compte, mot de passe oublié et nouveau mot de passe, via Supabase Auth (`window.appSupabase`). Quatre formulaires (`data-auth-form` : `login`, `signup`, `forgot`, `reset`), chacun avec sa règle de validation (format de l'e-mail, 8 caractères minimum, confirmation identique) puis un appel dans `HANDLERS`. Les erreurs Supabase sont traduites en français (`friendlyError`) ; `showNotice` affiche un message d'information (classe `.auth_error.is-info`). Inscription : si la confirmation d'e-mail est active, retour à la connexion avec un message ; un e-mail déjà utilisé est détecté (utilisateur renvoyé sans identité). "Mot de passe oublié" répond toujours par le même message, que l'adresse existe ou non. `handleEmailLink()` traite le lien reçu par e-mail (`window.__authHash`) : confirmation -> accueil ; récupération -> page `reset-password` ; lien expiré -> connexion avec un message. La session est gardée par supabase-js sous `golfSupabaseAuth` ; `hasStoredSession()` la lit sans réseau pour choisir tout de suite la page de départ (`home` si session, sinon `login`). Si la session est perdue (événement `SIGNED_OUT`), la copie locale est vidée (`appData.clearLocal()`) et la page rechargée, ce qui ramène à la connexion. Après connexion, inscription avec session, nouveau mot de passe ou lien e-mail, `loadAccountData()` démarre `core/data.js` ; si la copie locale a été remplacée, la page est rechargée. Expose `window.authLogout` (appelée par le bouton de déconnexion de `menu.js`) : envoie les dernières modifications, déconnecte l'appareil, vide la copie locale et recharge la page. Réutilise `getBackgroundByHour()` de `HomePage.js`. Les liens légaux sous les formulaires (dans `index.html`) appellent `openHelpPage('cgu' | 'confidentialite', 'login' | 'signup')` de `menu.js` : le texte s'ouvre dans la page Menu et le bouton retour ramène à l'écran d'origine. Un `MutationObserver` sur `#page-login` pose `html.login-locked` tant que la page de connexion est affichée : sous 600 px, `html` et `body` en `overflow: visible`, `body` en `min-height: calc(100lvh + 2px)` et `overscroll-behavior-y: none`, comme pour l'accueil (sur iPhone en appli installée, un document qui ne défile pas n'obtient que 762 pt sur 812 et le bas de la page restait noir ; voir `HomePage.css`). `window.authLogout(opts)` : envoie d'abord ce qui reste à envoyer (8 s au plus) et demande une confirmation s'il reste des saisies non envoyées ; `authLogout({ force: true })` saute ces deux étapes (suppression du compte, ou choix de se déconnecter plutôt que d'annuler la suppression). Le fichier écoute aussi l'événement `appdata:account` de `data.js` : si la suppression du compte est programmée, une fenêtre (`appConfirm`) propose « Annuler la suppression » (`appData.cancelDeletion()`) ou « Se déconnecter » ; elle est reproposée tant que l'annulation échoue.

### `modules/menu/menu.js` / `menu.css`
Profil et réglages. Gère l'état global persisté dans `golfAppState` : `userProfile`, `settings` (température, altitude, unités), `radars`, `golfBag`, `driverSettings`, `personalDistances`, `wedgeDistances`. Écrans : menu principal, sac de golf (`golfClubCatalog`), distances par club, et le groupe Aide & support (voir ci-dessous). Contient son propre pavé numérique (`openMenuKeypad`...) construit sur `appKeypad`. Expose `window.renderMenuTab`.
Ses variables globales (`golfBag`, `golfClubCatalog`, `personalDistances`, `wedgeDistances`, `settings`) sont lues directement par `parcours-ui.js` et `stats.js`.
Ses fonctions de sauvegarde sont `saveMenuState()` / `loadMenuState()` (préfixées pour ne pas entrer en collision avec celles de `putting.js`).

**Aide & support (`menu.js`, styles `faq_*`, `legal_*`, `contact_*`, `data_*` dans `menu.css`).**
- `MENU_LEGAL` : constantes éditeur (nom, statut, e-mail de contact), prestataire Supabase (nom, région), hébergeur, version et date de mise à jour. Les textes légaux lisent ces valeurs via des jetons `{{clé}}`. Tout champ encore au format `[À COMPLÉTER : ...]` est signalé dans la console au chargement. Pour mettre à jour un texte, changer `updatedAt`.
- `MENU_DOCS` : contenu des CGU, de la politique de confidentialité et des mentions légales (`{ title, heading, sections: [{ h, p, ul }] }`), rendu par `renderLegalDoc(id)`. `MENU_FAQ` : questions de la FAQ (accordéon natif `<details>`).
- `openHelpPage(id, from)` (exposée sur `window`) : routeur des écrans d'aide (`faq`, `contact`, `cgu`, `confidentialite`, `mentions`, `donnees`, `apropos`). `from` (`'login'` ou `'signup'`) fait revenir le bouton retour à cette page, pour les liens des écrans de connexion. `enterScreen()` accepte un 4e paramètre : le libellé du bouton retour.
- Contact : pas de serveur, `menuSendContactMessage()` ouvre un `mailto:` pré-rempli.
- Mes données : `exportMenuData()` (JSON du `localStorage`, sans la session Supabase `golfSupabaseAuth`, ni `golfAccountUserId`, ni l'état interne de la synchronisation `golfSyncBase` et `golfSyncPending` : les jetons ne doivent jamais sortir dans un fichier) et `deleteMenuData()` (asynchrone : programme la suppression du compte sur le serveur via `appData.requestDeletion()`, affiche la date de suppression définitive, puis déconnecte l'appareil avec `authLogout({ force: true })`, qui vide le `localStorage` et recharge la page ; en cas d'échec réseau, rien n'est effacé et la personne est prévenue).
- Liens directs publics : `?legal=cgu`, `?legal=confidentialite`, `?legal=mentions`, `?legal=donnees` ouvrent le texte sans compte. Ce sont les URL à renseigner dans Google Play Console (politique de confidentialité, suppression de compte) puis dans App Store Connect.
- À maintenir : toute nouvelle donnée collectée, tout nouveau service tiers (analytics, backend, paiement, connexion Apple/Google) ou changement de l'offre (abonnements) doit être reflété dans `MENU_DOCS.confidentialite` et `MENU_DOCS.cgu`, avec une nouvelle date `updatedAt`.

### `modules/parcours/parcours-ui.js` / `parcours-ui.css`
Suivi pendant le parcours : Fairway (mises en jeu sur 18 trous), Green (attaques de green), Historique (bilan du parcours en cours), calculateur de vent, calculateur de dénivelé (capteurs d'orientation de l'appareil), calculateur "Mes distances" (lit `golfBag` et les distances de `menu.js`). Les fonctions sont globales car appelées depuis des `onclick` générés. Unités m/yd. Menu 3 points (`openParcoursMenu`, branché au chargement sur le bouton du header d'`index.html`) : `parcoursApplyPrefs()` applique l'ordre et la visibilité (propriété CSS `order` et `display` posées par JS sur `.track-block-green`, le `.track-block` du Fairway et les quatre `.quick-action-btn`, retrouvés par leur `onclick`), et les classes `pc-large-text` / `pc-high-contrast` sur `#page-parcours` (règles en fin de `parcours-ui.css`, une règle de contraste par thème). `setParcoursUnit(u)` règle ensemble `trackUnit` (Fairway, Green) et `parcoursSettings.distanceUnit` (Vent, Dénivelé).

### `modules/putting/putting.js` / `putting.css`
Module le plus transversal. Combinés d'exercices (créatifs ou rapides), sessions de putting, reprise de session, analyses (distance, pente, performance, comparaisons), et saisie d'un "Nouveau parcours" avec historique et détail. Calcule le Strokes Gained des putts via `strokes-gained.js`. Remplit aussi le panneau de l'accueil (objectif de la semaine, dernière séance, `[data-stat]`) via `renderGolfHome()`, seule source de ce panneau. Expose `window.renderPuttingTab` et `window.renderGolfHome`. Ses requêtes DOM passent par `puttingQuery` / `puttingQueryAll` (limitées à `#page-putting`), sauf celles de `renderGolfHome()` qui visent `#page-home`. `renderPuttingTab()` retire `is-stats-screen` de `body` : ce drapeau reste sinon en place quand on quitte Putting depuis son écran Stats.
Reprise : deux emplacements indépendants, `resumableSession` (exercice créé, onglet Exercices, `putting_resume`) et `resumableQuick` (exercice rapide, onglet Parcours, `putting_resume_quick`). `exitExerciseFlow` quitte sans demander de confirmation (la séance commencée est enregistrée comme reprise) et n'enregistre ou n'efface que l'emplacement de la séance quittée ; `renderResumeCards()` remplit les deux cartes (`data-resume="exercice"` et `data-resume="quick"`). Menu 3 points (`openPuttingMenu('main' | 'stats')`, boutons des headers principal et Performance) : `puttingApplyPrefs()` (réglages `showHistory`, `showPerf*`; l'ancien réglage `showResume` n'existe plus et son éventuelle valeur stockée est ignorée) pose des classes `pref-hide-*` sur `#page-putting` (elles survivent au HTML régénéré par `renderPuttingTab`), règles en fin de `putting.css` ; les cartes de Performance portent `data-perf-card`. La période par défaut (`defaultSessions`) est lue au chargement et copiée dans les trois `filterState`.
Sauvegarde : `savePuttingState()` / `loadPuttingState()`. `importPuttingRoundFromStats(data)` (exposée sur `window`) crée une partie `source: 'stats'` à partir d'une partie saisie en détaillé dans `stats.js` ; elle est dédoublonnée par `statsKey`. `removePuttingRoundFromStats(statsKey)` (exposée sur `window`) la retire quand la partie est supprimée dans Stats.

### `modules/wedging/wedging.js` / `wedging.css`
SPA autonome (7 sections : constantes, `WedgeStorage`, `WedgeAnalytics`, `WedgeUI`, état `Wedge`, vues, routeur). Journal Parcours (cases par distance de 30 à 110 m compris, zones de dispersion à 9 directions), exercices créatifs, analyses de dispersion, de distance et de SG. Menu 3 points (`openWedgingMenu`, boutons des headers et des barres du haut des écrans d'analyse) : seul accès aux analyses depuis le Journal et les Exercices. Exercices : `wedgeResumeCardsHtml()` affiche une carte « À reprendre » par entrée de `wedgeInProgressSessions` (`resumeWedgeExercise(id)` sans passer par la fenêtre Reprendre / Recommencer, qui reste pour le badge « En cours » et le bouton Lancer). Journal : `wedgeHistoryGroupedHtml()` regroupe l'historique par jour (clé locale AAAA-MM-JJ) ; un jour à plusieurs coups est une pile façon notifications iPhone (`.wg-stack`) : cartes en position absolue, 3 visibles décalées de 10 px, un appui déplie / replie (`toggleWedgeStack`). `wedgeLayoutStack()` calcule transformations et hauteur à partir de la hauteur réelle des cartes ; il est rappelé après chaque rendu du routeur et par un `ResizeObserver` sur `#app` (mesures à 0 tant que la page est masquée). Les jours dépliés sont gardés dans `wedgeOpenStacks` (le rendu reconstruit tout le HTML). Un jour à un seul coup reste une carte simple. Le pas des paliers (`wedgeAnalysisStep()`, 5 ou 10 m) ne touche que l'affichage des analyses (`wedgeAnalysisBuckets`, `wedgeAnalysisBucketFor`, `wedgeAnalysisBucketLabel`) : les coups restent enregistrés par 5 m et le Journal garde ses cases de 5 m. Possède son propre routeur par hash (`#parcours`, `#exercices`, `#sg-analysis`...) rendu dans `#app`. Le routeur n'agit que si `#page-wedging` est affichée : `hashchange` est ignoré sinon, `body` et le scroll ne sont touchés que dans ce cas, et un hash étranger (Gym écrit aussi dans `location.hash`) laisse Wedging sur sa dernière route (variable `current`) au lieu de le renvoyer sur Parcours. Le toast "Erreur JS" ne répond qu'aux erreurs levées par `wedging.js` pendant que Wedging est affiché. Calcule son SG avec `sgExpected('rough' | 'green', m)` de `strokes-gained.js`.
Les limites d'un coup de wedge sont les constantes `WEDGE_MIN_DISTANCE` (30 m, comprise) et `WEDGE_MAX_DISTANCE` (110 m, comprise) : elles construisent `WEDGE_BUCKETS` (16 paliers de 30-34m à 105-110m, le dernier prenant la limite haute, libellés par `wedgeBucketLabel`) et les chips de distance des exercices (de 30 à 110 m, par 5 m), et `stats.js` les lit pour classer ses coups. `normalizeWedgeRounds` range dans le dernier palier les coups enregistrés avec l'ancien palier "110m". `importWedgeShotsFromStats(list)` (exposée sur `window`) ajoute au Journal les coups venant de Stats (`source: 'stats'`, dédoublonnés par `statsKey`). `removeWedgeShotsFromStats(idPartie)` (exposée sur `window`) retire les coups dont le `statsKey` commence par `idPartie:` quand la partie est supprimée dans Stats.

### `modules/gym/gym.js` / `gym.css`
Le plus gros fichier (6264 lignes). Injecte tout son HTML dans `#app-root-gym`, puis : bibliothèque d'icônes (`ICONS`, silhouette partagée `GYM_BODY` pour les zones du corps), données mockées (`GYM_DATA`), routeur interne, générateurs de composants et vues (Accueil, Programmes, Détail programme, Créer programme, Créer séance, Exercices, Séance active, Progression, Historique, Récap, Objectifs). Pavé numérique propre au module. Son écouteur `popstate` ne réagit que si `#page-gym` est affichée. `gymToday()` renvoie la date du jour à chaque appel (`GYM_DATA.today` est un accesseur). La séance active enregistre un brouillon dans `gym-session-draft` (séries saisies, exercice affiché, temps écoulé) à chaque changement ; il est repris à la réouverture de la même séance, effacé à la fin de la séance et ignoré au-delà de 12 h. Les textes saisis (noms de programmes, objectifs, descriptions) passent par `appEscapeHtml`. Menu 3 points (`openGymMenu`, branché sur tous les `.gym-header__action`) : unité de poids kg / lb, repos par défaut, programme en cours (`gymSetActiveProgram`, avec sa confirmation habituelle). Les poids restent stockés en kg ; `gymWeightUnit()`, `gymKgToDisplay()`, `gymFmtWeight()`, `gymWeightToInput()` et `gymWeightFromInput()` ne convertissent que l'affichage et la saisie (la cible d'un objectif de volume est saisie dans l'unité affichée et stockée en kg). L'unité n'est pas modifiable pendant une séance. `gymDefaultRestLabel()` donne le repos par défaut (réglage, sinon repos de l'objectif).

### `modules/stats/stats.js` / `stats.css`
IIFE unique. Composants (sparkline, KPI, filtres, graphiques Chart.js), écrans Dashboard / Par club / Par distance / Statistiques (Multi, Traditionnel, SG), saisie de parties (rapide trou par trou, ou détaillée coup par coup), calcul de toutes les stats à partir des parties enregistrées. Navigation interne via `data-goto`, exposée par `window.showStatsScreen`. Se rafraîchit au retour sur la page via un `MutationObserver`.
À la fin d'une partie, `saveFinishedRound` appelle `syncRoundToModules` : pour une partie saisie en détaillé, les coups à faire entre `WEDGE_MIN_DISTANCE` et `WEDGE_MAX_DISTANCE` m (compris) vont dans le Journal Wedging, et les premiers putts forment un parcours Putting. Sont ignorés : coups avec pénalité, sans zone d'arrivée exploitable (ou arrivée "Centre" sans secteur), trous rentrés sans putt. Un échec de synchro n'empêche jamais l'enregistrement dans Stats. Un coup est classé "wedging" dans Stats de `WEDGE_MIN_DISTANCE` (30 m) à `WEDGE_MAX_DISTANCE` compris : même plage que le Journal Wedging, sans trou entre les deux. Les coups de 30 à 50 m des parties saisies avant ce changement ne sont pas rétro-importés.
Brouillon de la partie en cours (`golfStatsRoundDraft`, ignoré au-delà de 24 h) : les deux saisies l'écrivent à chaque changement (`persistDraft`, seulement si quelque chose est saisi), `saveFinishedRound` l'efface quand la partie est bien enregistrée. Le dashboard affiche la carte "Partie en cours" (`#dash-resume`, `renderResumeCard`) avec "Reprendre" (`resumeDraft` puis `restore()` de la saisie) et "Abandonner". Lancer une nouvelle partie avec un brouillon demande confirmation. Le bouton "Terminer" de l'en-tête des saisies (`[data-finish-round]`) enregistre les trous jusqu'au dernier score saisi (saisie rapide) ou dernier trou rentré (saisie détaillée), les trous suivants sont écartés ; `holeCount` vaut alors le nombre de trous joués. L'historique propose une corbeille par partie (`deleteSavedRound`) : elle retire aussi les copies dans Putting et Wedging. Score brut : seules les parties de 18 trous alimentent meilleur, pire et moyenne (`grossRounds`), l'écart au par est ramené à 18 trous (`vsPar18`). Fairways : un trou compte sur un par 4 ou 5 (`fairwayApplies`) ; par inconnu, seulement si un fairway a été saisi.
Groupes SG : `sgGroup(S)` range chaque coup dans `driving`, `green` (A.G., au-delà de `WEDGING_MAX`), `wedging`, `approches` (APP., moins de `WEDGING_MIN` = 30 m) ou `putting`. `liveHoleSG` (encadré de la saisie détaillée) fusionne `wedging` dans `green`, car cet encadré n'a pas de case Wedging, et `renderStats` cumule le résultat sur tous les trous de la partie.
Indicateurs du dashboard : `kpiCatalog` liste tous les indicateurs (clé, groupe, titre, unité, icône, signe) et `DEFAULT_KPI_KEYS` les 4 affichés par défaut. `computeKpiValues` calcule la valeur de chacun sur les 20 dernières parties. Tentative de birdie à X m = 1er putt tenté en régulation (green touché) à X m ou moins, ramené à 18 trous saisis en détail. Le choix du joueur est enregistré dans `golfStatsKpis`.

### `modules/vitesse/vitesse.js` / `vitesse.css`
Placeholder : affiche "Fonctionnalités à venir". Son en-tête porte `data-header="vitesse"` (et non `main`, attribut utilisé par Putting).

### `images/`
`images/icon.png` (1024 px, carré plein sans coins arrondis) : icône de l'appli pour l'onglet et l'écran d'accueil du téléphone, déclarée par deux `<link>` dans `index.html`.
Fonds d'accueil (matin, midi, soir, nuit), fonds de boutons, illustrations de putts (`GreenPutt*`), programmes de gym, popup de reprise. Tous les fichiers sont en WebP et le code ne lit plus que des `.webp` : `HomePage.js`, `gym.js`, `gym.css`, `putting.js` (`QUICK_PUTT_IMAGE_EXT`) et `stats.js` (`IMAGE_EXT`). Les `.png` ne sont plus utilisés.
Non référencés dans le code (à confirmer avant suppression) : `FondEcranBoutonDenivele`, `FondEcranBoutonDistance`, `FondEcranBoutonVent`, `popupareprendre`.

## Données persistées (`localStorage`)

Copie de travail des données du compte. Toutes les clés ci-dessous sont synchronisées avec Supabase par `core/data.js` (correspondance clés -> tables dans sa section), sauf `golfSupabaseAuth`, `golfAccountUserId`, `golfSyncBase`, `golfSyncPending` et les brouillons ou parties en cours (`parcours-fairway-round`, `parcours-green-round`, `putting_resume`, `putting_resume_quick`, `wedgingInProgressSessions`, `gym-session-draft`, `golfStatsRoundDraft`), qui restent sur l'appareil.

| Clé | Écrite par | Contenu |
|---|---|---|
| `golfSupabaseAuth` | supabase-js (`core/supabase-client.js`) | session Supabase (jetons). L'ancienne clé `golfSession` est supprimée au chargement par `auth.js` |
| `golfAccountUserId` | `data.js` | identifiant du compte auquel la copie locale appartient |
| `golfSyncBase` | `data.js` | état de la synchronisation : pour chaque élément connu du serveur, son empreinte et son `occurred_at`, plus l'empreinte de chaque colonne de profil. Sert à reconnaître ce qui a changé ici ou sur le serveur. Mis à jour après chaque lecture et chaque envoi |
| `golfSyncPending` | `data.js` | file d'attente hors ligne : clé synchronisée -> date (ms) de sa dernière modification non encore envoyée. Retirée une fois tout envoyé |
| `golfAppState` | `menu.js` | profil, réglages, radars, sac, distances |
| `parcours-settings`, `parcours-fairway-unit` | `parcours-ui.js` | unités |
| `parcours-fairway-round`, `parcours-green-round` | `parcours-ui.js` | tour en cours (Fairway, Green) |
| `parcours-captures` | `parcours-ui.js` | captures de l'historique |
| `putting_combines`, `putting_sessions`, `putting_rounds`, `putting_resume`, `putting_resume_quick` | `putting.js` | combinés, sessions, parties (dont celles importées de Stats : `source: 'stats'`, `statsKey`), exercice créé à reprendre (Exercices) et exercice rapide à reprendre (Parcours, avec son exercice : il n'est pas dans `putting_combines`) |
| `wedgingShots`, `wedgingExercises`, `wedgingInProgressSessions` | `wedging.js` | coups (dont ceux importés de Stats : `source: 'stats'`, `statsKey`), exercices, sessions en cours |
| `gym-programs-saved`, `gym-history`, `gym-goals`, `gym-active-program-id` | `gym.js` | programmes, historique, objectifs, programme actif |
| `gym-session-draft` | `gym.js` | brouillon de la séance en cours (séries, exercice affiché, temps écoulé), effacé à la fin de la séance |
| `golfModulePrefs` | `commun.js` (`appPrefSet`) | réglages d'affichage des menus 3 points (Putting, Wedging, Parcours, Gym) |
| `golfStatsRounds` | `stats.js` | parties saisies dans Stats |
| `golfStatsKpis` | `stats.js` | clés des indicateurs affichés dans "Mes indicateurs" (ordre d'affichage) |
| `golfStatsRoundDraft` | `stats.js` | partie en cours (saisie rapide ou détaillée), effacée à l'enregistrement, ignorée après 24 h |

## Suivi des bugs

Les bugs en cours, les tests à faire sur téléphone, les décisions attendues et l'historique des corrections ne sont plus dans ce fichier : ils sont dans `Suivi-des-bugs.docx` (statuts en couleur, répartition entre Claude et le propriétaire). Ce README décrit l'application et son code, plus les anomalies relevées lors des audits et les fonctionnalités à venir.

### Anomalies relevées (suppression du compte, 24/10/2026)

Limites connues et points à contrôler :

- **Pas encore lancé sur le vrai Supabase.** Tant que `supabase/suppression-compte.sql` n'a pas été exécuté, la colonne `deletion_requested_at` n'existe pas : « Supprimer mon compte et mes données » échoue avec le message « Suppression impossible » et rien n'est modifié. Le script et le code ont été testés dans un faux environnement seulement (faux serveur, faux navigateur) ; la tâche `pg_cron` et la suppression de `auth.users` sont à essayer avec un compte de test (étapes en bas du script).
- **L'adresse e-mail reste prise pendant les 30 jours** : créer un nouveau compte avec la même adresse échoue tant que l'ancien n'est pas supprimé définitivement. La solution est de se reconnecter et d'annuler la suppression.
- **Un appareil resté connecté continue de fonctionner jusqu'à son prochain lancement** : il peut même continuer à envoyer des données. À l'ouverture suivante, la fenêtre de suppression programmée s'affiche. Rien n'oblige à agir sur le moment.
- **La date de demande est écrite par l'appli.** Une personne qui modifierait la requête pourrait avancer la date de sa propre suppression, ou l'annuler : elle n'agit que sur son propre compte (règles RLS), donc sans danger pour les autres.
- **Sauvegardes Supabase** : selon l'offre du projet, des sauvegardes de la base peuvent contenir le compte quelque temps après la suppression (la politique de confidentialité le mentionne). À vérifier dans les réglages du projet.
- **Délai de 30 jours à confirmer** : il est écrit à trois endroits, qui doivent rester identiques : `DELETION_DELAY_DAYS` dans `core/data.js`, `interval '30 days'` dans `supabase/suppression-compte.sql`, et les textes de `menu.js` (écran Mes données, FAQ, politique de confidentialité).
- **Les suppressions d'éléments (un coup de wedge, une séance...) ne sont plus récupérables** : les lignes sont effacées. Un appareil resté hors ligne reprend la suppression à sa prochaine lecture (sauf s'il a modifié l'élément entre-temps : sa version est alors renvoyée).


### Anomalies relevées (mode hors ligne, 23/10/2026)

Problèmes non résolus ou limites connues après l'ajout du mode hors ligne :

- **Pas testé sur un vrai téléphone ni sur le vrai Supabase.** Les tests ont tourné dans un faux navigateur (voir "Mode hors ligne"). À faire sur iPhone, appli installée : ouvrir une première fois avec du réseau, passer en mode avion, relancer l'appli, saisir dans Putting, Wedging, Gym et Parcours, couper le réseau en pleine saisie, rétablir le réseau, puis vérifier les lignes dans Supabase.
- **Première ouverture sans réseau impossible.** L'appli doit avoir été ouverte au moins une fois avec du réseau (copie d'environ 8 Mo, dont 7 Mo d'images). Un téléphone installé « à la dernière minute » sur un parcours sans réseau n'a rien à afficher.
- **Conflits : la date de comparaison est celle de la clé, pas celle de l'élément.** Si le même élément est modifié sur deux appareils, dont un hors ligne, un changement plus ancien peut l'emporter sur un plus récent quand la clé a été réécrite plus tard pour une autre raison. Cas rare (un seul appareil en pratique) ; il faudrait une date par élément.
- **Données d'un autre appareil non affichées après un démarrage hors ligne.** Tant que la personne n'appuie pas sur « Actualiser » (ou ne relance pas l'appli), les listes restent celles du démarrage. Rien n'est supprimé ni écrasé sur le serveur dans l'intervalle, mais les modules affichent une liste incomplète.
- **Les brouillons et parties en cours ne sont pas synchronisés** (liste dans `core/data.js`) : une séance commencée hors ligne ne se retrouve pas sur un autre appareil. Inchangé.
- **Ce qui demande toujours du réseau** : connexion, création de compte, mot de passe oublié, suppression du compte (`deleteMenuData`) et son annulation, recherche de parcours dans Stats (l'API FlyAway ; la saisie à la main reste possible, `stats.js` n'a pas été modifié).
- **Déconnexion forcée.** Si Supabase invalide la session (révoquée depuis un autre appareil, expirée), `SIGNED_OUT` vide la copie locale, y compris ce qui n'a pas été envoyé. Une simple coupure réseau ne déclenche pas cet événement.
- **Retour du réseau : premiers envois parfois refusés.** Après une longue période hors ligne (jeton d'accès expiré), supabase-js peut refuser le renouvellement de la session pendant environ une minute : l'envoi échoue puis réussit tout seul (nouveaux essais à 5, 10, 20 s...). La pastille indique « Envoi en attente » entre-temps.
- **Fichiers copiés : une modification sans `?v=` incrémenté** s'affiche à l'ouverture suivante seulement (CSS et JS servis depuis la copie puis rafraîchis) ; la page elle-même est toujours demandée au réseau d'abord. Une image ajoutée dans `images/` sans être ajoutée à `IMAGES` dans `sw.js` n'est disponible hors ligne qu'après avoir été affichée une fois avec du réseau (voir `sw.js`, "Ajouter une image").
- **iPhone, à vérifier** : dans un onglet Safari (appli non installée), le système peut vider le stockage d'un site resté longtemps sans visite, saisies non envoyées comprises ; l'appli installée sur l'écran d'accueil n'est normalement pas concernée. À confirmer sur l'appareil.
- **Pastille « Hors ligne » sur l'accueil** : placée en haut, centrée, sous la zone de sécurité, elle peut recouvrir un peu le texte « Bonjour » du header de l'accueil. Elle ne capte aucun appui. À contrôler sur téléphone ; elle se déplace en changeant `top` ou `left` dans `.app-net_pill` (`core/offline.js`). Le message hors ligne reste temporaire sur toutes les pages.
- **Mentions légales** : les textes (`MENU_DOCS`, `menu.js`) ne parlent pas de la copie d'attente gardée sur l'appareil ni du service worker. Le 24/10/2026, la FAQ « Comment supprimer mon compte ? » et la durée de conservation (§ 7 de la politique de confidentialité) ont été alignées sur la suppression à 30 jours, et `updatedAt` est passé au 24 octobre 2026 : formulation à faire valider par le propriétaire.
- **Fichiers inutiles dans le dépôt** : `core/diag.js` (plus référencé depuis le 19/10/2026) peut être supprimé ; `Suivi-des-bugs.docx` existe en deux exemplaires (racine et `docs/`), seul celui de `docs/` est cité plus haut. Le suivi n'a pas été mis à jour pour ce chantier.

### Anomalies relevées (correctifs du 19/10/2026, Accueil et Wedging)

- **Symboles des clubs et du sac à refaire.** Les cinq icônes de `stats.js` (`club`, `iron`, `wedge`, `putter`, `bag`) ne correspondaient pas aux objets. Redessinées de zéro, en contours de 1,6 px comme les autres icônes : bois (tête arrondie avec ligne de semelle), fer (lame et deux rainures), wedge (tête inclinée et balle), putter (tête plate avec ligne de visée et balle), sac (col, poche, bandoulière, trois clubs qui dépassent). Le bouton Wedging de l'accueil (`index.html`) reprend le même dessin. Dans la saisie détaillée, un wedge affichait l'icône du fer : il a maintenant la sienne (`sdClubType` renvoie `wedge`, `ICON_OF.wedge`, `.is-wedge`). Vérifié en rendu image, à contrôler sur téléphone aux petites tailles (14 px).

- **Wedging, récapitulatif d'exercice : valeurs mal alignées et mots « Réussi » / « Raté » inutiles.** Les colonnes distance et résultat étaient respectivement alignées à gauche et à droite, ce qui donnait des valeurs en escalier. Distance et résultat alignés à droite dans leur colonne (le résultat colle au bord droit du bandeau), sans les deux mots (la pastille indique déjà le résultat). Corrigé (`wedgeExRecapShotLabel`, `.wg-recap-dist`, `.wg-recap-result`).
- **Wedging, détail d'une session de l'historique : lignes non alignées.** Cet écran (`wedgeExerciseLogDetailHtml`) utilisait une ligne à deux blocs sans colonnes et gardait « Réussi » / « Raté » ; le résumé « 7/15 réussis » était collé au bord gauche. Il utilise maintenant la même grille que le récapitulatif (`.wg-recap-row`) et le résumé a la même marge que la liste (`.wg-log-summary`). Corrigé ; à contrôler sur téléphone.
- **Accueil, encadrés du bas : titres et symboles désalignés.** L'anneau de l'objectif (22 px) et l'icône du calendrier (13 px) n'avaient pas la même largeur, donc les deux titres ne partaient pas du même point. Les deux symboles sont dans une boîte de 22 px. Corrigé ; à contrôler sur téléphone.
- **Accueil, objectif de la semaine non modifiable** (valeur fixe `GOLF_WEEKLY_GOAL = 5`). Corrigé : réglable dans le Menu (`settings.weeklyGoal`, section Entraînement).
- **Accueil, dernière séance : date et type sur deux lignes.** Mis sur la même ligne. Le type ne dépendait que de la date de l'activité et pouvait afficher « Putting » alors que la dernière activité était une partie Stats ; il est maintenant tiré de l'activité la plus récente. Corrigé.
- **README : numéro de version de cache.** Il annonçait un `?v=46` commun à tous les fichiers alors que `index.html` en utilise plusieurs (54 à 57). Texte corrigé.

- **Menu, thème clair / sombre en liste déroulante.** Remplacée par un switch glissant de gauche à droite qui porte ses deux libellés, « Clair » et « Sombre » (`settingSwitchRow`, `.mn-switch`). Le réglage reste `settings.theme` (`dark` ou `light`).

### Anomalies relevées (correctifs du 18/10/2026)

- **Phrase « Sélectionne d'abord un exercice dans la liste. » visible sur Wedging, Stats, Putting et Vitesse.** Le toast de Putting (`showToast`) est ajouté à `<body>`, mais ses règles CSS étaient limitées à `#page-putting` : il s'affichait donc comme du texte brut. Les règles `.app-toast` ne dépendent plus de la page (avec des valeurs de repli pour les couleurs) et tiennent compte de la zone de sécurité du bas.
- **Stats : popups « Mes indicateurs » et « Nouvelle partie ».** Le cadre (`.new-round_overlay` / `.new-round_modal`) prenait toute la hauteur de l'écran et passait sous la caméra. Il garde maintenant une marge égale à la zone de sécurité haute et basse.
- **Déploiement du 18/10 : `wedging.css` n'avait pas été remplacé** (la v56 d'`index.html` chargeait l'ancienne version, d'où les headers d'analyse Wedging encore trop hauts) et une copie de `gym.css` s'est retrouvée dans `modules/wedging/` ; ce fichier n'est référencé nulle part et peut être supprimé. Les références à `core/diag.js` dans `index.html` (balise `<script>` et script de diagnostic du `<head>`) ont été supprimées le 19/10/2026.
- **Mode clair (19/10/2026) : à valider sur téléphone.** Les cartes de Parcours (trou, fairway) restent volontairement sombres en mode clair et tranchent donc encore avec le reste ; les photos de l'accueil ne sont pas modifiées. Le vert d'accent en texte (4,2:1 sur carte) est un peu sous les 4,5:1 recommandés.
- **Headers : règle commune.** Tout header, fixe ou statique, occupe 56 px sous la zone de sécurité iOS, avec son contenu centré (centre à `56/2 + safe-area-inset-top` du haut). Les barres statiques de Wedging (`.wg-topbar` : analyses Dispersion, Distance et SG, séance, récap) et l'en-tête de la séance active de Gym (`.session-header`) n'avaient qu'un padding de 18 à 20 px : leur contenu passait sous l'heure et la batterie. Mesuré en simulation avec une zone de sécurité de 0, 20 et 47 px sur tous les headers de l'appli. À contrôler sur téléphone : la séance active de Gym est un peu plus haute qu'avant. L'écran de saisie détaillée de Stats n'a pas de header standard (poignée repliable, voulu) et l'accueil a son propre bloc « Bonjour ».
- **Wedging : l'écran de récapitulatif** garde un bouton « Enregistrer » pleine largeur, sans marge latérale, contrairement à la liste au-dessus.
- **Wedging : la fenêtre « Session en cours » (Reprendre / Recommencer)** reste affichée quand on lance un exercice déjà commencé ; seul le popup Quitter / Rester de Putting a été supprimé.
- **Gym : aucune photo propre à chaque exercice** n'existe dans le dépôt. La page Exercices affiche `FondBoutonExercices.webp` dans son en-tête et la carte Exercices de l'accueil Gym est éclaircie ; les catégories gardent leurs pictogrammes.
- **Symboles** (`stats.js` : `club`, `iron`, `wedge`, `putter`, `bag` ; bouton Wedging de `index.html`) : les silhouettes pleines du 18/10 ne ressemblaient pas aux objets (bois en poêle, putter en barre, sac en gobelet).

### Anomalies relevées (audit des unités et réglages, 14/10/2026)

- **Unité de distance en double.** Menu stocke `settings.distanceUnit` (`golfAppState`, `"m"` ou `"ft"` = yards) et Parcours a son propre `parcoursSettings.distanceUnit` (`parcours-settings`, `"m"` ou `"yd"`). Les deux ne sont pas synchronisés. Putting, Wedging et Stats n'en lisent aucun : leurs distances restent en mètres.
- **Réglages enregistrés mais jamais lus.** `temperatureC`, `altitudeM`, `speedUnit`, `radarUnit` et les radars (`golfAppState`) ne sont utilisés par aucun autre module que Menu. Le calculateur de vent de Parcours est en km/h en dur.
- **Menu : température (°C), altitude (m), longueur (cm) et poids (g) du driver** n'ont pas d'unité alternative (°F, ft, in, oz).
- **Stats et Accueil sans menu 3 points** : le header de Stats n'a pas de bouton, l'Accueil non plus. Les menus de Putting, Wedging, Parcours et Gym existent (voir plus haut).
- **Menus 3 points non testés sur appareil** : le code a été vérifié par des tests automatiques (bottom sheet, conversions kg/lb, paliers, ordre des outils) mais pas dans un navigateur ; l'effet du texte plus grand et du contraste renforcé de Parcours (marques du Fairway et du Green) est à contrôler sur téléphone.
- **Putting : une saisie de "Nouveau parcours" interrompue n'a pas de reprise.** Quitter l'écran efface le formulaire (`closeNewParcoursModal`) ; seuls les exercices (créés ou rapides) peuvent être repris.
- **Parcours : deux réglages d'unité encore stockés** (`parcours-settings` et `parcours-fairway-unit`) : le menu 3 points les règle ensemble, mais ils restent deux clés, et Menu garde son propre réglage (voir plus haut).
- **Formats figés** : dates en `fr-FR` en dur (Putting, Stats).

## Fonctionnalités à venir

Rien de cette section n'existe dans le code actuel.

### Menu 3 points des headers : reste à faire

Les menus de Putting, Wedging, Parcours et Gym existent (voir "Menu 3 points des headers" dans le guide fonctionnel). Ce qui n'est pas fait :

- **Stats** : masquer et réordonner les blocs du dashboard (carte SG, Analyser mon jeu, Mes parcours). Fenêtre de calcul réglable (10 ou 20 parties, saison) au lieu des 20 fixes de `computeKpiValues`. Catégories SG affichées au choix. Nombre de tours affichés dans "Mes parcours". Le header de Stats n'a pas de bouton à 3 points : il faudrait l'ajouter. Le choix des indicateurs existe déjà via "Modifier" dans "Mes indicateurs".
- **Putting** : indicateur "réussite par distance" (il n'y a pas de carte à ce nom dans Performance) ; choix d'indicateurs plus fin que l'affichage des trois cartes existantes, sur le modèle de `kpiCatalog`.
- **Wedging** : wedge par défaut. Le Journal et les exercices n'enregistrent pas de club : il n'y a rien à présélectionner tant que `wedgeDistances` (Menu) n'est pas relié à Wedging.
- **Gym** : "programme épinglé" au sens d'un favori distinct du programme en cours. Le menu actuel choisit le programme en cours, avec la réinitialisation de progression habituelle de `gymSetActiveProgram`.
- **Parcours** : mélanger les zones (Green, Fairway) et les outils dans un même ordre. Aujourd'hui les deux zones s'ordonnent entre elles et les quatre outils entre eux, la rangée d'outils restant sous les zones.
- **Accueil** : réordonner ou masquer les six tuiles (Vitesse, par exemple), choisir les infos du panneau du bas. L'Accueil n'a pas de header avec bouton.
- **Déplacer et redimensionner** : mode édition (appui long, glisser avec Pointer Events), deux tailles par bloc (compact ou large), layout stocké en JSON par module. Réservé à l'Accueil et au dashboard Stats : ailleurs, le coût dépasse le gain.

### Hors ligne : pistes

- Date de modification par élément (au lieu de la date par clé) pour départager deux appareils.
- Appliquer les données d'un autre appareil sans recharger la page (chaque module relirait ses données).
- Synchroniser aussi les brouillons et parties en cours.
- Indicateur « données non envoyées » dans le Menu (`appData.status()` le fournit déjà).

### Autres personnalisations envisagées

- **Unités** : une seule unité de distance partagée par tous les modules (Parcours en a déjà une pour ses schémas et ses calculs ; Putting, Wedging et Stats restent en mètres), vent suivant `speedUnit`, °F, ft, in et oz pour température, altitude et driver.
- **Index cible** (scratch, 10, 20) comme référence Strokes Gained.
- **Gaucher ou droitier**, pour les schémas Fairway et Green.
- **Écran toujours allumé** pendant une partie ou une séance.
- **Retours haptiques et sonores** réglables (aujourd'hui seule la fin de repos de Gym vibre et sonne).
- **Parcours favoris** pour la saisie de partie, au lieu de la recherche par géolocalisation à chaque fois.
- **Export CSV** par module, en plus de l'export JSON global.
- **Préréglages de layout** (Compétiteur, Entraînement, Minimal) à appliquer en un tap.
