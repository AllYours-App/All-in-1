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
- **À reprendre** : une session interrompue peut être reprise là où elle s'était arrêtée. L'onglet Exercices et l'onglet Parcours ont chacun leur carte : un exercice créé interrompu apparaît dans Exercices, un exercice rapide interrompu dans Parcours, et les deux peuvent exister en même temps.
- **Performance** : analyses par distance et par pente, comparaisons entre périodes ou entre parcours, avec des filtres. Indicateurs principaux : Strokes Gained putting et pourcentage de 1 putt.
- **Parcours** : saisie des putts d'une partie réelle, avec historique et détail de chaque partie.
- **Activité récente** : dernières sessions.

### Wedging (jeu court, 30 à 110 m compris)
- **Parcours** : après chaque coup d'approche, on note la distance qu'il fallait faire, puis la distance restante et la zone d'arrivée par rapport au drapeau (huit directions autour du trou, ou "coup rentré"). L'historique garde tous les coups, regroupés par jour (Aujourd'hui, Hier, puis la date) avec le nombre de coups du jour.
- **Analyses** : dispersion (où tombent les balles pour chaque distance), distance (distance moyenne restante au drapeau pour chaque palier de distance à faire) et Strokes Gained. On y accède par le bouton 3 points du header ("Voir mes analyses"), qui ouvre la vue choisie par défaut ; les paliers peuvent être regroupés par 5 ou 10 m.
- **Exercices** : exercices d'approche à créer, à jouer en séance, avec récapitulatif et revue. Une session interrompue se reprend depuis la carte « À reprendre » en haut de la liste (une carte par session) ou depuis le badge « En cours » de l'exercice.

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
- **Putting** : afficher ou masquer "À reprendre" et "Activité récente" (écran principal), et chacune des trois cartes de Performance (SG par round, taux de réussite et mètres, 1 putt et 3 putts) ; période par défaut des filtres (5, 10, 15, 20 sessions ou toutes).
- **Wedging** : accès aux analyses, vue d'analyse par défaut (Dispersion, Distance ou SG), pas des paliers des analyses (5 ou 10 m).
- **Parcours** : ordre et visibilité du Green et du Fairway, puis de Vent, Dénivelé, Distance et Historique ; unité m ou yd (schémas et calculs ensemble) ; texte plus grand ; contraste renforcé.
- **Gym** : unité de poids kg ou lb (saisie et affichage), temps de repos par défaut, choix du programme en cours. Les boutons à engrenage ("Réglages") des écrans de création et des objectifs ouvrent le même menu.

### Vitesse
Pas encore disponible : l'écran annonce "Fonctionnalités à venir".

## Structure du dépôt

```
index.html                 point d'entrée unique (HTML des pages + balises <link>/<script>)
manifest.webmanifest       manifeste PWA
README.md
core/                      socle commun à tous les modules
  base.css                 reset, tokens :root, règles globales
  commun.css               composants partagés (pavé numérique, en-têtes, popups, boutons ronds, bottom sheet)
  theme-light.css          thème clair (activé par <html data-theme="light">)
  app-shell.js             showPage()
  commun.js                appKeypad(), popups, appPrefGet/Set(), appSheet(), applyAppTheme()
  sg-data.js               tables Strokes Gained
  strokes-gained.js        calculs Strokes Gained
vendor/
  chart.umd.min.js         Chart.js 4.5.0
modules/                   une page = un dossier (CSS + JS)
  home/  auth/  parcours/  putting/  wedging/  gym/  stats/  vitesse/  menu/
images/                    fonds, illustrations, icône
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
| `page-login`, `page-signup` | dans `index.html` | `modules/auth/auth.js` | `modules/auth/auth.css` | `index.html` |
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
core/app-shell.js            -> showPage()
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

Les CSS sont chargés dans l'ordre `base`, `commun`, `HomePage`, `parcours-ui`, `wedging`, `gym`, `putting`, `vitesse`, `stats`, `menu`, `auth`, puis `theme-light` en dernier (il doit passer après les autres pour les surcharger). Tous les CSS et JS locaux portent le même paramètre de version dans `index.html` (`?v=46`), à incrémenter partout à chaque déploiement qui modifie un fichier (remplacer `?v=46` par le numéro suivant dans toutes les balises).

### Dépendances externes

- Chart.js 4.5.0, hébergé dans `vendor/` (`vendor/chart.umd.min.js`, graphiques de `stats.js`) : plus aucun CDN tiers.
- API publique `https://api.flyawaygolf.com/v2` : recherche de golfs par géolocalisation et profil de golf, appelée uniquement depuis `stats.js` (popup "Nouveau parcours"). Elle reçoit la position de l'appareil : elle est citée dans la politique de confidentialité, comme Supabase et l'hébergeur.

### Règles de cloisonnement entre modules

Tous les modules vivent dans le même document et le même scope global. Pour qu'un module n'agisse jamais dans une page qui n'est pas la sienne :

- **Sélecteurs limités à la page.** Un `document.querySelector(...)` ou `querySelectorAll(...)` sur une classe ou un attribut générique (`data-header`, `.bottom-nav`, `.screen`, `.sheet`...) est préfixé par l'id de la page du module (`#page-putting ...`). `putting.js` le fait via `puttingQuery` / `puttingQueryAll`. Les seules requêtes qui visent volontairement une autre page sont celles de `renderGolfHome()` (`putting.js`), qui écrit dans `#page-home`.
- **Écouteurs globaux gardés.** Un écouteur posé sur `window` ou `document` (`hashchange`, `popstate`, `error`, `resize`, `click`, `keydown`) commence par vérifier que la page du module est affichée (`#page-xxx.active`) ou que la cible est dans la page. Cas particulier : `location.hash` est partagé entre Wedging (routeur) et Gym (`pushState`), aucun des deux ne doit réagir quand l'autre est affiché.
- **Attributs et ids uniques.** Pas de `data-xxx` ni d'`id` identique dans deux modules (`data-header` de Vitesse s'appelle `vitesse`, celui de Putting `main`). Les ids de Gym sont préfixés `gym-` (`gym-sheet-overlay`, `gym-view-programmes`...), ceux de Menu `menu-` (`menu-root`, `menu-back-btn`...), le conteneur de Wedging est `#wedging-app`, les boutons de menu 3 points `#puttingMenuBtn` et `#wedgingMenuBtn`. Les noms globaux de `wedging.js` sont préfixés `Wedge` (`WedgeStorage`, `WedgeAnalytics`, `WedgeUI`, `WedgeViews`, `WedgeRouter`) et le conteneur de `putting.js` s'appelle `puttingRoot`. Dans Gym, les requêtes sur une classe générique (`.gym-view`, `.sheet`, `.sheet-overlay`) sont préfixées par `#page-gym`.
- **État sur `body`.** Une classe ou un style posé sur `body` (`no-scroll`, `gym-home-locked`, `gym-view-fit`, `is-stats-screen`, `overflow`) est retiré par le module qui l'a posé quand il est quitté. Parcours (`no-scroll`) et Gym (`gym-home-locked`, `gym-view-fit`, via `gymSyncBodyLocks`) suivent l'activation de leur page avec un `MutationObserver` sur sa classe `active` ; `showPage()` et Wedging ne touchent plus aux verrous des autres modules. Stats passe par un verrou partagé (`lockScroll` / `unlockScroll`) qui restitue la valeur d'origine.

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

### `index.html` (1035 lignes)
Contient le HTML de Home, Parcours, Stats, Menu, Login et Signup, les conteneurs vides de Wedging, Gym, Putting et Vitesse, un script inline (bloque le swipe-retour iOS depuis les bords et le zoom au pincement) et la liste des scripts. Un script en `<head>` ajoute la classe `has-session` sur `<html>` si `golfSession` existe, pour éviter le flash de la page de connexion.

### `core/app-shell.js`
`showPage(id)` : active la page demandée et masque les autres, puis remonte en haut de page. Ignore un id inconnu. Ne touche à aucune classe de `body` : chaque module retire lui-même son verrou de défilement en quittant sa page. Expose `window.showPage`.

### `core/commun.js`
`appKeypad(pressFn, backspaceFn, clearFn, extraKey)` : génère le HTML d'un pavé numérique. Les boutons appellent par nom des fonctions globales via `onclick`. Utilisé par `menu.js`, `parcours-ui.js`, `putting.js`, `wedging.js` et `stats.js` (popup distance restante / pénalité de la saisie détaillée, fonctions globales préfixées `statsSd`). Gym a son propre pavé.

`appConfirm(message, { confirmLabel, cancelLabel, danger })`, `appAlert(message)` et `appPrompt(label, valeurInitiale, { multiline })` : popups de l'appli qui remplacent `confirm()`, `alert()` et `prompt()` natifs. Elles renvoient une Promise (`true` / `false`, rien, texte / `null`) : à attendre avec `await` dans une fonction `async`. Le message passe par `textContent` (aucun HTML interprété). Échap et un appui sur le fond annulent. Styles `.app-dialog_*` dans `commun.css` (z-index 9000). Plus aucun dialogue natif dans le code.

`appEscapeHtml(valeur)` : échappe `& < > " '` ; à utiliser pour tout texte saisi par la personne avant de l'injecter dans un gabarit HTML (y compris dans un attribut `value="..."` ou un `<textarea>`). `appSafeSetItem(clé, valeur)` : écrit dans le `localStorage` et renvoie `true` ou `false` ; en cas d'échec (stockage plein ou indisponible), elle affiche une alerte à l'écran (au plus une toutes les 8 secondes) au lieu d'ignorer l'erreur. Les modules l'utilisent à la place des `try { localStorage.setItem(...) } catch {}` : `gym.js`, `putting.js`, `wedging.js` (`WedgeStorage`) et `parcours-ui.js` (Fairway, Green, captures). `menu.js` (`saveMenuState`) y passe désormais. `stats.js` y passe aussi (`persistRounds`, indicateurs, brouillon) et utilise `appEscapeHtml` : son ancien helper `esc` est supprimé.

`appPrefGet(module, clé, défaut)` et `appPrefSet(module, clé, valeur)` : préférences d'affichage par module, dans la clé unique `golfModulePrefs` (`{ putting: {...}, wedging: {...}, parcours: {...}, gym: {...} }`). Elles sont volontairement séparées de `golfAppState`, que `menu.js` réécrit en entier depuis sa copie en mémoire. L'écriture passe par `appSafeSetItem`.

`appSheet({ title, sections: [{ title, items }] })` : bottom sheet partagée par les menus 3 points (renvoie la fonction `close()`). Types d'entrées : `toggle` (`value`, `onChange`), `segment` (`options`, `value`, `onChange`), `action` (`onClick`, `selected`, `danger`, `keepOpen`) et `reorder` (liste `[{ key, label, visible }]` avec oeil et flèches haut / bas, `onChange` reçoit la liste dans le nouvel ordre). Tous les textes passent par `textContent`. Une seule feuille à la fois ; `Échap`, un appui sur le fond ou "Fermer" la referment ; une action la ferme avant d'appeler `onClick` (sauf `keepOpen`). Chaque module fournit ses entrées dans sa fonction `open…Menu()` et applique ses préférences au chargement.

### `core/base.css`, `core/commun.css`
`base.css` : reset, tokens `:root` (dont les couleurs `--wg-*` partagées par tous les modules), règles globales. `commun.css` : composants partagés (`.app-keypad`, `.app-keypad-value`, en-têtes de page, etc.). Les styles de la bottom sheet (`.app-sheet_*`) sont à la fin de `commun.css` (z-index 8900, sous les popups `.app-dialog` à 9000 : une confirmation ouverte depuis une entrée passe au-dessus). Ils n'utilisent que des jetons de `:root`, donc le thème clair s'applique sans règle dédiée.

**Marges des pages (modèle : Putting).** Deux variables dans `base.css` : `--app-padding-x` (20 px, 16 px sous 360 px) pour la marge horizontale, et `--app-page-top` (56 px + safe-area + 16 px) pour le début du contenu sous le header fixe. Toute nouvelle page ou tout nouveau bloc de page les utilise, sans valeur en dur. Exceptions volontaires : les écrans de Gym et de Parcours verrouillés à la hauteur de l'écran (accueil Gym, création de programme, accueil Parcours) gardent un décalage vertical plus serré. `.screen` de `parcours-ui.css` est limité à `#page-parcours` (via `:where()`, spécificité inchangée) : il s'appliquait aussi à Stats et doublait sa marge.

### `vendor/chart.umd.min.js`
Chart.js 4.5.0 (licence MIT) : copie du fichier officiel `chart.umd.min.js` publié sur npm, chargée par `index.html` avec `?v=46`. Pour changer de version, remplacer ce fichier par celui de la nouvelle version (`npm pack chart.js@X.Y.Z`, dossier `dist/`).

### `core/theme-light.css`
Thème clair, actif quand `<html data-theme="light">`. Il redéfinit les jetons de couleur de chaque module (`:root`, `#page-stats`, `#page-putting`, `#page-wedging`, Gym, Menu) puis adapte les couleurs codées en dur. Choix dans Menu > Apparence > Thème (réglage `settings.theme`, `"dark"` ou `"light"`, dans `golfAppState`) ; `applyAppTheme()` (`core/commun.js`) pose l'attribut et la couleur de la barre du navigateur, et un petit script du `<head>` d'`index.html` l'applique avant le premier affichage. Restent sombres en mode clair : la photo et la carte de l'accueil, la carte de Parcours, l'écran de connexion. Ajouter un jeton de couleur dans un module oblige à lui donner sa valeur claire ici.

### `core/sg-data.js` et `core/strokes-gained.js`
Moteur Strokes Gained partagé. `sg-data.js` contient les tables de référence `SG_BASELINES` (lies `tee`, `fairway`, `rough`, `sand`, `recovery`, `green` ; yards sauf `green` en pieds), extraites du dépôt `dgtaillie/python_strokes_gained`. `strokes-gained.js` convertit les mètres, interpole (`sgExpected`) et calcule le SG d'un coup (`sgShot`). Aucune dépendance au DOM. C'est le seul endroit où vivent des tables SG : `putting.js`, `wedging.js` et `stats.js` l'appellent. Sous 10 yd (9,1 m), les tables fairway / rough / sand sont plafonnées à leur valeur à 10 yd (la source n'a pas de points plus courts).

## Modules

### `modules/home/HomePage.js` / `HomePage.css`
Page d'accueil : fond selon l'heure (`getBackgroundByHour`, images `images/FondEcranHomePage*.webp`), prénom du profil (lu dans `golfAppState`), Expose `window.renderHomeGreeting` (rappelée par `menu.js`). Le panneau du bas de l'accueil (objectif de la semaine, dernière séance) est rempli par `renderGolfHome()` dans `putting.js`. Toutes ses requêtes DOM sont limitées à `#page-home`. Un `MutationObserver` sur `#page-home` pose `html.home-locked` tant que l'accueil est affiché (et la retire en le quittant) : pas de défilement ni de rebond vertical (`overscroll-behavior-y: none`, sans risque ici car l'accueil ne défile jamais). Sous 600 px de large, `.page-wrapper` est en `position: fixed; inset: 0` et la photo prend tout l'écran ; au-dessus, l'accueil reste une carte centrée de 430 × 852 px (les iPhone récents les plus larges font 440 px : un seuil à 430 px les laissait en mode carte, avec du vide en haut et en bas). Le thème clair n'a aucune bande sous la barre d'état : sombre et clair ne diffèrent que par les couleurs.

### `modules/auth/auth.js` / `auth.css`
Connexion et création de compte. La session est uniquement la clé `golfSession` du `localStorage` (`{ email, createdAt }`) : aucun serveur, la validation ne vérifie que le format de l'e-mail et la longueur du mot de passe (8 caractères minimum à l'inscription). Choisit la page de départ (`home` si session, sinon `login`), expose `window.authLogout` (appelée par le bouton de déconnexion de `menu.js`). Réutilise `getBackgroundByHour()` de `HomePage.js`. Les liens légaux sous les formulaires (dans `index.html`) appellent `openHelpPage('cgu' | 'confidentialite', 'login' | 'signup')` de `menu.js` : le texte s'ouvre dans la page Menu et le bouton retour ramène à l'écran d'origine.

### `modules/menu/menu.js` / `menu.css`
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

### `modules/parcours/parcours-ui.js` / `parcours-ui.css`
Suivi pendant le parcours : Fairway (mises en jeu sur 18 trous), Green (attaques de green), Historique (bilan du parcours en cours), calculateur de vent, calculateur de dénivelé (capteurs d'orientation de l'appareil), calculateur "Mes distances" (lit `golfBag` et les distances de `menu.js`). Les fonctions sont globales car appelées depuis des `onclick` générés. Unités m/yd. Menu 3 points (`openParcoursMenu`, branché au chargement sur le bouton du header d'`index.html`) : `parcoursApplyPrefs()` applique l'ordre et la visibilité (propriété CSS `order` et `display` posées par JS sur `.track-block-green`, le `.track-block` du Fairway et les quatre `.quick-action-btn`, retrouvés par leur `onclick`), et les classes `pc-large-text` / `pc-high-contrast` sur `#page-parcours` (règles en fin de `parcours-ui.css`, une règle de contraste par thème). `setParcoursUnit(u)` règle ensemble `trackUnit` (Fairway, Green) et `parcoursSettings.distanceUnit` (Vent, Dénivelé).

### `modules/putting/putting.js` / `putting.css`
Module le plus transversal. Combinés d'exercices (créatifs ou rapides), sessions de putting, reprise de session, analyses (distance, pente, performance, comparaisons), et saisie d'un "Nouveau parcours" avec historique et détail. Calcule le Strokes Gained des putts via `strokes-gained.js`. Remplit aussi le panneau de l'accueil (objectif de la semaine, dernière séance, `[data-stat]`) via `renderGolfHome()`, seule source de ce panneau. Expose `window.renderPuttingTab` et `window.renderGolfHome`. Ses requêtes DOM passent par `puttingQuery` / `puttingQueryAll` (limitées à `#page-putting`), sauf celles de `renderGolfHome()` qui visent `#page-home`. `renderPuttingTab()` retire `is-stats-screen` de `body` : ce drapeau reste sinon en place quand on quitte Putting depuis son écran Stats.
Reprise : deux emplacements indépendants, `resumableSession` (exercice créé, onglet Exercices, `putting_resume`) et `resumableQuick` (exercice rapide, onglet Parcours, `putting_resume_quick`). `exitExerciseFlow` n'enregistre ou n'efface que celui de la séance quittée ; `renderResumeCards()` remplit les deux cartes (`data-resume="exercice"` et `data-resume="quick"`). Menu 3 points (`openPuttingMenu('main' | 'stats')`, boutons des headers principal et Performance) : `puttingApplyPrefs()` pose des classes `pref-hide-*` sur `#page-putting` (elles survivent au HTML régénéré par `renderPuttingTab`), règles en fin de `putting.css` ; les cartes de Performance portent `data-perf-card`. La période par défaut (`defaultSessions`) est lue au chargement et copiée dans les trois `filterState`.
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

| Clé | Écrite par | Contenu |
|---|---|---|
| `golfSession` | `auth.js` | e-mail et date de session |
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

### Anomalies relevées (audit des unités et réglages, 14/10/2026)

- **Unité de distance en double.** Menu stocke `settings.distanceUnit` (`golfAppState`, `"m"` ou `"ft"` = yards) et Parcours a son propre `parcoursSettings.distanceUnit` (`parcours-settings`, `"m"` ou `"yd"`). Les deux ne sont pas synchronisés. Putting, Wedging et Stats n'en lisent aucun : leurs distances restent en mètres.
- **Réglages enregistrés mais jamais lus.** `temperatureC`, `altitudeM`, `speedUnit`, `radarUnit` et les radars (`golfAppState`) ne sont utilisés par aucun autre module que Menu. Le calculateur de vent de Parcours est en km/h en dur.
- **Menu : température (°C), altitude (m), longueur (cm) et poids (g) du driver** n'ont pas d'unité alternative (°F, ft, in, oz).
- **Stats et Accueil sans menu 3 points** : le header de Stats n'a pas de bouton, l'Accueil non plus. Les menus de Putting, Wedging, Parcours et Gym existent (voir plus haut).
- **Menus 3 points non testés sur appareil** : le code a été vérifié par des tests automatiques (bottom sheet, conversions kg/lb, paliers, ordre des outils) mais pas dans un navigateur ; l'effet du texte plus grand et du contraste renforcé de Parcours (marques du Fairway et du Green) est à contrôler sur téléphone.
- **Putting : une saisie de "Nouveau parcours" interrompue n'a pas de reprise.** Quitter l'écran efface le formulaire (`closeNewParcoursModal`) ; seuls les exercices (créés ou rapides) peuvent être repris.
- **Parcours : deux réglages d'unité encore stockés** (`parcours-settings` et `parcours-fairway-unit`) : le menu 3 points les règle ensemble, mais ils restent deux clés, et Menu garde son propre réglage (voir plus haut).
- **Formats figés** : dates en `fr-FR` en dur (Putting, Stats), objectif hebdomadaire de Putting fixé dans le code (`GOLF_WEEKLY_GOAL = 5`).

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

### Autres personnalisations envisagées

- **Unités** : une seule unité de distance partagée par tous les modules (Parcours en a déjà une pour ses schémas et ses calculs ; Putting, Wedging et Stats restent en mètres), vent suivant `speedUnit`, °F, ft, in et oz pour température, altitude et driver.
- **Objectif hebdomadaire** réglable depuis l'Accueil.
- **Index cible** (scratch, 10, 20) comme référence Strokes Gained.
- **Gaucher ou droitier**, pour les schémas Fairway et Green.
- **Écran toujours allumé** pendant une partie ou une séance.
- **Retours haptiques et sonores** réglables (aujourd'hui seule la fin de repos de Gym vibre et sonne).
- **Parcours favoris** pour la saisie de partie, au lieu de la recherche par géolocalisation à chaque fois.
- **Export CSV** par module, en plus de l'export JSON global.
- **Préréglages de layout** (Compétiteur, Entraînement, Minimal) à appliquer en un tap.
