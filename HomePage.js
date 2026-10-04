// Trace l'anneau de progression de l'objectif pour un ratio compris entre 0 et 1
function setProgressRing(ratio) {
  const ring = document.querySelector(".progress-ring_progress");
  if (!ring) return;

  const circumference = 2 * Math.PI * ring.r.baseVal.value;
  ring.style.strokeDasharray = `${circumference} ${circumference}`;
  ring.style.strokeDashoffset = `${circumference * (1 - ratio)}`;
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

// Affiche le prénom enregistré dans le menu (localStorage) dans le titre d'accueil
function renderHomeGreeting() {
  const el = document.querySelector("[data-user-firstname], .header_title-highlight");
  if (!el) return;
  let firstName = "";
  try {
    // Même clé que STORAGE_KEY dans menu.js
    firstName = JSON.parse(localStorage.getItem("golfAppState"))?.userProfile?.firstName ?? "";
  } catch (e) {
    console.error("Erreur de lecture du localStorage", e);
  }
  el.textContent = firstName;
}

// Expose la fonction pour que le menu puisse la rappeler après saisie
window.renderHomeGreeting = renderHomeGreeting;

// Écrit une valeur dans un [data-stat="..."]. Si la valeur est vide/absente, affiche "_"
function setStat(name, value) {
  const el = document.querySelector(`[data-stat="${name}"]`);
  if (!el) return;
  el.textContent = (value == null || value === "") ? "_" : value;
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
function renderGolfStats(data) {
  const { goal, distance, index, lastSession } = data ?? {};

  const hasGoal = goal?.current != null && goal?.target != null;
  // Borné à [0, 1] : un objectif dépassé (6/5) doit afficher un anneau plein
  const ratio = hasGoal && goal.target > 0
    ? Math.min(Math.max(goal.current / goal.target, 0), 1)
    : 0;

  setStat("goal-ring", hasGoal ? `${goal.current}/${goal.target}` : null);
  setStat("goal-value", hasGoal ? `${goal.current} séance${goal.current > 1 ? "s" : ""}` : null);

  const fill = document.querySelector('[data-stat="goal-progress-fill"]');
  if (fill) fill.style.width = `${Math.round(ratio * 100)}%`;
  setProgressRing(ratio);

  setStat("distance-value", distance?.value);
  setStat("distance-variation", distance?.variation);

  setStat("index-value", index?.value);
  setStat("index-variation", index?.variation);

  setStat("last-session-value", lastSession?.value);
  setStat("last-session-secondary", lastSession?.type);
}

// Expose la fonction pour un appel depuis un autre fichier / script externe
window.renderGolfStats = renderGolfStats;

document.addEventListener("DOMContentLoaded", () => {
  applyBackground();
  renderHomeGreeting();

  // Appel réel à brancher sur la source de données
  renderGolfStats();

  // Retour visuel au toucher/clic sur les éléments interactifs
  document.querySelectorAll(".orbit-button, .profile_button").forEach((el) => {
    el.addEventListener("pointerdown", () => el.classList.add("is-pressed"));
    ["pointerup", "pointerleave", "pointercancel"].forEach((type) =>
      el.addEventListener(type, () => el.classList.remove("is-pressed"))
    );
  });
});

// Appli restée ouverte en arrière-plan : le fond doit suivre l'heure au retour
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) applyBackground();
});
