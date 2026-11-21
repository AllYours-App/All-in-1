/* ==========================================================================
   SHELL — bascule entre les pages de l'app (Home, Parcours, Putting, Stats,
   Gym, Wedging, Vitesse, Menu, Login, Signup) fusionnées dans un seul
   index.html. N'utilise jamais location.hash : ce hash est déjà possédé par le
   routeur interne de Wedging (et lu une fois par Parcours), on ne veut pas
   déclencher leurs routeurs en changeant de partie.
   ========================================================================== */
/* --------------------------------------------------------------------------
   CARTE DES PAGES — parent de chaque écran (le retour ramène toujours au parent,
   quel que soit le chemin par lequel on est arrivé).

   Niveau 1 : pages de l'appli (parent : home, sauf indication)
     home
     ├─ parcours          (écran unique ; fenêtres internes fermées par leur propre bouton)
     ├─ stats             écrans : dashboard (parent : home) ; par-club, par-distance, statistiques,
     │                    historique, putting, saisie-rapide, saisie-detaillee (parent : dashboard)
     ├─ putting           sous-onglets d'analyse (parent : onglet Parcours) ; détail d'un parcours
     │                    et fenêtre de saisie (parent : liste Putting)
     ├─ wedging           écrans d'analyse (parent : onglet Parcours) ; l'écran d'accueil Wedging
     │                    renvoie à home
     ├─ gym               gym-home (parent : home) ; programmes, exercices, historique, progression,
     │                    objectifs (parent : gym-home) ; créer un programme (parent : programmes) ;
     │                    programme-detail (parent : programmes, ou historique en lecture seule) ;
     │                    créer une séance, séance active (parent : programme-detail ; sans programme : gym-home) ;
     │                    récap d'une séance (parent : historique s'il vient de l'historique, sinon
     │                    programme-detail, sinon gym-home)
     ├─ vitesse
     └─ menu              écran principal (parent : home) ; Aide & support, Mes distances… (parent : Menu) ;
                          FAQ, contact, textes légaux, données, à propos (parent : Aide, ou la page
                          d'où l'aide a été ouverte)
   Pages de connexion (login, signup, forgot-password, reset-password) : hors hiérarchie.

   Les retours internes à un module (sous-écran -> écran du module) lisent leur destination dans
   APP_SCREEN_PARENTS (ci-dessous) via appBack(module, écran, contexte) ; celui qui quitte le module
   passe par appBack(module). Branchés sur la carte : Gym (tous les retours). Pas encore branchés :
   Wedging, Stats, Putting et Menu (leurs retours sont gérés par le module : voir APPLI-01).
   -------------------------------------------------------------------------- */
const APP_PAGE_PARENTS = {
  parcours: "home",
  stats: "home",
  putting: "home",
  wedging: "home",
  gym: "home",
  vitesse: "home",
  menu: "home",
};

/* --------------------------------------------------------------------------
   CARTE DES ÉCRANS D'UN MODULE — parent de chaque écran interne.
   Une entrée vaut : un nom d'écran ("gym-home"), ou une fonction (contexte) qui renvoie un nom d'écran
   ou { screen, params } quand le parent dépend du contexte (programme ouvert, provenance...).
   Le premier écran d'un module (gym-home) n'y figure pas : son retour quitte le module (appBack("gym")).
   -------------------------------------------------------------------------- */
const APP_SCREEN_PARENTS = {
  gym: {
    "programmes": "gym-home",
    "exercices": "gym-home",
    "historique": "gym-home",
    "progression": "gym-home",
    "objectifs": "gym-home",
    "creer-programme": "programmes",
    // Détail d'un programme : lecture seule depuis l'historique, sinon liste des programmes
    "programme-detail": (c) => (c.readonly ? "historique" : "programmes"),
    "creer-seance": (c) => ({ screen: "programme-detail", params: { id: c.programId } }),
    // Séance active : son programme ; écran « aucune séance » (sans programme) : accueil Gym
    "seance-active": (c) => (c.programId ? { screen: "programme-detail", params: { id: c.programId } } : "gym-home"),
    // Récap d'une séance : historique s'il vient de l'historique, sinon son programme (s'il existe encore), sinon l'accueil Gym
    "seance-recap": (c) => {
      if (c.from === "historique") return "historique";
      if (c.programId) return { screen: "programme-detail", params: { id: c.programId } };
      return "gym-home";
    },
  },
};

// Navigation interne de chaque module : le module s'enregistre (ex. Gym : gymNavigate). appBack s'en sert pour aller au parent.
const APP_SCREEN_NAV = {};
function appRegisterNav(moduleId, fn) {
  APP_SCREEN_NAV[moduleId] = fn;
}
window.appRegisterNav = appRegisterNav;

// Parent d'un écran interne : { screen, params } ou null si l'écran n'est pas sur la carte.
function appScreenParent(moduleId, screen, ctx) {
  const table = APP_SCREEN_PARENTS[moduleId];
  if (!table || !Object.prototype.hasOwnProperty.call(table, screen)) return null;
  let parent = table[screen];
  if (typeof parent === "function") parent = parent(ctx || {});
  if (!parent) return null;
  return typeof parent === "string" ? { screen: parent } : parent;
}
window.appScreenParent = appScreenParent;

// Retour. Sans screen : de la page fromId vers sa page parente (sans parent connu : accueil).
// Avec screen : de cet écran interne vers son parent sur la carte (ctx : contexte pour les parents qui en dépendent).
// Écran absent de la carte ou module sans navigation enregistrée : repli sur la page parente.
function appBack(fromId, screen, ctx) {
  if (screen) {
    const parent = appScreenParent(fromId, screen, ctx);
    const nav = APP_SCREEN_NAV[fromId];
    if (parent && typeof nav === "function") {
      nav(parent.screen, parent.params);
      return;
    }
    if (window.console) console.warn("appBack : écran hors carte ou module sans navigation :", fromId, screen);
  }
  showPage(APP_PAGE_PARENTS[fromId] || "home");
}
window.appBack = appBack;

function showPage(id) {
  const target = document.getElementById(`page-${id}`);
  // Page inconnue : on reste où on est (sinon toutes les pages seraient masquées)
  if (!target) return;

  document.querySelectorAll(".app-page").forEach((p) => p.classList.toggle("active", p === target));

  // Les verrous de défilement posés sur body (no-scroll, gym-home-locked, gym-view-fit) ne sont plus
  // gérés ici : chaque module (Parcours, Gym) suit lui-même l'activation de sa page et retire son verrou en la quittant.

  window.scrollTo({ top: 0, behavior: "instant" });

  // Accueil : les encadrés (objectif, dernière séance) suivent l'activité de tous les modules, à chaque retour
  if (id === "home" && typeof window.renderGolfHome === "function") window.renderGolfHome();
}
window.showPage = showPage;
