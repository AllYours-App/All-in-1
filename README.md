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
Chart.js 4.5.0 (`chart.umd.min.js`, à la racine du dépôt)
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

Les CSS sont chargés dans l'ordre `base`, `commun`, `HomePage`, `parcours-ui`, `wedging`, `gym`, `putting`, `vitesse`, `stats`, `menu`, `auth`. Tous les CSS et JS locaux portent le même paramètre de version dans `index.html` (`?v=36`), à incrémenter partout à chaque déploiement qui modifie un fichier (remplacer `?v=36` par le numéro suivant dans toutes les balises).

### Dépendances externes

- Chart.js 4.5.0, hébergé à la racine du dépôt (`chart.umd.min.js`, graphiques de `stats.js`) : plus aucun CDN tiers.
- API publique `https://api.flyawaygolf.com/v2` : recherche de golfs par géolocalisation et profil de golf, appelée uniquement depuis `stats.js` (popup "Nouveau parcours"). Elle reçoit la position de l'appareil : elle est citée dans la politique de confidentialité, comme Supabase et l'hébergeur.

### Règles de cloisonnement entre modules

Tous les modules vivent dans le même document et le même scope global. Pour qu'un module n'agisse jamais dans une page qui n'est pas la sienne :

- **Sélecteurs limités à la page.** Un `document.querySelector(...)` ou `querySelectorAll(...)` sur une classe ou un attribut générique (`data-header`, `.bottom-nav`, `.screen`, `.sheet`...) est préfixé par l'id de la page du module (`#page-putting ...`). `putting.js` le fait via `puttingQuery` / `puttingQueryAll`. Les seules requêtes qui visent volontairement une autre page sont celles de `renderGolfHome()` (`putting.js`), qui écrit dans `#page-home`.
- **Écouteurs globaux gardés.** Un écouteur posé sur `window` ou `document` (`hashchange`, `popstate`, `error`, `resize`, `click`, `keydown`) commence par vérifier que la page du module est affichée (`#page-xxx.active`) ou que la cible est dans la page. Cas particulier : `location.hash` est partagé entre Wedging (routeur) et Gym (`pushState`), aucun des deux ne doit réagir quand l'autre est affiché.
- **Attributs et ids uniques.** Pas de `data-xxx` ni d'`id` identique dans deux modules (`data-header` de Vitesse s'appelle `vitesse`, celui de Putting `main`).
- **État sur `body`.** Une classe ou un style posé sur `body` (`no-scroll`, `gym-home-locked`, `gym-view-fit`, `is-stats-screen`, `overflow`) est retiré par le module qui l'a posé quand il est quitté. Stats passe par un verrou partagé (`lockScroll` / `unlockScroll`) qui restitue la valeur d'origine.

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

`appConfirm(message, { confirmLabel, cancelLabel, danger })`, `appAlert(message)` et `appPrompt(label, valeurInitiale, { multiline })` : popups de l'appli qui remplacent `confirm()`, `alert()` et `prompt()` natifs. Elles renvoient une Promise (`true` / `false`, rien, texte / `null`) : à attendre avec `await` dans une fonction `async`. Le message passe par `textContent` (aucun HTML interprété). Échap et un appui sur le fond annulent. Styles `.app-dialog_*` dans `commun.css` (z-index 9000). Plus aucun dialogue natif dans le code.

`appEscapeHtml(valeur)` : échappe `& < > " '` ; à utiliser pour tout texte saisi par la personne avant de l'injecter dans un gabarit HTML (y compris dans un attribut `value="..."` ou un `<textarea>`). `appSafeSetItem(clé, valeur)` : écrit dans le `localStorage` et renvoie `true` ou `false` ; en cas d'échec (stockage plein ou indisponible), elle affiche une alerte à l'écran (au plus une toutes les 8 secondes) au lieu d'ignorer l'erreur. Les modules l'utilisent à la place des `try { localStorage.setItem(...) } catch {}` : `gym.js`, `putting.js`, `wedging.js` (`WedgeStorage`) et `parcours-ui.js` (Fairway, Green, captures). `menu.js` (`saveMenuState`) y passe désormais. `stats.js` y passe aussi (`persistRounds`, indicateurs, brouillon) et utilise `appEscapeHtml` : son ancien helper `esc` est supprimé.

### `base.css`, `commun.css`
`base.css` : reset, tokens `:root` (dont les couleurs `--wg-*` partagées par tous les modules), règles globales. `commun.css` : composants partagés (`.app-keypad`, `.app-keypad-value`, en-têtes de page, etc.).

**Marges des pages (modèle : Putting).** Deux variables dans `base.css` : `--app-padding-x` (20 px, 16 px sous 360 px) pour la marge horizontale, et `--app-page-top` (56 px + safe-area + 16 px) pour le début du contenu sous le header fixe. Toute nouvelle page ou tout nouveau bloc de page les utilise, sans valeur en dur. Exceptions volontaires : les écrans de Gym et de Parcours verrouillés à la hauteur de l'écran (accueil Gym, création de programme, accueil Parcours) gardent un décalage vertical plus serré. `.screen` de `parcours-ui.css` est limité à `#page-parcours` (via `:where()`, spécificité inchangée) : il s'appliquait aussi à Stats et doublait sa marge.

### `chart.umd.min.js`
Chart.js 4.5.0 (licence MIT) : copie du fichier officiel `chart.umd.min.js` publié sur npm, chargée par `index.html` avec `?v=36`. Pour changer de version, remplacer ce fichier par celui de la nouvelle version (`npm pack chart.js@X.Y.Z`, dossier `dist/`).

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
Sauvegarde : `savePuttingState()` / `loadPuttingState()`. `importPuttingRoundFromStats(data)` (exposée sur `window`) crée une partie `source: 'stats'` à partir d'une partie saisie en détaillé dans `stats.js` ; elle est dédoublonnée par `statsKey`. `removePuttingRoundFromStats(statsKey)` (exposée sur `window`) la retire quand la partie est supprimée dans Stats.

### `wedging.js` / `wedging.css`
SPA autonome (7 sections : constantes, `WedgeStorage`, `Analytics`, `UI`, état `Wedge`, vues, routeur). Journal Parcours (cases par distance de 30 à 110 m compris, zones de dispersion à 9 directions), exercices créatifs, analyses de dispersion, de distance et de SG. Possède son propre routeur par hash (`#parcours`, `#exercices`, `#sg-analysis`...) rendu dans `#app`. Le routeur n'agit que si `#page-wedging` est affichée : `hashchange` est ignoré sinon, `body` et le scroll ne sont touchés que dans ce cas, et un hash étranger (Gym écrit aussi dans `location.hash`) laisse Wedging sur sa dernière route (variable `current`) au lieu de le renvoyer sur Parcours. Le toast "Erreur JS" ne répond qu'aux erreurs levées par `wedging.js` pendant que Wedging est affiché. Calcule son SG avec `sgExpected('rough' | 'green', m)` de `strokes-gained.js`.
Les limites d'un coup de wedge sont les constantes `WEDGE_MIN_DISTANCE` (30 m, comprise) et `WEDGE_MAX_DISTANCE` (110 m, comprise) : elles construisent `WEDGE_BUCKETS` (16 paliers de 30-34m à 105-110m, le dernier prenant la limite haute, libellés par `wedgeBucketLabel`) et les chips de distance des exercices (de 30 à 110 m, par 5 m), et `stats.js` les lit pour classer ses coups. `normalizeWedgeRounds` range dans le dernier palier les coups enregistrés avec l'ancien palier "110m". `importWedgeShotsFromStats(list)` (exposée sur `window`) ajoute au Journal les coups venant de Stats (`source: 'stats'`, dédoublonnés par `statsKey`). `removeWedgeShotsFromStats(idPartie)` (exposée sur `window`) retire les coups dont le `statsKey` commence par `idPartie:` quand la partie est supprimée dans Stats.

### `gym.js` / `gym.css`
Le plus gros fichier (6149 lignes). Injecte tout son HTML dans `#app-root-gym`, puis : bibliothèque d'icônes (`ICONS`, silhouette partagée `GYM_BODY` pour les zones du corps), données mockées (`GYM_DATA`), routeur interne, générateurs de composants et vues (Accueil, Programmes, Détail programme, Créer programme, Créer séance, Exercices, Séance active, Progression, Historique, Récap, Objectifs). Pavé numérique propre au module. Son écouteur `popstate` ne réagit que si `#page-gym` est affichée. `gymToday()` renvoie la date du jour à chaque appel (`GYM_DATA.today` est un accesseur). La séance active enregistre un brouillon dans `gym-session-draft` (séries saisies, exercice affiché, temps écoulé) à chaque changement ; il est repris à la réouverture de la même séance, effacé à la fin de la séance et ignoré au-delà de 12 h. Les textes saisis (noms de programmes, objectifs, descriptions) passent par `appEscapeHtml`.

### `stats.js` / `stats.css`
IIFE unique. Composants (sparkline, KPI, filtres, graphiques Chart.js), écrans Dashboard / Par club / Par distance / Statistiques (Multi, Traditionnel, SG), saisie de parties (rapide trou par trou, ou détaillée coup par coup), calcul de toutes les stats à partir des parties enregistrées. Navigation interne via `data-goto`, exposée par `window.showStatsScreen`. Se rafraîchit au retour sur la page via un `MutationObserver`.
À la fin d'une partie, `saveFinishedRound` appelle `syncRoundToModules` : pour une partie saisie en détaillé, les coups à faire entre `WEDGE_MIN_DISTANCE` et `WEDGE_MAX_DISTANCE` m (compris) vont dans le Journal Wedging, et les premiers putts forment un parcours Putting. Sont ignorés : coups avec pénalité, sans zone d'arrivée exploitable (ou arrivée "Centre" sans secteur), trous rentrés sans putt. Un échec de synchro n'empêche jamais l'enregistrement dans Stats. Un coup est classé "wedging" dans Stats de `WEDGE_MIN_DISTANCE` (30 m) à `WEDGE_MAX_DISTANCE` compris : même plage que le Journal Wedging, sans trou entre les deux. Les coups de 30 à 50 m des parties saisies avant ce changement ne sont pas rétro-importés.
Brouillon de la partie en cours (`golfStatsRoundDraft`, ignoré au-delà de 24 h) : les deux saisies l'écrivent à chaque changement (`persistDraft`, seulement si quelque chose est saisi), `saveFinishedRound` l'efface quand la partie est bien enregistrée. Le dashboard affiche la carte "Partie en cours" (`#dash-resume`, `renderResumeCard`) avec "Reprendre" (`resumeDraft` puis `restore()` de la saisie) et "Abandonner". Lancer une nouvelle partie avec un brouillon demande confirmation. Le bouton "Terminer" de l'en-tête des saisies (`[data-finish-round]`) enregistre les trous jusqu'au dernier score saisi (saisie rapide) ou dernier trou rentré (saisie détaillée), les trous suivants sont écartés ; `holeCount` vaut alors le nombre de trous joués. L'historique propose une corbeille par partie (`deleteSavedRound`) : elle retire aussi les copies dans Putting et Wedging. Score brut : seules les parties de 18 trous alimentent meilleur, pire et moyenne (`grossRounds`), l'écart au par est ramené à 18 trous (`vsPar18`). Fairways : un trou compte sur un par 4 ou 5 (`fairwayApplies`) ; par inconnu, seulement si un fairway a été saisi.
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
| `gym-session-draft` | `gym.js` | brouillon de la séance en cours (séries, exercice affiché, temps écoulé), effacé à la fin de la séance |
| `golfStatsRounds` | `stats.js` | parties saisies dans Stats |
| `golfStatsKpis` | `stats.js` | clés des indicateurs affichés dans "Mes indicateurs" (ordre d'affichage) |
| `golfStatsRoundDraft` | `stats.js` | partie en cours (saisie rapide ou détaillée), effacée à l'enregistrement, ignorée après 24 h |

## Suivi des bugs

Les bugs en cours, les tests à faire sur téléphone, les décisions attendues et l'historique des corrections ne sont plus dans ce fichier : ils sont dans `Suivi-des-bugs.docx` (statuts en couleur, répartition entre Claude et le propriétaire). Ce README décrit uniquement l'application et son code.
