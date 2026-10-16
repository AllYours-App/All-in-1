/* ==========================================================================
   SHELL — bascule entre les pages de l'app (Home, Parcours, Putting, Stats,
   Gym, Wedging, Vitesse, Menu, Login, Signup) fusionnées dans un seul
   index.html. N'utilise jamais location.hash : ce hash est déjà possédé par le
   routeur interne de Wedging (et lu une fois par Parcours), on ne veut pas
   déclencher leurs routeurs en changeant de partie.
   ========================================================================== */
function showPage(id) {
  const target = document.getElementById(`page-${id}`);
  // Page inconnue : on reste où on est (sinon toutes les pages seraient masquées)
  if (!target) return;

  document.querySelectorAll(".app-page").forEach((p) => p.classList.toggle("active", p === target));

  // Les verrous de défilement posés sur body (no-scroll, gym-home-locked, gym-view-fit) ne sont plus
  // gérés ici : chaque module (Parcours, Gym) suit lui-même l'activation de sa page et retire son verrou en la quittant.

  window.scrollTo({ top: 0, behavior: "instant" });
}
window.showPage = showPage;
