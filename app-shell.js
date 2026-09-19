/* ==========================================================================
   SHELL — bascule entre les parties (Home / Parcours / Putting / Stats /
   Gym / Wedging / Vitesse) fusionnées dans une seule page. N'utilise jamais
   location.hash : ce hash est déjà possédé par le routeur interne de
   Wedging (et lu une fois par Parcours), on ne veut pas déclencher leurs
   routeurs en changeant de partie.
   ========================================================================== */
function showPage(id) {
  document.querySelectorAll(".app-page").forEach((p) => p.classList.remove("active"));
  const target = document.getElementById(`page-${id}`);
  if (target) target.classList.add("active");

  // Parcours pilote lui-même body.no-scroll selon son propre écran actif ;
  // on resynchronise cet état à l'entrée/sortie de cette partie.
  if (id === "parcours") {
    const parcoursHome = document.querySelector('#page-parcours .screen-view[data-screen="home"]');
    document.body.classList.toggle("no-scroll", !!(parcoursHome && parcoursHome.classList.contains("active")));
  } else {
    document.body.classList.remove("no-scroll");
  }

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}
window.showPage = showPage;
