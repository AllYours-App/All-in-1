// Recalcule le contour de l'anneau de progression à partir de data-progress (0 à 1)
function updateProgressRing() {
  const ring = document.querySelector(".progress-ring_progress");
  if (!ring) return;

  const radius = ring.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const progress = parseFloat(ring.dataset.progress) || 0;

  ring.style.strokeDasharray = `${circumference} ${circumference}`;
  ring.style.strokeDashoffset = `${circumference * (1 - progress)}`;
}

// Retourne le nom du fichier de fond selon l'heure de l'appareil
function getBackgroundByHour() {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 11) return "images/FondEcranHomePageMatin.png";
  if (hour >= 11 && hour < 17) return "images/FondEcranHomePageMidi.png";
  if (hour >= 17 && hour < 21) return "images/FondEcranHomePageSoir.png";
  return "images/FondEcranHomePageNuit.png";
}

// Applique le fond correspondant sur le composant principal
function applyBackground() {
  const el = document.querySelector(".home-screen_component");
  if (!el) return;
  el.style.backgroundImage = `url("${getBackgroundByHour()}")`;
}

// Écrit une valeur dans un [data-stat="..."]. Si la valeur est vide/absente, affiche "_"
function setStat(name, value) {
  const el = document.querySelector(`[data-stat="${name}"]`);
  if (!el) return;
  const isEmpty = value === null || value === undefined || value === "";
  el.textContent = isEmpty ? "_" : value;
}

/**
 * Remplit le panneau statistiques à partir d'un objet de données.
 * Prévu pour être appelé depuis un autre fichier (ex: après un appel API) :
 *   renderGolfStats({
 *     goal: { current: 4, target: 5 },
 *     distance: { value: "247 m", variation: "+8 m" },
 *     index: { value: "12.4", variation: "+0,3" },
 *     lastSession: { value: "Hier", type: "Parcours" }
 *   });
 * Tout champ manquant ou vide s'affiche sous forme de "_".
 */
function renderGolfStats(data = {}) {
  const goal = data.goal || {};
  const hasGoal =
    goal.current !== null && goal.current !== undefined &&
    goal.target !== null && goal.target !== undefined;

  setStat("goal-ring", hasGoal ? `${goal.current}/${goal.target}` : null);
  setStat("goal-value", hasGoal ? `${goal.current} séances` : null);

  const fill = document.querySelector('[data-stat="goal-progress-fill"]');
  const ring = document.querySelector(".progress-ring_progress");
  const ratio = hasGoal && goal.target > 0 ? goal.current / goal.target : 0;
  if (fill) fill.style.width = `${Math.round(ratio * 100)}%`;
  if (ring) ring.dataset.progress = String(ratio);
  updateProgressRing();

  const distance = data.distance || {};
  setStat("distance-value", distance.value);
  setStat("distance-variation", distance.variation);

  const index = data.index || {};
  setStat("index-value", index.value);
  setStat("index-variation", index.variation);

  const lastSession = data.lastSession || {};
  setStat("last-session-value", lastSession.value);
  setStat("last-session-secondary", lastSession.type);
}

// Expose la fonction pour un appel depuis un autre fichier / script externe
window.renderGolfStats = renderGolfStats;

/* ==========================================================================
   SHELL — bascule entre les 3 parties (Home / Parcours / Wedging) fusionnées
   dans une seule page. N'utilise jamais location.hash : ce hash est déjà
   possédé par le routeur interne de Wedging (et lu une fois par Parcours),
   on ne veut pas déclencher leurs routeurs en changeant de partie.
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

document.addEventListener("DOMContentLoaded", () => {

  updateProgressRing();
  applyBackground();

  // Données d'exemple — à remplacer par l'appel réel depuis la source de données
  renderGolfStats({
    goal: { current: 4, target: 5 },
    distance: { value: "247 m", variation: "↑ +8 m" },
    index: { value: "12.4", variation: "↑ +0,3" },
    lastSession: { value: "Hier", type: "Parcours" }
  });

  // Retour visuel au toucher/clic sur les éléments interactifs
  const pressables = document.querySelectorAll(
    ".orbit-button, .profile_button"
  );

  pressables.forEach((el) => {
    el.addEventListener("pointerdown", () => el.classList.add("is-pressed"));
    el.addEventListener("pointerup", () => el.classList.remove("is-pressed"));
    el.addEventListener("pointerleave", () => el.classList.remove("is-pressed"));
  });

});
