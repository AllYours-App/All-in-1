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
- **État sur `body`.** Une classe ou un style posé sur `body` (`no-scroll`, `gym-home-locked`, `gym-view-fit`, `is-stats-screen`, `overflow`) est retiré par le module qui l'a posé quand il est quitté. Voir le point 38 pour ce qui reste à faire (Gym et Parcours) ; Stats passe par un verrou partagé (`lockScroll` / `unlockScroll`) qui restitue la valeur d'origine.

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

État au **9 octobre 2026**, à partir du commit `f385d2b` du dépôt. Les corrections de Stats (29 à 33, 19, 20, 24, 37, 52, 64, 11) sont livrées avec `index.html` en `?v=35` (passé à `?v=36` pour `HomePage.css`) (voir "Bugs résolus > Stats"). Vérifiées par simulation (jsdom, hors dépôt). Les numéros de ligne de Stats ont été retirés des points restants : ils bougent à chaque modification. Aucun test sur un vrai téléphone.

Légende : **T** = à vérifier sur téléphone ; **D** = décision du propriétaire avant toute modification. Les numéros de points sont stables : les anciens renvois (« point 20 », « point 53 »...) restent valables.

### Bugs restants (par fichier)

#### `stats.js`
- **31 (reste). Pas de modification d'une partie enregistrée.** La suppression existe (corbeille de l'historique), mais corriger un score ou un trou mal saisi oblige encore à supprimer puis ressaisir la partie. À décider : écran de modification ou non.
- **2 et 3. Architecture des parties (D).** `stats.js` ne lit que `golfStatsRounds` et le sac de `menu.js` : un coup supprimé dans Wedging ou Putting reste dans Stats, et les parties saisies avant la passerelle ne sont pas rétro-importées (idem coups Wedging de 30 à 50 m). Deux saisies "Nouveau parcours" distinctes (`putting.js` / `putting_rounds` et `stats.js` / `golfStatsRounds`).
- **4. Couplage par `typeof`** sur `golfBag`, `golfClubCatalog`, `personalDistances` (`menu.js`) : casse silencieusement si une variable est renommée.

#### `stats.css`
- **60. Zones d'appui de 30 px** dans la saisie détaillée (`.saisie-detaillee_field`, `_lie`, `_group`, `_shot-button`) : mise en page verrouillée sans défilement, **D** de design.

#### `auth.js` et écrans de connexion (`index.html`)
- **17. Boutons sans action.** `data-auth-provider="apple"` et `"google"` (4 boutons dans `index.html`, connexion et inscription) n'ont aucun gestionnaire dans `auth.js`. "Mot de passe oublié" (`data-auth-goto="forgot-password"`) vise une page qui n'existe pas. Rien ne s'affiche au clic. À brancher avec Supabase Auth, ou à retirer. **D**.
- **1. Authentification factice (D).** Tout e-mail valide et tout mot de passe de 8 caractères ou plus ouvre une session (`TODO`, `auth.js` l. 163). Aucune donnée n'est liée à un compte : deux utilisateurs du même navigateur partagent tout.
- **9. Session forgeable (D).** `golfSession` n'est qu'un drapeau dans le `localStorage` : n'importe qui peut l'écrire depuis la console. Dépend de Supabase (Auth et RLS).

#### `index.html`
- **23. Zones de bord inactives (T).** Le script inline (l. 1045) fait `preventDefault()` sur tout `touchstart` à moins de 16 px des bords gauche et droit (`passive: false`) : un slider, une touche du pavé ou un doigt de zoom du Fairway qui démarre là est ignoré. À tester : slider de distance, pavé numérique, zoom du Fairway.
- **25. Zoom bloqué (D).** l. 5 : `maximum-scale=1, user-scalable=no` ; l. 1049 : `gesturestart` bloqué. Problème d'accessibilité : ne garder le blocage du pincement que sur le Fairway.

#### `gym.js`
- **42. Dix boutons d'en-tête sans action** : `.gym-header__action` "Options" / "Réglages" (l. 18, 173, 205, 234, 329, 427, 565, 618, 659, 703). **D** : câbler ou retirer.
- **40. Sélecteurs non préfixés par page** : `.gym-view`, `.sheet.is-open`, `.sheet-overlay.is-open` et ids génériques (`sheet-overlay`, `sheet-close`, `keypad-sheet-close`...). Aucune collision aujourd'hui.
- **38. Verrous de scroll** `gym-home-locked` / `gym-view-fit` posés par `gym.js`, retirés par `app-shell.js` : un module qui verrouille le scroll doit se retirer lui-même en quittant sa page.
- **66. Reprise de séance automatique (D, design).** Le brouillon est repris sans demander ; seul le délai de 12 h ou la fin de séance l'efface. Ajouter "Reprendre / Recommencer" si ce comportement gêne.
- **7. Taille** : 6149 lignes, 413 Ko, chargé au démarrage.

#### `gym.css`
- **54.** Plus aucun texte sous 11 px. **T** : étiquettes plus larges.

#### `putting.js`
- **41. Deux boutons "⋯" sans action** (l. 17, `#headerRightBtn`, et l. 26). **D**.
- **5. Noms globaux génériques** : `root`. `id="headerRightBtn"` aussi présent dans `wedging.js`, sans effet.
- **7. Taille** : 3739 lignes, 175 Ko.

#### `wedging.js`
- **40. Sélecteurs non préfixés** : `#app`, `.wg-toast`.
- **5. Noms globaux génériques** : `Analytics`, `Router`, `UI`, `Views`.

#### `wedging.css`
- **54. Trois textes SVG sous 11 px** : `.wg-radar-label-name` (8,5), `.wg-radar-value` (9,5), `.wg-chart-axis-text` (9). Leur taille réelle dépend du `viewBox` du graphique : à régler en regardant le rendu. **T**.

#### `menu.js`
- **8. Textes légaux non publiables en l'état (D).** Ils décrivent la cible (comptes et données sur Supabase) alors que le code est local ; champs `[À COMPLÉTER : ...]` de `MENU_LEGAL` (voir "Mise en ligne et conformité") ; relecture par un juriste. `deleteMenuData()` ne supprime rien côté serveur (`TODO Supabase`, l. 1047).
- **5 et 40.** `backBtn`, `headerTitle`, `STORAGE_KEY` ; sélecteurs `#backBtn`, `#headerTitle`, `.nav_back-label`.

#### `parcours-ui.js`
- **38. `no-scroll`** posé par un `MutationObserver` et retiré par `showPage` : propriétaire unique à définir.
- **20.** Les unités (l. 42 et 69) restent volontairement silencieuses.

#### `parcours-ui.css`
- **54. Quatre textes sous 11 px** : `.fw-mark` et `.gr-mark` (10 px), `.fw-ruler-label` et `.gr-ring-label` (9 px). Étiquettes posées sur la carte, dimensionnées par la géométrie des repères : à agrandir en regardant le rendu. **T**.
- **60. Zone d'appui sous 44 px** : `.mode-btn` (boutons ronds + / − / renumérotation, côte à côte : agrandir la zone les ferait se chevaucher). **T**.

#### `base.css`, `commun.css`, `HomePage.css`
- **`base.css` 35.** Inter chargée par `@import` depuis Google Fonts (l. 1) : adresse IP transmise à Google (non citée dans la politique de confidentialité), affichage bloqué tant que la feuille n'est pas téléchargée, échec hors connexion. À héberger en `woff2` avec `@font-face` (impossible depuis l'environnement de correction : domaines bloqués) ou à retirer. Inter n'est lue que par Gym (`--gym-font`).

#### `images/` et dépôt
- **26. Poids du dépôt (D).** `images/` contient encore 28 PNG inutilisés, les orphelines `FondEcranBoutonDenivele`, `FondEcranBoutonDistance`, `FondEcranBoutonVent`, `popupareprendre` (`.png` et `.webp`) et `ProgrammeForce.png`. À supprimer du dépôt.
- **7. Poids des fichiers chargés au démarrage** : `stats.js` 4112 lignes (210 Ko), `gym.css` 68 Ko, `stats.css` 89 Ko, `putting.css` 52 Ko, y compris pour les parties jamais ouvertes.
- **67. Chart.js** : `index.html` doit pointer vers l'emplacement réel de `chart.umd.min.js` (racine, vérifié). Un fichier mal placé ne se voit qu'en ouvrant un graphique de Stats.
- **Dépôt par erreur.** Un fichier déposé à la place d'un autre ne se voit qu'à l'écran de la page concernée (cas `commun.css`, voir "Bugs résolus"). Comparer la taille des fichiers modifiés avant chaque commit.

#### Transverse
- **10. Données uniquement locales (D).** Vider le cache, changer de téléphone ou désinstaller efface tout. Limite d'environ 5 Mo par domaine : `gym-history`, `putting_sessions` et `golfStatsRounds` grossissent à chaque séance.
- **12. Pas de service worker (D).** `manifest.webmanifest` existe, pas le service worker : l'appli ne se charge pas sans réseau.
- **13. Aucun outillage (D).** Pas de `package.json`, de lint, de tests ni de build ; `?v=36` à changer à la main dans 25 balises. Recommandé : ESLint (`no-undef`, `no-redeclare`, `no-unused-vars`), puis Vite.
- **50. Registre mélangé (D).** Vouvoiement ("Vos objectifs", "Développez votre") et tutoiement ("Configure ta séance", "t'affiner") dans la même appli, parfois le même écran.
- **11. Aucun suivi d'erreurs en production** : ajouter un outil du type Sentry avant la mise en ligne publique, et le déclarer dans la politique de confidentialité.

### À vérifier sur téléphone (T)
Corrigés dans le code, jamais testés sur un vrai appareil :

- **Parcours / accueil** : ouverture de Parcours et verrou de défilement (6), panneau d'accueil (15), en-têtes qui ne glissent plus (45), écran "Remets ton téléphone en mode portrait" en mode installé. Boutons orbitaux de l'accueil (104 px) : icône, titre, sous-titre et chevron dans le cercle pour les six boutons, aucun chevauchement entre le bouton central Parcours et les cinq autres, titre et sous-titre de l'en-tête non recouverts par Putting.
- **Gym** : recharger l'appli en pleine séance (36), lien "Voir tous" des objectifs (43), bottom sheets avec safe-area sur iPhone (49), étiquettes plus larges (54).
- **Wedging** : toast dans la modale de création d'exercice (44), boutons modifier / dupliquer / supprimer, aucun style disparu après la suppression de 82 règles (51).
- **Menu** : en-tête en mode installé avec encoche (55), boutons Valider / Enregistrer / Envoyer au support (57), pavé numérique.
- **Popups de l'appli (point 27)** : les 15 anciens dialogues natifs ont été remplacés. Supprimer un exercice, une séance, un programme ; quitter une séance Putting sans enregistrer ; réduire le nombre de trous d'un parcours ; terminer une séance Gym avec des séries non validées ; changer de programme Gym en cours ; effacer le Fairway ou le Green ; modifier Lieu, Vitesse du green et Notes d'une séance Putting. Vérifier : popup centrée et lisible, au-dessus de la modale ouverte, Échap / appui sur le fond = annuler, clavier qui n'écrase pas la popup de saisie.
- **Corrections de la version 33** : champs Wedging à 16 px sans zoom iOS (53) ; textes passés à 11 px (accueil, barre du bas de Wedging, jauges et barres SG de Wedging, pastilles "Hors green" / unité / Skip de Parcours) : aucun débordement ni retour à la ligne ; zones d'appui de 44 px sur la croix et le bouton ± du pavé du Menu, sur le bouton "i" des actions rapides et sur le bouton de remise à zéro de Parcours (60) : pas de tap pris à un bouton voisin.
- **Stats et Putting** : cartes Stats et lignes d'historique Putting sans bordure ni `scale(0.99)` hérités de Parcours, champs à 16 px sans zoom iOS (53), zones d'appui de 44 px (59, 60). Bouton rond "Nouveau parcours" du dashboard Stats (80 px, libellé à 11 px) : "PARCOURS" doit rester dans le cercle et le bouton ne doit pas masquer le dernier bloc.

### Décisions du propriétaire avant modification
1 et 9 (authentification et session), 2 et 3 (une seule saisie de parties, un seul stockage), 7 et 26 (poids, PNG), 8 (textes légaux), 10 (sauvegarde des données), 12 (service worker), 13 (outillage et `?v=36`), 17, 41 et 42 (câbler ou retirer les boutons morts), 25 (zoom), 50 (tutoiement ou vouvoiement), 60 (saisie détaillée de Stats), 66 (reprise de séance Gym).

### Ordre de correction conseillé
1. Décision sur les boutons morts, puis une correction par fichier (`auth.js`, `putting.js`, `gym.js`).
2. CSS : 54 (textes SVG de Wedging, étiquettes de carte de Parcours, `.fab` de `commun.css`) et 60 (`.mode-btn`) en regardant le rendu.
3. Décisions 2 et 3 (une seule saisie de parties) et 31 (modification d'une partie), puis 4 (couplage par `typeof`).

### Bugs résolus (par module)

Points résolus : 6, 11 (appel API de Stats), 14, 15, 16, 18, 19, 20, 21, 22, 24, 27, 29, 30, 32, 33, 34, 36, 37, 39, 43, 44, 45, 46, 47, 48, 49, 51, 52, 53, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65. Partiellement résolus (le reste est dans "Bugs restants") : 31 (suppression faite, modification non), 35, 38, 50, 54, 60.

#### Navigation et cloisonnement entre modules

- **Wedging : le routeur agissait sur toute l'appli (points 21 et 22).** `hashchange` re-rendait Wedging même masqué et retirait `no-scroll`, `gym-home-locked` et `gym-view-fit` de `body` : un Retour/Avant du navigateur dans Gym faisait sauter le verrou de scroll de l'accueil Gym, et un import depuis Stats retirait `no-scroll` pendant Parcours. Le routeur ne touche plus à `body` ni au scroll hors de sa page. Un hash étranger ne le renvoie plus sur Parcours : un `rerender()` reste sur la vue en cours. Le toast "Erreur JS" apparaissait pour n'importe quelle erreur de n'importe quel module ; il ne répond plus qu'à `wedging.js`, Wedging affiché.
- **Gym : `popstate` actif hors de Gym.** Un retour navigateur pendant un autre module re-rendait l'accueil Gym (via `gymRenderHomeNextSession`, qui peut faire avancer et sauvegarder un programme terminé) et faisait défiler la page. Il est ignoré si Gym n'est pas affiché.
- **Putting et Vitesse : `data-header="main"` en double.** Putting cherchait son en-tête avec `document.querySelector` : après avoir ouvert Vitesse, il tombait sur l'en-tête de Vitesse et son propre en-tête ne se masquait plus. L'attribut de Vitesse devient `vitesse`, et toutes les requêtes de Putting (environ 70 sites d'appel) sont limitées à `#page-putting`.
- **Putting : `is-stats-screen` resté sur `body`.** Quitter Putting depuis son écran Stats laissait ce drapeau, lu ensuite comme "on vient de Stats" au lancement d'un exercice. `renderPuttingTab()` le retire.
- **Accueil : requêtes limitées à `#page-home`** (`HomePage.js` et `renderGolfHome()` de `putting.js`).
- Vérifié en simulation (jsdom, hors dépôt) : routeur Wedging avec hash étranger, Retour/Avant dans Gym, ouverture de Vitesse puis de Putting, exercice, nouveau parcours et retour depuis l'écran Stats de Putting, import Stats vers Wedging pendant Parcours. Pas de test sur téléphone.

#### `index.html`, accueil, Menu, Chart.js
- **Écran "Remets ton téléphone en mode portrait" affiché partout.** `.orientation-lock_component` (`index.html`) n'avait aucune règle CSS : il s'affichait en clair sur toutes les pages. Règles ajoutées à la fin de `base.css` : masqué par défaut, visible seulement en mode installé (`display-mode: standalone`), en paysage et sur une hauteur de téléphone (500 px max). `index.html` référençait aussi `manifest.webmanifest`, absent du dépôt : ajouté, avec `"orientation": "portrait"` (verrouille la rotation sur Android à l'installation ; iOS ignore ce réglage et l'écran de secours prend le relais).
- **`index.html`, `HomePage.js`, `HomePage.css`, `menu.js`, `chart.umd.min.js` (points 6, 14, 15, 39, 53, 56).** Chart.js hébergé à la racine (`chart.umd.min.js`) (le paragraphe cdnjs de la politique de confidentialité de `menu.js` est retiré) ; panneau de l'accueil réduit à ses deux colonnes vivantes (grille à 2 colonnes, valeurs de départ neutres 0/5, 0 séance, "--") et `renderGolfStats` / `setStat` / `setProgressRing` supprimés de `HomePage.js` ; écran `home` de Parcours actif ; écrans `distances` et `add-shot` retirés ; balises iOS et `theme-color` ; champ de recherche de l'historique à 16 px.
- **Chart.js introuvable (graphiques de Stats vides).** `index.html` chargeait `vendor/chart.umd.min.js`, mais le fichier a été déposé à la racine du dépôt : la requête échouait (404) et aucun graphique de Stats ne se dessinait (le code teste `typeof Chart`, donc sans message d'erreur). `index.html` charge maintenant `chart.umd.min.js` (racine), et le paramètre de version passe à `?v=34` dans les 25 balises. Si le fichier est un jour déplacé dans `vendor/`, remettre l'ancien chemin dans `index.html`.

#### HomePage
- **Accueil : icône et chevron des boutons hors du cercle.** Les boutons orbitaux faisaient 85 px (contenu utile de 61 px) pour une icône, un titre, un sous-titre à 11 px sur 2 à 3 lignes et un chevron (environ 80 à 95 px) : le contenu débordait du cercle, surtout pour Parcours, Gym et Wedging dont le sous-titre passe sur 3 lignes. Diamètre porté à `min(104px, 28cqw)` (variable `--orbit-size`), marge interne 8 px, sous-titre limité à `--orbit-size - 20px`, icône et chevron non compressibles. Estimé par calcul (largeur du texte avec une police proche de la police réelle) ; aucun rendu vu, car il n'y a pas de navigateur dans l'environnement : voir "À vérifier sur téléphone".

#### Stats
- **Stats : partie en cours jamais sauvegardée (29).** Brouillon écrit à chaque changement par les deux saisies, carte "Partie en cours" sur le dashboard (Reprendre / Abandonner), confirmation avant de remplacer une partie en cours. Vérifié en simulation (jsdom, hors dépôt) : saisie rapide et détaillée, rechargement complet, reprise avec putts, fairway et trou courant conservés, abandon, brouillon effacé à l'enregistrement.
- **Stats : impossible de terminer une partie incomplète (30).** Bouton "Terminer" dans l'en-tête des deux saisies : alerte si aucun trou n'est saisi, sinon confirmation puis enregistrement des trous joués (`holeCount` = trous joués). Vérifié en simulation : partie arrêtée au trou 1 enregistrée avec 1 trou, brouillon effacé.
- **Stats : aucune suppression d'une partie enregistrée (31, suppression).** Corbeille par ligne de l'historique, avec confirmation. Retire la partie de `golfStatsRounds`, de `putting_rounds` (`statsKey` = identifiant) et de `wedgingShots` (`statsKey` commençant par `identifiant:`), via `removePuttingRoundFromStats` et `removeWedgeShotsFromStats`. Vérifié en simulation : seules les copies de la partie supprimée disparaissent.
- **Stats : score brut mélangeant 9 et 18 trous (32).** Meilleur, pire et moyenne du brut ne portent que sur les parties de 18 trous ; l'écart au par moyen est ramené à 18 trous. Vérifié en simulation : une partie de 36 sur 9 trous n'est plus le "meilleur score".
- **Stats : fairways, trous sans par (33).** Dénominateur du FIR des listes et des encadrés en direct : par 4 et 5 seulement ; par inconnu, le trou compte si un fairway a été saisi (écart volontaire avec la correction proposée, qui aurait ignoré les fairways saisis sur un parcours entré à la main). Vérifié en simulation : 3 fairways saisis sur par inconnu = 100 %.
- **Stats : nettoyage (19, 20, 24, 52, 64, 37, 38, 11).** `esc` remplacé par `appEscapeHtml` ; `persistRounds` et `persistKpiKeys` passent par `appSafeSetItem` ; variables mortes et `createSparkline` supprimées ; classes `filter-chip-wrap` et `insights_chart` retirées ; jeton `--shadow-card-hover` retiré ; `scroll-behavior: smooth` supprimé de `stats.css` ; texte à 10 px de `.analyse-filter_label` passé à 11 px ; popups "Nouveau parcours" et "Indicateurs" : verrou de défilement partagé, libéré aussi quand on quitte la page Stats ; API de golfs avec délai de 10 s (les états de chargement et d'échec existaient déjà) ; distance restante bornée à 3 chiffres avant la virgule (999,9 m max) ; libellé du bouton rond "Nouveau parcours" à 11 px (`#page-stats .fab` dans `stats.css`, rond de 80 px au lieu de 64 px).
- **Stats : "Mes indicateurs" modifiable.** Bouton "Modifier" ouvrant un popup avec 35 indicateurs classés par groupe (Score, Driving, Approche, Petit jeu, Putting, Strokes gained), dont "Tentatives de birdie à 7 m" et "à 3 m". Sélection libre, enregistrée dans `golfStatsKpis`. Valeurs par défaut inchangées.
- **Stats : accueil réorganisé.** Carte SG en deux colonnes avec barres de progression par catégorie, section "Mes indicateurs" (pastille à gauche, valeur à droite), "Analyser mon jeu" en liste de cartes pleine largeur avec description (la bulle "i" est supprimée), "Mes parcours" en cartes individuelles avec lien "Voir tout". Titres de section avec icône SVG (`.section__title--icon`). Calculs et valeurs inchangés.
- **Stats : filtre "Lie" de l'aperçu (Multi) supprimé.** Il ne servait pas, et `computeOverview` n'a plus de paramètre `lie`. Les filtres Lie de "Par club" et "Par distance" restent : ils sont lus par `computeClubInsights` et `computeDistanceInsights`.
- **Stats : boutons "⋯" sans action.** Les huit en-têtes de la page Stats (dont "Performance putting") avaient un bouton rond sans aucun gestionnaire. Retirés de `index.html`, ainsi que leurs règles dans `commun.css` et `stats.css` (le titre reste centré : la grille de l'en-tête a trois colonnes).
- **Saisie détaillée : score total en coups au lieu de l'écart au par.** Il affiche maintenant +1, -2 ou E.
- **Strokes Gained : A.G. et APP. inversés** (saisie détaillée, tableau de bord, onglet SG des Statistiques). A.G. affichait les petits coups autour du green et APP. les longs coups. `sgGroup` (`stats.js`) corrigé : A.G. = attaque de green (longs coups), APP. = autour du green (moins de 30 m). La constante `AG_MAX` est supprimée au profit de `WEDGING_MIN`, son nom prêtait à confusion.
- **Encadré SG de la saisie détaillée** : il n'affichait que le SG du trou en cours. Il cumule maintenant tous les trous depuis le début de la partie, comme le SG total du haut.
- **Clavier natif dans Stats (saisie détaillée).** Les champs Distance restante et Pénalité ouvraient le clavier du téléphone. Ils ouvrent maintenant le pavé de l'appli (`appKeypad`), et `#page-stats` a été ajouté à la liste `:is(...)` du pavé dans `commun.css`.
- **Stats > Multi : valeurs non alignées.** Chaque tableau calculait sa propre largeur de colonne. Les lignes de résumé et les tableaux à 2 colonnes partagent maintenant `--multi-label-col` (60 %), dans `stats.css`.
- **Stats > Multi : faux boutons.** Le chevron après le titre et le menu "Toutes distances" n'avaient aucune action. Supprimés de `statBlockHeader` (`stats.js`) et de `stats.css`.
- **Stats > Multi : photo du fairway hors écran.** `min-height` + `aspect-ratio` donnaient à la grille `.field-map-layout` une largeur minimale supérieure à l'écran. Colonne `minmax(0, 1fr)` et `min-width: 0` sur les enfants.
- **Stats > Multi : termes anglais.** Approach → Attaque de green, Penalty → Pénalités, Eagle → Aigle, Up & Down / U&D → Sauvetages (balle rentrée en 2 coups depuis un green raté), S. Bunker → Bunker, Vs par → Écart au par, GIR → Greens en régulation. Les autres écrans de Stats gardent leurs libellés.
- **Stats > Multi : espaces vides.** Score : 5 tuiles en 3 + 2 (`.stat-block__metrics--5`). Green : pleine largeur au lieu d'une hauteur fixe de 240 px. Graphique de distance : masqué sans données, plus de points pour une tranche à 0 %, échelle ajustée.

#### Gym
- **Pavé numérique Gym disproportionné** (création de programme, objectifs, poids). L'icône Effacer est un SVG sans taille : elle s'étirait sur toute la touche. Fixé par une règle sur `#keypad-grid button svg` dans `gym.css`.
- **Clavier natif dans Gym (objectifs).** Le champ "Cible" du popup "Nouvel objectif" ouvre maintenant le pavé de Gym.
- **Gym : séance en cours perdue au rechargement (point 36), dates figées (point 34), lien "Voir tous" des objectifs (point 43), image Force (point 16).** La séance active enregistre son brouillon (`gym-session-draft`) et le reprend à la réouverture ; `gymToday()` remplace `GYM_TODAY` ; "Voir tous" fait défiler jusqu'à la grille sans toucher au hash ; les programmes Force chargent `ProgrammeForce-1.webp`. Vérifié en simulation (jsdom, hors dépôt) : séance ouverte, série validée, chrono lancé puis mis en pause, rechargement complet de la page, séance rouverte avec la série validée et le temps écoulé conservés. Pas de test sur téléphone.
- **Gym et Wedging : textes saisis injectés sans échappement (point 19).** Noms de programmes, d'exercices et d'objectifs, descriptions : `appEscapeHtml` (nouveau dans `commun.js`). Un nom contenant `"`, `<img ...>` ou `</textarea>` s'affiche tel quel au lieu de casser la page ou d'exécuter du code. Vérifié en simulation sur le détail d'un programme Gym et sur la liste d'exercices Wedging.

#### Dialogues natifs remplacés (point 27, version 34)
- **`confirm()`, `alert()`, `prompt()` remplacés par des popups de l'appli** (`appConfirm`, `appAlert`, `appPrompt` dans `commun.js`, styles dans `commun.css`) : 9 appels dans `putting.js` (suppression d'exercice et de séance, sortie de séance, réduction du nombre de trous en exercice rapide et en nouveau parcours, saisie de Lieu / Vitesse du green / Notes, deux messages de validation de formulaire), 4 dans `gym.js` (changement de programme en cours, suppression de programme et de séance, fin de séance avec séries non validées), 2 dans `parcours-ui.js` (remise à zéro Fairway et Green). Les fonctions concernées sont devenues `async` ; tous leurs appels viennent d'un `onclick` ou d'un écouteur, aucun ne dépend de leur valeur de retour (vérifié). Les boutons de confirmation destructive sont en rouge et libellés ("Supprimer", "Effacer"). Vérifié en simulation (jsdom, hors dépôt) : OK / annuler / Échap / appui sur le fond, HTML du message non interprété, saisie texte et multiligne, et trois flux réels (remise à zéro du Fairway, suppression d'un exercice Putting confirmée et annulée). Reste à tester sur téléphone (**T**).

#### Menu et Putting : helpers partagés (version 33)
- **Menu : écritures et échappement (points 19 et 20, en partie).** `saveMenuState` écrit par `appSafeSetItem` : stockage plein ou indisponible, une alerte s'affiche au lieu d'une erreur en console. `escapeHtml` de `menu.js` supprimé, ses 16 appels passent par `appEscapeHtml`. Vérifié en simulation (jsdom, hors dépôt) : écriture de `golfAppState`, alerte affichée quand `setItem` échoue, chargement des 8 pages sans erreur. Reste : `stats.js`.
- **Putting : `escHtml` supprimé (point 19, en partie).** Les 9 emplois (et les alias `esc` des gabarits) passent par `appEscapeHtml`, qui échappe aussi l'apostrophe.

#### Putting
- **Putting : `resumableSession` jamais déclarée (point 18).** Déclarée avec `let`. ESLint (`no-undef`, `no-redeclare`) sur les 13 scripts concaténés passe de 16 erreurs (toutes cette variable) à 0.

#### Wedging
- **Wedging : trou de 30 à 50 m et dernier palier.** Stats classait en wedging les coups à partir de 30 m, mais le Journal Wedging commençait à 50 m : les coups de 30 à 50 m n'allaient nulle part. Les paliers (boutons de saisie, filtres, graphes de dispersion, de distance et de SG) commencent maintenant à 30 m, comme les distances proposées pour les exercices (30 à 110 m). Le dernier palier affichait "105-109m" puis "110m" seul ; il devient "105-110m".
- Voir aussi, pour Wedging : routeur et `hashchange` (section "Navigation et cloisonnement"), échappement des textes (section "Gym"), `wedging.css` (section "CSS et design").

#### CSS et design
- **Icônes difformes ou sans rapport avec leur sens.** Revue complète des SVG : Gym (`ICONS` dans `gym.js` : muscle, running, tempo, sliders, legs, torso, abs, backMuscle, shoulders, arms, glutes, mobility, functional, equipment, layers). Les icônes de zones du corps partagent la silhouette `GYM_BODY` avec la zone travaillée en plein. Stats (`ICONS` et `LIE_ICON` dans `stats.js` : club, wedge, putter, bird, bag, bowl, arc, sliders, Fairway, Rough, Bunker). Accueil et Parcours (`index.html` : Wedging, Dénivelé, Historique, Bunker, Rough). Putting (`putting.js`, onglet Analyse distance). Les 9 boutons de fermeture `✕` de `parcours-ui.js` (caractère dépendant de la police) deviennent un SVG, dimensionné par `.icon-btn svg` dans `parcours-ui.css`. Convention : SVG inline 24×24, `stroke="currentColor"`, aucun emoji ni caractère Unicode comme icône.
- **Wedging : `wedging.css` (points 44, 59, 60, 61, 62, 51).** `.wg-toast` passe à `z-index: 300` (au-dessus de `.wg-modal-overlay` à 200) : les messages de validation de la modale de création d'exercice s'affichent. Les utilitaires `.mt-*` portent maintenant leur vraie valeur (`.mt-6` = 6 px, `.mt-8` = 8 px, scopés par `:where(#page-wedging)`) ; `.mt-8`, `.mt-10` et `.mt-12` de `wedging.js` ont été renommés en `mt-6` / `mt-8` sans changement d'affichage. `.wg-modal` a un repli `88dvh`. Les 7 règles `:hover` restantes sont dans `@media (hover:hover)`. Zones d'appui portées à 44 px (pseudo-élément `::after`) sur `.wg-exercise-actions button` (écart de 22 px entre boutons), `.wg-stepper-controls button` et `.wg-modal-close`. 82 règles CSS mortes supprimées (65 classes sans référence dans le JS ni le HTML, aucune construction dynamique de nom trouvée) et le `@keyframes wgFadeIn` devenu orphelin. À vérifier sur téléphone : toast dans la modale (44), appui sur les boutons modifier / dupliquer / supprimer (60), `Wedging` complet pour s'assurer qu'aucun style n'a disparu (51).
- **Petits CSS partagés (points 46, 48, 53, 65, 35 en partie).** `auth.css` : règles ajoutées pour `.auth_divider*`, `.auth_social` et `.auth_button.is-social` (séparateur « OU » et boutons Apple / Google, repris des jetons `--auth-*`). `vitesse.css` : marges via `--app-page-top` et `--app-padding-x`, media query supprimée. `commun.css` : champs `.field-list` du Menu et de Stats à 16 px (plus de zoom iOS au focus, à tester sur iPhone). `HomePage.css` : halo coloré des `.orbit-button` et variables `--glow` retirés. `base.css` : `@import` ne charge plus que Inter (Oswald et IBM Plex Mono n'étaient lues par aucune règle ; les variables `--font-display` et `--font-mono` de `putting.css:27-28` restent, sans effet).
- **Parcours et Menu : `parcours-ui.css` et `menu.css` (points 37, 45, 55, 57, 59, 61, 65, 51 en partie).** `menu.css` : règles `.btn` et `.btn-primary` écrites pour `#page-menu` (Valider du pavé, Enregistrer, Envoyer ne dépendent plus de Parcours), en-tête avec `env(safe-area-inset-top)`, 2 `:hover` dans `@media (hover: hover)`. `parcours-ui.css` : `.btn`, `.btn-primary`, `.icon-btn`, `.card`, `.stat-card`, `.history-item`, `.progress-*`, `.page-subtitle`, `.kpi-card`, `.screen-view`, `input[type="range"]` et les règles `body.no-scroll` sont limités à `#page-parcours` par `:where()` (spécificité inchangée). L'animation `fadeUp` de `.screen, .top-bar, .page-header` est limitée à Parcours et le doublon de `stats.css` est supprimé : Parcours garde l'animation complète, les autres pages n'animent pas leurs en-têtes. 7 `:hover` dans `@media (hover: hover)`, repli `88dvh` sur `.modal-sheet`, 4 `backdrop-filter` supprimés, 5 classes sans référence retirées (`btn-row`, `fw-hole-number`, `kpi-value`, `quick-action-disabled`, `stat-icon`) avec leurs règles. À vérifier sur téléphone : animation d'ouverture de Parcours, boutons du Menu (pavé numérique, Enregistrer, Envoyer au support), cartes Stats et lignes d'historique Putting (plus de bordure ni de `scale(0.99)` hérités de Parcours), en-tête du Menu en mode installé.
- **`commun.css` écrasé par une copie de `base.css` (dernier commit `075fe64`).** Les deux fichiers faisaient 7 136 octets, identiques : `.app-keypad`, `.app-keypad-value`, les en-têtes de page partagés et `.field-list` avaient disparu (pavé numérique et champs du Menu et de Stats sans style). Restauré depuis le commit `e921d90`, avec les champs `.field-list` à 16 px (correction du point 53 qui devait être dans ce commit). À surveiller : un fichier déposé par erreur à la place d'un autre ne se voit pas à l'écran avant la page concernée.
- **Stats : `stats.css` (points 45, 48, 59, 60 en partie, 64, 51 en partie).** Marges de page par variables, jeton de survol réel, jetons morts retirés, 4 survols dans `@media (hover: hover)`, zones d'appui de 44 px sur les contrôles isolés de la saisie détaillée, 34 classes mortes supprimées (environ 250 lignes).
- **Putting : `putting.css` (points 48, 53, 54, 59, 60 en partie, 61, 51 en partie).** Marges par variables, champs à 16 px, textes à 11 px minimum, survol tactile, zones d'appui de 44 px, repli `dvh` sur `.exercise-modal`, 47 classes mortes supprimées (dont les écrans de saisie rapide par trou qui n'existent plus dans `putting.js`).
- **Gym : `gym.css` (points 47, 49, 53, 54, 58, 59, 60 en partie, 61, 65, 51 en partie).** Règles globales limitées à `#page-gym`, règles de cartes limitées à `.gym-app` (Stats ne reçoit plus le survol ni l'animation de `.card--interactive`), safe-area du bas des sheets, champs à 16 px, textes à 11 px minimum, dégradé radial et flou d'arrière-plan retirés, zones d'appui de 44 px, repli `dvh`, 16 classes mortes supprimées.

#### Données et code mort
- **Wedging : champs à 16 px (point 53).** `.wg-input` et `.wg-textarea` passent de 15 à 16 px : plus de zoom automatique d'iOS au focus. Tous les champs de l'appli sont maintenant à 16 px, hors Stats (déjà fait).
- **Textes sous 11 px (point 54, en partie).** Passés à 11 px : `HomePage.css` (`.orbit-button_subtitle`, `.column_secondary`, `.column_label`), `commun.css` (`#page-wedging .wg-bottom-nav-item`), `wedging.css` (`.wg-badge-progress`, `.wg-gauge-axis`, `.wg-gauge-value`, `.wg-sg-bar-label`), `parcours-ui.css` (pastilles "Hors green", unité et Skip). Restent les textes SVG de Wedging, les étiquettes de carte de Parcours et `.fab` de Stats.
- **Zones d'appui de 44 px (point 60, en partie).** Par `::after`, visuel inchangé : `.keypad-close` et `.keypad-sign-btn` (`menu.css`), `.quick-action-info` et `.track-reset-btn` (`parcours-ui.css`). Reste `.mode-btn` et la saisie détaillée de Stats.
- **Classe CSS morte (point 51).** `.wg-container` retirée de `base.css` (aucune référence dans le JS ni le HTML).
- **Version des fichiers : `?v=36`** dans les 25 balises de `index.html`.
- **Pertes de données silencieuses (point 20, en partie).** Gym, Putting, Wedging et Parcours (Fairway, Green, captures) écrivent par `appSafeSetItem` : stockage plein ou indisponible, une alerte s'affiche. Vérifié en simulation avec un `setItem` qui échoue.
- **Code mort et petits défauts (points 24, 50, 52).** Supprimés : `setWedgeExercisesSort`, `setWedgeExReviewLimit`, `gymOnReady`, `DISTANCE_BUCKET_LABELS`, `svgColumnChart`, `setParcoursRowPutts`, `setParcoursRowClock`. `</div>` orphelin retiré du gabarit de `gym.js`. "All" devient "Toutes" dans les graphiques de Putting. Cinq classes sans règle CSS retirées (voir point 52).

### Contrôles effectués (sans problème)

- État du 8 octobre 2026 : les 13 scripts passent `node --check` ; ESLint (`no-undef`, `no-redeclare`, `no-dupe-keys`, `no-const-assign`) sur les scripts concaténés dans l'ordre de `index.html` : 0 erreur ; tous les `onclick` de `index.html` pointent vers des fonctions existantes ; `chart.umd.min.js` est bien à la racine et référencé tel quel.
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
- **Gabarits de `putting.js` (30-634) et `gym.js` (9-870)** : IDs uniques, `div` équilibrés, tous les `onclick` pointent vers des fonctions existantes, aucun ID commun avec `index.html` ni avec les autres modules. Les paliers de distance du gabarit Putting (0-2, >2-3, >3-5, >5-9, >9 m) correspondent à `distanceBucketIndex`. Les lignes 870 à 985 de `gym.js` sont la bibliothèque `ICONS`, pas du gabarit.
- **`sg-data.js`** (lu en entier) : 6 tables triées par distance croissante, aucune erreur de structure. Deux précisions sur les données : la table `green` est plafonnée à 2,382 coup au-delà de 100 ft (30,5 m), donc tous les putts plus longs valent pareil ; elle fait un saut de 0,015 entre 30 et 31 ft puis reste plate à 32 ft (1,978, 1,993, 1,993). Ces deux points viennent de la source.
- **`menu.css` lu en entier, fin de `parcours-ui.css` (lignes 1000 à 1297) lue**, aucun défaut en plus de ceux listés. Contrôles par script supplémentaires : aucun ID CSS sans élément correspondant, aucune règle vide, aucune propriété dupliquée dans une règle, aucune classe d'état (`classList`) sans règle CSS hormis les drapeaux JS (`is-stats-screen`).
- **`wedging.css` lu en entier.** Variables `--wg-max-width` et `--wg-transition` définies dans `base.css:76-77`, roue du green dimensionnée par `#page-wedging svg.wg-wheel` (la règle `#page-wedging svg { 20px }` ne l'écrase pas), aucun autre défaut en plus des points 44, 59, 60, 61 et 62 (tous corrigés).
- **`putting.css` lu en entier.** Aucun défaut en plus des points 35, 48, 53, 59, 60 et 61. Les modales Putting tiennent compte de la safe-area basse (`padding-bottom: calc(24px + env(safe-area-inset-bottom))`), contrairement aux bottom sheets de Gym (point 49).
- **`stats.css` lu en entier.** Aucun défaut en plus des points 45, 48, 53, 58, 59, 60 et 64. Les modales de Stats utilisent déjà `font-size: 16px` sur leurs champs (`.new-round_field-input`, `.new-round_field-select`, `.saisie-detaillee_field-select`) : `#hist-search` (point 53) est l'exception.
- **`gym.css` lu en entier.** Défauts relevés : points 43 (lien « Voir tous »), 47, 48, 49, 53, 54, 58, 59, 60, 61 et 65. Le gabarit `#view-creer-programme` utilise une mise en page à `clamp()` selon la hauteur d'écran qui tient sans défilement entre 480 et 800 px de haut ; je ne l'ai pas rendue à l'écran. Les sheets de Gym sont placées hors des vues animées (`gym.js:750`), donc les animations `forwards` de `.gym-anim-in` n'affectent pas leur `position: fixed`.
- **CSS (11 fichiers)** : accolades équilibrées, aucune déclaration invalide (validateur css-tree), toutes les variables `var(--…)` définies (seule `--fill` de `parcours-ui.css` s'appuie sur un repli), un seul `@keyframes` en doublon (point 45), `100dvh` utilisé avec repli `100vh` partout où la hauteur est verrouillée.
