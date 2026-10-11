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

  // Parcours pilote lui-même body.no-scroll selon son propre écran actif ;
  // on resynchronise cet état à l'entrée/sortie de cette partie.
  if (id === "parcours") {
    const parcoursHome = document.querySelector('#page-parcours .screen-view[data-screen="home"]');
    document.body.classList.toggle("no-scroll", !!(parcoursHome && parcoursHome.classList.contains("active")));
  } else {
    document.body.classList.remove("no-scroll");
    document.body.classList.remove("gym-home-locked", "gym-view-fit");
  }

  window.scrollTo({ top: 0, behavior: "instant" });
}
window.showPage = showPage;
