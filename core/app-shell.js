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
     │                    créer une séance (parent : gym-home) ; programme-detail (parent : programmes,
     │                    ou historique en lecture seule) ; sous-écrans d'un programme (parent : programme-detail)
     ├─ vitesse
     └─ menu              écran principal (parent : home) ; Aide & support, Mes distances… (parent : Menu) ;
                          FAQ, contact, textes légaux, données, à propos (parent : Aide, ou la page
                          d'où l'aide a été ouverte)
   Pages de connexion (login, signup, forgot-password, reset-password) : hors hiérarchie.

   Les retours internes à un module (sous-écran -> écran du module) restent gérés par le module,
   mais celui qui quitte le module passe par appBack().
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

// Retour d'une page vers sa page parente. fromId : la page qu'on quitte (ex. "stats"). Sans parent connu : accueil.
function appBack(fromId) {
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
